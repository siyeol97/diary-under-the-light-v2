'use client';

import deleteRecording from '@/actions/diary/deleteRecording';
import { Diary, TextEmotionProb, VoiceEmotionProb } from '@/types/diary';
import formatDateDiff from '@/utils/formatDateDiff';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { Json } from '../../../database.types';
import { Button } from '../ui/button';

interface Props {
  session: Session;
  date: Date | undefined;
  diary: Diary;
}

export default function DiaryItem({ session, date, diary }: Props) {
  const queryClient = useQueryClient();
  // 음성 우울, 감정 분석 결과
  const [voiceDepression, setVoiceDepression] = useState<Json>('결과 없음');
  const [sigmoidValue, setSigmoidValue] = useState<Json>(0);
  const [voiceEmotion, setVoiceEmotion] = useState<Json>('결과 없음');
  const [voiceEmotionProb, setVoiceEmotionProb] = useState<VoiceEmotionProb>(
    {},
  );
  // 텍스트 우울, 감정 분석 결과
  const [textEmotionProb, setTextEmotionProb] = useState<TextEmotionProb>({});
  const [textDepressionValue, setTextDepressionValue] = useState<Json>(0);
  const [textAdvice, setTextAdvice] = useState<string>('');

  const { id, created_at, recording_url, stt_text, voice_result, text_result } =
    diary;

  const formattedDate = formatDateDiff(created_at);

  const { mutateAsync: deleteDiary } = useMutation({
    mutationFn: () => deleteRecording(id, recording_url),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['diary', session.user.id, date],
      }),
  });

  useEffect(() => {
    if (voice_result) {
      const { depression, sigmoid_value, emotion, emotion_prob } = voice_result;

      // 음성 우울감 분석 결과
      if (depression && sigmoid_value) {
        setVoiceDepression(depression);
        setSigmoidValue(sigmoid_value);
      }

      // 음성 감정 분석 결과
      if (emotion && emotion_prob) {
        setVoiceEmotion(emotion);
        setVoiceEmotionProb(emotion_prob);
      }
    }

    // 텍스트 우울, 감정 분석 결과
    if (text_result) {
      const { emotion, depression_value, advice } = text_result;

      setTextEmotionProb(emotion);
      setTextDepressionValue(depression_value);
      setTextAdvice(advice);
    }
  }, [voice_result, text_result]);

  return (
    <section>
      <Button onClick={() => deleteDiary()}>삭제</Button>
      <h3>{formattedDate}</h3>
      <audio src={recording_url!} style={{ width: '100%' }} controls />
      <div className='flex flex-col h-full gap-2 mt-6 mb-6 py-2'>
        {stt_text && (
          <>
            <h3>--STT 결과--</h3>
            <p>{stt_text}</p>
          </>
        )}
        {voice_result && (
          <>
            <h3>--음성 우울감 분석 결과--</h3>
            <span>
              {typeof voiceDepression === 'string'
                ? voiceDepression
                : '결과 없음'}
            </span>
            <span>
              우울감 수치 :{' '}
              {typeof sigmoidValue === 'number'
                ? (sigmoidValue * 100).toFixed(2)
                : '결과 없음'}
            </span>
            <h3>--음성 감정 분석 결과--</h3>
            <span>
              대표 감정:{' '}
              {typeof voiceEmotion === 'string' ? voiceEmotion : '결과 없음'}
            </span>
            {voiceEmotionProb &&
              Object.keys(voiceEmotionProb || {}).map((emotion) => {
                return (
                  <span key={emotion}>
                    {emotion}: {(voiceEmotionProb[emotion] * 100).toFixed(2)}%
                  </span>
                );
              })}
          </>
        )}
        <h3>--텍스트 감정 분석 결과--</h3>
        {text_result ? (
          <>
            <p>
              우울감 수치:{' '}
              {typeof textDepressionValue === 'number'
                ? textDepressionValue
                : '결과 없음'}
            </p>
            {textEmotionProb &&
              Object.keys(textEmotionProb).map((emotion) => {
                return (
                  <span key={emotion}>
                    {emotion}: {textEmotionProb[emotion]}
                  </span>
                );
              })}
            <p>{textAdvice}</p>
          </>
        ) : (
          <p>GEMINI 연결이 원활하지 않습니다.</p>
        )}
      </div>
    </section>
  );
}
