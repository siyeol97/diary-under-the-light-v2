'use client';

import getSpeechToText from '@/actions/diary/getSpeechToText';
import getVoiceDepress from '@/actions/diary/getVoiceDepress';
import saveRecording from '@/actions/diary/saveRecording';
import { Button } from '@/components/ui/button';
import useConvertToMP3 from '@/hooks/useConvertToMP3';
import formatDate from '@/utils/formatDate';
import { Session } from 'next-auth';
import { useEffect, useRef, useState } from 'react';

interface Props {
  session: Session;
}

export default function RecordButton({ session }: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태 관리
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // 녹음 URL 관리 (audio 태그에 사용)
  const [isIOS, setIsIOS] = useState(false); // iOS 여부 관리
  const [isSafari, setIsSafari] = useState(false); // Safari 여부 관리
  const { load, transcode } = useConvertToMP3();
  const [sttText, setSttText] = useState<string | null>(null); // STT 결과 관리

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window),
    );
    setIsSafari(navigator.userAgent.indexOf('Safari') !== -1);
    load();
  }, []);

  const startRecording = async () => {
    let mimeType = 'webm'; // 녹음 데이터 타입
    if (isIOS || isSafari) {
      mimeType = 'mp4'; // iOS or Safari에서는 mp4로 설정
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // 오디오 스트림 요청
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: `audio/${mimeType}`,
    }); // MediaRecorder 생성

    const chunks: BlobPart[] = []; // 녹음 데이터 저장 배열
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data); // 녹음 데이터 이벤트 핸들러

    // 녹음 중지 이벤트 핸들러
    mediaRecorder.onstop = async () => {
      const recordedBlob = new Blob(chunks, { type: `audio/${mimeType}` }); // 녹음 데이터 Blob 생성

      const { audioBlob, audioURL } = await transcode(recordedBlob, mimeType); // 녹음 데이터 mp3로 변환
      setAudioUrl(audioURL); // 녹음 URL 업데이트 (화면에 녹음 데이터 출력)

      // 녹음 데이터 File 생성 (supabase에 업로드, 음성모델 서버에 요청할 때 사용)
      const recordedFile = new File(
        [audioBlob],
        `${formatDate(new Date())}.mp3`,
        {
          type: 'audio/mp3',
        },
      );

      const { text } = await getSpeechToText(recordedFile); // STT API 호출
      const voiceDepressResult = await getVoiceDepress(recordedFile); // 음성 감정 분석 API 호출

      setSttText(text); // STT 결과 업데이트

      // supabase에 녹음 데이터 저장
      await saveRecording(
        recordedFile,
        session.user.id!,
        text,
        voiceDepressResult,
      );
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder; // MediaRecorder를 Ref에 저장
    setIsRecording(true); // 녹음 상태 업데이트
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop(); // 녹음 중지
      setIsRecording(false); // 녹음 상태 업데이트
    }
  };

  return (
    <section className='flex flex-col items-center'>
      {isRecording ? (
        <Button variant='destructive' onClick={stopRecording}>
          녹음 중
        </Button>
      ) : (
        <Button onClick={startRecording}>녹음 시작</Button>
      )}
      {audioUrl && (
        <>
          <p>녹음완료</p>
          <audio controls src={audioUrl} style={{ width: '100%' }} />
          <p>{sttText}</p>
        </>
      )}
    </section>
  );
}
