import SignOut from '@/components/auth/SignOut';
import Profile from '@/components/shared/Profile';
import PushNotificationManager from '@/components/shared/PushNotificationManager';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='flex flex-col justify-center items-center gap-10'>
      <Profile {...session.user} />
      <PushNotificationManager />
      <SignOut />
    </div>
  );
}
