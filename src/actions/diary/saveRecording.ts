'use server';

import getKoreaDate from '@/utils/getKoreaDate';
import { createClient } from '@/utils/supabase/createServerClient';

// 녹음 파일을 저장하고 diary 테이블에 저장하는 함수
const saveRecording = async (
  recordedFile: File,
  userId: string,
  sttText: string,
  voiceResult: string,
  textResult: string,
  date: Date,
) => {
  const supabase = await createClient();

  const { data: recordingStorageData, error: recordingError } =
    await supabase.storage
      .from('recordings')
      .upload(`${userId}/${recordedFile.name}`, recordedFile);

  if (recordingError) {
    console.error(recordingError);
    throw recordingError;
  }

  const result = supabase.storage
    .from('recordings')
    .getPublicUrl(recordingStorageData.path);

  const dateToUse = date.getDate() === new Date().getDate() ? new Date() : date;
  // 한국 시간(UTC+9)으로 변환
  const koreaDate = getKoreaDate(dateToUse);
  const isoDate = koreaDate.toISOString();

  const { data: diaryData, error: diaryError } = await supabase
    .from('test_diary')
    .insert([
      {
        created_at: isoDate,
        recording_url: result.data.publicUrl,
        user_id: userId,
        stt_text: sttText,
        voice_result: voiceResult,
        text_result: textResult,
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
