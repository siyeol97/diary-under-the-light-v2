'use server';

import webpush, { PushSubscription } from 'web-push';

/**
 * Web Push 알림을 위한 서버 사이드 액션 파일
 * VAPID(Voluntary Application Server Identification) 키를 사용하여 푸시 서비스 설정
 */

webpush.setVapidDetails(
  'mailto:leesi2830@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, // VAPID 공개 키
  process.env.VAPID_PRIVATE_KEY! // VAPID 비공개 키
);

let subscription: PushSubscription | null = null; // 현재 구독 정보를 메모리에 저장 (개발 환경용)

// 사용자의 푸시 알림 구독을 처리하는 함수
export async function subscribeUser(sub: PushSubscription) {
  // sub: 브라우저에서 생성된 PushSubscription 객체
  subscription = sub;
  // 실제 프로덕션에서는 DB에 구독 정보를 저장해야 함
  // 예시: await db.subscriptions.create({ data: sub })
  return { success: true };
}

// 사용자의 푸시 알림 구독을 취소하는 함수
export async function unsubscribeUser() {
  subscription = null;
  // 실제 프로덕션에서는 DB에서 구독 정보를 삭제해야 함
  // 예시: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

// 푸시 알림을 전송하는 함수
export async function sendNotification(message: string) {
  // message:전송할 메시지 내용
  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification', // 푸시 알림 제목
        body: message, // 푸시 알림 내용
        icon: '/icon.png', // 푸시 알림 아이콘
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
