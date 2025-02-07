'use server';

import { authOptions } from '@/utils/authOptions';
import { createClient } from '@/utils/supabase/createServerClient';
import { getServerSession } from 'next-auth';

// 사용자의 푸시 알림 구독을 취소하는 함수
const unsubscribeUser = async () => {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;
  if (!user_id) {
    throw new Error(
      '푸시 알림 구독 취소 오류 : 사용자 정보를 찾을 수 없습니다.',
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
};

export default unsubscribeUser;
