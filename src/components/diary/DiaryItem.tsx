'use client';

import { Diary } from '@/types/diary';
import formatDateDiff from '@/utils/formatDateDiff';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export default function DiaryItem({ diary }: { diary: Diary }) {
  const { id, created_at, recording_url } = diary;
  const formattedDate = formatDateDiff(created_at);

  return (
    <AccordionItem key={id} value={`${id}`}>
      <AccordionTrigger>{formattedDate}</AccordionTrigger>
      <AccordionContent>
        <audio src={recording_url!} style={{ width: '100%' }} controls />
      </AccordionContent>
    </AccordionItem>
  );
}
