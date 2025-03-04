import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useCallback, useRef, useState, useEffect } from 'react';

const useConvertToMP3 = () => {
  // FFmpeg 인스턴스를 저장할 ref 선언
  const ffmpegRef = useRef<FFmpeg | null>(null);
  // 로딩 완료 상태 추적
  const [isLoaded, setIsLoaded] = useState(false);

  // 컴포넌트가 마운트될 때만 FFmpeg 인스턴스 생성
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ffmpegRef.current = new FFmpeg();
    }
  }, []);

  const load = useCallback(async () => {
    // 이미 로드되었거나 브라우저 환경이 아닌 경우 처리
    if (isLoaded || typeof window === 'undefined' || !ffmpegRef.current) return;

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
      const ffmpeg = ffmpegRef.current;

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript',
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm',
        ),
      });

      setIsLoaded(true);
      console.log('FFmpeg 로딩 완료');
    } catch (error) {
      console.error('FFmpeg 로딩 실패:', error);
    }
  }, [isLoaded]);

  const transcode = async (blob: Blob, mimeType: string) => {
    if (!ffmpegRef.current || typeof window === 'undefined') {
      throw new Error('FFmpeg가 초기화되지 않았습니다.');
    }

    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(`input.${mimeType}`, await fetchFile(blob));
    await ffmpeg.exec(['-i', `input.${mimeType}`, 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3');

    const audioBlob = new Blob([data], { type: 'audio/mp3' });
    const audioURL = URL.createObjectURL(audioBlob);

    return { audioBlob, audioURL };
  };

  return { load, transcode };
};

export default useConvertToMP3;
