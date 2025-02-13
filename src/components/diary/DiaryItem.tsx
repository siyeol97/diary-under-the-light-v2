'use client';

import { Diary } from '@/types/diary';
import formatDateDiff from '@/utils/formatDateDiff';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { useEffect, useState } from 'react';
import { Json } from '../../../database.types';

export default function DiaryItem({ diary }: { diary: Diary }) {
  const [depress, setDepress] = useState<Json | string>('');
  const [sigmoidValue, setSigmoidValue] = useState<Json | number>(0);
  const { id, created_at, recording_url, stt_text, voice_depress_result } =
    diary;

  const formattedDate = formatDateDiff(created_at);

  useEffect(() => {
    if (
      voice_depress_result &&
      typeof voice_depress_result === 'object' &&
      !Array.isArray(voice_depress_result)
    ) {
      const { depress, sigmoid_value } = voice_depress_result;
      if (depress && sigmoid_value !== undefined) {
        setDepress(depress);
        setSigmoidValue(sigmoid_value);
      }
    }
  }, [voice_depress_result]);

  return (
    <AccordionItem key={id} value={`${id}`}>
      <AccordionTrigger>{formattedDate}</AccordionTrigger>
      <AccordionContent>
        <audio src={recording_url!} style={{ width: '100%' }} controls />
        {stt_text && (
          <div className='flex flex-col gap-2 mt-2'>
            <h3>--STT 결과--</h3>
            <p>{stt_text}</p>
            <h3>--음성 우울감 분석 결과--</h3>
            <span>
              {typeof depress === 'string' ? depress : '결과 없음'}
            </span>{' '}
            <span>
              확률 :{' '}
              {typeof sigmoidValue === 'number' ? sigmoidValue : '결과 없음'}
            </span>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
