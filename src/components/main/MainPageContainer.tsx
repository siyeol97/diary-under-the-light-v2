'use client';

import { useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Session } from 'next-auth';
import { Accordion } from '../ui/accordion';
import DiaryItem from '../diary/DiaryItem';
import useDiary from '@/hooks/useDiary';

interface Props {
  session: Session;
}

export default function MainPageContainer({ session }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: diaryList } = useDiary(session, date);

  return (
    <section className='flex flex-col gap-10 px-5 py-10 size-full'>
      <Calendar
        mode='single'
        selected={date}
        onSelect={setDate}
        className='rounded-md border'
      />
      <Accordion type='single' collapsible className='w-full'>
        {diaryList &&
          diaryList.map((diary) => {
            return <DiaryItem key={diary.id} diary={diary} />;
          })}
      </Accordion>
    </section>
  );
}
