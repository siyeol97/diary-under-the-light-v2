'use server';

import { createClient } from '@/utils/supabase/createServerClient';

// 녹음 파일을 저장하고 diary 테이블에 저장하는 함수
const saveRecording = async (
  recordedFile: File,
  userId: string,
  sttText: string,
  voiceResult: string,
) => {
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
    .insert([
      {
        recording_url: result.data.publicUrl,
        user_id: userId,
        stt_text: sttText,
        voice_depress_result: voiceResult,
      },
    ])
    .select();

  if (diaryError) {
    console.error(diaryError);
    throw diaryError;
  }

  return diaryData;
};

export default saveRecording;
