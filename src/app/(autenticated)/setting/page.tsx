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
    <div>
      <Profile {...session.user} />
      <PushNotificationManager />
    </div>
  );
}
