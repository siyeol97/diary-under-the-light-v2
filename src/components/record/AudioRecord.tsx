import React from 'react';
import RecordButton from './RecordButton';
import { Session } from 'next-auth';

export default function AudioRecord({ session }: { session: Session }) {
  return (
    <div>
      <RecordButton session={session} />
    </div>
  );
}
