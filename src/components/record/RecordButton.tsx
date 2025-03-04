'use client';

import { Button } from '@/components/ui/button';
import useRecord from '@/hooks/useRecord';
import { Session } from 'next-auth';
import STTResult from '../main/STTResult';

interface Props {
  session: Session;
  date: Date | undefined;
  transcode: (
    blob: Blob,
    mimeType: string,
  ) => Promise<{
    audioBlob: Blob;
    audioURL: string;
  }>;
}

export default function RecordButton({ session, date, transcode }: Props) {
  const {
    isRecording,
    startRecording,
    stopRecording,
    processingText,
    sttText,
    audioURL,
    updateSttText,
    analyze,
    recordRemainingTime,
  } = useRecord(session, date, transcode);

  return (
    <section className='flex flex-col items-center'>
      {isRecording ? (
        <>
          <p>{recordRemainingTime}</p>
          <Button variant='destructive' onClick={stopRecording}>
            녹음 중
          </Button>
        </>
      ) : processingText ? (
        <p>{processingText}</p>
      ) : audioURL ? (
        <STTResult
          audioURL={audioURL}
          sttText={sttText}
          updateSttText={updateSttText}
          analyze={analyze}
        />
      ) : (
        <Button onClick={startRecording}>녹음 시작</Button>
      )}
    </section>
  );
}
