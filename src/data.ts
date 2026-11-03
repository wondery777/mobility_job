export interface Job {
  id: string;
  company: string;
  title: string;
  field: '자율주행' | '전기차·배터리' | 'UAM·드론' | '모빌리티 서비스' | '차량용 SW·반도체' | '자동차 부품';
  level: '신입' | '경력 2년+' | '경력 3년+' | '경력 5년+' | '신입·경력' | '경력 무관';
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
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  field: '자율주행' | '전기차·배터리' | 'UAM·드론' | '모빌리티 서비스' | '차량용 SW·반도체' | '자동차 부품';
  url: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: '채용박람회' | '세미나' | '해커톤' | '대회';
  location?: string;
}

export interface MobilityField {
  name: '자율주행' | '전기차·배터리' | 'UAM·드론' | '모빌리티 서비스' | '차량용 SW·반도체' | '자동차 부품';
  gradient: {
    from: string;
    to: string;
    bgClass: string;
    textClass: string;
  };
  hexColor: string;
  iconType: 'autonomous' | 'battery' | 'uam' | 'service' | 'chip' | 'parts';
  shortDesc: string;
  description: string;
  subFields: string[];
  coreSkills: string[];
  certificates: string[];
  educationRecommend: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  // 1. Deadline closing alert
  deadlineAlertEnabled: boolean;
  deadlineDays: number[]; // [0, 1, 3] (0: D-Day, 1: D-1, 3: D-3)
  deadlineBookmarkedOnly: boolean;
  // 2. New job alerts based on fields & technologies
  newJobAlertEnabled: boolean;
  alertFields: string[]; // e.g. ['자율주행', '차량용 SW·반도체']
  alertSkills: string[]; // e.g. ['C++', 'Python', 'ROS']
  // Additional preference options
  alertTime: string; // e.g. "09:00"
  soundEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  deadlineAlertEnabled: true,
  deadlineDays: [3, 1, 0],
  deadlineBookmarkedOnly: false,
  newJobAlertEnabled: true,
  alertFields: ['자율주행', '전기차·배터리', '차량용 SW·반도체'],
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
    name: '자율주행',
    gradient: {
      from: 'from-blue-600',
      to: 'to-indigo-700',
      bgClass: 'bg-gradient-to-br from-blue-600 to-indigo-700',
      textClass: 'text-blue-500 dark:text-blue-400',
    },
    hexColor: '#2563eb',
    iconType: 'autonomous',
    shortDesc: '인지·판단·제어 알고리즘 및 센서퓨전 시스템',
    description: '라이다, 레이더, 카메라 센서 데이터를 결합한 환경 인지와 딥러닝 기반 경로 생성 및 차량 거동 제어를 연구·개발합니다.',
    subFields: ['센서퓨전 & 인지(Perception)', 'SLAM & 측위(Localization)', '판단 & 제어(Planning & Control)', '시뮬레이션 가상 검증'],
    coreSkills: ['C++', 'Python', 'ROS', '센서퓨전', 'SLAM', 'OpenCV', '딥러닝', 'Linux'],
    certificates: ['정보처리기사', '전자기사', '운전면허 1종', 'ADsP'],
    educationRecommend: ['자율주행 전문인력 양성과정', 'ROS2 기반 로보틱스 부트캠프', '현대 NGV 산학협력 프로그램'],
  },
  {
    name: '전기차·배터리',
    gradient: {
      from: 'from-emerald-500',
      to: 'to-teal-700',
      bgClass: 'bg-gradient-to-br from-emerald-500 to-teal-700',
      textClass: 'text-emerald-500 dark:text-emerald-400',
    },
    hexColor: '#10b981',
    iconType: 'battery',
    shortDesc: 'BMS, 고전압 배터리 팩, 전력 변환 및 열관리',
    description: '차세대 2차 전지 셀/모듈/팩 설계와 BMS(배터리 관리 시스템) SW 개발, 인버터/컨버터 전력전자 설계를 담당합니다.',
    subFields: ['BMS 알고리즘 & 펌웨어', '배터리 팩/셀 기구설계', '전력전자 인버터·컨버터', '배터리 열관리 시스템(BTMS)'],
    coreSkills: ['C', 'MATLAB', 'BMS', 'CAN', 'AUTOSAR', 'ANSYS', 'CATIA'],
    certificates: ['전기기사', '전자기사', '화공기사', '기계기사'],
    educationRecommend: ['배터리 아카데미 전문과정', 'MATLAB/Simulink 모델기반 제어 워크숍', '전력전자 협회 전력변환 교육'],
  },
  {
    name: 'UAM·드론',
    gradient: {
      from: 'from-purple-600',
      to: 'to-violet-800',
      bgClass: 'bg-gradient-to-br from-purple-600 to-violet-800',
      textClass: 'text-purple-500 dark:text-purple-400',
    },
    hexColor: '#9333ea',
    iconType: 'uam',
    shortDesc: '도심항공모빌리티 eVTOL 기체 설계 & 자율비행',
    description: '도심 상공을 오가는 수직이착륙기(eVTOL) 공력 설계, 항법 제어 시스템(FC), 지상관제(GCS) 소프트웨어를 개발합니다.',
    subFields: ['eVTOL 비행제어(FCC)', '공력 해석 및 경량 복합재 설계', 'UATM 도심항공 교통관제', '자율비행 항법 솔루션'],
    coreSkills: ['C++', 'Python', 'MATLAB', 'Linux', 'ROS', 'SolidWorks', 'ANSYS'],
    certificates: ['항공기사', '초경량비행장치 조종자', '기계기사', '무선설비기사'],
    educationRecommend: ['한국항공우주연구원 도심항공인재 캠프', 'PX4/ArduPilot 비행제어 스터디', 'UAM 버티포트 기술 포럼'],
  },
  {
    name: '모빌리티 서비스',
    gradient: {
      from: 'from-amber-500',
      to: 'to-orange-600',
      bgClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textClass: 'text-amber-500 dark:text-amber-400',
    },
    hexColor: '#f59e0b',
    iconType: 'service',
    shortDesc: 'MaaS 플랫폼, 카셰어링, 플릿 매니지먼트 및 물류',
    description: '실시간 차량 배차 알고리즘, 이동 데이터 분석, 스마트 물류 및 사용자 경험 중심의 모바일 MaaS 솔루션을 만듭니다.',
    subFields: ['MaaS 경로 최적화 엔진', 'FMS(차량관제 플랫폼)', '수요응답형 대중교통(DRT)', '모빌리티 빅데이터 분석'],
    coreSkills: ['Python', 'SQL', 'Java', 'Docker', 'Git', 'Linux'],
    certificates: ['SQLD', 'ADsP', '정보처리기사', '빅데이터분석기사'],
    educationRecommend: ['모빌리티 데이터 기반 추천시스템 프로젝트', '지능형 교통체계(ITS) 아카데미'],
  },
  {
    name: '차량용 SW·반도체',
    gradient: {
      from: 'from-cyan-600',
      to: 'to-blue-800',
      bgClass: 'bg-gradient-to-br from-cyan-600 to-blue-800',
      textClass: 'text-cyan-600 dark:text-cyan-400',
    },
    hexColor: '#0891b2',
    iconType: 'chip',
    shortDesc: 'SDV, AUTOSAR 임베디드, AP·MCU 및 차량 보안',
    description: '소프트웨어 중심 자동차(SDV) 아키텍처, 전장 제어기 MCU 펌웨어, 차량용 NPU 가속기 및 차량 이더넷 보안을 구현합니다.',
    subFields: ['AUTOSAR Classic/Adaptive', '차량용 OS & 하이퍼바이저', '차량 통신(CAN/Ethernet)', '차량 사이버보안(ISO 21434)'],
    coreSkills: ['C', 'C++', 'AUTOSAR', 'CAN', 'Linux', 'Git', 'Docker'],
    certificates: ['정보처리기사', '정보보안기사', '전자기사', '리눅스마스터'],
    educationRecommend: ['AUTOSAR 공인 교육과정', '현대오토에버 모빌리티 임베디드 스쿨', '차량 보안 국제표준 워크숍'],
  },
  {
    name: '자동차 부품',
    gradient: {
      from: 'from-slate-600',
      to: 'to-zinc-800',
      bgClass: 'bg-gradient-to-br from-slate-600 to-zinc-800',
      textClass: 'text-slate-600 dark:text-slate-300',
    },
    hexColor: '#475569',
    iconType: 'parts',
    shortDesc: '샤시·조향·제동 시스템, 전동화 액추에이터 기구',
    description: '전자식 조향(MDPS), 전동식 통합제동(IDB), 스마트 서스펜션 등 미래 모빌리티의 핵심 기계·전자 융합 모듈을 개발합니다.',
    subFields: ['전자식 제동/조향(by-wire)', '전동화 구동 모터/감속기', '스마트 서스펜션 & 샤시', 'NVH 소음진동 저감 해석'],
    coreSkills: ['CATIA', 'SolidWorks', 'ANSYS', 'MATLAB', 'Excel', 'C'],
    certificates: ['기계기사', '품질경영기사', '전기기사', '컴퓨터활용능력'],
    educationRecommend: ['모빌리티 메카트로닉스 종합설계', 'CATIA 기반 자동차 바디/샤시 실무', '품질경영 6시그마 교육'],
  },
];

export const INITIAL_SKILLS = [
  'C', 'C++', 'Python', 'Java', 'MATLAB',
  'ROS', 'AUTOSAR', 'CAN', '센서퓨전', 'SLAM',
  '딥러닝', 'OpenCV', 'BMS', 'SQL', 'Linux',
  'Git', 'Docker', 'CATIA', 'SolidWorks', 'ANSYS', 'Excel'
];

export const INITIAL_CERTIFICATES = [
  '정보처리기사', '정보보안기사', '전기기사', '전자기사',
  '기계기사', '품질경영기사', '항공기사', '컴퓨터활용능력',
  'SQLD', 'ADsP', '빅데이터분석기사', '리눅스마스터',
  '초경량비행장치 조종자', '운전면허 1종', 'TOEIC', 'OPIc'
];

export const INITIAL_MAJORS = [
  '기계공학과', '자동차공학과', '전기공학과', '전자공학과',
  '컴퓨터공학과', '소프트웨어학과', 'AI·데이터공학과', '제어계측공학과',
  '항공우주공학과', '로봇공학과', '산업공학과', '신소재공학과',
  '화학공학과', '통신공학과', '메카트로닉스공학과', '비전공(기타)'
];

export const SAMPLE_JOBS: Job[] = [
  {
    id: 'job-01',
    company: '오토노머스에이아이 (가상)',
    title: '자율주행 인지/판단 알고리즘 개발자 (신입 채용)',
    field: '자율주행',
    level: '신입',
    region: '서울 서초구',
    deadline: '2026-11-03', // D-2 (빨간색)
    skills: ['C++', 'Python', 'ROS', '센서퓨전', 'SLAM', 'Linux'],
    summary: '도심 자율주행 셔틀에 탑재되는 LiDAR 및 카메라 융합 인지 파이프라인과 실시간 로컬 경로 생성 알고리즘을 개발하는 포지션입니다.',
    required: [
      '컴퓨터공학, 로봇공학, 전자공학 관련 전공 학사 이상',
      'C++ 또는 Python 기반 알고리즘 구현 능력',
      'Linux 환경 및 Git 버전 관리 친숙자',
      '자율주행 센서(LiDAR, Camera, IMU) 기본 원리 이해'
    ],
    preferred: [
      'ROS / ROS2 기반 프로젝트 개발 경험자',
      'Point Cloud 라이브러리(PCL) 또는 OpenCV 활용 경험',
      '대학생 자율주행 경진대회 참가 또는 수상 이력',
      '관련 자격증: 운전면허 1종, 정보처리기사'
    ],
    certificates: ['운전면허 1종', '정보처리기사'],
    majors: ['컴퓨터공학과', '소프트웨어학과', '로봇공학과', '전자공학과', 'AI·데이터공학과'],
    salary: '연봉 4,200만 ~ 4,800만 원 (성과급 별도)',
    department: '자율주행 코어선행개발본부',
    sourceUrl: 'https://careers.example.com/jobs/autocore-01',
  },
  {
    id: 'job-02',
    company: '에너텍 모빌리티 (가상)',
    title: '전기차 차세대 고전압 BMS SW 엔지니어',
    field: '전기차·배터리',
    level: '신입·경력',
    region: '충북 청주시',
    deadline: '2026-11-04', // D-3 (빨간색)
    skills: ['C', 'MATLAB', 'BMS', 'CAN', 'AUTOSAR'],
    summary: 'EV 배터리 팩 수명 및 잔여용량(SoC/SoH) 추정 알고리즘 개발과 AUTOSAR 기반 고전압 제어기 펌웨어를 설계합니다.',
    required: [
      '전기전자공학, 제어계측 또는 배터리공학 전공자',
      '임베디드 C 언어 프로그래밍 실무 가능자',
      '마이크로컨트롤러(MCU) 및 CAN/LIN 통신 인터페이스 경험'
    ],
    preferred: [
      'MATLAB/Simulink Model-Based Design 경험자',
      '기능안전(ISO 26262) 프로세스 이해자',
      '전기차 배터리 시스템 평가 및 테스트베드 경험',
      '관련 자격증: 전기기사, 전자기사'
    ],
    certificates: ['전기기사', '전자기사'],
    majors: ['전기공학과', '전자공학과', '제어계측공학과', '화학공학과'],
    salary: '회사 내규에 따름 (신입 초봉 4,600만 원 선)',
    department: '배터리제어개발팀',
    sourceUrl: 'https://careers.example.com/jobs/enertec-02',
  },
  {
    id: 'job-03',
    company: '스카이모션 테크 (가상)',
    title: '도심항공 UAM eVTOL 비행제어(FCC) 시스템 개발자',
    field: 'UAM·드론',
    level: '경력 3년+',
    region: '대전 유성구',
    deadline: '2026-11-12',
    skills: ['C++', 'MATLAB', 'Linux', 'ROS', 'SolidWorks'],
    summary: '5인승 도심항공교통 기체의 비행제어 컴퓨터(FCC) 소프트웨어 아키텍처 수립과 3중화 센서 페일세이프 로직을 설계합니다.',
    required: [
      '항공우주공학, 기계제어공학 석사 이상 또는 동등 경력자',
      '비행 동역학 및 현대 제어이론(LQR, H-infinity 등) 적용 능력',
      '실시간 OS(RTOS) 환경의 임베디드 C/C++ 개발 경력 3년 이상'
    ],
    preferred: [
      'DO-178C 항공 소프트웨어 인증 기준 참여 경험자',
      'PX4 또는 ROS 기반 무인기 제어 개발 경험',
      '관련 자격증: 항공기사, 초경량비행장치 조종자'
    ],
    certificates: ['항공기사', '초경량비행장치 조종자'],
    majors: ['항공우주공학과', '기계공학과', '제어계측공학과', '로봇공학과'],
    salary: '연봉 6,000만 ~ 7,500만 원 (스톡옵션 협의)',
    department: '비행제어연구소',
    sourceUrl: 'https://careers.example.com/jobs/skymotion-03',
  },
  {
    id: 'job-04',
    company: '루트나우 모빌리티 (가상)',
    title: '수요응답형 모빌리티(DRT) 라우팅 엔진 백엔드 개발자',
    field: '모빌리티 서비스',
    level: '신입·경력',
    region: '경기 성남시',
    deadline: '2026-11-02', // D-1 (빨간색)
    skills: ['Python', 'SQL', 'Docker', 'Git', 'Linux'],
    summary: '실시간 승객 호출에 대응하여 다차량 최적 배차 경로를 1초 이내에 연산하는 MaaS 라우팅 엔진 및 대용량 트래픽 백엔드를 개발합니다.',
    required: [
      '컴퓨터공학 관련 전공 또는 이에 준하는 소프트웨어 개발 역량',
      'Python, Go 또는 Java 기반 웹 백엔드 구축 경험',
      'RDBMS(PostgreSQL) 및 Redis 등 인메모리 캐시 다뤄본 분',
      'Git 형상관리 협업 역량'
    ],
    preferred: [
      'VRP(Vehicle Routing Problem) 또는 그래프 최적화 알고리즘 연구 경험',
      'Docker/Kubernetes 기반 클라우드 MSA 아키텍처 경험',
      '관련 자격증: SQLD, 정보처리기사'
    ],
    certificates: ['SQLD', '정보처리기사'],
    majors: ['컴퓨터공학과', '소프트웨어학과', '산업공학과', 'AI·데이터공학과'],
    salary: '신입 4,500만 원 / 경력 협의',
    department: 'MaaS Core 플랫폼팀',
    sourceUrl: 'https://careers.example.com/jobs/routenow-04',
  },
  {
    id: 'job-05',
    company: '넥스트세미 오토 (가상)',
    title: '차량용 AP/MCU 임베디드 펌웨어 및 AUTOSAR 개발자',
    field: '차량용 SW·반도체',
    level: '경력 2년+',
    region: '경기 수원시',
    deadline: '2026-11-20',
    skills: ['C', 'C++', 'AUTOSAR', 'CAN', 'Linux', 'Git'],
    summary: 'SDV 중앙 집중형 도메인 컨트롤러(DCU)에 탑재되는 AUTOSAR Adaptive 플랫폼 포팅과 차량 내 고속 Ethernet 통신 스택을 개발합니다.',
    required: [
      '전자공학, 컴퓨터공학 학사 이상',
      'C/C++ 기반 펌웨어 개발 실무 2년 이상',
      'CAN, CAN-FD, SPI, Ethernet 프로토콜 분석 가능자'
    ],
    preferred: [
      'Classic 또는 Adaptive AUTOSAR 프로젝트 양산 경험자',
      '차량 사이버보안 규격(ISO/SAE 21434) 적용 경험',
      '관련 자격증: 정보보안기사, 정보처리기사'
    ],
    certificates: ['정보보안기사', '정보처리기사'],
    majors: ['전자공학과', '컴퓨터공학과', '전기공학과', '통신공학과'],
    salary: '연봉 5,500만 ~ 7,000만 원',
    department: 'SDV 전장SW본부',
    sourceUrl: 'https://careers.example.com/jobs/nextsemi-05',
  },
  {
    id: 'job-06',
    company: '한라드라이브 메카 (가상)',
    title: '전동식 조향장치(MDPS) 메카트로닉스 설계 엔지니어',
    field: '자동차 부품',
    level: '신입',
    region: '부산 강서구',
    deadline: '2026-11-15',
    skills: ['CATIA', 'SolidWorks', 'ANSYS', 'MATLAB', 'Excel'],
    summary: '미래형 By-Wire 전자식 조향 모듈(Steer-by-Wire)의 기구 부품 3D CAD 모델링과 정밀 기어박스 구조 강도/피로 해석을 담당합니다.',
    required: [
      '기계공학, 자동차공학 전공 학사 이상',
      'CATIA 또는 SolidWorks 등 3D 기구설계 CAD 숙련자',
      '재료역학, 기계요소설계 등 기계공학 기초 전공자'
    ],
    preferred: [
      'ANSYS Workbench 구조/응력 해석 경험자',
      '자동차 샤시/부품사 인턴십 수료자',
      '관련 자격증: 기계기사, 일반기계기사, 컴퓨터활용능력'
    ],
    certificates: ['기계기사', '컴퓨터활용능력'],
    majors: ['기계공학과', '자동차공학과', '메카트로닉스공학과'],
    salary: '연봉 4,400만 원 (기숙사/식사 지원)',
    department: '샤시시스템개발부',
    sourceUrl: 'https://careers.example.com/jobs/halladrive-06',
  },
  {
    id: 'job-07',
    company: '비전드라이브랩 (가상)',
    title: '자율주행 영상 딥러닝 객체 검출 모델 연구원',
    field: '자율주행',
    level: '경력 무관',
    region: '서울 강남구',
    deadline: '2026-11-08',
    skills: ['Python', '딥러닝', 'OpenCV', 'Docker', 'Linux', 'Git'],
    summary: '차량 전방 서라운드 뷰 카메라 영상에서 보행자, 신호등, 도로 차선을 정밀 검출하는 실시간 딥러닝 모델 학습 및 TensorRT 최적화.',
    required: [
      'PyTorch 또는 TensorFlow 프레임워크 능숙자',
      '컴퓨터 비전(2D/3D Object Detection, Segmentation) 기초 이해',
      '학술 논문(CVPR, ICCV 등) 재현 및 코딩 구현 역량'
    ],
    preferred: [
      'ONNX 및 TensorRT 임베디드 추론 최적화 경험',
      'NuScenes, Waymo, KITTI 자율주행 데이터셋 활용 경험',
      '관련 자격증: ADsP, 빅데이터분석기사'
    ],
    certificates: ['ADsP', '빅데이터분석기사'],
    majors: ['컴퓨터공학과', 'AI·데이터공학과', '소프트웨어학과', '전자공학과'],
    salary: '경력 및 학위에 따라 개별 협의 (스톡옵션 부여)',
    department: 'AI Vision 연구팀',
    sourceUrl: 'https://careers.example.com/jobs/visiondrive-07',
  },
  {
    id: 'job-08',
    company: '그린에너지셀 (가상)',
    title: '전기차 배터리 모듈 열관리(BTMS) 시뮬레이션 해석원',
    field: '전기차·배터리',
    level: '경력 3년+',
    region: '울산 북구',
    deadline: '2026-11-25',
    skills: ['ANSYS', 'MATLAB', 'CATIA', 'Excel'],
    summary: '급속 충전 및 가혹 주행 시 발생하는 배터리 셀의 열폭주를 방지하기 위한 냉각 유로 CFD 전산유체역학 해석과 냉각판 설계.',
    required: [
      '기계공학, 열유체공학 석사 이상 또는 동등 3년 이상 경력',
      'ANSYS Fluent 또는 Star-CCM+ CFD 열유체 해석 숙련자',
      '배터리 열화 메커니즘 및 냉각 시스템 이해'
    ],
    preferred: [
      '침전식(Immersion) 배터리 냉각 기술 선행과제 수행자',
      '관련 자격증: 기계기사, 품질경영기사'
    ],
    certificates: ['기계기사', '품질경영기사'],
    majors: ['기계공학과', '화학공학과', '자동차공학과'],
    salary: '연봉 5,800만 ~ 7,200만 원',
    department: '열관리선행해석팀',
    sourceUrl: 'https://careers.example.com/jobs/greencell-08',
  },
  {
    id: 'job-09',
    company: '모빌링크 (가상)',
    title: '스마트 물류 플릿 매니지먼트(FMS) 데이터 엔지니어',
    field: '모빌리티 서비스',
    level: '신입',
    region: '인천 연수구',
    deadline: '2026-11-18',
    skills: ['Python', 'SQL', 'Docker', 'Linux', 'Git'],
    summary: '상용 트럭 수천 대에서 1초 주기로 전송되는 실시간 텔레매틱스 CAN 데이터를 정제·가공하고 이상 징후를 예측하는 파이프라인 구축.',
    required: [
      '컴퓨터/소프트웨어, 산업공학, 데이터사이언스 전공자',
      'SQL 쿼리 작성 및 데이터 모델링 역량',
      'Python 데이터 분석 라이브러리(Pandas, NumPy) 숙련도'
    ],
    preferred: [
      'Kafka, Spark 기반 실시간 스트리밍 처리 경험',
      '관련 자격증: SQLD, ADsP, 정보처리기사'
    ],
    certificates: ['SQLD', 'ADsP', '정보처리기사'],
    majors: ['컴퓨터공학과', '산업공학과', 'AI·데이터공학과', '소프트웨어학과'],
    salary: '연봉 4,100만 ~ 4,500만 원',
    department: '데이터플랫폼팀',
    sourceUrl: 'https://careers.example.com/jobs/mobilink-09',
  },
  {
    id: 'job-10',
    company: '에어로보틱스 (가상)',
    title: '산업용 특수 드론 항법 및 지상제어(GCS) 소프트웨어',
    field: 'UAM·드론',
    level: '신입·경력',
    region: '경남 창원시',
    deadline: '2026-11-28',
    skills: ['C++', 'Python', 'ROS', 'Git', 'Linux'],
    summary: '해양 감시 및 인프라 점검용 장거리 VTOL 드론의 실시간 지상 관제 스테이션(GCS) GUI 및 LTE 통신 모뎀 연동 SW 개발.',
    required: [
      '소프트웨어/제어공학 학사 이상',
      'C++ 또는 Python 기반 데스크톱/웹 애플리케이션 개발 경험',
      '시리얼(UART), TCP/UDP 소켓 통신 기본 지식'
    ],
    preferred: [
      'QGroundControl 또는 MAVLink 프로토콜 커스터마이징 경험',
      '드론 조종 자격 소지자',
      '관련 자격증: 초경량비행장치 조종자, 정보처리기사'
    ],
    certificates: ['초경량비행장치 조종자', '정보처리기사'],
    majors: ['항공우주공학과', '로봇공학과', '컴퓨터공학과', '전자공학과'],
    salary: '연봉 4,200만 ~ 5,300만 원',
    department: '항법시스템팀',
    sourceUrl: 'https://careers.example.com/jobs/aerobotics-10',
  },
  {
    id: 'job-11',
    company: '오토칩스코리아 (가상)',
    title: '차량용 AI NPU 가속기 컴파일러 런타임 엔지니어',
    field: '차량용 SW·반도체',
    level: '경력 5년+',
    region: '경기 평택시',
    deadline: '2026-11-05',
    skills: ['C++', 'C', 'Linux', 'Git', '딥러닝'],
    summary: '자율주행용 고성능 차량 시스템 반도체(SoC)의 딥러닝 NPU 컴파일러 최적화와 가속 런타임 라이브러리를 개발합니다.',
    required: [
      '컴퓨터공학, 전기전자공학 학사 이상',
      'LLVM 컴파일러 또는 딥러닝 런타임(TVM, ONNX Runtime) 프레임워크 이해',
      '최신 C++ (C++14/17) 고급 문법 및 최적화 기법 보유자'
    ],
    preferred: [
      '차량 기능안전 인증(ISO 26262 ASIL-B 이상) 프로젝트 경험',
      '관련 자격증: 정보처리기사'
    ],
    certificates: ['정보처리기사'],
    majors: ['컴퓨터공학과', '전자공학과', '소프트웨어학과'],
    salary: '연봉 7,500만 ~ 9,500만 원',
    department: 'SoC SW 플랫폼그룹',
    sourceUrl: 'https://careers.example.com/jobs/autochips-11',
  },
  {
    id: 'job-12',
    company: '한국파워트레인테크 (가상)',
    title: '친환경 전기차 전동감속기 기구설계 및 품질평가',
    field: '자동차 부품',
    level: '경력 무관',
    region: '대구 달서구',
    deadline: '2026-11-19',
    skills: ['CATIA', 'SolidWorks', 'ANSYS', 'Excel'],
    summary: '모터 구동력을 바퀴로 전달하는 초소형 초경량 1단/2단 전기차 전동 감속기 하우징 기구설계와 기어 치형 접촉 피로 수명 시험.',
    required: [
      '기계공학 또는 메카트로닉스 관련 학과 졸업(예정)자',
      '2D/3D CAD(CATIA, SolidWorks) 도면 해독 및 모델링 능력',
      '공학적 문제 해결 의지와 적극적인 현장 소통 태도'
    ],
    preferred: [
      '기어 트랜스미션 선행설계 연구실 경험',
      '관련 자격증: 기계기사, 품질경영기사'
    ],
    certificates: ['기계기사', '품질경영기사'],
    majors: ['기계공학과', '자동차공학과', '메카트로닉스공학과', '신소재공학과'],
    salary: '신입 4,300만 원 / 경력직 별도 협의',
    department: '전동화구동선행설계팀',
    sourceUrl: 'https://careers.example.com/jobs/powertech-12',
  },
  {
    id: 'job-13',
    company: '현대오토에버 (가상)',
    title: '차량 임베디드 사이버보안 및 OTA 무선 업데이트 플랫폼 개발',
    field: '차량용 SW·반도체',
    level: '신입·경력',
    region: '서울 강남구',
    deadline: '2026-11-09',
    skills: ['C++', 'Linux', 'Git', 'CAN', 'AUTOSAR'],
    summary: '차량 내/외부 통신 보안(ISO/SAE 21434 규격) 모듈 구현 및 차량 제어기 무선 펌웨어 업데이트(OTA) 시스템을 구축합니다.',
    required: [
      '컴퓨터공학, 정보보호학, 전자공학 학사 이상',
      'C/C++ 기반 임베디드 리눅스 프로그래밍 역량',
      '네트워크 보안(TLS, 암호화 알고리즘) 및 공개키 인프라(PKI) 이해'
    ],
    preferred: [
      '차량 사이버보안 표준(UN R155/156) 관련 프로젝트 경험',
      '관련 자격증: 정보처리기사, 정보보안기사'
    ],
    certificates: ['정보처리기사', '정보보안기사'],
    majors: ['컴퓨터공학과', '소프트웨어학과', '전자공학과', '통신공학과'],
    salary: '연봉 5,000만 ~ 6,500만 원',
    department: '차량보안플랫폼팀',
    sourceUrl: 'https://careers.example.com/jobs/autoever-13',
  },
  {
    id: 'job-14',
    company: '모빌리티X (가상)',
    title: '도심 자율주행 로보택시 원격 관제 및 V2X 통신 엔지니어',
    field: '자율주행',
    level: '신입',
    region: '경기 성남시',
    deadline: '2026-11-15',
    skills: ['Python', 'C++', 'Linux', 'ROS', 'Git'],
    summary: '자율주행차와 스마트 인프라(RSU) 간 5G-V2X 초저지연 통신 및 비상 원격 제어 인터페이스를 개발합니다.',
    required: [
      '전자공학, 컴퓨터공학, 통신공학 전공자',
      'C++ 또는 Python 네트워크 소켓 프로그래밍 이해',
      'Linux 운영체제 환경 실무 경험'
    ],
    preferred: [
      'V2X 통신 프로토콜(WAVE, C-V2X) 규격 이해자',
      '관련 자격증: 무선설비기사, 정보통신기사'
    ],
    certificates: ['무선설비기사', '정보통신기사'],
    majors: ['통신공학과', '전자공학과', '컴퓨터공학과', '소프트웨어학과'],
    salary: '연봉 4,400만 ~ 5,000만 원',
    department: 'V2X통신선행랩',
    sourceUrl: 'https://careers.example.com/jobs/mobilityx-14',
  },
  {
    id: 'job-15',
    company: '스카이모빌리티 (가상)',
    title: 'eVTOL 비행체 공력설계 및 비행제어 시뮬레이터 개발',
    field: 'UAM·드론',
    level: '경력 2년+',
    region: '대전 유성구',
    deadline: '2026-11-22',
    skills: ['MATLAB', 'C++', 'ANSYS', 'CATIA', 'Linux'],
    summary: '도심형 항공 모빌리티 비행체의 공력 특성 해석(CFD) 및 6자유도 비행 동역학 제어 모델 시뮬레이터를 개발합니다.',
    required: [
      '항공우주공학, 기계공학 석사 이상 또는 동등 경력',
      '비행 동역학 및 자동비행제어 시스템(FCS) 이론 이해',
      'MATLAB/Simulink 비행 시뮬레이션 모델링 역량'
    ],
    preferred: [
      'eVTOL 틸트로터 또는 멀티로터 설계 프로젝트 경험',
      '관련 자격증: 항공기사, 초경량비행장치 조종자'
    ],
    certificates: ['항공기사', '초경량비행장치 조종자'],
    majors: ['항공우주공학과', '기계공학과', '제어계측공학과'],
    salary: '연봉 5,500만 ~ 7,000만 원',
    department: 'UAM비행체연구센터',
    sourceUrl: 'https://careers.example.com/jobs/skymobility-15',
  },
  {
    id: 'job-16',
    company: '셀테크놀로지 (가상)',
    title: '차세대 전고체 배터리 셀 전극 공정 및 수율 개선 엔지니어',
    field: '전기차·배터리',
    level: '신입',
    region: '경기 화성시',
    deadline: '2026-11-12',
    skills: ['Excel', 'CATIA', 'MATLAB'],
    summary: '고용량 전고체 배터리 양극/음극 극판 코팅, 압연 공정 최적화 및 셀 생산 파일럿 라인 수율 분석을 담당합니다.',
    required: [
      '화학공학, 신소재공학, 재료공학 학사 이상',
      '2차전지 전극 소재(양극재, 고체전해질) 기초 특성 이해',
      '데이터 기반 공정 조건 분석 능력'
    ],
    preferred: [
      '배터리 공정 실습 또는 학부 연구생 경험자',
      '관련 자격증: 화학분석기사, 화공기사'
    ],
    certificates: ['화학분석기사', '화공기사'],
    majors: ['화학공학과', '신소재공학과'],
    salary: '연봉 4,600만 ~ 5,200만 원',
    department: '배터리공정개발실',
    sourceUrl: 'https://careers.example.com/jobs/celltech-16',
  }
];

export const SAMPLE_NEWS: NewsItem[] = [
  {
    id: 'news-01',
    title: '서울시 심야 자율주행 택시 정식 운행 개시... 운행 구간 강남 일대로 확대',
    source: '모빌리티데일리 (가상)',
    publishedAt: '2시간 전',
    field: '자율주행',
    url: 'https://news.example.com/autonomous-taxi-gangnam',
  },
  {
    id: 'news-02',
    title: '차세대 전고체 배터리 파일럿 라인 가동... 2027년 양산 채비 속도',
    source: '배터리인사이트 (가상)',
    publishedAt: '4시간 전',
    field: '전기차·배터리',
    url: 'https://news.example.com/solid-state-battery-line',
  },
  {
    id: 'news-03',
    title: '국토부 K-UAM 실증 2단계 완료... 수도권 상공 비행시험 안전성 검증',
    source: '항공항공타임스 (가상)',
    publishedAt: '6시간 전',
    field: 'UAM·드론',
    url: 'https://news.example.com/k-uam-grand-challenge',
  },
  {
    id: 'news-04',
    title: '현대차그룹 SDV 전환 선언 3년차, 차세대 ccOS 탑재 차종 대폭 확대',
    source: '오토SW리포트 (가상)',
    publishedAt: '12시간 전',
    field: '차량용 SW·반도체',
    url: 'https://news.example.com/sdv-ccos-expansion',
  },
  {
    id: 'news-05',
    title: 'MaaS 통합 플랫폼 이용자 500만 돌파, 대중교통·킥보드·택시 환승 결제 연계',
    source: '스마트트래픽뉴스 (가상)',
    publishedAt: '1일 전',
    field: '모빌리티 서비스',
    url: 'https://news.example.com/maas-platform-5m',
  },
  {
    id: 'news-06',
    title: '전자식 통합 제동장치(IDB) 수출액 전년비 40% 증가... 글로벌 친환경차 공략',
    source: '한국부품경제 (가상)',
    publishedAt: '1일 전',
    field: '자동차 부품',
    url: 'https://news.example.com/idb-export-boom',
  },
  {
    id: 'news-07',
    title: '자율주행 센서퓨전 전문인력 품귀 현상... 모빌리티 업계 채용 경쟁 치열',
    source: '커리어모빌리티 (가상)',
    publishedAt: '2일 전',
    field: '자율주행',
    url: 'https://news.example.com/autonomous-recruitment-trend',
  },
  {
    id: 'news-08',
    title: '차량용 전력반도체 SiC 공급망 다변화, 국내 팹리스 기업 신규 투자 확대',
    source: '반도체월드 (가상)',
    publishedAt: '3일 전',
    field: '차량용 SW·반도체',
    url: 'https://news.example.com/sic-semiconductor-invest',
  }
];

export const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 'event-01',
    date: '2026-11-06',
    title: '2026 대한민국 모빌리티 잡페어 & 채용설명회',
    category: '채용박람회',
    location: '서울 양재 aT센터 제1전시장',
  },
  {
    id: 'event-02',
    date: '2026-11-13',
    title: '자율주행 소프트웨어 개발자 데크 & 테크 컨퍼런스',
    category: '세미나',
    location: '판교 스타트업캠퍼스 컨퍼런스홀',
  },
  {
    id: 'event-03',
    date: '2026-11-21',
    title: '전국 대학생 UAM eVTOL 공력설계 해커톤 본선',
    category: '해커톤',
    location: '대전 KAIST KI빌딩 매트릭스홀',
  },
  {
    id: 'event-04',
    date: '2026-11-27',
    title: '미래차 전장부품 & 배터리 인재 매칭데이',
    category: '채용박람회',
    location: '부산 벡스코 제2전시장',
  }
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
    title: 'MobilityJob v2.4 업데이트 안내: 지역별 세부 필터 및 기술 매칭 기능 강화',
    date: '2026-10-15',
    author: '운영팀',
    content: '전국 17개 시·도 및 시군구 정밀 필터가 추가되었습니다. MY 탭에서 보유 기술과 자격증을 등록하시면 각 공고별로 맞춤 매칭률(%)과 부족한 추천 역량을 즉시 확인하실 수 있습니다.'
  }
];
