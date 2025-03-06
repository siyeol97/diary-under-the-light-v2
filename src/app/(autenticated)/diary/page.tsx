import DiaryDetailWrapper from '@/components/diary/DiaryDetailWrapper';
import { Diary } from '@/types/diary';
import { authOptions } from '@/utils/authOptions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `그 날의 일기`,
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function page(props: { searchParams: SearchParams }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'https://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL;

  const { userId, date } = await props.searchParams;
  const data = await fetch(
    `${BASE_URL}/api/diary-detail?userId=${userId}&date=${date}`,
    {
      method: 'GET',
    },
  );

  const diaryDetail = (await data.json())[0] as Diary;

  return (
    <section className='flex w-full h-[calc(100%-80px)] overflow-auto'>
      <DiaryDetailWrapper diaryDetail={diaryDetail} />
    </section>
  );
}
