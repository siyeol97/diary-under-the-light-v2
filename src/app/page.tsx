import InstallPrompt from '@/components/InstallPrompt';
import PushNotificationManager from '@/components/PushNotificationManager';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import SignOut from '@/components/SignOut';
import { authOptions } from '@/utils/authOptions';

export const metadata: Metadata = {
  title: '푸시 알림 테스트 화면',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userImage = session?.user?.image ?? '/icon_192.png';
  return (
    <div>
      {session ? (
        <div>
          <PushNotificationManager />
          <InstallPrompt />
          <Link href={'/write'}>일기 녹음하러 가기</Link>
          <img
            src={userImage}
            alt='user-profile'
          />
          <p>유저 이름: {session?.user.name}</p>
          <p>이메일 : {session?.user.email}</p>
          <SignOut />
        </div>
      ) : (
        <Link href={'/auth/signin'}>로그인 하기</Link>
      )}
    </div>
  );
}
