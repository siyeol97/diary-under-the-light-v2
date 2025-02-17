'use client';

import { Diary, EmotionProb } from '@/types/diary';
import formatDateDiff from '@/utils/formatDateDiff';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { useEffect, useState } from 'react';
import { Json } from '../../../database.types';

export default function DiaryItem({ diary }: { diary: Diary }) {
  const [depression, setDepression] = useState<Json>('결과 없음');
  const [sigmoidValue, setSigmoidValue] = useState<Json>(0);
  const [emotion, setEmotion] = useState<Json>('결과 없음');
  const [emotionProb, setEmotionProb] = useState<EmotionProb>({});
  const { id, created_at, recording_url, stt_text, voice_depress_result } =
    diary;

  const formattedDate = formatDateDiff(created_at);

  useEffect(() => {
    if (
      voice_depress_result &&
      typeof voice_depress_result === 'object' &&
      !Array.isArray(voice_depress_result)
    ) {
      const { depression, sigmoid_value, emotion, emotion_prob } =
        voice_depress_result;

      // 음성 우울감 분석 결과
      if (depression && sigmoid_value) {
        setDepression(depression);
        setSigmoidValue(sigmoid_value);
      }

      // 음성 감정 분석 결과
      if (emotion && emotion_prob) {
        setEmotion(emotion);
        setEmotionProb(emotion_prob);
      }
    }
  }, [voice_depress_result]);

  return (
    <AccordionItem key={id} value={`${id}`}>
      <AccordionTrigger>{formattedDate}</AccordionTrigger>
      <AccordionContent>
        <audio src={recording_url!} style={{ width: '100%' }} controls />
        <div className='flex flex-col gap-2 mt-2'>
          {stt_text && (
            <>
              <h3>--STT 결과--</h3>
              <p>{stt_text}</p>
            </>
          )}
          {voice_depress_result && (
            <>
              <h3>--음성 우울감 분석 결과--</h3>
              <span>
                {typeof depression === 'string' ? depression : '결과 없음'}
              </span>
              <span>
                우울감 수치 :{' '}
                {typeof sigmoidValue === 'number'
                  ? (sigmoidValue * 100).toFixed(2)
                  : '결과 없음'}
              </span>
              <h3>--음성 감정 분석 결과--</h3>
              <span>
                대표 감정: {typeof emotion === 'string' ? emotion : '결과 없음'}
              </span>
              {emotionProb &&
                Object.keys(emotionProb || {}).map((emotion) => {
                  return (
                    <span key={emotion}>
                      {emotion}: {(emotionProb[emotion] * 100).toFixed(2)}%
                    </span>
                  );
                })}
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
