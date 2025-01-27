import SignOut from "../auth/SignOut";
import { Avatar, AvatarImage } from "../ui/avatar";

interface ProfileProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
}

export default function Profile(user: ProfileProps) {
  const userImage = user?.image ?? "/icon_192.png";
  const userName = user?.name ?? "";
  const userEmail = user?.email ?? "";

  return (
    <div>
      <Avatar>
        <AvatarImage src={userImage} alt="user-profile" />
      </Avatar>
      <p>유저 이름: {userName}</p>
      <p>이메일 : {userEmail}</p>
      <SignOut />
    </div>
  );
}
