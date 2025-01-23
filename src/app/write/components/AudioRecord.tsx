'use client';

import { getDiaries, saveRecording } from '@/app/actions';
import formatDate from '@/utils/formatDate';
import { Session } from 'next-auth';
import { useEffect, useRef, useState } from 'react';

interface Props {
  session: Session;
}

interface Diary {
  created_at: string;
  id: number;
  recording_url: string | null;
  user_id: string | null;
}

export default function AudioRecord({ session }: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태 관리
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // 녹음 URL 관리 (audio 태그에 사용)
  const [diaries, setDiaries] = useState<Diary[]>([]); // 일기 목록 관리

  useEffect(() => {
    const updateDiaryList = async () => {
      const diaryList = await getDiaries(session.user.id!);
      setDiaries(diaryList);
    };
    updateDiaryList();
  }, [audioUrl]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // 오디오 스트림 요청
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // MediaRecorder 생성

    const chunks: BlobPart[] = []; // 녹음 데이터 저장 배열
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data); // 녹음 데이터 이벤트 핸들러

    // 녹음 중지 이벤트 핸들러
    mediaRecorder.onstop = async () => {
      const recordedBlob = new Blob(chunks, { type: 'audio/webm' }); // 녹음 데이터 Blob 생성
      const audioUrl = URL.createObjectURL(recordedBlob); // 녹음 데이터 URL 생성 (audio 태그에 사용)

      // 녹음 데이터 File 생성 (supabase에 업로드할 때 사용)
      const recordedFile = new File(
        [recordedBlob],
        `${formatDate(new Date())}.webm`,
        {
          type: 'audio/webm',
        }
      );

      // supabase에 녹음 데이터 저장
      await saveRecording(recordedFile, session.user.id!);
      setAudioUrl(audioUrl); // 녹음 URL 업데이트 (화면에 녹음 데이터 출력)
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
    <section>
      {isRecording ? (
        <button onClick={stopRecording}>녹음 중지</button>
      ) : (
        <button onClick={startRecording}>녹음 시작</button>
      )}
      {audioUrl && (
        <>
          <p>녹음완료</p>
          <audio
            controls
            src={audioUrl}
            style={{ width: '100%' }}
          />
        </>
      )}
      <p>녹음파일 리스트</p>
      {diaries.map((diary) => {
        return (
          <div key={diary.id}>
            <p>{diary.created_at}</p>
            <audio
              src={diary.recording_url!}
              style={{ width: '100%' }}
              controls
            />
          </div>
        );
      })}
    </section>
  );
}
