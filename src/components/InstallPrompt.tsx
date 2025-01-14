'use client';

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false); // iOS 기기 여부
  const [isStandalone, setIsStandalone] = useState(false); // PWA가 이미 설치되어 있는지(standalone 모드) 여부

  /**
   * 컴포넌트 마운트 시 기기 및 설치 상태 확인
   * - User Agent를 통한 iOS 기기 감지
   * - matchMedia API를 통한 standalone 모드 확인
   */
  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null; // 이미 PWA가 설치되어 있다면 프롬프트를 표시하지 않음
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span
            role='img'
            aria-label='share icon'
          >
            {' '}
            ⎋{' '}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span
            role='img'
            aria-label='plus icon'
          >
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      )}
    </div>
  );
}
