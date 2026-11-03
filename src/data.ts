export type MobilityFieldType =
  | '자율주행 & 로보틱스'
  | 'SDV & 차량용 SW'
  | '전기차·배터리 & 충전 인프라'
  | 'UAM · 드론 & 항공우주'
  | 'C-ITS & 스마트시티 관제'
  | '모빌리티 서비스 & MaaS'
  | '차체·부품 & 신소재'
  | '스마트 해양 & 자율운항'
  | '스마트 물류 & 풀필먼트'
  | '에너지 & hydrogen'
  // Legacy aliases for backward compatibility
  | '자율주행'
  | '전기차·배터리'
  | 'UAM·드론'
  | '모빌리티 서비스'
  | '차량용 SW·반도체'
  | '자동차 부품';

export interface SpecBenchmark {
  avgGpa: number; // e.g. 3.65
  avgCertCount: number; // e.g. 1.8
  avgSkillMatch: number; // e.g. 70 (%)
  passingRateTip?: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  field: MobilityFieldType;
  level: string; // e.g. "신입", "신입·경력", "경력 2년+"
  region: string; // e.g. "서울 서초구", "경기 성남시"
  deadline: string; // YYYY-MM-DD
  skills: string[];
  summary: string;
  required: string[];
  preferred: string[];
  sourceUrl: string;
  certificates?: string[];
  majors?: string[];
  salary?: string;
  department?: string;
  salaryMin?: number; // e.g. 5400 (5,400만원)
  benefits?: string[]; // e.g. ['💰 초봉 5,400만+', '🏠 재택가능', '⏰ 탄력근무', '🎁 장비지원']
  benchmark?: SpecBenchmark;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  field: MobilityFieldType;
  url: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: '채용박람회' | '세미나' | '해커톤' | '대회' | '추천교육' | '부트캠프';
  location?: string;
  organizer?: string;
  linkUrl?: string; // 외부 신청 홈페이지 URL
  badge?: string; // e.g. "전액국비", "현대차인증", "채용연계", "무료교육"
  targetMajor?: string;
}

export interface MobilityField {
  name: MobilityFieldType;
  gradient: {
    from: string;
    to: string;
    bgClass: string;
    textClass: string;
  };
  hexColor: string;
  iconType: string;
  shortDesc: string;
  description: string;
  subFields: string[];
  coreSkills: string[];
  certificates: string[];
  educationRecommend: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  deadlineAlertEnabled: boolean;
  deadlineDays: number[];
  deadlineBookmarkedOnly: boolean;
  newJobAlertEnabled: boolean;
  alertFields: string[];
  alertSkills: string[];
  alertTime: string;
  soundEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  deadlineAlertEnabled: true,
  deadlineDays: [3, 1, 0],
  deadlineBookmarkedOnly: false,
  newJobAlertEnabled: true,
  alertFields: ['자율주행 & 로보틱스', 'SDV & 차량용 SW', '전기차·배터리 & 충전 인프라'],
  alertSkills: ['C++', 'Python', 'ROS', 'Linux'],
  alertTime: '09:00',
  soundEnabled: true,
};

export interface RegionDefinition {
  province: string;
  districts: string[];
}

export const REGIONS_DATA: RegionDefinition[] = [
  { province: '서울', districts: ['강남구', '서초구', '송파구', '마포구', '영등포구', '성동구', '종로구', '구로구', '금천구'] },
  { province: '경기', districts: ['성남시', '화성시', '수원시', '평택시', '용인시', '안양시', '시흥시', '부천시'] },
  { province: '인천', districts: ['연수구', '남동구', '부평구', '서구', '중구'] },
  { province: '강원', districts: ['춘천시', '원주시', '강릉시'] },
  { province: '대전', districts: ['유성구', '서구', '중구', '대덕구'] },
  { province: '세종', districts: ['세종시'] },
  { province: '충북', districts: ['청주시', '충주시', '진천군', '음성군'] },
  { province: '충남', districts: ['천안시', '아산시', '서산시', '당진시'] },
  { province: '광주', districts: ['광산구', '북구', '서구'] },
  { province: '전북', districts: ['전주시', '군산시', '완주군', '익산시'] },
  { province: '전남', districts: ['광양시', '여수시', '나주시', '순천시'] },
  { province: '부산', districts: ['강서구', '사상구', '해운대구', '기장군', '동래구'] },
  { province: '대구', districts: ['달서구', '북구', '수성구', '달성군'] },
  { province: '울산', districts: ['북구', '남구', '울주군', '동구'] },
  { province: '경북', districts: ['포항시', '구미시', '경주시', '김천시'] },
  { province: '경남', districts: ['창원시', '김해시', '거제시', '양산시'] },
  { province: '제주', districts: ['제주시', '서귀포시'] },
];

export const MOBILITY_FIELDS: MobilityField[] = [
  {
    name: '자율주행 & 로보틱스',
    gradient: {
      from: 'from-blue-600',
      to: 'to-indigo-700',
      bgClass: 'bg-gradient-to-br from-blue-600 to-indigo-700',
      textClass: 'text-blue-500 dark:text-blue-400',
    },
    hexColor: '#2563eb',
    iconType: 'autonomous',
    shortDesc: '센서퓨전, SLAM, ROS2, 배달 로봇 및 물류 AMR',
    description: '카메라, 라이다, 레이더 센서퓨전과 딥러닝 기반 경로계획, 무인 배달 로봇 및 물류 AMR 시스템을 연구·개발합니다.',
    subFields: ['센서퓨전 & 인지(Perception)', 'SLAM & 실시간 측위', '판단 및 모션 플래닝', '로보틱스 AMR / ROS2'],
    coreSkills: ['C++', 'Python', 'ROS', 'ROS2', '센서퓨전', 'SLAM', 'CUDA', 'Linux'],
    certificates: ['정보처리기사', '전자기사', '임베디드기사'],
    educationRecommend: ['K-Digital Training 자율주행 엔지니어 과정', 'ROS2 기반 로보틱스 부트캠프'],
  },
  {
    name: 'SDV & 차량용 SW',
    gradient: {
      from: 'from-cyan-600',
      to: 'to-blue-800',
      bgClass: 'bg-gradient-to-br from-cyan-600 to-blue-800',
      textClass: 'text-cyan-600 dark:text-cyan-400',
    },
    hexColor: '#0891b2',
    iconType: 'chip',
    shortDesc: 'AUTOSAR, CAN/LIN 통신, IVI 인포테인먼트, OTA, 사이버보안',
    description: '소프트웨어 정의 차량(SDV)의 코어 아키텍처, 전장 제어기 MCU 펌웨어 및 차량 내 초저지연 통신을 구축합니다.',
    subFields: ['AUTOSAR Classic/Adaptive', '차량용 OS & 하이퍼바이저', 'CAN/CAN-FD/Ethernet 통신', '차량 사이버보안(ISO 21434)'],
    coreSkills: ['C', 'C++', 'AUTOSAR', 'CAN', 'Linux', 'Git', 'Docker'],
    certificates: ['정보처리기사', '정보보안기사', '전자기사'],
    educationRecommend: ['현대오토에버 모빌리티 임베디드 스쿨', 'AUTOSAR 공인 아키텍처 교육'],
  },
  {
    name: '전기차·배터리 & 충전 인프라',
    gradient: {
      from: 'from-emerald-500',
      to: 'to-teal-700',
      bgClass: 'bg-gradient-to-br from-emerald-500 to-teal-700',
      textClass: 'text-emerald-500 dark:text-emerald-400',
    },
    hexColor: '#10b981',
    iconType: 'battery',
    shortDesc: 'BMS, 고전압 배터리 팩, 전력변환, V2G, EV 충전 플랫폼',
    description: '차세대 2차전지 셀/팩 기구설계, 고신뢰성 BMS 제어기 알고리즘 및 초급속 충전 인프라 시스템을 개발합니다.',
    subFields: ['BMS 제어 알고리즘 & 펌웨어', '배터리 팩 기구설계 & 열해석', '인버터/컨버터 전력변환', '초급속 충전기 & V2G 통신'],
    coreSkills: ['C', 'MATLAB', 'Simulink', 'BMS', 'CAN', 'ANSYS', 'CATIA'],
    certificates: ['전기기사', '전자기사', '화공기사'],
    educationRecommend: ['배터리 인재양성 아카데미', '전력전자 전력변환 전문과정'],
  },
  {
    name: 'UAM · 드론 & 항공우주',
    gradient: {
      from: 'from-purple-600',
      to: 'to-violet-800',
      bgClass: 'bg-gradient-to-br from-purple-600 to-violet-800',
      textClass: 'text-purple-500 dark:text-purple-400',
    },
    hexColor: '#9333ea',
    iconType: 'uam',
    shortDesc: 'AAM 기체 설계, 비행제어 FC, 위성통신, 항공우주 구조',
    description: '도심 상공을 오가는 순수 전기 수직이착륙(eVTOL) 기체 공력설계, 3중화 비행제어 컴퓨터(FCC) 및 위성항법을 연구합니다.',
    subFields: ['eVTOL 비행제어(FCC)', '공력 해석 및 경량 복합재', 'UAM 도심항공 관제(UTM)', '항공우주 항법 시스템'],
    coreSkills: ['C++', 'Python', 'MATLAB', 'Simulink', 'Linux', 'ROS', 'SolidWorks'],
    certificates: ['항공기사', '초경량비행장치 조종자', '무선설비기사'],
    educationRecommend: ['한국항공우주연구원 도심항공인재 캠프', 'PX4 비행제어 오픈소스 워크숍'],
  },
  {
    name: 'C-ITS & 스마트시티 관제',
    gradient: {
      from: 'from-indigo-600',
      to: 'to-sky-700',
      bgClass: 'bg-gradient-to-br from-indigo-600 to-sky-700',
      textClass: 'text-indigo-500 dark:text-indigo-400',
    },
    hexColor: '#4f46e5',
    iconType: 'city',
    shortDesc: 'V2X 통신, 노변 센서 관제, ITS 관제 시스템',
    description: '차량과 도로 인프라 간 실시간 통신(V2I/V2V) 및 지능형 교통 체계(ITS) 통합 관제 플랫폼을 구축합니다.',
    subFields: ['5G-V2X / WAVE 통신 프로토콜', '스마트 교차로 AI 영상관제', '도로 인프라 RSU 통합제어', '교통 흐름 최적화'],
    coreSkills: ['C++', 'Python', 'Linux', '네트워크소켓', 'V2X', 'SQL', 'Docker'],
    certificates: ['무선설비기사', '정보통신기사', '정보처리기사'],
    educationRecommend: ['지능형 교통체계(ITS) 전문인력 교육', '스마트시티 인프라 관제 스터디'],
  },
  {
    name: '모빌리티 서비스 & MaaS',
    gradient: {
      from: 'from-amber-500',
      to: 'to-orange-600',
      bgClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textClass: 'text-amber-500 dark:text-amber-400',
    },
    hexColor: '#f59e0b',
    iconType: 'service',
    shortDesc: '카셰어링, 호출/마이크로모빌리티, 동선/수요 데이터 분석',
    description: '실시간 차량 배차 알고리즘, 이동 데이터 마이닝, 수요응답형 교통(DRT) 및 통합 MaaS 플랫폼을 구축합니다.',
    subFields: ['MaaS 최적 경로/배차 엔진', '수요응답형 교통(DRT)', '이동 패턴 시계열 분석', '차량 관제(FMS) API'],
    coreSkills: ['Python', 'SQL', 'Java', 'Docker', 'AWS', 'Kafka', 'GIS'],
    certificates: ['SQLD', 'ADsP', '정보처리기사', '빅데이터분석기사'],
    educationRecommend: ['쏘카/티맵 모빌리티 데이터 부트캠프', 'GIS 공간정보 데이터 분석 교육'],
  },
  {
    name: '차체·부품 & 신소재',
    gradient: {
      from: 'from-slate-600',
      to: 'to-zinc-800',
      bgClass: 'bg-gradient-to-br from-slate-600 to-zinc-800',
      textClass: 'text-slate-600 dark:text-slate-300',
    },
    hexColor: '#475569',
    iconType: 'parts',
    shortDesc: '섀시/의장 CAD 설계, NVH 해석, 열관리, 경량화 소재',
    description: '전자식 샤시(X-by-Wire), 고강도 경량화 탄소복합재 및 차량 소음진동(NVH) 저감 기구 설계를 담당합니다.',
    subFields: ['전자식 조향/제동(by-wire)', 'CFRP 경량화 신소재', 'NVH 소음진동 해석', '충돌 안전도 시뮬레이션'],
    coreSkills: ['CATIA', 'SolidWorks', 'ANSYS', 'AutoCAD', 'MATLAB', 'Excel'],
    certificates: ['기계기사', '일반기계기사', '품질경영기사'],
    educationRecommend: ['CATIA 미래차 샤시/바디 설계 실무', 'ANSYS 구조/충돌 해석 워크숍'],
  },
  {
    name: '스마트 해양 & 자율운항',
    gradient: {
      from: 'from-teal-600',
      to: 'to-cyan-800',
      bgClass: 'bg-gradient-to-br from-teal-600 to-cyan-800',
      textClass: 'text-teal-600 dark:text-teal-400',
    },
    hexColor: '#0d9488',
    iconType: 'ship',
    shortDesc: '자율운항 선박, 친환경 암모니아/수소 선박, 스마트 항만',
    description: '원격 제어 및 인공지능 기반 자율운항 선박(MASS) 항법 제어, 친환경 전동화 추진 시스템을 연구합니다.',
    subFields: ['선박 자율운항 인지/회피 알고리즘', '친환경 암모니아/수소 추진체', '스마트 항만 AGV 연동', '해상 위성 통신'],
    coreSkills: ['C++', 'Python', 'ROS', 'Linux', 'MATLAB', '기계설계'],
    certificates: ['조선기사', '정보처리기사', '전자기사', '해기사'],
    educationRecommend: ['자율운항선박 실증인재 양성과정', '해양 친환경 추진체 엔지니어링'],
  },
  {
    name: '스마트 물류 & 풀필먼트',
    gradient: {
      from: 'from-rose-500',
      to: 'to-red-700',
      bgClass: 'bg-gradient-to-br from-rose-500 to-red-700',
      textClass: 'text-rose-500 dark:text-rose-400',
    },
    hexColor: '#f43f5e',
    iconType: 'logistics',
    shortDesc: '물류 자동화, 라스트마일 배송, AGV/소터 관제 시스템',
    description: '물류 거점 풀필먼트 센터 내 무인이송로봇(AGV) 군집 제어 및 라스트마일 로봇 배송 알고리즘을 구축합니다.',
    subFields: ['물류센터 AGV/AMR 군집제어', 'WMS/WCS 창고제어 플랫폼', '라스트마일 배송 라우팅', '자동 피킹 3D 비전'],
    coreSkills: ['Java', 'Python', 'C++', 'SQL', 'ROS', 'Docker', 'Kafka'],
    certificates: ['물류관리사', '정보처리기사', 'SQLD'],
    educationRecommend: ['스마트물류 4.0 전문인력 아카데미', '쿠팡/CJ대한통운 물류 테크 세미나'],
  },
  {
    name: '에너지 & hydrogen',
    gradient: {
      from: 'from-lime-600',
      to: 'to-emerald-800',
      bgClass: 'bg-gradient-to-br from-lime-600 to-emerald-800',
      textClass: 'text-lime-600 dark:text-lime-400',
    },
    hexColor: '#65a30d',
    iconType: 'hydrogen',
    shortDesc: '수소연료전지 스택, 수소 저장/공급 및 차세대 전동화 에너지',
    description: '수소전기차(FCEV) 연료전지 스택 막전극접합체(MEA), 고압 수소 저장 밸브 및 에너지 변환 효율을 연구합니다.',
    subFields: ['연료전지 스택(MEA/분리판)', '고압 수소 저장 및 감압 밸브', '수소 안전제어 로직', '전동화 에너지 종합관리'],
    coreSkills: ['CATIA', 'ANSYS', 'MATLAB', '화학공학', '전기기사', 'C'],
    certificates: ['가스기사', '화공기사', '전기기사', '에너지관리기사'],
    educationRecommend: ['수소에너지 선행인력 양성과정', '한국에너지기술연구원 수소 테크 세미나'],
  },
];

export const INITIAL_SKILLS = [
  'C', 'C++', 'Python', 'Java', 'MATLAB',
  'ROS', 'ROS2', 'AUTOSAR', 'CAN', '센서퓨전', 'SLAM',
  '딥러닝', 'OpenCV', 'BMS', 'SQL', 'Linux',
  'Git', 'Docker', 'CATIA', 'SolidWorks', 'ANSYS', 'Excel',
  'CUDA', 'V2X', 'PyTorch', 'Kafka', 'AWS'
];

export const INITIAL_CERTIFICATES = [
  '정보처리기사', '정보보안기사', '전기기사', '전자기사',
  '일반기계기사', '기계기사', '임베디드기사', '무선설비기사',
  '항공기사', '초경량비행장치 조종자', '화공기사', '품질경영기사',
  'SQLD', 'ADsP', '빅데이터분석기사', '물류관리사', '가스기사', '운전면허 1종'
];

export const INITIAL_MAJORS = [
  '기계공학과', '자동차공학과', '전기공학과', '전자공학과',
  '컴퓨터공학과', '소프트웨어학과', 'AI·데이터공학과', '제어계측공학과',
  '항공우주공학과', '로봇공학과', '산업공학과', '신소재공학과',
  '화학공학과', '통신공학과', '메카트로닉스공학과', '조선해양공학과', '비전공(기타)'
];

export const SAMPLE_JOBS: Job[] = [
  {
    id: 'job-01',
    company: '현대자동차',
    title: '자율주행 인지/판단 알고리즘 및 센서퓨전 선행개발',
    field: '자율주행 & 로보틱스',
    level: '신입·경력',
    region: '경기 화성시',
    deadline: '2026-11-20',
    skills: ['C++', 'Python', 'ROS', 'Linux', 'Git', 'CUDA'],
    certificates: ['정보처리기사', '임베디드기사'],
    majors: ['컴퓨터공학과', '로봇공학과', '전자공학과', '기계공학과'],
    summary: '남양연구소에서 차세대 양산 자율주행 차량용 카메라·라이다·레이더 센서퓨전과 딥러닝 기반 객체 인식 및 위험 판단 알고리즘을 개발합니다.',
    required: [
      '컴퓨터공학, 전자공학, 로봇공학 학사 이상 학위 소지자',
      'C++ 또는 Python을 활용한 알고리즘 구현 역량',
      'Linux 기반 개발 환경 및 Git 형상 관리 능숙자',
    ],
    preferred: [
      'ROS/ROS2 기반 자율주행 로봇 또는 차량 프로젝트 경험',
      'LiDAR 점군 데이터(Point Cloud) 처리 및 칼만 필터 경험',
    ],
    salary: '신입 초봉 5,400만 원 (성과급 별도)',
    salaryMin: 5400,
    benefits: ['💰 초봉 5,400만+', '🏠 재택가능', '⏰ 탄력근무', '🎁 장비지원', '🍱 삼시세끼무료'],
    department: '자율주행선행개발센터 센서인식팀',
    sourceUrl: 'https://talent.hyundai.com',
    benchmark: {
      avgGpa: 3.65,
      avgCertCount: 1.8,
      avgSkillMatch: 70,
      passingRateTip: 'C++ 실시간 최적화 및 ROS2 토픽 통신 포트폴리오 첨부 시 서류 합격률이 급상승합니다.',
    },
  },
  {
    id: 'job-02',
    company: '포티투닷 (42dot)',
    title: 'AEv / SDV 차량용 임베디드 OS 및 고성능 미들웨어 엔지니어',
    field: 'SDV & 차량용 SW',
    level: '신입·경력',
    region: '서울 강남구',
    deadline: '2026-11-25',
    skills: ['C++', 'Linux', 'AUTOSAR', 'CAN', 'Docker', 'Git'],
    certificates: ['정보처리기사'],
    majors: ['컴퓨터공학과', '소프트웨어학과', '전자공학과'],
    summary: '현대차그룹 글로벌 소프트웨어 센터에서 차세대 SDV(Software Defined Vehicle)의 코어 OS 및 초저지연 차량 내 메시징 미들웨어를 구축합니다.',
    required: [
      '컴퓨터공학 또는 소프트웨어 유관 학사 이상',
      '모던 C++(C++14/17) 및 POSIX/Linux 시스템 프로그래밍 역량',
      '임베디드 타깃 보드 크로스 컴파일 및 디버깅 경험',
    ],
    preferred: [
      'Adaptive AUTOSAR 또는 SOME/IP 프로토콜 구현 경험',
      '차량 내 보안(HSM, Crypto) 아키텍처 이해자',
    ],
    salary: '업계 최고 수준 협의 (스톡옵션)',
    salaryMin: 5800,
    benefits: ['💰 초봉 5,500만+', '🏠 주3일재택', '🚀 스톡옵션', '⏰ 시차출퇴근', '🎁 최고급장비'],
    department: 'SDV OS Platform Architecture Team',
    sourceUrl: 'https://42dot.ai/careers',
    benchmark: {
      avgGpa: 3.70,
      avgCertCount: 1.5,
      avgSkillMatch: 68,
      passingRateTip: '리눅스 시스템 프로그래밍과 소켓 통신 구현 능력이 가장 중요한 평가 기준입니다.',
    },
  },
  {
    id: 'job-03',
    company: 'LG에너지솔루션',
    title: '차세대 원통형/파우치형 EV 배터리 셀 기구설계 및 열해석',
    field: '전기차·배터리 & 충전 인프라',
    level: '신입',
    region: '충북 청주시',
    deadline: '2026-11-18',
    skills: ['CATIA', 'ANSYS', 'AutoCAD', 'SolidWorks', 'Excel'],
    certificates: ['기계기사', '일반기계기사'],
    majors: ['기계공학과', '화학공학과', '신소재공학과'],
    summary: '오창 에너지플랜트에서 글로벌 완성차 OEM 공급을 위한 차세대 전고체/하이니켈 EV 배터리 셀 외장 기구설계 및 열해석을 수행합니다.',
    required: [
      '기계공학, 신소재공학, 화학공학 학사 이상 학위',
      '3D CAD 도면 작성 및 공학적 공차 분석 가능자',
      '배터리 열/응력 CAE 해석에 대한 기초 지식',
    ],
    preferred: [
      '이차전지 관련 캡스톤 디자인 또는 연구실 인턴 경험',
      'CATIA V5 및 ANSYS Workbench 능숙자 우대',
    ],
    salary: '초봉 5,300만 원 (사이닝보너스)',
    salaryMin: 5300,
    benefits: ['💰 초봉 5,300만+', '🏡 기숙사제공', '🎁 복지포인트', '⏰ 탄력근무'],
    department: '자동차전지선행개발팀',
    sourceUrl: 'https://www.lgensol.com/kr/career',
    benchmark: {
      avgGpa: 3.68,
      avgCertCount: 2.0,
      avgSkillMatch: 75,
      passingRateTip: 'CAD 3D 모델링 포트폴리오와 열유체/구조해석 과제 경험이 합격의 열쇠입니다.',
    },
  },
  {
    id: 'job-04',
    company: '한화시스템',
    title: 'UAM(도심항공모빌리티) 버터플라이 전기추진 및 항전 FCC 개발',
    field: 'UAM · 드론 & 항공우주',
    level: '신입·경력',
    region: '서울 중구',
    deadline: '2026-11-28',
    skills: ['C++', 'Simulink', 'MATLAB', 'CAN', 'Linux', 'Git'],
    certificates: ['무선설비기사', '항공기사', '전기기사'],
    majors: ['항공우주공학과', '전기공학과', '전자공학과', '제어계측공학과'],
    summary: '순수 전기 구동 수직이착륙(eVTOL) 기체 버터플라이의 멀티로터 틸팅 모터 제어 및 고신뢰성 항법·통신 비행제어 컴퓨터(FCC)를 개발합니다.',
    required: [
      '항공우주공학, 전기/전자공학, 제어공학 학사 이상',
      'MATLAB/Simulink 기반 비행체 동역학 시뮬레이션 역량',
      '모터 드라이버 및 인버터 PWM 제어 기초 지식',
    ],
    preferred: [
      '드론 또는 항공기 비행제어기(FCC) 하드웨어/펌웨어 설계 경험',
      'DO-178C / DO-254 항공 인증 프로세스 이해',
    ],
    salary: '신입 5,100만 원 (상여금 별도)',
    salaryMin: 5100,
    benefits: ['💰 초봉 5,100만+', '🏠 재택가능', '⏰ 탄력근무', '🎁 교육비지원'],
    department: 'UAM사업단 항전추진체계팀',
    sourceUrl: 'https://www.hanwha.co.kr/careers',
    benchmark: {
      avgGpa: 3.72,
      avgCertCount: 1.6,
      avgSkillMatch: 65,
      passingRateTip: '비행체 자세제어 알고리즘 및 Simulink 시뮬레이션 경험이 결정적입니다.',
    },
  },
  {
    id: 'job-05',
    company: '티맵모빌리티 (TMAP)',
    title: '모빌리티 AI 라우팅 엔진 및 대규모 차량 이동 데이터 분석',
    field: '모빌리티 서비스 & MaaS',
    level: '신입·경력',
    region: '서울 중구',
    deadline: '2026-11-22',
    skills: ['Python', 'Java', 'SQL', 'Docker', 'AWS', 'Kafka'],
    certificates: ['정보처리기사', 'SQLD'],
    majors: ['컴퓨터공학과', '산업공학과', 'AI·데이터공학과'],
    summary: '2,000만 운전자의 실시간 주행 데이터를 기반으로 도로 혼잡을 예측하고 초개인화된 최적 경로를 산출하는 분산 알고리즘을 구축합니다.',
    required: [
      '컴퓨터/소프트웨어공학 또는 산업공학/통계학 전공',
      'Python 또는 Java 기반 백엔드 API 서비스 개발 경험',
      '대용량 시계열 데이터 가공 및 관계형/비관계형 DB 쿼리 역량',
    ],
    preferred: [
      '지리정보시스템(GIS) 또는 지도 네트워크 그래프 탐색 알고리즘 경험',
      'Apache Kafka, Spark 클라우드 데이터 파이프라인 운영 경험',
    ],
    salary: '신입 5,000만 원선 (통신비/복지포인트)',
    salaryMin: 5000,
    benefits: ['💰 초봉 5,000만+', '🏠 전면자율재택', '⏰ 자율출퇴근', '🎁 통신비지원', '🚀 스톡옵션'],
    department: 'Routing & Navigation Core Lab',
    sourceUrl: 'https://tmapmobility.career.greetinghr.com',
    benchmark: {
      avgGpa: 3.60,
      avgCertCount: 1.4,
      avgSkillMatch: 72,
      passingRateTip: '대용량 쿼리 튜닝 경험과 그래프 탐색 알고리즘(A*, 다익스트라) 이해도가 중요합니다.',
    },
  },
  {
    id: 'job-06',
    company: 'HL만도 (HL Mando)',
    title: '차량 전자식 섀시(X-by-Wire) 스마트 제동/조향 제어 알고리즘',
    field: '차체·부품 & 신소재',
    level: '신입',
    region: '경기 평택시',
    deadline: '2026-11-16',
    skills: ['C++', 'Simulink', 'MATLAB', 'CAN', 'AUTOSAR'],
    certificates: ['일반기계기사', '전기기사'],
    majors: ['기계공학과', '자동차공학과', '메카트로닉스공학과', '제어계측공학과'],
    summary: '물리적 기계 연결을 전자 신호로 대체하는 바이와이어(By-Wire) 차세대 통합 섀시 도메인 컨트롤러 제어기를 설계합니다.',
    required: [
      '기계공학, 자동차공학, 메카트로닉스 학사 이상',
      'C언어 및 임베디드 마이크로컨트롤러(MCU) 프로그래밍 능력',
      '차량 동역학(Vehicle Dynamics) 및 제어이론에 대한 확고한 이해',
    ],
    preferred: [
      'CANalyzer, CANoe를 활용한 차량 네트워크 통신 분석 경험',
      'ISO 26262 기능안전 규격 프로젝트 경험자',
    ],
    salary: '초봉 5,200만 원선 (성과급 별도)',
    salaryMin: 5200,
    benefits: ['💰 초봉 5,200만+', '🏠 재택가능', '⏰ 탄력근무', '🎁 건강검진'],
    department: '섀시선행제어연구실',
    sourceUrl: 'https://www.hlcompany.com/career',
    benchmark: {
      avgGpa: 3.65,
      avgCertCount: 2.1,
      avgSkillMatch: 70,
      passingRateTip: '차량 제동/조향 기구학 이해와 MATLAB/Simulink 제어 시뮬레이션 과제 포트폴리오가 유리합니다.',
    },
  },
  {
    id: 'job-07',
    company: '오토노머스에이투지 (Autonomous a2z)',
    title: '레벨4 무인 자율주행 셔틀 관제 및 5G C-ITS V2X 통신 엔지니어',
    field: 'C-ITS & 스마트시티 관제',
    level: '신입·경력',
    region: '대구 달서구',
    deadline: '2026-11-14',
    skills: ['Python', 'C++', 'Linux', 'ROS', 'Git', 'V2X'],
    certificates: ['정보처리기사', '무선설비기사'],
    majors: ['통신공학과', '전자공학과', '컴퓨터공학과'],
    summary: '순수 자체 기술로 개발한 레벨4 무인 자율주행 모빌리티의 실시간 클라우드 관제 플랫폼과 지능형 도로 노변 기지국(RSU) 통신 프로토콜을 개발합니다.',
    required: [
      '컴퓨터공학 또는 통신공학 전공자',
      'Linux 환경에서 C++ 또는 Python 소켓 통신 구현 가능자',
      '자율주행 서비스 상용화에 대한 열정과 도전 정신',
    ],
    preferred: [
      'V2X 통신 프로토콜(WAVE, C-V2X) 규격 실무 경험',
      'ROS2 기반 미들웨어 통신 최적화 경험',
    ],
    salary: '연봉 4,600만 ~ 5,800만 원',
    salaryMin: 4600,
    benefits: ['💰 초봉 4,600만+', '🚀 스톡옵션', '⏰ 탄력근무', '🎁 장비지원'],
    department: 'C-ITS플랫폼개발실',
    sourceUrl: 'https://auto-a2z.com/recruit',
    benchmark: {
      avgGpa: 3.55,
      avgCertCount: 1.5,
      avgSkillMatch: 65,
      passingRateTip: '소켓 통신 네트워크 프로그래밍과 리눅스 환경 구축 역량을 집중 기술하세요.',
    },
  },
  {
    id: 'job-08',
    company: '아비커스 (Avikus / HD현대)',
    title: '자율운항 레저보트 및 대형상선 지능형 항법·충돌회피 SW',
    field: '스마트 해양 & 자율운항',
    level: '신입·경력',
    region: '경기 성남시',
    deadline: '2026-11-24',
    skills: ['C++', 'Python', 'ROS', 'Linux', 'OpenCV'],
    certificates: ['정보처리기사', '조선기사'],
    majors: ['컴퓨터공학과', '로봇공학과', '조선해양공학과', '전자공학과'],
    summary: 'HD현대 사내벤처 1호 자율운항 선박 스타트업에서 해상 카메라/레이더 기반 타선박 탐지 및 국제해상충돌예방규칙(COLREGS) 기반 회피 알고리즘을 구축합니다.',
    required: [
      '컴퓨터공학, 로봇공학, 전자공학 학사 이상',
      '모던 C++ 및 컴퓨터 비전 알고리즘 개발 역량',
      '이동체 경로 생성(Trajectory Planning) 이론 이해',
    ],
    preferred: [
      '해상 환경 센서(Marine Radar, AIS) 데이터 처리 경험',
      '드론 또는 로봇 자율주행 프로젝트 경험자',
    ],
    salary: '신입 5,200만 원 (성과급 별도)',
    salaryMin: 5200,
    benefits: ['💰 초봉 5,200만+', '🏠 재택가능', '⏰ 탄력근무', '🎁 최고급맥북'],
    department: 'Autonomous Navigation Core Lab',
    sourceUrl: 'https://avikus.ai/careers',
    benchmark: {
      avgGpa: 3.62,
      avgCertCount: 1.6,
      avgSkillMatch: 70,
      passingRateTip: '해상 환경은 장애물 규정이 특수하므로 기하학적 경로 계획과 비전 객체 인식 프로젝트를 강조하세요.',
    },
  },
  {
    id: 'job-09',
    company: 'CJ대한통운 테크',
    title: '스마트 물류 메가허브 AGV/AMR 무인이송로봇 군집제어 SW',
    field: '스마트 물류 & 풀필먼트',
    level: '신입·경력',
    region: '경기 곤지암',
    deadline: '2026-11-26',
    skills: ['Java', 'Python', 'SQL', 'Docker', 'Linux'],
    certificates: ['물류관리사', '정보처리기사'],
    majors: ['산업공학과', '컴퓨터공학과', '로봇공학과'],
    summary: '아시아 최대 곤지암 메가허브 풀필먼트 센터에서 500대 이상의 무인이송로봇(AGV/AMR) 충돌 방지 및 실시간 작업 할당 군집 알고리즘을 개발합니다.',
    required: [
      '산업공학, 컴퓨터공학, 로봇공학 학사 이상',
      '그래프 탐색(Graph Search) 및 최적화(OR/Optimization) 이해',
      'Java 또는 Python 기반 백엔드 서비스 개발 역량',
    ],
    preferred: [
      '대규모 동시성 분산 트래픽 처리 경험자',
      'WCS/WMS 창고제어 시스템 연동 경험',
    ],
    salary: '초봉 4,900만 원 (교통비 지원)',
    salaryMin: 4900,
    benefits: ['💰 초봉 4,900만+', '🚌 통근버스', '🎁 자사몰할인', '⏰ 유연근무'],
    department: '스마트물류연구소 로봇제어팀',
    sourceUrl: 'https://www.cjlogistics.com',
    benchmark: {
      avgGpa: 3.58,
      avgCertCount: 1.7,
      avgSkillMatch: 68,
      passingRateTip: '최적화 알고리즘(Linear Programming, A* 군집제어) 수강 이력이나 프로젝트가 강점입니다.',
    },
  },
  {
    id: 'job-10',
    company: '현대모비스',
    title: '수소전기차(FCEV) 연료전지 스택 고압 제어 및 MEA 선행개발',
    field: '에너지 & hydrogen',
    level: '신입',
    region: '경기 용인시',
    deadline: '2026-11-17',
    skills: ['CATIA', 'ANSYS', 'MATLAB', 'Excel'],
    certificates: ['가스기사', '화공기사', '전기기사'],
    majors: ['화학공학과', '신소재공학과', '기계공학과'],
    summary: '차세대 넥쏘(NEXO) 및 대형 수소 트럭에 탑재될 연료전지 스택의 촉매 막전극접합체(MEA) 내구수명 향상과 수소 공급 밸브 제어 로직을 설계합니다.',
    required: [
      '화학공학, 신소재공학, 기계공학 학사 이상 학위',
      '전기화학 반응 및 연료전지 기초 원리에 대한 이해',
      '공학 데이터 통계 분석 및 실험 계획(DOE) 역량',
    ],
    preferred: [
      '수소연료전지 또는 수전해 연구실 캡스톤 프로젝트 경험',
      '고압가스 안전관리 및 관련 법규 이해',
    ],
    salary: '초봉 5,300만 원 (성과급 별도)',
    salaryMin: 5300,
    benefits: ['💰 초봉 5,300만+', '🏠 재택가능', '⏰ 탄력근무', '🎁 의료비지원'],
    department: '연료전지선행개발셀',
    sourceUrl: 'https://mobis.recruiter.co.kr',
    benchmark: {
      avgGpa: 3.65,
      avgCertCount: 2.0,
      avgSkillMatch: 72,
      passingRateTip: '전기화학 임피던스(EIS) 측정 및 연료전지 열화 분석 경험을 강조하면 서류 합격률이 높습니다.',
    },
  },
];

export const SAMPLE_NEWS: NewsItem[] = [
  {
    id: 'news-01',
    title: '국토교통부, 무인 레벨4 자율주행 셔틀 상용화 지구 전국 15곳 확대 지정',
    source: '모빌리티데일리',
    publishedAt: '2시간 전',
    field: '자율주행 & 로보틱스',
    url: 'https://www.yna.co.kr',
  },
  {
    id: 'news-02',
    title: '현대차그룹 글로벌 소프트웨어 센터 42dot, SDV 통합 차세대 OS 로드맵 전격 공개',
    source: '테크오토',
    publishedAt: '3시간 전',
    field: 'SDV & 차량용 SW',
    url: 'https://news.mt.co.kr',
  },
  {
    id: 'news-03',
    title: '차세대 전고체 배터리 파일럿 라인 준공... 2027년 양산 로드맵 가시화',
    source: '전자신문',
    publishedAt: '5시간 전',
    field: '전기차·배터리 & 충전 인프라',
    url: 'https://www.etnews.com',
  },
  {
    id: 'news-04',
    title: '수도권 아라뱃길 상공 UAM eVTOL 실증 비행 성공... 2026년 공항 셔틀 가동',
    source: '항공모빌리티리포트',
    publishedAt: '6시간 전',
    field: 'UAM · 드론 & 항공우주',
    url: 'https://www.hankyung.com',
  },
  {
    id: 'news-05',
    title: '스마트 항만 자율운항 선박 접안 실증 완료... 스마트 해양 물류 대전환',
    source: '해양경제신문',
    publishedAt: '1일 전',
    field: '스마트 해양 & 자율운항',
    url: 'https://www.dt.co.kr',
  },
  {
    id: 'news-06',
    title: '글로벌 물류 로봇 AGV/AMR 시장 연평균 32% 성장... 스마트 풀필먼트 투자 집중',
    source: '로봇테크인사이트',
    publishedAt: '1일 전',
    field: '스마트 물류 & 풀필먼트',
    url: 'https://www.mk.co.kr',
  },
];

export const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 'event-01',
    date: '2026-11-06',
    title: '2026 대한민국 모빌리티 잡페어 & 채용설명회',
    category: '채용박람회',
    location: '서울 양재 aT센터 제1전시장 (현대차, LG엔솔 등 45개사 참가)',
    organizer: '한국자동차산업협회',
    linkUrl: 'https://www.kama.or.kr',
    badge: '취업박람회',
  },
  {
    id: 'event-02',
    date: '2026-11-10',
    title: '현대자동차 SOFTEER 아카데미 부트캠프 7기 모집',
    category: '부트캠프',
    location: '온라인 및 현대차 강남 교육센터',
    organizer: '현대자동차그룹',
    linkUrl: 'https://softeer.ai',
    badge: '현대차인증',
    targetMajor: '컴퓨터, 전자, 기계',
  },
  {
    id: 'event-03',
    date: '2026-11-13',
    title: 'K-Digital Training 자율주행 SW & ROS2 실무자 양성과정',
    category: '추천교육',
    location: '서울 서초구 & 온라인 병행',
    organizer: '프로그래머스 X 대한상의',
    linkUrl: 'https://programmers.co.kr',
    badge: '전액국비',
    targetMajor: 'SW, 로봇, 전자',
  },
  {
    id: 'event-04',
    date: '2026-11-15',
    title: '쏘카(SOCAR) 데이터 & MaaS 플랫폼 부트캠프 4기',
    category: '부트캠프',
    location: '온라인 메타버스 게더타운',
    organizer: '쏘카 테크아카데미',
    linkUrl: 'https://socar.team',
    badge: '채용연계',
    targetMajor: '컴퓨터, 산업공학, 통계',
  },
  {
    id: 'event-05',
    date: '2026-11-18',
    title: '차세대 전고체 배터리 & BMS 펌웨어 단기 집중 마스터 클래스',
    category: '추천교육',
    location: '오창 배터리아카데미',
    organizer: '한국배터리산업협회',
    linkUrl: 'https://koba.org',
    badge: '전문교육',
    targetMajor: '화공, 신소재, 전기',
  },
  {
    id: 'event-06',
    date: '2026-11-21',
    title: '전국 대학생 UAM eVTOL 공력설계 해커톤 본선',
    category: '해커톤',
    location: '대전 KAIST KI빌딩 매트릭스홀',
    organizer: '국토교통부·한화시스템',
    linkUrl: 'https://www.kaist.ac.kr',
    badge: '총상금 2천만',
  },
  {
    id: 'event-07',
    date: '2026-11-27',
    title: '미래차 전장부품 & 배터리 인재 매칭데이',
    category: '채용박람회',
    location: '부산 벡스코 제2전시장',
    organizer: '부산테크노파크',
    linkUrl: 'https://www.btp.or.kr',
    badge: '현장면접',
  },
];

export interface ColumnNotice {
  id: string;
  category: '공지' | '칼럼' | '취업가이드';
  title: string;
  date: string;
  author: string;
  content: string;
}

export const SAMPLE_NOTICES: ColumnNotice[] = [
  {
    id: 'notice-01',
    category: '취업가이드',
    title: '모빌리티 자율주행 포트폴리오에 반드시 들어가야 할 3가지',
    date: '2026-10-28',
    author: 'MobilityJob 커리어 멘토',
    content: '1. 단순 모델 학습을 넘어선 센서 캘리브레이션 및 왜곡 보정 경험\n2. ROS2 토픽 통신 지연 분석 및 임베디드 리눅스 실기기 배포 파이프라인\n3. 예외 상황(Edge Case: 야간, 악천후, 오인식) 방어 로직 설계 이력'
  },
  {
    id: 'notice-02',
    category: '칼럼',
    title: 'SDV(Software Defined Vehicle) 시대, 신입 개발자에게 요구되는 핵심 역량',
    date: '2026-10-22',
    author: '차량SW 아키텍트 J',
    content: '과거 하드웨어 중심에서 차량 전체가 소프트웨어로 제어되는 시대로 진입했습니다. AUTOSAR 아키텍처 이해와 함께, OTA(Over-The-Air) 무선 업데이트, 보안 격리, 그리고 C++14/17 기반의 안정적인 코드 작성이 가장 큰 차별점이 됩니다.'
  },
  {
    id: 'notice-03',
    category: '공지',
    title: 'MobilityJob 10대 모빌리티 분야 확장 & AI 자소서 도우미 업데이트',
    date: '2026-11-02',
    author: '운영팀',
    content: '스마트 해양, 스마트 물류, 수소 에너지를 포함한 10대 모빌리티 생태계 전반으로 분야가 대폭 확대되었습니다. 또한 Gemini AI 기반 맞춤 자소서 초안 생성 및 3단계 첨삭 진단 기능을 통해 서류 합격 가능성을 극대화해보세요!'
  }
];
