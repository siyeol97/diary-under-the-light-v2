'use client';

import useDeleteDiaryMutation from '@/hooks/useDeleteDiaryMutation';
import { Button } from '../ui/button';

interface Props {
  user_id: string;
  id: number;
  date: string;
  recording_url: string;
}

export default function DeleteButton({
  user_id,
  id,
  date,
  recording_url,
}: Props) {
  const { mutateAsync: deleteDiary } = useDeleteDiaryMutation(
    id,
    user_id,
    recording_url,
    date,
  );

  return <Button onClick={() => deleteDiary()}>삭제하기</Button>;
}
