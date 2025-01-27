export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      {children}
      <footer>
        <div className='flex h-[50px] justify-center items-center bg-primary-500 fixed bottom-0 w-full'>
          <p>© 2021 등잔밑일기</p>
          <p>이용약관</p>
          <p>개인정보 처리방침</p>
          <p>문의하기</p>
        </div>
      </footer>
    </main>
  );
}
