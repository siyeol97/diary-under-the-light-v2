import { Diary } from '@/types/diary';
import formatDateDiff from '@/utils/formatDateDiff';
import DeleteButton from './DeleteButton';

interface Props {
  diaryDetail: Diary;
}

export default function DiaryDetailWrapper({ diaryDetail }: Props) {
  const { id, user_id, created_at, recording_url, stt_text } = diaryDetail;
  const date = created_at.slice(0, 10);
  const formattedDate = formatDateDiff(date);

  return (
    <div className='flex flex-col gap-4 justify-start items-start size-full'>
      <p>{formattedDate}</p>
      <audio src={recording_url!} controls className='w-full' />
      <p>{stt_text}</p>
      <DeleteButton
        id={id}
        user_id={user_id!}
        date={date}
        recording_url={recording_url!}
      />
    </div>
  );
}
