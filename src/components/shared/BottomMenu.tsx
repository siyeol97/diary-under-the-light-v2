'use client';
import { Menu } from '@/types/type';
import { usePathname } from 'next/navigation';
import MenuItem from './MenuItem';

const menu: Menu[] = [
  {
    id: 1,
    name: 'mindcare',
    href: '/mindcare',
    icon: 'heart',
  },
  {
    id: 2,
    href: '/chart',
    name: 'statistics',
    icon: 'chart',
  },
  {
    id: 3,
    name: 'Home',
    href: '/',
    icon: 'calender',
  },
  {
    id: 4,
    name: 'diary',
    href: '/diary',
    icon: 'diary',
  },
  {
    id: 5,
    name: 'setting',
    href: '/setting',
    icon: 'setting',
  },
];

export default function BottomMenu() {
  const currentPath = usePathname();

  return (
    <section className='flex justify-between items-center fixed bottom-0 w-full bg-greyScale-20 h-[80px] px-4'>
      {menu.map((menu) => (
        <MenuItem
          menu={menu}
          key={menu.id}
          isActive={currentPath === menu.href}
        />
      ))}
    </section>
  );
}
