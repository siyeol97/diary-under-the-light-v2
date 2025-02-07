'use server';

import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import webpush, { PushSubscription } from 'web-push';

webpush.setVapidDetails(
  'mailto:leesi2830@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, // VAPID 공개 키
  process.env.VAPID_PRIVATE_KEY!, // VAPID 비공개 키
);

// 푸시 알림을 전송하는 함수
export async function sendNotification(
  subscription: PushSubscription,
  message: string,
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
      }),
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
