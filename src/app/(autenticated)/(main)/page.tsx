import AudioRecord from '@/components/record/AudioRecord';
import InstallPrompt from '@/components/shared/InstallPrompt';
import { authOptions } from '@/utils/authOptions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '달력 보기',
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='flex flex-col gap-4 justify-center items-center size-full'>
      <InstallPrompt />
      <AudioRecord session={session} />
    </div>
  );
}
