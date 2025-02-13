import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useRef } from 'react';

const useConvertToMP3 = () => {
  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
    const ffmpeg = ffmpegRef.current;

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });
  };

  const transcode = async (blob: Blob, mimeType: string) => {
    let audioBlob = null;

    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(`input.${mimeType}`, await fetchFile(blob));
    await ffmpeg.exec(['-i', `input.${mimeType}`, 'output.mp3']);
    // eslint-disable-next-line
    const data = (await ffmpeg.readFile('output.mp3')) as any;

    audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });

    return { audioBlob };
  };

  return { load, transcode };
};

export default useConvertToMP3;
