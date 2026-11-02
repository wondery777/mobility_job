import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. 자율주행: 센서 신호를 내는 차
export const AutonomousCarIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Car body */}
    <path d="M5 16h14a2 2 0 0 0 2-2v-2l-2-4H5L3 12v2a2 2 0 0 0 2 2z" />
    <circle cx="7" cy="16" r="2" />
    <circle cx="17" cy="16" r="2" />
    <path d="M8 8l1.5-3h5L16 8" />
    {/* Sensor dome on roof */}
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    {/* Radar signal waves */}
    <path d="M9 1.5a4.2 4.2 0 0 1 6 0" />
    <path d="M7 0a7 7 0 0 1 10 0" strokeDasharray="1 1.5" />
  </svg>
);

// 2. 전기차·배터리: 번개 배터리
export const BatteryLightningIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Battery body */}
    <rect x="2" y="6" width="17" height="12" rx="2.5" />
    <path d="M21 10v4" strokeWidth="2.5" />
    {/* Lightning bolt inside */}
    <path
      d="M11 8.5L7.5 13h4l-1 3.5L14.5 11h-4l1-2.5z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

// 3. UAM·드론: 4프로펠러 드론
export const UamDroneIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Central drone fuselage */}
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    {/* 4 Diagonal arms */}
    <path d="M9.5 9.5L5.5 5.5" />
    <path d="M14.5 9.5L18.5 5.5" />
    <path d="M9.5 14.5L5.5 18.5" />
    <path d="M14.5 14.5L18.5 18.5" />
    {/* 4 Propeller disks */}
    <ellipse cx="5" cy="5" rx="3.5" ry="1.5" transform="rotate(-30 5 5)" />
    <ellipse cx="19" cy="5" rx="3.5" ry="1.5" transform="rotate(30 19 5)" />
    <ellipse cx="5" cy="19" rx="3.5" ry="1.5" transform="rotate(30 5 19)" />
    <ellipse cx="19" cy="19" rx="3.5" ry="1.5" transform="rotate(-30 19 19)" />
  </svg>
);

// 4. 모빌리티 서비스: 위치 핀과 도로 경로
export const MobilityServiceIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Map location pin */}
    <path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6z" />
    <circle cx="12" cy="8" r="2.2" fill="currentColor" fillOpacity="0.3" />
    {/* Route curve under */}
    <path d="M4 21c3-2 6-1 9-3s5-1 7-3" strokeDasharray="2 2" />
  </svg>
);

// 5. 차량용 SW·반도체: 반도체 칩
export const AutomotiveChipIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Chip body */}
    <rect x="5" y="5" width="14" height="14" rx="2" />
    {/* Inner core */}
    <rect x="8.5" y="8.5" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.2" />
    {/* Pins Top */}
    <path d="M9 2v3M12 2v3M15 2v3" />
    {/* Pins Bottom */}
    <path d="M9 19v3M12 19v3M15 19v3" />
    {/* Pins Left */}
    <path d="M2 9h3M2 12h3M2 15h3" />
    {/* Pins Right */}
    <path d="M19 9h3M19 12h3M19 15h3" />
  </svg>
);

// 6. 자동차 부품: 톱니바퀴
export const AutoPartsGearIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Primary gear */}
    <circle cx="10" cy="10" r="3" />
    <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41" />
    {/* Secondary interlocking gear */}
    <circle cx="17" cy="17" r="2" />
    <path d="M17 12v1M17 21v1M12 17h1M21 17h1M13.5 13.5l.8.8M19.7 19.7l.8.8M13.5 20.5l.8-.8M19.7 14.3l.8.8" />
  </svg>
);

export const getFieldIcon = (fieldName: string, className = 'w-5 h-5') => {
  switch (fieldName) {
    case '자율주행':
      return <AutonomousCarIcon className={className} />;
    case '전기차·배터리':
      return <BatteryLightningIcon className={className} />;
    case 'UAM·드론':
      return <UamDroneIcon className={className} />;
    case '모빌리티 서비스':
      return <MobilityServiceIcon className={className} />;
    case '차량용 SW·반도체':
      return <AutomotiveChipIcon className={className} />;
    case '자동차 부품':
      return <AutoPartsGearIcon className={className} />;
    default:
      return <AutonomousCarIcon className={className} />;
  }
};
