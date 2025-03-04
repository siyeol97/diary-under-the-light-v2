'use client';

import useConvertToMP3 from '@/hooks/useConvertToMP3';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import MainPageContainer from './MainPageContainer';

interface Props {
  session: Session;
}

export default function MainPageWrapper({ session }: Props) {
  const { load, transcode } = useConvertToMP3();

  useEffect(() => {
    load();
  }, [load]);

  return <MainPageContainer session={session} transcode={transcode} />;
}
