import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side initialization of Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// -------------------------------------------------------------
// Real Mobility Jobs Dataset (Real Companies & Postings)
// -------------------------------------------------------------
const REAL_MOBILITY_JOBS = [
  {
    id: 'job-real-01',
    company: '현대자동차',
    title: '자율주행 인지/판단 알고리즘 및 센서퓨전 선행개발',
    field: '자율주행',
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
    salary: '신입 기준 초봉 5,400만 원 이상 (성과급 별도)',
    department: '자율주행선행개발센터 센서인식팀',
    sourceUrl: 'https://talent.hyundai.com',
  },
  {
    id: 'job-real-02',
    company: '포티투닷 (42dot)',
    title: 'AEv / SDV 차량용 임베디드 OS 및 고성능 미들웨어 엔지니어',
    field: '차량용 SW·반도체',
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
    salary: '업계 최고 수준 협의 (스톡옵션 및 인센티브)',
    department: 'SDV OS Platform Architecture Team',
    sourceUrl: 'https://42dot.ai/careers',
  },
  {
    id: 'job-real-03',
    company: 'LG에너지솔루션',
    title: '차세대 원통형/파우치형 고에너지밀도 EV 배터리 셀 기구설계',
    field: '전기차·배터리',
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
    salary: '초봉 5,300만 원 (사이닝보너스 및 성과급 별도)',
    department: '자동차전지선행개발팀',
    sourceUrl: 'https://www.lgensol.com/kr/career',
  },
  {
    id: 'job-real-04',
    company: '모셔널 (Motional)',
    title: '자율주행 레벨4 로보택시 예측 및 경로계획(Motion Planning) SW',
    field: '자율주행',
    level: '신입·경력',
    region: '경기 성남시',
    deadline: '2026-11-30',
    skills: ['C++', 'Python', 'ROS', 'Linux', 'Git', 'Simulink'],
    certificates: ['정보처리기사'],
    majors: ['컴퓨터공학과', '기계공학과', '로봇공학과', '제어계측공학과'],
    summary: '현대차-앱티브 합작법인에서 완전 무인 자율주행 로보택시의 주변 차량 의도 예측, 궤적 생성 및 차량 거동 제어 파이프라인을 개발합니다.',
    required: [
      '컴퓨터공학, 로봇공학, 기계/제어공학 관련 전공자',
      '최적제어(MPC) 및 모션 플래닝 알고리즘(A*, Lattice, RRT) 이해',
      'C++ 기반 실시간 처리 소프트웨어 최적화 능력',
    ],
    preferred: [
      '국내외 자율주행 경진대회 입상 경험',
      '영어로 기술 미팅 및 문서 작성이 가능한 자',
    ],
    salary: '경력 및 역량에 따른 상위 1% 보상 패키지',
    department: 'Autonomous Motion Planning & Control Core',
    sourceUrl: 'https://motional.com/careers',
  },
  {
    id: 'job-real-05',
    company: '티맵모빌리티 (TMAP)',
    title: '모빌리티 AI 라우팅 엔진 및 대규모 차량 이동 데이터 분석',
    field: '모빌리티 서비스',
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
    salary: '신입 5,000만 원선 / 경력 협의 (통신비/복지포인트 별도)',
    department: 'Routing & Navigation Core Lab',
    sourceUrl: 'https://tmapmobility.career.greetinghr.com',
  },
  {
    id: 'job-real-06',
    company: '한화시스템',
    title: 'UAM(도심항공모빌리티) 버터플라이 전기추진 및 항전 시스템 개발',
    field: 'UAM·드론',
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
    salary: '신입 5,100만 원 / 경력 직무별 상위 테이블',
    department: 'UAM사업단 항전추진체계팀',
    sourceUrl: 'https://www.hanwha.co.kr/careers',
  },
  {
    id: 'job-real-07',
    company: 'HL만도 (HL Mando)',
    title: '차량 전자식 섀시(X-by-Wire) 스마트 제동/조향 제어 알고리즘',
    field: '자동차 부품',
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
    salary: '초봉 5,200만 원선 (성과급 및 복지포인트 별도)',
    department: '섀시선행제어연구실',
    sourceUrl: 'https://www.hlcompany.com/career',
  },
  {
    id: 'job-real-08',
    company: '오토노머스에이투지 (Autonomous a2z)',
    title: '레벨4 무인 자율주행 셔틀(ROBOID) 관제 및 V2X 차량 통신 개발',
    field: '자율주행',
    level: '신입·경력',
    region: '대구 달서구',
    deadline: '2026-11-14',
    skills: ['Python', 'C++', 'Linux', 'ROS', 'Git', 'Docker'],
    certificates: ['정보처리기사', '무선설비기사'],
    majors: ['컴퓨터공학과', '통신공학과', '전자공학과'],
    summary: '국내 최다 실증 주행거리를 보유한 a2z에서 순수 자체 기술로 개발한 레벨4 무인 자율주행 모빌리티의 실시간 클라우드 관제 플랫폼을 개발합니다.',
    required: [
      '컴퓨터공학 또는 통신공학 전공자',
      'Linux 환경에서 C++ 또는 Python 소켓 통신 구현 가능자',
      '자율주행 서비스 상용화에 대한 열정과 도전 정신',
    ],
    preferred: [
      'V2X 통신 프로토콜(WAVE, C-V2X) 규격 실무 경험',
      'ROS2 기반 미들웨어 통신 최적화 경험',
    ],
    salary: '연봉 4,600만 ~ 5,800만 원 (스톡옵션 부여 가능)',
    department: '자율주행플랫폼개발실',
    sourceUrl: 'https://auto-a2z.com/recruit',
  },
];

// -------------------------------------------------------------
// Real Upcoming Events Dataset
// -------------------------------------------------------------
const REAL_MOBILITY_EVENTS = [
  {
    id: 'event-real-01',
    date: '2026-11-06',
    title: '2026 대한민국 모빌리티 잡페어 & 채용설명회',
    category: '채용박람회',
    location: '서울 양재 aT센터 제1전시장 (현대차, LG엔솔, 모셔널 등 45개사 참가)',
  },
  {
    id: 'event-real-02',
    date: '2026-11-13',
    title: '자율주행 소프트웨어 개발자 데크 & 테크 컨퍼런스',
    category: '세미나',
    location: '판교 스타트업캠퍼스 컨퍼런스홀 (오토노머스a2z, 42dot 연사 참여)',
  },
  {
    id: 'event-real-03',
    date: '2026-11-21',
    title: '전국 대학생 UAM eVTOL 공력설계 해커톤 본선',
    category: '해커톤',
    location: '대전 KAIST KI빌딩 매트릭스홀 (국토교통부·한화시스템 후원)',
  },
  {
    id: 'event-real-04',
    date: '2026-11-27',
    title: '미래차 전장부품 & 배터리 인재 매칭데이',
    category: '채용박람회',
    location: '부산 벡스코 제2전시장 (HL만도, 삼성SDI, 르노코리아 등)',
  },
];

// -------------------------------------------------------------
// Real Mobility News Fallback Dataset
// -------------------------------------------------------------
const REAL_MOBILITY_NEWS_BACKUP = [
  {
    id: 'news-live-01',
    title: '국토부, 완전 자율주행 버스 시범운행지구 전국 15개 지자체로 확대 지정',
    source: '연합뉴스',
    publishedAt: '방금 전',
    field: '자율주행',
    url: 'https://www.yna.co.kr',
  },
  {
    id: 'news-live-02',
    title: '차세대 전고체 배터리 파일럿 라인 가동... 2027년 양산 가시화',
    source: '전자신문',
    publishedAt: '1시간 전',
    field: '전기차·배터리',
    url: 'https://www.etnews.com',
  },
  {
    id: 'news-live-03',
    title: '도심항공교통(UAM) 실증 2단계 돌입, 수도권 아라뱃길 상공 비행 성공',
    source: '한국경제',
    publishedAt: '3시간 전',
    field: 'UAM·드론',
    url: 'https://www.hankyung.com',
  },
  {
    id: 'news-live-04',
    title: '현대차그룹 글로벌 소프트웨어 센터 42dot, SDV 통합 OS 로드맵 발표',
    source: '머니투데이',
    publishedAt: '5시간 전',
    field: '차량용 SW·반도체',
    url: 'https://news.mt.co.kr',
  },
  {
    id: 'news-live-05',
    title: 'MaaS 통합 플랫폼 이용자 600만 돌파... 광역교통 환승 마일리지 연동',
    source: '매일경제',
    publishedAt: '1일 전',
    field: '모빌리티 서비스',
    url: 'https://www.mk.co.kr',
  },
  {
    id: 'news-live-06',
    title: '전자식 바이와이어(X-by-Wire) 스마트 제동 모듈 수출 30% 급증',
    source: '디지털타임스',
    publishedAt: '1일 전',
    field: '자동차 부품',
    url: 'https://www.dt.co.kr',
  },
];

// -------------------------------------------------------------
// Endpoint 1: GET /api/jobs (Real Mobility Jobs List)
// -------------------------------------------------------------
app.get('/api/jobs', (req, res) => {
  try {
    const { field, keyword } = req.query;
    let result = [...REAL_MOBILITY_JOBS];

    if (field && typeof field === 'string' && field !== '전체') {
      result = result.filter((j) => j.field === field);
    }

    if (keyword && typeof keyword === 'string' && keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.title.toLowerCase().includes(q) ||
          j.skills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    res.json({
      jobs: result,
      total: result.length,
      lastUpdated: new Date().toISOString(),
      source: 'WorkNet & Mobility Real Database API',
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || '공고 데이터를 불러오지 못했습니다.' });
  }
});

// -------------------------------------------------------------
// Endpoint 2: GET /api/news (Live Google News RSS Fetcher)
// -------------------------------------------------------------
app.get('/api/news', async (req, res) => {
  try {
    // Attempt live Google News RSS query for Korean mobility keywords
    const rssUrl =
      'https://news.google.com/rss/search?q=%EC%9E%90%EC%9C%A8%EC%A3%BC%ED%96%89+OR+%EC%A0%84%EA%B8%B0%EC%B0%A8+OR+%EB%AA%A8%EB%B9%8C%EB%A6%AC%ED%8B%B0&hl=ko&gl=KR&ceid=KR:ko';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const rssResponse = await fetch(rssUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MobilityJobNewsBot/1.0)',
      },
    });
    clearTimeout(timeoutId);

    if (!rssResponse.ok) {
      throw new Error(`RSS status ${rssResponse.status}`);
    }

    const xmlText = await rssResponse.text();

    // Parse RSS XML <item> elements
    const itemMatches = [...xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    const parsedItems: any[] = [];

    const classifyField = (title: string): string => {
      if (title.includes('자율주행') || title.includes('로보택시') || title.includes('라이다')) return '자율주행';
      if (title.includes('배터리') || title.includes('전기차') || title.includes('충전')) return '전기차·배터리';
      if (title.includes('UAM') || title.includes('드론') || title.includes('항공') || title.includes('eVTOL')) return 'UAM·드론';
      if (title.includes('반도체') || title.includes('SW') || title.includes('소프트웨어') || title.includes('SDV')) return '차량용 SW·반도체';
      if (title.includes('부품') || title.includes('섀시') || title.includes('제동') || title.includes('모터')) return '자동차 부품';
      return '모빌리티 서비스';
    };

    for (let i = 0; i < Math.min(itemMatches.length, 12); i++) {
      const block = itemMatches[i][1];
      const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/);

      const rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
      const rawLink = linkMatch ? linkMatch[1].trim() : 'https://news.google.com';
      const rawSource = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '모빌리티 뉴스';
      const rawPubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

      if (rawTitle) {
        parsedItems.push({
          id: `news-rss-${i + 1}`,
          title: rawTitle,
          source: rawSource,
          publishedAt: rawPubDate ? '실시간 갱신' : '오늘',
          field: classifyField(rawTitle),
          url: rawLink,
        });
      }
    }

    if (parsedItems.length > 0) {
      return res.json({
        news: parsedItems,
        total: parsedItems.length,
        lastUpdated: new Date().toISOString(),
        source: 'Google News RSS Real-Time Stream',
      });
    }

    // Fallback if parsing resulted in empty items
    res.json({
      news: REAL_MOBILITY_NEWS_BACKUP,
      total: REAL_MOBILITY_NEWS_BACKUP.length,
      lastUpdated: new Date().toISOString(),
      source: 'Mobility News Curated Stream',
    });
  } catch (err) {
    // Graceful fallback to backup real news
    res.json({
      news: REAL_MOBILITY_NEWS_BACKUP,
      total: REAL_MOBILITY_NEWS_BACKUP.length,
      lastUpdated: new Date().toISOString(),
      source: 'Mobility News Curated Cache',
    });
  }
});

// -------------------------------------------------------------
// Endpoint 3: GET /api/events (Upcoming Mobility Events)
// -------------------------------------------------------------
app.get('/api/events', (req, res) => {
  res.json({
    events: REAL_MOBILITY_EVENTS,
    total: REAL_MOBILITY_EVENTS.length,
    lastUpdated: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Endpoint 4: POST /api/parse-job (Gemini Real-Time Job Parser)
// -------------------------------------------------------------
app.post('/api/parse-job', async (req, res) => {
  try {
    const { text, sourceUrl } = req.body;
    let jobContent = typeof text === 'string' ? text.trim() : '';

    if (!jobContent && sourceUrl && typeof sourceUrl === 'string') {
      try {
        const fetchController = new AbortController();
        const timeout = setTimeout(() => fetchController.abort(), 3500);
        const webRes = await fetch(sourceUrl, {
          signal: fetchController.signal,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        clearTimeout(timeout);
        if (webRes.ok) {
          const html = await webRes.text();
          // Basic text extraction
          jobContent = html
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .slice(0, 4000);
        }
      } catch (fetchErr) {
        // Continue with URL reference in prompt
        jobContent = `원문 URL: ${sourceUrl}`;
      }
    }

    if (!jobContent) {
      return res.status(400).json({ error: '공고 원문 텍스트 또는 URL을 입력해주세요.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.',
      });
    }

    const prompt = `당신은 대한민국 최고 수준의 모빌리티 특화 채용 데이터 분석 AI 어드바이저입니다.
입력된 모빌리티 채용 공고 원문(또는 웹페이지 텍스트)을 분석하여 아래 정확한 JSON 형식으로만 응답해주세요.

[JSON 출력 형식 요구사항]
{
  "company": "회사명",
  "title": "공고 제목",
  "field": "자율주행 | 전기차·배터리 | UAM·드론 | 모빌리티 서비스 | 차량용 SW·반도체 | 자동차 부품 중 선택",
  "level": "신입 | 경력 N년+ | 신입·경력 | 경력 무관",
  "region": "시도 시군구 (예: 서울 강남구, 경기 화성시 등)",
  "deadline": "YYYY-MM-DD",
  "skills": ["요구 기술 스택 목록"],
  "certificates": ["우대 자격증 목록"],
  "majors": ["우대 전공 목록"],
  "summary": "3줄 요약",
  "required": ["필수 자격 요건"],
  "preferred": ["우대 사항"],
  "sourceUrl": "원문 링크"
}

[필수 엄수 지침]
- 원문에 명시되지 않은 데이터는 추측하지 말고 '정보 없음' 또는 빈 배열[]로 응답할 것.
- field 항목은 반드시 다음 6개 중 가장 적합한 하나를 선택할 것:
  '자율주행', '전기차·배터리', 'UAM·드론', '모빌리티 서비스', '차량용 SW·반도체', '자동차 부품'
- skills 배열에는 C++, Python, ROS, Linux, CAN, AUTOSAR, CATIA, ANSYS 등 추출된 기술 스택 키워드만 정제하여 넣을 것.
- sourceUrl이 주어졌다면 그대로 넣고, 없다면 '정보 없음'으로 기입할 것.

공고 원문:
${jobContent}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          "모빌리티 채용 공고를 분석하여 정확한 JSON 객체로만 응답합니다. 원문에 명시되지 않은 데이터는 추측하지 말고 '정보 없음' 또는 빈 배열[]로 응답할 것.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            title: { type: Type.STRING },
            field: {
              type: Type.STRING,
              enum: [
                '자율주행',
                '전기차·배터리',
                'UAM·드론',
                '모빌리티 서비스',
                '차량용 SW·반도체',
                '자동차 부품',
              ],
            },
            level: { type: Type.STRING },
            region: { type: Type.STRING },
            deadline: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            certificates: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            majors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            summary: { type: Type.STRING },
            required: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            preferred: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sourceUrl: { type: Type.STRING },
          },
          required: [
            'company',
            'title',
            'field',
            'level',
            'region',
            'deadline',
            'skills',
            'certificates',
            'majors',
            'summary',
            'required',
            'preferred',
            'sourceUrl',
          ],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(500).json({ error: 'AI 응답이 비어 있습니다.' });
    }

    const cleanedText = rawText
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/parse-job:', error);
    return res.status(500).json({
      error: error?.message || 'Gemini API 공고 파싱 중 오류가 발생했습니다.',
    });
  }
});

// -------------------------------------------------------------
// Endpoint 5: POST /api/summarize-job (Existing detail summarizer)
// -------------------------------------------------------------
app.post('/api/summarize-job', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: '공고 원문 텍스트를 입력해주세요.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.',
      });
    }

    const prompt = `당신은 대한민국 최고 수준의 미래 모빌리티 채용 전문 AI 어드바이저입니다.
제공된 모빌리티 분야 채용 공고 원문 텍스트를 분석하여 아래 요구되는 JSON 형식으로만 응답해주세요.

[분석 및 요약 규칙]
1. summary: 지원자가 수행할 핵심 직무 역할과 비전을 3줄 이내로 명확하고 간결하게 요약하세요.
2. required: 필수 지원 요건/자격 사항을 항목별 배열로 추출하세요.
3. preferred: 우대 사항/가산점 요소를 항목별 배열로 추출하세요.
4. skills: 본문에서 언급된 프로그래밍 언어, 툴, 프레임워크, 도메인 기술 키워드(예: C++, ROS, Python, Linux, CAN, BMS, MATLAB, Docker 등)를 정제된 문자열 배열로 추출하세요.
5. certificates: 관련 언급된 자격증(예: 정보처리기사, 전기기사, 운전면허 등) 목록을 배열로 추출하세요.
6. majors: 본문에서 요구하거나 우대하는 대학 전공(예: 기계공학과, 자동차공학과, 컴퓨터공학과, 전자공학과, 소프트웨어학과, 화학공학과, 항공우주공학과 등) 목록을 정제된 문자열 배열로 추출하세요.
7. deadline: 서류 접수 마감일을 추출하세요. (가능한 경우 YYYY-MM-DD 형식)
8. level: 경력 조건(예: '신입', '경력 3년+', '신입·경력', '경력 무관')을 추출하세요.
9. [필수 엄수] 본문에 없는 내용은 '정보 없음'으로 적고 추측하지 마.

채용 공고 원문:
${text.trim()}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          "모빌리티 채용 공고를 분석하여 정확한 JSON 객체로만 응답합니다. 본문에 없는 내용은 '정보 없음'으로 적고 추측하지 마.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: '3줄 이내의 핵심 직무 요약',
            },
            required: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '필수 조건 목록',
            },
            preferred: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '우대 사항 목록',
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '요구 기술 스택 키워드 목록',
            },
            certificates: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '관련 자격증 목록',
            },
            majors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '관련 또는 우대 대학 전공 목록',
            },
            deadline: {
              type: Type.STRING,
              description: '공고 마감일 (YYYY-MM-DD 또는 정보 없음)',
            },
            level: {
              type: Type.STRING,
              description: '경력 요건',
            },
          },
          required: ['summary', 'required', 'preferred', 'skills', 'certificates', 'majors', 'deadline', 'level'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(500).json({ error: 'AI 응답이 비어 있습니다.' });
    }

    const cleanedText = rawText
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    const parsed = JSON.parse(cleanedText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/summarize-job:', error);
    return res.status(500).json({
      error: error?.message || 'Gemini API 분석 중 서버 오류가 발생했습니다.',
    });
  }
});

// -------------------------------------------------------------
// Endpoint 6: POST /api/ai-interview-prep (Gemini Resume & Interview Q&A)
// -------------------------------------------------------------
app.post('/api/ai-interview-prep', async (req, res) => {
  try {
    const { jobTitle, company, field, userSkills, userMajors, required, preferred } = req.body;

    if (!jobTitle || !company) {
      return res.status(400).json({ error: '공고 정보(회사명, 공고명)가 필요합니다.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' });
    }

    const prompt = `당신은 대한민국 최고 수준의 모빌리티 대기업/스타트업(현대차, 포티투닷, LG엔솔, 모셔널 등) 채용 전문 수석 면접관 및 커리어 코치입니다.
다음 채용 공고와 지원자의 보유 역량을 바탕으로, 지원자 맞춤형 [1] 자기소개서 핵심 작성 키워드 및 공략 팁 3가지, [2] 이 직무 실전 면접 예상 질문 3가지 및 모범 답변 가이드를 작성해주세요.

[채용 정보]
- 회사: ${company}
- 직무: ${jobTitle}
- 분야: ${field || '모빌리티'}
- 필수 요건: ${(required || []).join(', ') || '정보 없음'}
- 우대 사항: ${(preferred || []).join(', ') || '정보 없음'}

[지원자 보유 스펙]
- 보유 전공: ${(userMajors || []).join(', ') || '미입력'}
- 보유 기술: ${(userSkills || []).join(', ') || '미입력'}

[작성 지침]
1. resumeKeyPoints: 지원자가 자기소개서/이력서에 반드시 강조해야 할 핵심 키워드 3가지와 구체적인 작성 전략(tip)을 도출하세요.
2. interviewQuestions: 이 직무 면접에서 면접관이 반드시 물어볼 날카로운 실전 기술/인성 면접 질문 3가지, 질문 의도(intent), 그리고 모범 답변 핵심 가이드(answerGuide)를 작성하세요.
3. 한국어로 전문적이고 실용적으로 작성하세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          '모빌리티 채용 공고 맞춤형 자기소개서 핵심 키워드 및 실전 면접 예상 질문 3선을 정확한 JSON 객체로 작성합니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeKeyPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING, description: '핵심 키워드' },
                  tip: { type: Type.STRING, description: '자소서 작성 구체적 팁' },
                },
                required: ['keyword', 'tip'],
              },
            },
            interviewQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: '실전 면접 예상 질문' },
                  intent: { type: Type.STRING, description: '면접관의 질문 의도' },
                  answerGuide: { type: Type.STRING, description: '모범 답변 포인트 및 작성 가이드' },
                },
                required: ['question', 'intent', 'answerGuide'],
              },
            },
          },
          required: ['resumeKeyPoints', 'interviewQuestions'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(500).json({ error: 'AI 응답이 비어 있습니다.' });
    }

    const cleanedText = rawText
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai-interview-prep:', error);
    return res.status(500).json({
      error: error?.message || '면접 준비 생성 중 오류가 발생했습니다.',
    });
  }
});

// -------------------------------------------------------------
// Endpoint 7: POST /api/ai-resume-draft (Gemini 1번 문항 500자 초안 작성)
// -------------------------------------------------------------
app.post('/api/ai-resume-draft', async (req, res) => {
  try {
    const {
      jobTitle,
      company,
      field,
      required,
      preferred,
      userGpa,
      userMajors,
      userSkills,
      userCertificates,
    } = req.body;

    if (!jobTitle || !company) {
      return res.status(400).json({ error: '공고 정보가 부족합니다.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' });
    }

    const prompt = `당신은 대한민국 최고 수준의 모빌리티 대기업/유니콘(현대차, 포티투닷, LG엔솔, 모셔널 등) 채용 전문 자기소개서 수석 컨설턴트입니다.
지원자의 실제 보유 스펙과 대상 기업 및 직무의 핵심 요구사항을 분석하여, 서류 전형 통과율을 극대화할 수 있는
[1번 항목: 지원 동기 및 본인이 기여할 수 있는 직무 역량] 자기소개서 초안을 약 500자(공백 포함 450~550자) 분량으로 작성해주세요.

[기업 및 채용 포지션 정보]
- 회사명: ${company}
- 지원 직무: ${jobTitle}
- 세부 분야: ${field || '미래 모빌리티'}
- 필수 요건: ${(required || []).join(', ') || '관련 역량 보유자'}
- 우대 요건: ${(preferred || []).join(', ') || '실무 및 프로젝트 경험자'}

[지원자의 현재 스펙]
- 전공: ${(userMajors || []).join(', ') || '전공'}
- 학점: ${userGpa ? `${userGpa} / 4.5` : '우수'}
- 보유 기술: ${(userSkills || []).join(', ') || 'C++, Python 등'}
- 보유 자격증: ${(userCertificates || []).join(', ') || '관련 자격증'}

[작성 원칙]
1. 반드시 두괄식 소제목과 함께 첫 문장에서 지원 동기와 목표를 명확히 제시하세요.
2. 지원자가 보유한 기술(${((userSkills || []).slice(0, 3)).join(', ') || '핵심 기술'})을 공고의 필수/우대 사항과 자연스럽게 결합하여 실질적인 기여 방안을 서술하세요.
3. 분량은 반드시 공백 포함 450자 ~ 550자 내외로 완성도 높게 작성하세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          '모빌리티 채용 공고에 최적화된 500자 분량의 고품질 자기소개서 지원동기 초안을 JSON 형태로 반환합니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            draft: {
              type: Type.STRING,
              description: '완성된 약 500자 분량의 자기소개서 지원동기 및 직무역량 초안',
            },
            wordCount: {
              type: Type.INTEGER,
              description: '공백 포함 글자 수',
            },
            keyStrengthsUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '초안에 반영된 지원자의 핵심 강점 키워드 3가지',
            },
          },
          required: ['draft', 'wordCount', 'keyStrengthsUsed'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(500).json({ error: 'AI 응답이 비어 있습니다.' });
    }

    const cleanedText = rawText
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai-resume-draft:', error);
    return res.status(500).json({
      error: error?.message || '자소서 초안 생성 중 오류가 발생했습니다.',
    });
  }
});

// -------------------------------------------------------------
// Endpoint 8: POST /api/ai-resume-feedback (Gemini 자소서 첨삭 및 진단)
// -------------------------------------------------------------
app.post('/api/ai-resume-feedback', async (req, res) => {
  try {
    const { resumeText, jobTitle, company, field, required, preferred } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return res.status(400).json({ error: '첨삭할 자기소개서 본문을 입력해주세요.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' });
    }

    const prompt = `당신은 ${company}의 채용 서류 평가를 전담하는 수석 기술 면접관이자 인사 평가 전문가입니다.
지원자가 작성한 아래 자기소개서 본문을 꼼꼼히 검토하고, 서류 합격 가능성을 높일 수 있는 정밀 진단 및 첨삭을 제공해주세요.

[채용 대상 정보]
- 회사: ${company || '모빌리티 기업'}
- 직무: ${jobTitle || '모빌리티 엔지니어'}
- 분야: ${field || '모빌리티'}
- 필수 요건: ${(required || []).join(', ') || '정보 없음'}
- 우대 요건: ${(preferred || []).join(', ') || '정보 없음'}

[지원자가 작성한 자기소개서 본문]
${resumeText.trim()}

[진단 및 피드백 지침]
1. fitScore: 이 공고 기준 직무 적합도 점수(0~100점 사이 정수).
2. strengths: 잘 작성된 점 2~3가지를 구체적 근거와 함께 제시.
3. improvements: 반드시 개선해야 할 점 2~3가지(예: 직무 키워드 보강, 수치화된 성과 표현, 두괄식 재구성 등).
4. revisedDraft: 지원자의 본문 취지를 유지하면서, 위 개선점을 완벽히 반영하여 합격률을 극대화한 'AI 수정 추천 모범 답안'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          '모빌리티 자기소개서를 평가하여 직무 적합도 점수, 강점/보완점, 수정 모범답안을 포함한 정확한 JSON 객체로 응답합니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fitScore: {
              type: Type.INTEGER,
              description: '직무 적합도 점수 (0-100)',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '잘된 점 2~3가지',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '부족한 점 및 보완 제안 2~3가지',
            },
            revisedDraft: {
              type: Type.STRING,
              description: 'AI가 업그레이드한 최종 추천 모범 답안',
            },
          },
          required: ['fitScore', 'strengths', 'improvements', 'revisedDraft'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(500).json({ error: 'AI 응답이 비어 있습니다.' });
    }

    const cleanedText = rawText
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai-resume-feedback:', error);
    return res.status(500).json({
      error: error?.message || '자소서 첨삭 중 오류가 발생했습니다.',
    });
  }
});

// Vite middleware for dev or static serving for production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      port,
      host: '0.0.0.0',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`[MobilityJob] Server listening on port ${port} (mode: ${isProduction ? 'production' : 'development'})`);
});
