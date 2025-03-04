import { Button } from '../ui/button';

interface Props {
  sttText: string;
  audioURL: string;
  updateSttText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  analyze: () => void;
}

export default function STTResult({
  sttText,
  audioURL,
  updateSttText,
  analyze,
}: Props) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <audio controls src={audioURL}></audio>
      <textarea
        className='border border-black min-w-full min-h-[160px]'
        value={sttText}
        onChange={(e) => updateSttText(e)}
      />
      <Button onClick={() => analyze()}>분석 시작</Button>
    </div>
  );
}
