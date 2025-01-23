/**
 * 서버에서 푸시 알림을 보내는 데 필요한 공개 키를 클라이언트에서 사용할 수 있는 형식으로 변환
 * PWA에서 푸시 알림을 사용하려면 푸시 서비스와 브라우저 간의 상호작용을 위해 웹 푸시 프로토콜을 사용해야 함
 * 클라이언트는 VAPID(Voluntary Application Server Identification) 키를 사용하여 푸시 알림 구독을 생성하고, 이 키는 base64로 인코딩 된 문자열로 제공됨.
 * 하지만 푸시 알림을 보낼 때 이 키는 Uint8Array 형식으로 변환해야 함
 */
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default urlBase64ToUint8Array;
