'use server';

import { createClient } from '@/utils/supabase/createServerClient';

// diary 테이블에서 데이터를 가져오는 함수
const getDiaries = async (userId: string) => {
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
};

export default getDiaries;
