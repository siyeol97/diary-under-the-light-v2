'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function OAuth() {
  const signInOAuth = async (provider: string) => {
    await signIn(provider, {
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <section>
      <button onClick={() => signInOAuth('google')}>
        Sign In With Google
        <Image
          src={'/google_logo.svg'}
          alt='google-logo'
          width={24}
          height={24}
        />
      </button>
    </section>
  );
}
