import { useEffect, useRef, useState } from 'react';
import useConvertToMP3 from './useConvertToMP3';
import formatDate from '@/utils/formatDate';
import getSpeechToText from '@/actions/diary/getSpeechToText';
import getVoiceModelResult from '@/actions/diary/getVoiceModelResult';
import saveRecording from '@/actions/diary/saveRecording';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

const useRecord = (session: Session) => {
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태 관리
  const [isIOS, setIsIOS] = useState(false); // iOS 여부 관리
  const [isSafari, setIsSafari] = useState(false); // Safari 여부 관리
  const { load, transcode } = useConvertToMP3();
  const [processingText, setProcessingText] = useState<string | null>(null); // 프로세싱 과정을 보여주는 텍스트

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window),
    );
    setIsSafari(navigator.userAgent.indexOf('Safari') !== -1);
    load();
  }, []);

  // 녹음 시작 함수
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
      const { audioBlob } = await transcode(recordedBlob, mimeType); // 녹음 데이터 mp3로 변환

      // 녹음 데이터 File 생성 (supabase에 업로드, 음성, 텍스트 모델 서버에 요청할 때 사용)
      const recordedFile = new File(
        [audioBlob],
        `${formatDate(new Date())}.mp3`,
        {
          type: 'audio/mp3',
        },
      );

      setProcessingText('음성을 텍스트로 변환 중...');
      const { text } = await getSpeechToText(recordedFile); // STT API 호출

      // TODO: STT 변환 후 텍스트를 화면에 표시하고, '분석' 버튼을 누를 시 음성, 텍스트 모델 서버에 요청

      setProcessingText('음성으로 우울감, 감정 분석 중...');
      const voiceResult = await getVoiceModelResult(recordedFile); // 음성 우울감 분석 API 호출

      setProcessingText('데이터 저장 중...');
      // supabase에 녹음파일, 유저 id, stt text, 음성 우울감 분석 결과 저장
      await saveRecording(recordedFile, session.user.id!, text, voiceResult);

      setProcessingText(null); // 프로세싱 텍스트 초기화
      // '/diary' 페이지로 이동, default로 오늘 날짜의 다이어리를 보여줌
      router.replace('/diary');
    };

    // 녹음 시작
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

  return {
    isRecording,
    startRecording,
    stopRecording,
    processingText,
  };
};

export default useRecord;
