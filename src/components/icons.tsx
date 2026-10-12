import type { CSSProperties } from 'react';
const paths: Record<string, string> = {
  dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  students: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  user: 'M20 21v-2a7 7 0 0 0-14 0v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2 M8 14h2 M14 14h2 M8 18h2',
  money: 'M3 5h18v14H3z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M5 9h1 M18 15h1',
  pulse: 'M2 12h5l3-8 4 16 3-8h5',
  lead: 'M3 3h18l-7 8v8l-4 2V11z',
  commission: 'M12 3v18 M16 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6',
  bag: 'M5 7h14l2 14H3z M8 7V5a4 4 0 0 1 8 0v2',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
  up: 'M6 15l6-6 6 6',
  plus: 'M12 5v14 M5 12h14',
  check: 'M5 12l4 4L19 6',
  close: 'M6 6l12 12 M18 6L6 18',
  clock: 'M12 8v4l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  settings: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8 M4 4l16 16 M20 4L4 20 M12 2v3 M12 19v3 M2 12h3 M19 12h3',
  logout: 'M10 3H4v18h6 M9 12h13 M17 7l5 5-5 5',
  qr: 'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h3v3h3v3h-6z M12 3v3 M12 9v3h9 M3 12h6 M12 15v6',
  dumbbell: 'M3 8v8 M6 5v14 M18 5v14 M21 8v8 M6 12h12',
  shield: 'M12 2l9 4v6c0 5-9 10-9 10S3 17 3 12V6z M8 12l3 3 5-6',
  tablet: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 M11 18h2',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 M11 18h2',
  chart: 'M3 3v18h18 M7 15l4-5 4 3 6-8',
  exit: 'M4 3v18 M4 7h10v14 M8 12h1 M14 3h6v18',
  warning: 'M12 3l10 18H2z M12 9v5 M12 17h.01',
  wifi: 'M2 8a16 16 0 0 1 20 0 M5 12a11 11 0 0 1 14 0 M8 16a6 6 0 0 1 8 0 M12 20h.01',
  wifiOff: 'M2 2l20 20 M8 16a6 6 0 0 1 8 0 M12 20h.01 M5 12a11 11 0 0 1 3-2 M12 5a16 16 0 0 1 10 3',
  face: 'M3 8V3h5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5 M8 9h1 M15 9h1 M8 15a6 6 0 0 0 8 0',
  home: 'M3 10l9-7 9 7v11h-6v-7H9v7H3z',
  fire: 'M12 2c1 5 7 6 7 12a7 7 0 0 1-14 0c0-4 3-7 3-7l1 5c3-2 3-6 3-10z',
  target: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0 M12 12h.01',
  lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
  mail: 'M3 5h18v14H3z M3 5l9 8 9-8',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4',
  refresh: 'M20 7v-4l-3 3 M4 17v4l3-3 M20 11a8 8 0 0 0-13-6 M4 13a8 8 0 0 0 13 6',
  bottle: 'M9 2h6v5l3 4v11H6V11l3-4z M9 15h6',
  shirt: 'M8 3l4 3 4-3 6 4-3 5-3-1v10H8V11l-3 1-3-5z',
  box: 'M3 6l9-4 9 4v12l-9 4-9-4z M3 6l9 4 9-4 M12 10v12',
  sun: 'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  play: 'M7 3l14 9-14 9z',
  star: 'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z'
};
export function Icon({
  name,
  size = 20,
  className = '',
  style
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
    <path d={paths[name] ?? paths.dumbbell} />
  </svg>;
}
export function Logo({
  symbol = false
}: {
  symbol?: boolean;
}) {
  return <span className="brand" translate="no">
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M31 8a16 16 0 1 0 0 24l-5-5a9 9 0 1 1 0-14z" fill="currentColor" />
      <path d="M21 17h15v6H21z" fill="currentColor" />
      <path d="M32 17v11h-6V17z" fill="currentColor" />
    </svg>{!symbol && <span>gym<span className="brand-light">core</span>
      <span className="brand-dot">.</span>
    </span>}</span>;
}
