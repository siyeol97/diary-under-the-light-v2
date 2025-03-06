import BottomMenu from '@/components/shared/BottomMenu';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='flex flex-col justify-between h-screen pt-10'>
      {children}
      <BottomMenu />
    </main>
  );
}
