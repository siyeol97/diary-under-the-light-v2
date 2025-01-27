'use client';

import { getDiaryAtDate } from '@/app/actions';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { DatePicker } from '../shared/DatePicker';
import DiaryItem from './DiaryItem';
import { Diary } from '@/types/diary';
import { Accordion } from '../ui/accordion';

interface Props {
  session: Session;
}

export default function DiaryList({ session }: Props) {
  const TODAY = new Date();

  const [date, setDate] = useState(TODAY); // 조회할 날짜
  const [diaryList, setDiaryList] = useState<Diary[]>(); // 일기 목록 관리

  useEffect(() => {
    console.log(date);
    const updateDiaryList = async () => {
      const diaryList = await getDiaryAtDate(
        session.user.id!,
        date.toISOString().slice(0, 10),
      );
      setDiaryList(diaryList);
    };
    updateDiaryList();
  }, [date]);

  return (
    <section className='flex flex-col gap-10 px-5 py-10 '>
      <DatePicker date={date} setDate={setDate} className='w-full' />
      {/* <p>녹음파일 전체 리스트</p>
      {diaries.map((diary) => {
        return (
          <div key={diary.id}>
            <p>{diary.created_at}</p>
            <audio
              src={diary.recording_url!}
              style={{ width: '100%' }}
              controls
            />
          </div>
        );
      })} */}
      <Accordion type='single' collapsible className='w-full'>
        {diaryList &&
          diaryList.map((diary) => {
            return <DiaryItem key={diary.id} diary={diary} />;
          })}
      </Accordion>
    </section>
  );
}
