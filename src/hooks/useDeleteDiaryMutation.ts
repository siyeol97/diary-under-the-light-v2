import deleteRecording from '@/actions/diary/deleteRecording';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const useDeleteDiaryMutation = (
  id: number,
  user_id: string,
  recording_url: string,
  date: string,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRecording(id, recording_url),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['diary', user_id, date],
      });
      router.replace('/');
    },
  });
};

export default useDeleteDiaryMutation;
