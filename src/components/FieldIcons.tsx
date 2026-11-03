import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. 자율주행 & 로보틱스
export const AutonomousRoboticsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <path d="M5 16h14a2 2 0 0 0 2-2v-2l-2-4H5L3 12v2a2 2 0 0 0 2 2z" />
    <circle cx="7" cy="16" r="2" />
    <circle cx="17" cy="16" r="2" />
    <path d="M8 8l1.5-3h5L16 8" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <path d="M9 1.5a4.2 4.2 0 0 1 6 0" />
    <path d="M7 0a7 7 0 0 1 10 0" strokeDasharray="1 1.5" />
  </svg>
);

// 2. SDV & 차량용 SW
export const SdvSoftwareIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M8 9l-2 2 2 2M12 9l2 2-2 2M8 20h8M12 17v3" />
    <circle cx="17" cy="7" r="1" fill="currentColor" />
  </svg>
);

// 3. 전기차·배터리 & 충전 인프라
export const EvBatteryChargingIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <rect x="2" y="6" width="16" height="12" rx="2.5" />
    <path d="M20 10v4" strokeWidth="2.5" />
    <path d="M10 8.5L7 12.5h3.5L9.5 15.5 13 11.5h-3.5L10 8.5z" fill="currentColor" stroke="none" />
  </svg>
);

// 4. UAM · 드론 & 항공우주
export const UamAerospaceIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path d="M9.5 9.5L5.5 5.5M14.5 9.5L18.5 5.5M9.5 14.5L5.5 18.5M14.5 14.5L18.5 18.5" />
    <ellipse cx="5" cy="5" rx="3.5" ry="1.5" transform="rotate(-30 5 5)" />
    <ellipse cx="19" cy="5" rx="3.5" ry="1.5" transform="rotate(30 19 5)" />
    <ellipse cx="5" cy="19" rx="3.5" ry="1.5" transform="rotate(30 5 19)" />
    <ellipse cx="19" cy="19" rx="3.5" ry="1.5" transform="rotate(-30 19 19)" />
  </svg>
);

// 5. C-ITS & 스마트시티 관제
export const CitsSmartCityIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <path d="M2 20h20M4 20V10l4-3v13M12 20V4l6 4v12" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <path d="M9 1.5a4.2 4.2 0 0 1 6 0" />
    <path d="M7 0a7 7 0 0 1 10 0" strokeDasharray="1 1.5" />
  </svg>
);

// 6. 모빌리티 서비스 & MaaS
export const MobilityMaaSPlatformIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6z" />
    <circle cx="12" cy="8" r="2.2" fill="currentColor" fillOpacity="0.3" />
    <path d="M4 21c3-2 6-1 9-3s5-1 7-3" strokeDasharray="2 2" />
  </svg>
);

// 7. 차체·부품 & 신소재
export const BodyPartsMaterialsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <circle cx="9" cy="9" r="3" />
    <path d="M9 2v3M9 13v3M2 9h3M13 9h3M4.5 4.5l2.2 2.2M11.3 11.3l2.2 2.2M4.5 13.5l2.2-2.2M11.3 6.7l2.2-2.2" />
    <circle cx="16" cy="16" r="2.5" />
    <path d="M16 11.5v1.5M16 19v1.5M11.5 16h1.5M19 16h1.5" />
  </svg>
);

// 8. 스마트 해양 & 자율운항
export const SmartMaritimeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <path d="M2 20a4 4 0 0 0 4-2 4 4 0 0 1 4-2 4 4 0 0 1 4 2 4 4 0 0 0 4 2 4 4 0 0 0 4-2" />
    <path d="M4 17l2-7h12l2 7H4z" />
    <path d="M12 4v6M10 7h4" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
  </svg>
);

// 9. 스마트 물류 & 풀필먼트
export const SmartLogisticsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <path d="M16.5 9.4L7.5 4.21M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// 10. 에너지 & hydrogen
export const HydrogenEnergyIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
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
    <circle cx="12" cy="12" r="9" />
    <path d="M8 8v8M16 8v8M8 12h8" strokeWidth="2" />
    <path d="M19 19l1.5-1.5M19 16.5l1.5 1.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const getFieldIcon = (fieldName: string, className = 'w-5 h-5') => {
  // Normalize match
  if (fieldName.includes('자율주행') || fieldName.includes('로봇')) {
    return <AutonomousRoboticsIcon className={className} />;
  }
  if (fieldName.includes('SW') || fieldName.includes('SDV') || fieldName.includes('반도체')) {
    return <SdvSoftwareIcon className={className} />;
  }
  if (fieldName.includes('배터리') || fieldName.includes('전기차') || fieldName.includes('충전')) {
    return <EvBatteryChargingIcon className={className} />;
  }
  if (fieldName.includes('UAM') || fieldName.includes('드론') || fieldName.includes('항공')) {
    return <UamAerospaceIcon className={className} />;
  }
  if (fieldName.includes('C-ITS') || fieldName.includes('스마트시티') || fieldName.includes('관제')) {
    return <CitsSmartCityIcon className={className} />;
  }
  if (fieldName.includes('서비스') || fieldName.includes('MaaS')) {
    return <MobilityMaaSPlatformIcon className={className} />;
  }
  if (fieldName.includes('차체') || fieldName.includes('부품') || fieldName.includes('신소재')) {
    return <BodyPartsMaterialsIcon className={className} />;
  }
  if (fieldName.includes('해양') || fieldName.includes('선박') || fieldName.includes('자율운항')) {
    return <SmartMaritimeIcon className={className} />;
  }
  if (fieldName.includes('물류') || fieldName.includes('풀필먼트') || fieldName.includes('배송')) {
    return <SmartLogisticsIcon className={className} />;
  }
  if (fieldName.includes('수소') || fieldName.includes('에너지') || fieldName.includes('hydrogen')) {
    return <HydrogenEnergyIcon className={className} />;
  }

  return <AutonomousRoboticsIcon className={className} />;
};
