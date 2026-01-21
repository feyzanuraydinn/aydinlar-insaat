'use client';

interface SpinnerProps {
  size?: number;
  text?: string;
}

export default function Spinner({ size = 80, text = 'Yükleniyor...' }: SpinnerProps) {
  return (
    <div className="loader">
      <svg
        className="logo"
        width={size}
        height={size}
        viewBox="0 0 87 92"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M18.9896 59.9688V83.3958H26.5833V65.5469L18.9896 59.9688Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M52.9167 40.0885L55.5417 41.6979V31.8646L52.9167 33.4844V40.0885Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M57.2448 30.8177V42.7448L59.8646 44.3542V29.1979L57.2448 30.8177Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M61.5625 28.151V45.401L64.1823 47.0156V26.5312L61.5625 28.151Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M22.25 60.1198V9.0677L19.6354 10.6927V58.2448L22.25 60.1198Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M23.9531 8.02604V61.3281L26.5833 63.2188V6.39062L23.9531 8.02604Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M28.2708 5.35937V83.3958H30.8906V3.72395L28.2708 5.35937Z" />
        <path d="M32.2656 0H36.2656V83.776H32.2656V0Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M32.5781 2.68228V83.3958H35.1979V1.05728L32.5781 2.68228Z" />
        <path d="M36.2656 0H40.2656V83.776H36.2656V0Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M36.8958 0.520828V83.3958H39.5104V2.14583L36.8958 0.520828Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M41.2135 3.1875V45.7604L43.8437 43.875V4.81771L41.2135 3.1875Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M45.5312 5.875V42.6771L48.151 40.7865V7.5L45.5312 5.875Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.0937 59.9531L9.85416 64.1615V67.7396L17.0937 63.526V59.9531Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.0937 67.1146L9.85416 71.3073V74.8958L17.0937 70.6771V67.1146Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.0937 74.2604L9.85416 78.4687V82.0469L17.0937 77.8385V74.2604Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.0937 81.4115L13.6927 83.3958H17.0937V81.4115Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M50.9219 41.474L41.2135 48.3906V83.3958H50.9219V41.474Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M52.9167 47.0677L64.474 54.1823V50.2969L52.9167 43.1875V47.0677Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M64.474 58.0521L52.9167 50.9427V54.8229L64.474 61.9375V58.0521Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M64.474 65.8177L52.9167 58.6979V62.5677L64.474 69.6823V65.8177Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M64.474 73.5625L52.9167 66.4427V70.3125L64.474 77.4323V73.5625Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M64.474 81.3073L52.9167 74.1979V78.0833L61.5625 83.3958H64.474V81.3073Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M55.2552 83.3958L52.9167 81.9531V83.3958H55.2552Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M77.125 83.3958V35.8854L65.7031 27.5156V83.3958H77.125Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M3.61458 85.849H83.3646V87.7136H3.61458V85.849Z" />
        <path d="M0 89.1094H87V91.776H0V89.1094Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M0 89.6823H86.9844V91.5364H0V89.6823Z" />
      </svg>
      {text && <p className="text-sm text-text-secondary mt-4">{text}</p>}
    </div>
  );
}

export function PageSpinner({ text = 'Yükleniyor...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
      <Spinner size={100} text={text} />
    </div>
  );
}
