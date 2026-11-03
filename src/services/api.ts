/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, NewsItem, CalendarEvent, SAMPLE_JOBS, SAMPLE_NEWS, SAMPLE_EVENTS } from '../data';

export interface NotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO or formatted
  read: boolean;
  jobId?: string;
  type: 'deadline' | 'new_job' | 'system' | 'custom';
}

const STORAGE_KEYS = {
  REAL_JOBS_CACHE: 'mobility_job_real_jobs_cache_v2',
  REAL_NEWS_CACHE: 'mobility_job_real_news_cache_v2',
  REAL_EVENTS_CACHE: 'mobility_job_real_events_cache_v2',
  USER_ADDED_JOBS: 'mobility_job_user_added_jobs_v2',
  NOTIFICATIONS_HISTORY: 'mobility_job_notifications_history_v2',
  LAST_SYNC_TIME: 'mobility_job_last_sync_time_v2',
};

// Initial Notification Seeds if none exist
const DEFAULT_NOTIFICATIONS: NotificationHistoryItem[] = [
  {
    id: 'noti-01',
    title: '마감 임박 공고 안내',
    message: '[오토노머스에이투지] 자율주행 라이다/레이더 센서퓨전 및 인지 알고리즘 엔지니어 공고 서류 마감이 2일 남았습니다.',
    timestamp: '오늘 09:30',
    read: false,
    jobId: 'job-01',
    type: 'deadline',
  },
  {
    id: 'noti-02',
    title: '맞춤 신규 공고 추천',
    message: '등록하신 보유 기술(C++, ROS, Python)과 90% 이상 일치하는 신규 자율주행 공고가 등록되었습니다.',
    timestamp: '어제 17:15',
    read: false,
    jobId: 'job-04',
    type: 'new_job',
  },
  {
    id: 'noti-03',
    title: '모빌리티 채용박람회 안내',
    message: '이번 주 금요일 2026 대한민국 모빌리티 잡페어 & 채용설명회가 개최됩니다.',
    timestamp: '2일 전',
    read: true,
    type: 'system',
  },
];

// Helper to format friendly relative or date time
export function formatFriendlyTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return '방금 전';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  } catch {
    return '방금 전';
  }
}

// -------------------------------------------------------------
// 1. Fetching Functions (Jobs, News, Events)
// -------------------------------------------------------------

/**
 * Fetch Jobs from real API / backend service with cache fallback
 */
export async function fetchJobs(
  forceRefresh = false
): Promise<{ jobs: Job[]; lastUpdated: string; fromCache: boolean }> {
  // 1. Check local cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.REAL_JOBS_CACHE);
      const userAdded = getUserAddedJobs();
      if (cached) {
        const parsed = JSON.parse(cached) as Job[];
        const combined = mergeJobsWithUserAdded(parsed, userAdded);
        const lastSync = getLastSyncTime() || new Date().toISOString();
        return { jobs: combined, lastUpdated: lastSync, fromCache: true };
      }
    } catch (e) {
      console.warn('Cache read error for jobs:', e);
    }
  }

  // 2. Fetch from backend /api/jobs
  try {
    const res = await fetch('/api/jobs');
    if (!res.ok) {
      throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
    }
    const data = await res.json();
    const fetchedJobs: Job[] = data.jobs || data;

    // Cache the fetched jobs
    localStorage.setItem(STORAGE_KEYS.REAL_JOBS_CACHE, JSON.stringify(fetchedJobs));
    const nowIso = new Date().toISOString();
    setLastSyncTime(nowIso);

    const userAdded = getUserAddedJobs();
    const combined = mergeJobsWithUserAdded(fetchedJobs, userAdded);

    return { jobs: combined, lastUpdated: nowIso, fromCache: false };
  } catch (error) {
    console.warn('Failed to fetch jobs from API, falling back to base dataset:', error);

    // Fallback: Use base sample jobs + user added jobs
    const userAdded = getUserAddedJobs();
    const fallbackJobs = mergeJobsWithUserAdded(SAMPLE_JOBS, userAdded);
    const nowIso = new Date().toISOString();

    // Store in cache so app continues working
    try {
      localStorage.setItem(STORAGE_KEYS.REAL_JOBS_CACHE, JSON.stringify(SAMPLE_JOBS));
      setLastSyncTime(nowIso);
    } catch (e) {
      console.error(e);
    }

    return { jobs: fallbackJobs, lastUpdated: nowIso, fromCache: true };
  }
}

/**
 * Fetch News from live RSS feed / backend service with cache fallback
 */
export async function fetchNews(
  forceRefresh = false
): Promise<{ news: NewsItem[]; lastUpdated: string; fromCache: boolean }> {
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.REAL_NEWS_CACHE);
      if (cached) {
        const parsed = JSON.parse(cached) as NewsItem[];
        const lastSync = getLastSyncTime() || new Date().toISOString();
        return { news: parsed, lastUpdated: lastSync, fromCache: true };
      }
    } catch (e) {
      console.warn('Cache read error for news:', e);
    }
  }

  try {
    const res = await fetch('/api/news');
    if (!res.ok) {
      throw new Error(`뉴스 서버 응답 오류 (HTTP ${res.status})`);
    }
    const data = await res.json();
    const fetchedNews: NewsItem[] = data.news || data;

    localStorage.setItem(STORAGE_KEYS.REAL_NEWS_CACHE, JSON.stringify(fetchedNews));
    const nowIso = new Date().toISOString();

    return { news: fetchedNews, lastUpdated: nowIso, fromCache: false };
  } catch (error) {
    console.warn('Failed to fetch live news, falling back to base news dataset:', error);
    const nowIso = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.REAL_NEWS_CACHE, JSON.stringify(SAMPLE_NEWS));
    } catch (e) {
      console.error(e);
    }
    return { news: SAMPLE_NEWS, lastUpdated: nowIso, fromCache: true };
  }
}

/**
 * Fetch Events from backend service / calendar events
 */
export async function fetchEvents(
  forceRefresh = false
): Promise<{ events: CalendarEvent[]; lastUpdated: string; fromCache: boolean }> {
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.REAL_EVENTS_CACHE);
      if (cached) {
        const parsed = JSON.parse(cached) as CalendarEvent[];
        const lastSync = getLastSyncTime() || new Date().toISOString();
        return { events: parsed, lastUpdated: lastSync, fromCache: true };
      }
    } catch (e) {
      console.warn('Cache read error for events:', e);
    }
  }

  try {
    const res = await fetch('/api/events');
    if (!res.ok) {
      throw new Error(`이벤트 서버 응답 오류 (HTTP ${res.status})`);
    }
    const data = await res.json();
    const fetchedEvents: CalendarEvent[] = data.events || data;

    localStorage.setItem(STORAGE_KEYS.REAL_EVENTS_CACHE, JSON.stringify(fetchedEvents));
    const nowIso = new Date().toISOString();

    return { events: fetchedEvents, lastUpdated: nowIso, fromCache: false };
  } catch (error) {
    console.warn('Failed to fetch events from API, falling back to base events:', error);
    const nowIso = new Date().toISOString();
    return { events: SAMPLE_EVENTS, lastUpdated: nowIso, fromCache: true };
  }
}

// -------------------------------------------------------------
// 2. Gemini API Real-time Parsing for pasted text / URL
// -------------------------------------------------------------

export interface GeminiParsedJobResponse {
  company: string;
  title: string;
  field: '자율주행' | '전기차·배터리' | 'UAM·드론' | '모빌리티 서비스' | '차량용 SW·반도체' | '자동차 부품';
  level: string;
  region: string;
  deadline: string;
  skills: string[];
  certificates: string[];
  majors: string[];
  summary: string;
  required: string[];
  preferred: string[];
  sourceUrl: string;
}

/**
 * Call server-side Gemini API endpoint to parse job posting text or URL
 */
export async function parseJobPostingWithGemini(
  text: string,
  sourceUrl?: string
): Promise<Job> {
  const res = await fetch('/api/parse-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sourceUrl }),
  });

  if (!res.ok) {
    let errorMsg = 'AI 공고 파싱 중 오류가 발생했습니다.';
    try {
      const errData = await res.json();
      if (errData?.error) errorMsg = errData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const parsed: GeminiParsedJobResponse = await res.json();

  // Map into complete Job model
  const newJob: Job = {
    id: `job-ai-${Date.now()}`,
    company: parsed.company || '모빌리티 기업',
    title: parsed.title || '모빌리티 엔지니어 채용',
    field: parsed.field || '자율주행',
    level: (parsed.level as any) || '신입·경력',
    region: parsed.region || '서울 강남구',
    deadline: parsed.deadline || '2026-12-31',
    skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : ['C++', 'Python'],
    certificates: Array.isArray(parsed.certificates) ? parsed.certificates : [],
    majors: Array.isArray(parsed.majors) ? parsed.majors : [],
    summary: parsed.summary || '공고 본문 내용이 성공적으로 요약되었습니다.',
    required: Array.isArray(parsed.required) && parsed.required.length > 0 ? parsed.required : ['관련 분야 전공 또는 유관 경력 보유자'],
    preferred: Array.isArray(parsed.preferred) ? parsed.preferred : [],
    sourceUrl: parsed.sourceUrl || sourceUrl || 'https://careers.example.com',
  };

  return newJob;
}

// -------------------------------------------------------------
// 3. User Added Jobs (Persistent LocalStorage)
// -------------------------------------------------------------

export function getUserAddedJobs(): Job[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_ADDED_JOBS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveUserAddedJob(job: Job): Job[] {
  try {
    const current = getUserAddedJobs();
    const updated = [job, ...current.filter((j) => j.id !== job.id)];
    localStorage.setItem(STORAGE_KEYS.USER_ADDED_JOBS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save user added job:', e);
    return [];
  }
}

export function deleteUserAddedJob(jobId: string): Job[] {
  try {
    const current = getUserAddedJobs();
    const updated = current.filter((j) => j.id !== jobId);
    localStorage.setItem(STORAGE_KEYS.USER_ADDED_JOBS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function mergeJobsWithUserAdded(baseJobs: Job[], userAdded: Job[]): Job[] {
  const userAddedIds = new Set(userAdded.map((j) => j.id));
  const filteredBase = baseJobs.filter((j) => !userAddedIds.has(j.id));
  return [...userAdded, ...filteredBase];
}

// -------------------------------------------------------------
// 4. Notification History Storage (Inbox)
// -------------------------------------------------------------

export function getNotificationsHistory(): NotificationHistoryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_HISTORY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Seed initial notifications
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS_HISTORY,
      JSON.stringify(DEFAULT_NOTIFICATIONS)
    );
    return DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function addNotificationHistory(
  item: Omit<NotificationHistoryItem, 'id' | 'timestamp' | 'read'>
): NotificationHistoryItem[] {
  try {
    const current = getNotificationsHistory();
    const newItem: NotificationHistoryItem = {
      ...item,
      id: `noti-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: '방금 전',
      read: false,
    };
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function markNotificationAsRead(id: string): NotificationHistoryItem[] {
  try {
    const current = getNotificationsHistory();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function markAllNotificationsAsRead(): NotificationHistoryItem[] {
  try {
    const current = getNotificationsHistory();
    const updated = current.map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllNotifications(): NotificationHistoryItem[] {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_HISTORY, JSON.stringify([]));
    return [];
  } catch {
    return [];
  }
}

// -------------------------------------------------------------
// 5. Sync Timestamp
// -------------------------------------------------------------

export function getLastSyncTime(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
  } catch {
    return null;
  }
}

export function setLastSyncTime(timeIso: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, timeIso);
  } catch (e) {
    console.error(e);
  }
}

// -------------------------------------------------------------
// 6. Gemini Interview & Resume Prep Service
// -------------------------------------------------------------

export interface ResumeKeyPoint {
  keyword: string;
  tip: string;
}

export interface InterviewQuestionItem {
  question: string;
  intent: string;
  answerGuide: string;
}

export interface AiInterviewPrepResponse {
  resumeKeyPoints: ResumeKeyPoint[];
  interviewQuestions: InterviewQuestionItem[];
}

export async function fetchAiInterviewPrep(params: {
  jobTitle: string;
  company: string;
  field: string;
  userSkills?: string[];
  userMajors?: string[];
  required?: string[];
  preferred?: string[];
}): Promise<AiInterviewPrepResponse> {
  const res = await fetch('/api/ai-interview-prep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let msg = 'AI 자소서/면접 질문 생성 중 오류가 발생했습니다.';
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }

  return await res.json();
}

// -------------------------------------------------------------
// 7. Gemini Resume Draft & Feedback Service
// -------------------------------------------------------------

export interface AiResumeDraftResponse {
  draft: string;
  wordCount: number;
  keyStrengthsUsed: string[];
}

export interface AiResumeFeedbackResponse {
  fitScore: number;
  strengths: string[];
  improvements: string[];
  revisedDraft: string;
}

export async function fetchAiResumeDraft(params: {
  jobTitle: string;
  company: string;
  field: string;
  required?: string[];
  preferred?: string[];
  userGpa?: string;
  userMajors?: string[];
  userSkills?: string[];
  userCertificates?: string[];
}): Promise<AiResumeDraftResponse> {
  const res = await fetch('/api/ai-resume-draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let msg = '자소서 초안 생성 중 오류가 발생했습니다.';
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }

  return await res.json();
}

export async function fetchAiResumeFeedback(params: {
  resumeText: string;
  jobTitle: string;
  company: string;
  field: string;
  required?: string[];
  preferred?: string[];
}): Promise<AiResumeFeedbackResponse> {
  const res = await fetch('/api/ai-resume-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let msg = '자소서 첨삭 및 진단 중 오류가 발생했습니다.';
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }

  return await res.json();
}

