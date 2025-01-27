'use client';
import { cn } from '@/lib/utils';
import type { Menu } from '@/types/type';
import { useRouter } from 'next/navigation';
import IconRenderer from './IconRendere';

export default function MenuItem({
  menu,
  isActive = false,
}: {
  menu: Menu;
  isActive?: boolean;
}) {
  const router = useRouter();
  const onClick = () => {
    router.push(menu.href);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'cursor-pointer flex items-center justify-center p-2 hover:bg-primary-400 hover:text-greyScale-20 text-greyScale-600 transition-all duration-200 rounded-md',
        {
          'bg-primary-600 text-white': isActive,
        },
      )}
    >
      <IconRenderer icon={menu.icon} />
    </button>
  );
}
