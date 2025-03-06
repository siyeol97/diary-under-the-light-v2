'use client';

import useDiary from '@/hooks/useDiary';
import { Session } from 'next-auth';
import { useState } from 'react';
import DiaryItem from '../diary/DiaryItem';
import RecordButton from '../record/RecordButton';
import { Calendar } from '../ui/calendar';

interface Props {
  session: Session;
  transcode: (
    blob: Blob,
    mimeType: string,
  ) => Promise<{
    audioBlob: Blob;
    audioURL: string;
  }>;
}

export default function MainPageContainer({ session, transcode }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: diaryList, isLoading } = useDiary(session, date);

  // 날짜 토글 방지
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <section className='flex flex-col gap-8 px-5 pt-10 size-full'>
      <Calendar
        mode='single'
        selected={date}
        onSelect={handleDateSelect}
        className='rounded-md border'
        disabled={(date) => date > new Date()}
      />
      {!diaryList || diaryList.length === 0 ? (
        isLoading ? (
          <p>로딩 중...</p>
        ) : (
          <RecordButton session={session} date={date} transcode={transcode} />
        )
      ) : (
        date && <DiaryItem session={session} date={date} diary={diaryList[0]} />
      )}
    </section>
  );
}
