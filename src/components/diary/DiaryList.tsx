'use client';

import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { DatePicker } from '../shared/DatePicker';
import DiaryItem from './DiaryItem';
import { Diary } from '@/types/diary';
import { Accordion } from '../ui/accordion';
import getDiaryAtDate from '@/actions/diary/getDiaryAtDate';

interface Props {
  session: Session;
}

export default function DiaryList({ session }: Props) {
  const TODAY = new Date(new Date().toDateString());

  const [date, setDate] = useState(TODAY); // 조회할 날짜
  const [diaryList, setDiaryList] = useState<Diary[]>(); // 일기 목록 관리

  const getDate = (date: Date) => {
    const KOREA_TIMEZONE_OFFSET = 9 * 60; // 9 hours in minutes
    const koreaDate = new Date(
      date.getTime() + KOREA_TIMEZONE_OFFSET * 60 * 1000,
    );
    return koreaDate;
  };

  useEffect(() => {
    const updateDiaryList = async () => {
      const diaryList = await getDiaryAtDate(
        session.user.id!,
        getDate(date).toISOString().slice(0, 10),
      );
      setDiaryList(diaryList as Diary[]);
    };
    updateDiaryList();
  }, [date]);

  console.log(getDate(date).toISOString().slice(0, 10));

  return (
    <section className='flex flex-col gap-10 px-5 py-10 '>
      <DatePicker date={date} setDate={setDate} className='w-full' />
      <Accordion type='single' collapsible className='w-full'>
        {diaryList &&
          diaryList.map((diary) => {
            return <DiaryItem key={diary.id} diary={diary} />;
          })}
      </Accordion>
    </section>
  );
}
