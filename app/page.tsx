'use client';

import { useState } from 'react';
import { EntryCeremony } from '@/components/EntryCeremony';
import { BirthdayExperience } from '@/components/BirthdayExperience';

export default function Home() {
  // 主界面容器默认隐藏，等入场仪式（烟花 2s → siu~ 爱心 5s）结束后再显示。
  const [entered, setEntered] = useState(false);
  return (
    <>
      <EntryCeremony onFinished={() => setEntered(true)} />
      <BirthdayExperience active={entered} enableInterestAccent />
    </>
  );
}
