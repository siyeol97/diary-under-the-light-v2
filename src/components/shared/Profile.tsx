import { Avatar, AvatarImage } from '../ui/avatar';

interface ProfileProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
}

export default function Profile(user: ProfileProps) {
  const userImage = user?.image ?? '/icon_192.png';
  const userName = user?.name ?? '';
  const userEmail = user?.email ?? '';

  return (
    <div className='w-full flex flex-col items-center gap-5 pt-20 pb-10'>
      <Avatar className='w-24 h-24'>
        <AvatarImage src={userImage} alt='user-profile' />
      </Avatar>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='font-bold text-2xl'>{userName}</h1>
        <p className='text-greyScale-400'>{userEmail}</p>
      </div>
    </div>
  );
}
