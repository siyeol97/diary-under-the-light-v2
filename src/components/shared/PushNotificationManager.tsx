'use client';

import { useEffect, useState } from 'react';
import urlBase64ToUint8Array from '@/utils/urlBase64ToUint8Array';
import { PushSubscription } from 'web-push';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import getSubscription from '@/actions/webpush/getSubscription';
import subscribeUser from '@/actions/webpush/subscribeUser';
import unsubscribeUser from '@/actions/webpush/unsubscribeUser';
import sendNotification from '@/actions/webpush/sendNotification';

/**
 * 웹 푸시 알림을 관리하는 컴포넌트
 * - 브라우저의 푸시 알림 지원 여부 확인
 * - 서비스 워커 등록 및 푸시 구독 관리
 * - 알림 구독/구독취소 기능 제공
 */
export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false); // 브라우저의 푸시 알림 지원 여부
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  ); // 현재 푸시 알림 구독 상태
  const [message, setMessage] = useState(''); // 사용자에게 표시할 상태 메시지

  // 컴포넌트 마운트 시 브라우저 지원 여부 확인 및 서비스 워커 등록
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      console.log('푸시 알림을 지원하지 않는 브라우저 입니다.');
    }
  }, []);

  // 서비스 워커를 등록하고 기존 구독 정보를 확인하는 함수
  async function registerServiceWorker() {
    // 서비스 워커 등록
    await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    // db에서 구독 정보 확인
    const dbSub = await getSubscription();

    setSubscription(dbSub);
  }

  // 푸시 알림 구독 요청, subscribe: 푸시 알림 허용
  async function subscribeToPush() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
          ),
        });
        const serializedSub = JSON.parse(JSON.stringify(sub)); // 깊은 복사
        const dbSub = await subscribeUser(serializedSub);

        setSubscription(dbSub);
      } catch (error) {
        console.error('푸시 알림 구독 요청 실패 -> ', error);
      }
    } else {
      console.log('푸시 알림 허용이 거부되었습니다.');
    }
  }

  // 푸시 알림 구독 취소
  async function unsubscribeFromPush() {
    setSubscription(null);
    await unsubscribeUser();
  }

  // 테스트 푸시 알림 전송
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(subscription, message);
      setMessage('');
    }
  }

  // 푸시 알림이 지원되지 않는 브라우저 일 경우
  if (!isSupported) {
    return <p>푸시 알림을 지원하지 않는 브라우저 입니다.</p>;
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex px-6 py-4 justify-between items-center w-full '>
        <h3>앱 푸시 알림</h3>
        <Switch
          checked={!!subscription}
          onCheckedChange={
            !!subscription ? unsubscribeFromPush : subscribeToPush
          }
        />
      </div>
      {/** 푸시 알림 테스트 */}
      {!!subscription && (
        <div className='flex flex-col gap-2 px-6 py-2'>
          <Input
            type='text'
            placeholder='Enter notification message'
            value={message} // 푸시 알림 메세지
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendTestNotification}>푸시 알림 보내기</Button>
        </div>
      )}
    </div>
  );
}
