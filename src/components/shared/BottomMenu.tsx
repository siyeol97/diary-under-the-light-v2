'use client';

import { Menu } from '@/types/type';
import { usePathname } from 'next/navigation';
import MenuItem from './MenuItem';

const menu: Menu[] = [
  {
    id: 1,
    name: 'Home',
    href: '/',
    icon: 'calender',
  },
  {
    id: 2,
    name: 'selfcare',
    href: '/selfcare',
    icon: 'heart',
  },
  {
    id: 3,
    href: '/chart',
    name: 'statistics',
    icon: 'chart',
  },
  {
    id: 4,
    name: 'setting',
    href: '/setting',
    icon: 'setting',
  },
];

export default function BottomMenu() {
  const currentPath = usePathname();

  return (
    <section className='flex justify-between items-center fixed bottom-0 w-full bg-greyScale-20 h-[80px] px-4 pb-4'>
      {menu.map((menu) => (
        <MenuItem
          menu={menu}
          key={menu.id}
          isActive={
            menu.href === '/'
              ? currentPath === '/' || currentPath.startsWith('/diary')
              : currentPath.startsWith(menu.href)
          }
        />
      ))}
    </section>
  );
}
