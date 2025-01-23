'use server';

import { authOptions } from '@/utils/authOptions';
import { createClient } from '@/utils/supabase/createServerClient';
import { getServerSession } from 'next-auth';
import webpush, { PushSubscription } from 'web-push';

/**
 * Web Push 알림을 위한 서버 사이드 액션 파일
 * VAPID(Voluntary Application Server Identification) 키를 사용하여 푸시 서비스 설정
 */

webpush.setVapidDetails(
  'mailto:leesi2830@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, // VAPID 공개 키
  process.env.VAPID_PRIVATE_KEY! // VAPID 비공개 키
);

export async function getSubscription() {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;
  if (!user_id) {
    throw new Error('푸시 알림 구독 오류 : 사용자 정보를 찾을 수 없습니다.');
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subscribe')
    .select()
    .eq('user_id', user_id);

  if (error) {
    console.error('Supabase 구독 정보 가져오기 오류:', error);
    throw error;
  }

  if (data.length === 0) {
    console.log('저장된 구독 정보가 없습니다.');
    return null;
  }

  return JSON.parse(data[0].sub as string) as PushSubscription;
}

// 사용자의 푸시 알림 구독을 처리하는 함수
export async function subscribeUser(sub: PushSubscription) {
  // sub: 브라우저에서 생성된 PushSubscription 객체
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;
  if (!user_id) {
    throw new Error('푸시 알림 구독 오류 : 사용자 정보를 찾을 수 없습니다.');
  }

  const supabase = await createClient();
  // 사용자의 구독 정보를 DB에 저장

  const { data, error } = await supabase
    .from('subscribe')
    .insert([{ sub: JSON.stringify(sub), user_id: user_id }])
    .select();

  if (error) {
    console.error('Supabase 푸시 알림 구독 오류:', error);
    throw error;
  }

  if (data.length === 0) {
    console.log('저장된 구독 정보가 없습니다.');
    return null;
  }

  return JSON.parse(data[0].sub as string) as PushSubscription;
}

// 사용자의 푸시 알림 구독을 취소하는 함수
export async function unsubscribeUser() {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;
  if (!user_id) {
    throw new Error(
      '푸시 알림 구독 취소 오류 : 사용자 정보를 찾을 수 없습니다.'
    );
  }

  const supabase = await createClient();
  // 사용자의 구독 정보를 DB에서 삭제
  const { error } = await supabase
    .from('subscribe')
    .delete()
    .eq('user_id', user_id);

  if (error) {
    console.error('Supabase 푸시 알림 구독 삭제 오류:', error);
    throw error;
  }

  return { success: true };
}

// 푸시 알림을 전송하는 함수
export async function sendNotification(
  subscription: PushSubscription,
  message: string
) {
  // message:전송할 메시지 내용
  if (!subscription) {
    throw new Error('푸시 알림 전송 오류 : 구독 정보를 찾을 수 없습니다.');
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('푸시 알림 전송 오류 : 사용자 정보를 찾을 수 없습니다.');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: `안녕하세요 ${session.user.name}님!`, // 푸시 알림 제목
        body: message, // 푸시 알림 내용
        icon: '/icon_256.png', // 푸시 알림 아이콘
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

// 녹음 파일을 저장하고 diary 테이블에 저장하는 함수
export async function saveRecording(recordedFile: File, userId: string) {
  const supabase = await createClient();

  const { data: recordingData, error: recordingError } = await supabase.storage
    .from('recordings')
    .upload(`${userId}/${recordedFile.name}`, recordedFile);

  if (recordingError) {
    console.error(recordingError);
    throw recordingError;
  }

  const result = supabase.storage
    .from('recordings')
    .getPublicUrl(recordingData.path);

  const { data: diaryData, error: diaryError } = await supabase
    .from('test_diary')
    .insert([{ recording_url: result.data.publicUrl, user_id: userId }])
    .select();

  if (diaryError) {
    console.error(diaryError);
    throw diaryError;
  }

  return diaryData;
}

// diary 테이블에서 데이터를 가져오는 함수
export async function getDiaries(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('test_diary')
    .select()
    .eq('user_id', userId);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
