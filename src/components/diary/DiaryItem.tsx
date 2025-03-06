'use client';

import { Diary } from '@/types/diary';
import formatDateDiff from '@/utils/formatDateDiff';
import getKoreaDate from '@/utils/getKoreaDate';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface Props {
  session: Session;
  date: Date | undefined;
  diary: Diary;
}

export default function DiaryItem({ session, date, diary }: Props) {
  const router = useRouter();
  const { created_at, recording_url, stt_text } = diary;
  const formattedDate = formatDateDiff(created_at);

  if (!date) {
    return null;
  }

  const koreaDate = getKoreaDate(date).toISOString().slice(0, 10);

  const navigateToDiaryDetail = () => {
    router.push(`/diary?userId=${session.user.id}&date=${koreaDate}`);
  };

  return (
    <section className='flex flex-col gap-4 justify-start items-start size-full'>
      <h3>{formattedDate}</h3>
      <audio src={recording_url!} style={{ width: '100%' }} controls />
      <div className='flex flex-col'>{stt_text && <p>{stt_text}</p>}</div>
      <div className='mt-auto mb-2 w-full'>
        <Button className='w-full' onClick={navigateToDiaryDetail}>
          상세 결과 확인하기
        </Button>
      </div>
    </section>
  );
}
