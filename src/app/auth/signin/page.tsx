import { Metadata } from 'next';
import OAuth from './components/OAuth';

export const metadata: Metadata = {
  title: '로그인',
};

export default function page() {
  return (
    <main>
      로그인 페이지
      <OAuth />
    </main>
  );
}
