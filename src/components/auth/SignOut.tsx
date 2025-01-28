'use client';

import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';

export default function SignOut() {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
      variant='destructive'
    >
      로그아웃
    </Button>
  );
}
