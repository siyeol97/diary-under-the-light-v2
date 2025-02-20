'use client';

import useDiary from '@/hooks/useDiary';
import { Session } from 'next-auth';
import { useState } from 'react';
import DiaryItem from '../diary/DiaryItem';
import AudioRecord from '../record/AudioRecord';
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
          <AudioRecord session={session} />
        )
      ) : (
        <DiaryItem key={diaryList[0].id} diary={diaryList[0]} />
      )}
    </section>
  );
}
