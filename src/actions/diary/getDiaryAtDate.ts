'use server';

import { Diary } from '@/types/diary';
import { createClient } from '@/utils/supabase/createServerClient';

// diary 테이블에서 오늘 날짜의 데이터를 가져오는 함수
const getDiaryAtDate = async (userId: string, createdAt: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('test_diary')
    .select()
    .eq('user_id', userId)
    .gte('created_at', `${createdAt}T00:00:00.000Z`)
    .lte('created_at', `${createdAt}T23:59:59.999Z`);

  if (error) {
    console.error(error);
    throw error;
  }

  return data as Diary[];
};

export default getDiaryAtDate;
