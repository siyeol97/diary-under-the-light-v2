import BottomMenu from '@/components/shared/BottomMenu';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      {children}
      <BottomMenu />
    </main>
  );
}
