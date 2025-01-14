/**
 * 애플리케이션의 웹 앱 매니페스트를 생성
 *
 * @returns {MetadataRoute.Manifest} 웹 애플리케이션에 대한 메타데이터를 포함하는 매니페스트 객체
 *
 * @property {string} name - 웹 애플리케이션의 이름
 * @property {string} short_name - 웹 애플리케이션의 짧은 이름
 * @property {string} description - 웹 애플리케이션에 대한 간단한 설명
 * @property {string} lang - 웹 애플리케이션의 기본 언어
 * @property {string} start_url - 웹 애플리케이션이 시작될 때 시작할 URL
 * @property {string} display - 웹 애플리케이션의 디스플레이 모드
 * @property {string} orientation - 웹 애플리케이션의 기본 방향
 * @property {string} background_color - 웹 애플리케이션의 배경색
 * @property {string} theme_color - 웹 애플리케이션의 테마 색상
 * @property {Array} icons - 웹 애플리케이션에서 사용하는 아이콘 객체의 배열
 * @property {string} icons[].src - 아이콘 이미지의 소스 URL
 * @property {string} icons[].sizes - 아이콘 이미지의 크기
 * @property {string} icons[].purpose - 아이콘의 용도
 * @property {string} icons[].type - 아이콘 이미지의 MIME 타입
 */

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '등잔밑일기',
    short_name: '등잔밑일기',
    description: 'AI analysis of your emotions in your diary',
    lang: 'ko-KR',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon_192.png',
        sizes: '192x192',
        purpose: 'maskable',
        type: 'image/png',
      },
      {
        src: '/icon_256.png',
        sizes: '256x256',
        purpose: 'maskable',
        type: 'image/png',
      },
      {
        src: '/icon_512.png',
        sizes: '512x512',
        purpose: 'maskable',
        type: 'image/png',
      },
      {
        src: '/icon_192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon_256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icon_512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
