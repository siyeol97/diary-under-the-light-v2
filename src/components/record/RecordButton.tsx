'use client';

import { Button } from '@/components/ui/button';
import useRecord from '@/hooks/useRecord';
import { Session } from 'next-auth';

interface Props {
  session: Session;
}

export default function RecordButton({ session }: Props) {
  const { isRecording, startRecording, stopRecording, processingText } =
    useRecord(session);

  return (
    <section className='flex flex-col items-center'>
      {isRecording ? (
        <Button variant='destructive' onClick={stopRecording}>
          녹음 중
        </Button>
      ) : processingText ? (
        <p>{processingText}</p>
      ) : (
        <Button onClick={startRecording}>녹음 시작</Button>
      )}
    </section>
  );
}
