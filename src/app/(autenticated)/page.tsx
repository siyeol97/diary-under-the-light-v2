import InstallPrompt from '@/components/shared/InstallPrompt';
import Profile from '@/components/shared/Profile';
import PushNotificationManager from '@/components/shared/PushNotificationManager';
import { authOptions } from '@/utils/authOptions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
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
    <div className='flex justify-center items-center w-full'>
      <div>
        <PushNotificationManager />
        <InstallPrompt />
        <Link href={'/write'}>일기 녹음하러 가기</Link>
        <Profile {...session.user} />
      </div>
    </div>
  );
}
