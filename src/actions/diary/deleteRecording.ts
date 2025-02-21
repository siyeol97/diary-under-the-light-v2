'use server';

import { createClient } from '@/utils/supabase/createServerClient';

const deleteRecording = async (id: number, url: string | null) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/recordings/`;
  const filePath = url?.replace(baseUrl, '');
  const supabase = await createClient();

  console.log(filePath);

  if (!filePath) {
    throw new Error('파일 경로가 존재하지 않습니다.');
  }

  const { error: storageError } = await supabase.storage
    .from('recordings')
    .remove([filePath]);

  const { error: tableError } = await supabase
    .from('test_diary')
    .delete()
    .eq('id', id);

  return { storageError, tableError };
};

export default deleteRecording;
