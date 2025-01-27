'use client';

import { getDiaryAtDate } from '@/app/actions';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';

interface Props {
  session: Session;
}

interface Diary {
  created_at: string;
  id: number;
  recording_url: string | null;
  user_id: string | null;
}

export default function DiaryList({ session }: Props) {
  const [diaryList, setDiaryList] = useState<Diary[]>(); // 일기 목록 관리

  useEffect(() => {
    const updateDiaryList = async () => {
      const diaryList = await getDiaryAtDate(
        session.user.id!,
        new Date().toISOString().slice(0, 10),
      );
      setDiaryList(diaryList);
    };
    updateDiaryList();
  }, []);

  return (
    <section>
      {/* <p>녹음파일 리스트</p>
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
      {diaryList &&
        diaryList.map((diary) => {
          return (
            <div key={diary.id}>
              <audio
                src={diary.recording_url!}
                style={{ width: '100%' }}
                controls
              />
            </div>
          );
        })}
    </section>
  );
}
