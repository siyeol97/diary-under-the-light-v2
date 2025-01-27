import OAuth from '@/components/auth/OAuth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
};

export default function page() {
  return (
    <main className='flex justify-center items-center w-full h-screen'>
      <OAuth />
    </main>
  );
}
