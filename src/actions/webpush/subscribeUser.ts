'use server';

import { authOptions } from '@/utils/authOptions';
import { createClient } from '@/utils/supabase/createServerClient';
import { getServerSession } from 'next-auth';
import { PushSubscription } from 'web-push';

// 사용자의 푸시 알림 구독을 처리하는 함수
const subscribeUser = async (sub: PushSubscription) => {
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
};

export default subscribeUser;
