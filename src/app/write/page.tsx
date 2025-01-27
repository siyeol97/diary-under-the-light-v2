import { getServerSession } from "next-auth";
import AudioRecord from "../../components/write/AudioRecord";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/utils/authOptions";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main>
      <h1>일기 녹음 페이지</h1>
      <AudioRecord session={session} />
      <Link href="/">홈으로</Link>
    </main>
  );
}
