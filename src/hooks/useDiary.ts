import getDiaryAtDate from '@/actions/diary/getDiaryAtDate';
import getKoreaDate from '@/utils/getKoreaDate';
import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';

const useDiary = (session: Session, date: Date | undefined) => {
  return useQuery({
    queryKey: ['diary', session.user.id, date],
    queryFn: async () =>
      await getDiaryAtDate(
        session.user.id!,
        getKoreaDate(date!).toISOString().slice(0, 10),
      ),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
};

export default useDiary;
