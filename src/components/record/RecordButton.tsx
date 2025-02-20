'use client';

import { Button } from '@/components/ui/button';
import useRecord from '@/hooks/useRecord';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';

interface Props {
  session: Session;
  date: Date | undefined;
}

export default function RecordButton({ session, date }: Props) {
  const queryClient = useQueryClient();
  const {
    isRecording,
    startRecording,
    stopRecording,
    processingText,
    sttText,
    audioURL,
    updateSttText,
    analyzeEmotions,
  } = useRecord(session);

  const { mutateAsync } = useMutation({
    mutationFn: analyzeEmotions,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['diary', session.user.id, date],
      }),
  });

  return (
    <section className='flex flex-col items-center'>
      {isRecording ? (
        <Button variant='destructive' onClick={stopRecording}>
          녹음 중
        </Button>
      ) : processingText ? (
        <p>{processingText}</p>
      ) : audioURL ? (
        // 녹음 완료 후, stt 결과와 음성 렌더링
        <div className='flex flex-col items-center gap-2'>
          <audio controls src={audioURL}></audio>
          <textarea
            className='border border-black min-w-full min-h-[250px]'
            value={sttText}
            onChange={(e) => updateSttText(e)}
          />
          <Button onClick={() => mutateAsync()}>분석 시작</Button>
        </div>
      ) : (
        <Button onClick={startRecording}>녹음 시작</Button>
      )}
    </section>
  );
}
