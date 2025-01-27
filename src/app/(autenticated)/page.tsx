import InstallPrompt from '@/components/shared/InstallPrompt';
import { authOptions } from '@/utils/authOptions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '푸시 알림 테스트 화면',
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='flex justify-center items-center size-full'>
      <InstallPrompt />
    </div>
  );
}
