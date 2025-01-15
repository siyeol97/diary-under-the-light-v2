/* eslint-disable-next-line */
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string; // 사용자 ID를 추가
    };
  }

  interface User {
    id: string; // 사용자 ID 추가
  }
}
