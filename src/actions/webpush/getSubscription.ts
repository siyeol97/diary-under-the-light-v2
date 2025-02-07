'use server';

import { authOptions } from '@/utils/authOptions';
import { createClient } from '@/utils/supabase/createServerClient';
import { getServerSession } from 'next-auth';
import { PushSubscription } from 'web-push';

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
