'use client';

import useDiary from '@/hooks/useDiary';
import { Session } from 'next-auth';
import { useState } from 'react';
import DiaryItem from '../diary/DiaryItem';
import RecordButton from '../record/RecordButton';
import { Calendar } from '../ui/calendar';

interface Props {
  session: Session;
}

export default function MainPageContainer({ session }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: diaryList, isLoading } = useDiary(session, date);

  return (
    <section className='flex flex-col gap-10 px-5 py-10 w-full'>
      <Calendar
        mode='single'
        selected={date}
        onSelect={setDate}
        className='rounded-md border'
      />
      {!diaryList || diaryList.length === 0 ? (
        isLoading ? (
          <p>로딩 중...</p>
        ) : (
          <RecordButton session={session} date={date} />
        )
      ) : (
        <DiaryItem session={session} date={date} diary={diaryList[0]} />
      )}
    </section>
  );
}
