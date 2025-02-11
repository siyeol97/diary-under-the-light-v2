import { SVGProps } from 'react';

export default function ChartIcon({
  width = 24,
  height = 24,
}: SVGProps<SVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M21.21 15.89C20.5738 17.3945 19.5788 18.7202 18.3119 19.7513C17.045 20.7824 15.5448 21.4874 13.9424 21.8048C12.3401 22.1221 10.6844 22.0421 9.12015 21.5718C7.55588 21.1014 6.13063 20.2551 4.96903 19.1066C3.80742 17.9582 2.94482 16.5427 2.45664 14.9839C1.96846 13.4251 1.86957 11.7705 2.1686 10.1646C2.46764 8.55877 3.1555 7.05061 4.17205 5.77202C5.1886 4.49342 6.50289 3.4833 8.00001 2.82999'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
