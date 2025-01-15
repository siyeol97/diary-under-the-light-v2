import InstallPrompt from '@/components/InstallPrompt';
import PushNotificationManager from '@/components/PushNotificationManager';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: '푸시 알림 테스트 화면',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userImage = session?.user?.image ?? '/icon_192.png';
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
      {session ? (
        <div>
          <img
            src={userImage}
            alt='user-profile'
          />
          <p>유저 이름: {session?.user.name}</p>
          <p>이메일 : {session?.user.email}</p>
        </div>
      ) : null}
    </div>
  );
}
