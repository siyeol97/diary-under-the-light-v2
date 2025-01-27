import InstallPrompt from "@/components/shared/InstallPrompt";
import Profile from "@/components/shared/Profile";
import PushNotificationManager from "@/components/shared/PushNotificationManager";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "푸시 알림 테스트 화면",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex justify-center items-center w-full h-screen">
      {session ? (
        <div>
          <PushNotificationManager />
          <InstallPrompt />
          <Link href={"/write"}>일기 녹음하러 가기</Link>
          <Profile {...session.user} />
        </div>
      ) : (
        <Button asChild>
          <Link href={"/auth/signin"}>로그인 하러가기</Link>
        </Button>
      )}
    </div>
  );
}
