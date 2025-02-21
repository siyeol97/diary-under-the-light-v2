import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useConvertToMP3 from './useConvertToMP3';
import formatDate from '@/utils/formatDate';
import getSpeechToText from '@/actions/diary/getSpeechToText';
import getVoiceModelResult from '@/actions/diary/getVoiceModelResult';
import saveRecording from '@/actions/diary/saveRecording';
import { Session } from 'next-auth';
import getGeminiResponse from '@/actions/diary/getGeminiResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRecord = (session: Session, date: Date | undefined) => {
  const queryClient = useQueryClient();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태 관리
  const [isIOS, setIsIOS] = useState(false); // iOS 여부 관리
  const [isSafari, setIsSafari] = useState(false); // Safari 여부 관리
  const { load, transcode } = useConvertToMP3();
  const [audioURL, setAudioURL] = useState<string>(''); // 녹음된 오디오 URL
  const [sttText, setSttText] = useState<string>(''); // 음성을 텍스트로 변환한 텍스트
  const [recordedFile, setRecordedFile] = useState<File | null>(null); // 녹음 데이터 File
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
      setProcessingText('음성을 텍스트로 변환 중...');

      const recordedBlob = new Blob(chunks, { type: `audio/${mimeType}` }); // 녹음 데이터 Blob 생성
      const { audioBlob, audioURL } = await transcode(recordedBlob, mimeType); // 녹음 데이터 mp3로 변환

      setAudioURL(audioURL); // 녹음된 오디오 URL 업데이트

      // 녹음 데이터 File 생성 (supabase에 업로드, 음성, 텍스트 모델 서버에 요청할 때 사용)
      const recorded = new File([audioBlob], `${formatDate(new Date())}.mp3`, {
        type: 'audio/mp3',
      });

      setRecordedFile(recorded); // 녹음 데이터 File 업데이트

      const { text } = await getSpeechToText(recorded); // STT API 호출

      setProcessingText(null);

      if (!text) {
        setSttText('음성 감지가 원활하지 않습니다.');
        return;
      }

      setSttText(text); // STT 결과 업데이트
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

  // 일기 텍스트 업데이트
  const updateSttText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSttText(e.target.value);
  };

  // 음성, 텍스트 우울감, 감정 분석 함수
  const analyzeEmotions = async () => {
    setProcessingText('음성으로 우울감, 감정 분석 중...');
    const voiceResult = await getVoiceModelResult(recordedFile!);

    setProcessingText('텍스트로 우울감, 감정 분석 중...');
    const result = await getGeminiResponse(sttText);
    let textResult = '';

    try {
      setProcessingText('데이터 저장 중...');
      textResult = JSON.parse(result);
    } catch (e) {
      console.log(e);
      textResult = '';
    } finally {
      await saveRecording(
        recordedFile!,
        session.user.id!,
        sttText,
        voiceResult,
        textResult,
      );
      setProcessingText(null);
    }
  };

  const { mutateAsync: analyze } = useMutation({
    mutationFn: analyzeEmotions,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['diary', session.user.id, date],
      }),
  });

  return {
    isRecording,
    startRecording,
    stopRecording,
    processingText,
    sttText,
    audioURL,
    updateSttText,
    analyze,
  };
};

export default useRecord;
