import getDiaryAtDate from '@/actions/diary/getDiaryAtDate';
import getKoreaDate from '@/utils/getKoreaDate';
import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';

const useDiary = (session: Session, date: Date | undefined) => {
  const koreaDate = getKoreaDate(date!).toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['diary', session.user.id, koreaDate],
    queryFn: async () => await getDiaryAtDate(session.user.id!, koreaDate),
    enabled: !!date,
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export default useDiary;
