import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY!,
      authorization: {
        // Google OAuth2.0 인증을 위한 추가 옵션, Google 인증 엔드포인트에 쿼리 매개변수 정의.
        params: {
          prompt: 'consent', // 사용자가 항상 권한 요청 화면을 볼 수 있도록 함.
          access_type: 'offline', // 리프레시 토큰을 받기 위해 오프라인 액세스 권한을 요청.
          response_type: 'code', // OAuth2.0 인증 코드 흐름을 사용.
        },
      },
    }),
  ],

  session: {
    strategy: 'jwt', // 서버에 저장된 상태 없이도 세션 유지
    maxAge: 365 * 24 * 60 * 60, // 만료 시간 1년
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token; // token 객체는 session 콜백으로 전달.
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
