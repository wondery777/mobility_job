import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronLeft,
  Share2,
  RefreshCw,
  FileText,
  Send,
  Loader2,
  Check,
  Target,
  Wrench,
  GraduationCap,
  Copy,
  CheckCheck,
  HelpCircle,
  MessageSquareQuote,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import { Job, MOBILITY_FIELDS } from '../data';
import { calculateDday } from './JobCard';
import { getFieldIcon } from './FieldIcons';
import { fetchAiInterviewPrep, AiInterviewPrepResponse } from '../services/api';
import { AiResumeAssistantModal } from './AiResumeAssistantModal';

export interface AISummaryResult {
  summary: string;
  required: string[];
  preferred: string[];
  skills: string[];
  certificates: string[];
  majors?: string[];
  deadline: string;
  level: string;
  analyzedAt?: string;
}

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
  mySkills: string[];
  myCertificates: string[];
  myMajors?: string[];
  userGpa?: string;
  onOpenSourceUrl: (url: string, title: string) => void;
  viewMode?: 'mobile' | 'web';
}

const AI_CACHE_KEY = 'mobility_job_ai_cache_v1';
const PREP_CACHE_KEY = 'mobility_job_prep_cache_v1';

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  isBookmarked,
  onToggleBookmark,
  mySkills,
  myCertificates,
  myMajors = [],
  userGpa = '3.85',
  onOpenSourceUrl,
  viewMode = 'mobile',
}) => {
  if (!job) return null;

  // AI Analysis states
  const [inputText, setInputText] = useState('');
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AISummaryResult | null>(null);
  const [isCachedResult, setIsCachedResult] = useState(false);

  // Gemini AI Resume Assistant Modal State
  const [isResumeAssistantOpen, setIsResumeAssistantOpen] = useState(false);

  // AI Interview & Resume Prep states
  const [interviewPrep, setInterviewPrep] = useState<AiInterviewPrepResponse | null>(null);
  const [isPrepLoading, setIsPrepLoading] = useState(false);
  const [prepErrorMsg, setPrepErrorMsg] = useState<string | null>(null);
  const [copiedKeyIdx, setCopiedKeyIdx] = useState<number | null>(null);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  // Initialize input text with sample job's full descriptive content
  useEffect(() => {
    if (!job) return;

    const defaultFullText = `[${job.company}] ${job.title}
분야: ${job.field} | 근무지: ${job.region} | 경력: ${job.level} | 마감일: ${job.deadline}
${job.salary ? `처우: ${job.salary}` : ''}
${job.department ? `소속 부서: ${job.department}` : ''}

[주요 업무 및 직무 요약]
${job.summary}

[자격 요건]
${job.required.map((r) => `- ${r}`).join('\n')}

[우대 사항]
${job.preferred.map((p) => `- ${p}`).join('\n')}

[요구 기술 스택]
${job.skills.join(', ')}

[관련 자격증]
${(job.certificates || []).join(', ')}

[관련/우대 전공]
${(job.majors || []).join(', ')}`;

    setInputText(defaultFullText);

    // Check LocalStorage cache for this job ID
    try {
      const cacheRaw = localStorage.getItem(AI_CACHE_KEY);
      if (cacheRaw) {
        const cacheMap: Record<string, AISummaryResult> = JSON.parse(cacheRaw);
        if (cacheMap[job.id]) {
          setAiResult(cacheMap[job.id]);
          setIsCachedResult(true);
          setErrorMsg(null);
        } else {
          setAiResult(null);
          setIsCachedResult(false);
          setErrorMsg(null);
        }
      } else {
        setAiResult(null);
        setIsCachedResult(false);
        setErrorMsg(null);
      }
    } catch (e) {
      console.error('Error reading AI cache', e);
      setAiResult(null);
    }

    // Check LocalStorage cache for Interview Prep
    try {
      const prepCacheRaw = localStorage.getItem(PREP_CACHE_KEY);
      if (prepCacheRaw) {
        const prepMap: Record<string, AiInterviewPrepResponse> = JSON.parse(prepCacheRaw);
        if (prepMap[job.id]) {
          setInterviewPrep(prepMap[job.id]);
          setPrepErrorMsg(null);
        } else {
          setInterviewPrep(null);
          setPrepErrorMsg(null);
        }
      } else {
        setInterviewPrep(null);
        setPrepErrorMsg(null);
      }
    } catch (e) {
      console.error('Error reading prep cache', e);
      setInterviewPrep(null);
    }
  }, [job]);

  // Execute Gemini AI analysis
  const handleAnalyzeJob = async (forceRefresh = false) => {
    if (!inputText.trim()) {
      setErrorMsg('분석할 채용 공고 원문 텍스트를 입력해주세요.');
      return;
    }

    // Check cache first if not forced refresh
    if (!forceRefresh) {
      try {
        const cacheRaw = localStorage.getItem(AI_CACHE_KEY);
        if (cacheRaw) {
          const cacheMap: Record<string, AISummaryResult> = JSON.parse(cacheRaw);
          if (cacheMap[job.id]) {
            setAiResult(cacheMap[job.id]);
            setIsCachedResult(true);
            setErrorMsg(null);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/summarize-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `서버 오류 (${response.status})`);
      }

      // Validate required fields
      if (!data || typeof data.summary !== 'string') {
        throw new Error('AI 응답 형식이 올바르지 않습니다.');
      }

      const structuredResult: AISummaryResult = {
        summary: data.summary || '정보 없음',
        required: Array.isArray(data.required) ? data.required : [],
        preferred: Array.isArray(data.preferred) ? data.preferred : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        certificates: Array.isArray(data.certificates) ? data.certificates : [],
        majors: Array.isArray(data.majors) ? data.majors : [],
        deadline: data.deadline || '정보 없음',
        level: data.level || '정보 없음',
        analyzedAt: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setAiResult(structuredResult);
      setIsCachedResult(false);

      // Save to localStorage cache
      try {
        const cacheRaw = localStorage.getItem(AI_CACHE_KEY);
        const cacheMap: Record<string, AISummaryResult> = cacheRaw
          ? JSON.parse(cacheRaw)
          : {};
        cacheMap[job.id] = structuredResult;
        localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cacheMap));
      } catch (err) {
        console.error('Failed to save to AI cache', err);
      }
    } catch (err: any) {
      console.error('AI Summarization failed:', err);
      setErrorMsg(
        err.message ||
          '공고 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Gemini Resume Key Points & Interview Prep
  const handleGenerateInterviewPrep = async (forceRefresh = false) => {
    if (!forceRefresh && interviewPrep) return;

    setIsPrepLoading(true);
    setPrepErrorMsg(null);

    try {
      const data = await fetchAiInterviewPrep({
        jobTitle: job.title,
        company: job.company,
        field: job.field,
        userSkills: mySkills,
        userMajors: myMajors,
        required: activeRequired,
        preferred: activePreferred,
      });

      if (!data || !Array.isArray(data.resumeKeyPoints) || !Array.isArray(data.interviewQuestions)) {
        throw new Error('AI 분석 결과 형식이 올바르지 않습니다.');
      }

      setInterviewPrep(data);

      // Save to localStorage
      try {
        const prepCacheRaw = localStorage.getItem(PREP_CACHE_KEY);
        const prepMap = prepCacheRaw ? JSON.parse(prepCacheRaw) : {};
        prepMap[job.id] = data;
        localStorage.setItem(PREP_CACHE_KEY, JSON.stringify(prepMap));
      } catch (e) {
        console.error('Failed to save prep cache', e);
      }
    } catch (err: any) {
      console.error('Interview prep generation failed:', err);
      setPrepErrorMsg(err?.message || '면접 준비 데이터를 생성하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsPrepLoading(false);
    }
  };

  const handleCopyText = (text: string, idx?: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (idx !== undefined) {
        setCopiedKeyIdx(idx);
        setTimeout(() => setCopiedKeyIdx(null), 2000);
      }
    }
  };

  const dDayInfo = calculateDday(job.deadline);
  const fieldDef = MOBILITY_FIELDS.find((f) => f.name === job.field);

  // Helper for flexible trimmed case-insensitive matching
  const isCompetencyMatched = (target: string, userList: string[]): boolean => {
    if (!target || !userList || userList.length === 0) return false;
    const t = target.trim().toLowerCase();
    return userList.some((my) => {
      const u = my.trim().toLowerCase();
      return u === t || t.includes(u) || u.includes(t);
    });
  };

  // Active skills & requirements to display (use AI result if available, otherwise original job)
  const activeSummary = aiResult ? aiResult.summary : job.summary;
  const activeSkills =
    aiResult && aiResult.skills.length > 0 ? aiResult.skills : job.skills;
  const activeRequired =
    aiResult && aiResult.required.length > 0 ? aiResult.required : job.required;
  const activePreferred =
    aiResult && aiResult.preferred.length > 0 ? aiResult.preferred : job.preferred;
  const activeCertificates =
    aiResult && aiResult.certificates.length > 0
      ? aiResult.certificates
      : job.certificates || [];
  const activeMajors =
    aiResult && aiResult.majors && aiResult.majors.length > 0
      ? aiResult.majors
      : job.majors || [];

  // Skill matching calculations
  const matchedSkills = activeSkills.filter((sk) =>
    isCompetencyMatched(sk, mySkills)
  );
  const missingSkills = activeSkills.filter(
    (sk) => !isCompetencyMatched(sk, mySkills)
  );
  const skillMatchPercentage =
    activeSkills.length > 0
      ? Math.round((matchedSkills.length / activeSkills.length) * 100)
      : 100;

  // Major matching calculations
  const matchedMajors = activeMajors.filter((m) =>
    isCompetencyMatched(m, myMajors)
  );
  const missingMajors = activeMajors.filter(
    (m) => !isCompetencyMatched(m, myMajors)
  );

  // Certificate matching calculations
  const matchedCertificates = activeCertificates.filter((cert) =>
    isCompetencyMatched(cert, myCertificates)
  );
  const missingCertificates = activeCertificates.filter(
    (cert) => !isCompetencyMatched(cert, myCertificates)
  );
  const certMatchPercentage =
    activeCertificates.length > 0
      ? Math.round((matchedCertificates.length / activeCertificates.length) * 100)
      : 100;

  // Overall Total Competency Matching Percentage (Skills + Certificates + Major fit)
  const totalCompetencyItems =
    activeSkills.length +
    activeCertificates.length +
    (activeMajors.length > 0 ? 1 : 0);
  const majorBonus = activeMajors.length > 0 && matchedMajors.length > 0 ? 1 : 0;
  const totalMatchedCompetencies =
    matchedSkills.length + matchedCertificates.length + majorBonus;
  const overallMatchPercentage =
    totalCompetencyItems > 0
      ? Math.round((totalMatchedCompetencies / totalCompetencyItems) * 100)
      : skillMatchPercentage;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `[MobilityJob] ${job.company} - ${job.title} 공고를 확인해보세요!`
      );
      alert('공고 링크 정보가 클립보드에 복사되었습니다.');
    }
  };

  // Spec Benchmark calculation
  const benchmark = job.benchmark || {
    avgGpa: 3.75,
    avgCertCount: 2,
    avgSkillMatch: 75,
    passingRateTip: '이 직무는 관련 실무 프로젝트 경험과 핵심 라이브러리 활용 역량을 증빙할 때 서류 통과율이 크게 상승합니다.',
  };
  const myGpaNum = parseFloat(userGpa || '3.85') || 3.85;
  const myCertCount = myCertificates.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Mobile / Web responsive container wrapper */}
      <div
        className={`relative w-full ${
          viewMode === 'web' ? 'max-w-2xl sm:max-w-3xl' : 'max-w-[440px]'
        } h-full sm:h-[94vh] bg-white dark:bg-slate-900 sm:rounded-[20px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all`}
      >
        
        {/* Navigation Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3.5 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xs font-semibold">이전</span>
          </button>

          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[190px]">
            {job.company}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="공고 공유"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          
          {/* 🎯 전체 매칭률(%) 상단 시각화 카드 */}
          <div className="rounded-[16px] p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md border border-blue-900/60 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              {/* Header: Title & AI indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>내 스펙 종합 매칭 분석</span>
                </div>
                <div>
                  {aiResult ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40">
                      <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                      Gemini AI 분석 기준
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      공고 기본 스펙 기준
                    </span>
                  )}
                </div>
              </div>

              {/* Big Score Row */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black tracking-tight text-white">
                      {overallMatchPercentage}%
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      전체 매칭률
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-300">
                    총 {totalCompetencyItems}개 요구 스펙 중{' '}
                    <span className="text-emerald-400 font-bold">
                      {totalMatchedCompetencies}개 일치 (초록 {totalMatchedCompetencies} · 빨강{' '}
                      {totalCompetencyItems - totalMatchedCompetencies})
                    </span>
                  </div>
                </div>

                {/* Fit recommendation badge */}
                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 text-center ${
                    overallMatchPercentage >= 75
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : overallMatchPercentage >= 50
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {overallMatchPercentage >= 75
                    ? '서류 적합도: 최상 🚀'
                    : overallMatchPercentage >= 50
                    ? '서류 적합도: 양호 👍'
                    : '역량 보완 권장 💡'}
                </div>
              </div>

              {/* Full width Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-800/90 border border-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    overallMatchPercentage >= 75
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : overallMatchPercentage >= 50
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      : 'bg-gradient-to-r from-amber-500 to-rose-400'
                  }`}
                  style={{ width: `${overallMatchPercentage}%` }}
                />
              </div>

              {/* Sub Breakdown Cards */}
              <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-xs">
                {/* 기술 매칭 */}
                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">요구 기술</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {skillMatchPercentage}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      ✓{matchedSkills.length}
                    </span>
                  </div>
                </div>

                {/* 전공 적합성 */}
                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="truncate">우대 전공</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        matchedMajors.length > 0
                          ? 'text-emerald-400'
                          : activeMajors.length > 0
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {matchedMajors.length > 0
                        ? '일치'
                        : activeMajors.length > 0
                        ? '우대팁'
                        : '무관'}
                    </span>
                    {activeMajors.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {matchedMajors.length}/{activeMajors.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* 자격증 매칭 */}
                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">관련 자격증</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {activeCertificates.length > 0 ? `${certMatchPercentage}%` : '해당없음'}
                    </span>
                    {activeCertificates.length > 0 && (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        ✓{matchedCertificates.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${
                  fieldDef ? fieldDef.gradient.bgClass : 'bg-blue-600'
                }`}
              >
                {getFieldIcon(job.field, 'w-4 h-4')}
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {job.company}
              </span>
              {job.department && (
                <span className="text-xs text-slate-400 font-normal">
                  · {job.department}
                </span>
              )}
            </div>

            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug mb-3">
              {job.title}
            </h1>

            {/* Tags & Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  fieldDef
                    ? `${fieldDef.gradient.textClass} bg-slate-100 dark:bg-slate-800`
                    : 'text-blue-600 bg-blue-50 dark:bg-blue-950'
                }`}
              >
                {job.field}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {aiResult?.level && aiResult.level !== '정보 없음'
                  ? aiResult.level
                  : job.level}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.region}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold ${
                  dDayInfo.isUrgent
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                    : 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                마감일: {job.deadline} ({dDayInfo.label})
              </span>
            </div>

            {/* Salary */}
            {job.salary && (
              <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">급여/처우</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {job.salary}
                </span>
              </div>
            )}

            {/* Benefits Badges */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {job.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 🤖 Gemini AI 올인원 자소서 도우미 실행 버튼 배너 */}
          <button
            type="button"
            onClick={() => setIsResumeAssistantOpen(true)}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.99] text-white shadow-md shadow-indigo-500/20 flex items-center justify-between transition-all group cursor-pointer border border-white/20"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black flex items-center gap-1.5">
                  <span>Gemini AI 자소서 도우미</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900">
                    초안 + 첨삭
                  </span>
                </div>
                <div className="text-[10px] text-blue-100 font-medium">
                  500자 맞춤 초안 생성 & 100점 만점 직무 적합도 진단
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold bg-white/15 px-2.5 py-1.5 rounded-xl group-hover:bg-white/25 transition-colors">
              <span>열기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 👥 합격자 스펙 컷라인 & 내 스펙 위치 (Spec Benchmark) */}
          <div className="rounded-[16px] p-4 bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>합격자 스펙 컷라인 & 내 위치</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      1:1 벤치마크
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    최근 동일 직군 최종 합격자 평균 스펙 대비 내 현재 위치
                  </p>
                </div>
              </div>
            </div>

            {/* 3대 스펙 1:1 비교 바 차트 */}
            <div className="space-y-3 pt-1">
              {/* 1. 학부 학점 (GPA) */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span>학부 학점 (GPA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      내 학점 <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{myGpaNum.toFixed(2)}</strong> / 4.5
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (합격평균 {benchmark.avgGpa.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Progress bars: Mine vs Passing Average */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 shrink-0 font-medium">내 학점</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (myGpaNum / 4.5) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-slate-700 dark:text-slate-300">
                      {myGpaNum.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 shrink-0 font-medium">합격평균</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (benchmark.avgGpa / 4.5) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {benchmark.avgGpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-0.5">
                  <span className="text-slate-500">
                    {myGpaNum >= benchmark.avgGpa
                      ? `합격선 대비 +${(myGpaNum - benchmark.avgGpa).toFixed(2)}점 상회`
                      : `합격선 대비 -${(benchmark.avgGpa - myGpaNum).toFixed(2)}점`}
                  </span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      myGpaNum >= benchmark.avgGpa
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {myGpaNum >= benchmark.avgGpa ? '안정권 🟢' : '직무역량 보완 권장 🟡'}
                  </span>
                </div>
              </div>

              {/* 2. 보유 자격증 수 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>보유 자격증 수</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      내 자격증 <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{myCertCount}개</strong>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (합격평균 {benchmark.avgCertCount}개)
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 shrink-0 font-medium">내 보유</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (myCertCount / 4) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-slate-700 dark:text-slate-300">
                      {myCertCount}개
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 shrink-0 font-medium">합격평균</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (benchmark.avgCertCount / 4) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {benchmark.avgCertCount}개
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-0.5">
                  <span className="text-slate-500">
                    {myCertCount >= benchmark.avgCertCount
                      ? '합격자 평균 보유 수 이상 충족'
                      : `합격자 평균 대비 ${benchmark.avgCertCount - myCertCount}개 부족`}
                  </span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      myCertCount >= benchmark.avgCertCount
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {myCertCount >= benchmark.avgCertCount ? '충족 🟢' : '자격증 보완 권장 🟡'}
                  </span>
                </div>
              </div>

              {/* 3. 직무 기술 매칭률 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Wrench className="w-4 h-4 text-blue-500" />
                    <span>직무 기술 스택 일치율</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      내 일치율 <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{skillMatchPercentage}%</strong>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (합격평균 {benchmark.avgSkillMatch}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 shrink-0 font-medium">내 일치율</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${skillMatchPercentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-slate-700 dark:text-slate-300">
                      {skillMatchPercentage}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 shrink-0 font-medium">합격평균</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${benchmark.avgSkillMatch}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {benchmark.avgSkillMatch}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-0.5">
                  <span className="text-slate-500">
                    {skillMatchPercentage >= benchmark.avgSkillMatch
                      ? `기술 컷라인 상회 (+${skillMatchPercentage - benchmark.avgSkillMatch}%p)`
                      : `기술 컷라인 대비 -${benchmark.avgSkillMatch - skillMatchPercentage}%p`}
                  </span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      skillMatchPercentage >= benchmark.avgSkillMatch
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {skillMatchPercentage >= benchmark.avgSkillMatch ? '합격 안정권 🚀' : '스킬 추가 보완 필요 💡'}
                  </span>
                </div>
              </div>
            </div>

            {/* 합격 팁 박스 */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>합격자 데이터 분석 기반 전략 팁</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {benchmark.passingRateTip}
              </p>
            </div>
          </div>

          {/* ✨ Gemini AI Summarization Control & Result Box */}
          <div className="rounded-[14px] p-4 bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-purple-50/80 dark:from-slate-800/90 dark:via-blue-950/40 dark:to-slate-800/90 border border-blue-200/80 dark:border-blue-900/70 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Gemini AI 공고 분석</span>
                    {isCachedResult && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                        캐시 사용됨
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    원문 기반 3줄 요약 · 요구 역량 및 자격 자동 추출
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsInputOpen((prev) => !prev)}
                  className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>{isInputOpen ? '원문 접기' : '원문 붙여넣기'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAnalyzeJob(true)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs flex items-center gap-1 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  <span>{aiResult ? '다시 분석' : 'AI 분석 실행'}</span>
                </button>
              </div>
            </div>

            {/* Optional Collapsible Raw Textarea */}
            {isInputOpen && (
              <div className="pt-2 border-t border-blue-100 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    공고 원문 텍스트 (수정 또는 외부 공고 붙여넣기 가능)
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {inputText.length}자
                  </span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                  placeholder="공고 원문 내용을 이곳에 붙여넣으세요..."
                  className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAnalyzeJob(true)}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>이 원문으로 Gemini 분석 실행</span>
                </button>
              </div>
            )}

            {/* Error Message Box */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">AI 분석 실패</div>
                  <div className="mt-0.5 leading-relaxed">{errorMsg}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAnalyzeJob(true)}
                  className="px-2 py-1 rounded bg-rose-600 text-white font-semibold text-[10px] shrink-0"
                >
                  재시도
                </button>
              </div>
            )}

            {/* Loading Skeleton UI */}
            {isLoading && (
              <div className="p-3 bg-white/70 dark:bg-slate-800/60 rounded-xl border border-blue-100 dark:border-slate-700 space-y-2.5 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-900" />
                  <div className="h-3.5 w-32 bg-blue-200 dark:bg-blue-900 rounded" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-md" />
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-md" />
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded-md" />
                </div>
              </div>
            )}

            {/* AI Summary Text Display */}
            {!isLoading && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <p className="whitespace-pre-line">{activeSummary}</p>
                </div>

                {/* Disclaimer notice */}
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <AlertCircle className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>AI가 생성한 요약이며 원문 확인이 필요합니다.</span>
                </div>
              </div>
            )}
          </div>

          {/* 🎯 Required Skills & My Matching Rate */}
          <div className="rounded-[14px] p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  🎯 요구 역량 · 내 기술 매칭
                </span>
                {aiResult && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    AI 추출 스킬 기준
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-base font-extrabold ${
                    skillMatchPercentage >= 70
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : skillMatchPercentage >= 40
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {skillMatchPercentage}%
                </span>
                <span className="text-[11px] text-slate-400">
                  ({matchedSkills.length}/{activeSkills.length})
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  skillMatchPercentage >= 70
                    ? 'bg-emerald-500'
                    : skillMatchPercentage >= 40
                    ? 'bg-blue-600'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${skillMatchPercentage}%` }}
              />
            </div>

            {/* Skill chips: Green for owned (초록색), Red for missing (빨간색) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeSkills.map((sk) => {
                const hasSkill = isCompetencyMatched(sk, mySkills);
                return (
                  <div
                    key={sk}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      hasSkill
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {hasSkill ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                    )}
                    <span>{sk}</span>
                  </div>
                );
              })}
            </div>

            {/* Recommendation sentence */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              {missingSkills.length > 0 ? (
                <p>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    추천 역량:{' '}
                  </span>
                  {missingSkills.join(', ')} 역량을 보완하면 서류 합격 가능성이 높아집니다.
                </p>
              ) : (
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  🎉 이 공고의 모든 필수 기술 역량을 이미 보유하고 계십니다!
                </p>
              )}
            </div>

            {/* 🎓 관련/우대 전공 칩 목록 및 매칭 */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>관련 / 우대 전공</span>
                </div>
                <div className="text-xs">
                  {activeMajors.length > 0 ? (
                    <>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        ✓ {matchedMajors.length}
                      </span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {activeMajors.length}개
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400 text-[11px]">전공 무관</span>
                  )}
                </div>
              </div>

              {activeMajors.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {activeMajors.map((major) => {
                      const hasMajor = isCompetencyMatched(major, myMajors);
                      return (
                        <span
                          key={major}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            hasMajor
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {hasMajor ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{major}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* 우대 안내 팁 */}
                  <div className="text-[11px] leading-relaxed pt-0.5">
                    {matchedMajors.length > 0 ? (
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-start gap-1">
                        <span className="shrink-0 font-bold">✓</span>
                        <span>
                          내 전공({matchedMajors.join(', ')})과 일치하여 학과 적합성 평가에서 우수한 평가를 받을 수 있습니다.
                        </span>
                      </p>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 flex items-start gap-1">
                        <span className="shrink-0">💡</span>
                        <span>
                          <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                            우대 안내:
                          </strong>{' '}
                          {missingMajors.join(', ')} 전공자 또는 관련 유사 과목 이수 시 우대 가점이 적용될 수 있습니다.
                        </span>
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-slate-400">
                  전공 제한이 없거나 경력/실무 역량 중심의 포지션입니다.
                </p>
              )}
            </div>
          </div>

          {/* 📜 Related Certificates */}
          {activeCertificates.length > 0 && (
            <div className="rounded-[14px] p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>📜 관련 자격증 대조</span>
                </div>
                <div className="text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ {matchedCertificates.length}
                  </span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {activeCertificates.length}개
                  </span>
                </div>
              </div>

              {/* Certificate chips: Green for owned (초록색), Red for missing (빨간색) */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {activeCertificates.map((cert) => {
                  const hasCert = isCompetencyMatched(cert, myCertificates);
                  return (
                    <span
                      key={cert}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        hasCert
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {hasCert ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                      )}
                      <span>{cert}</span>
                    </span>
                  );
                })}
              </div>

              {missingCertificates.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  💡 <span className="font-semibold text-amber-600 dark:text-amber-400">{missingCertificates.join(', ')}</span> 자격증 취득 시 가산점 혜택을 받을 수 있습니다.
                </div>
              )}
            </div>
          )}

          {/* 필수 조건 */}
          <div className="rounded-[14px] p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              📌 필수 자격 요건
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {activeRequired.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 우대 사항 */}
          <div className="rounded-[14px] p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              ⭐ 우대 사항
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {activePreferred.map((pref, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{pref}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ✨ Gemini AI 맞춤 자소서 키워드 & 실전 면접 예상 질문 3선 */}
          <div className="rounded-[16px] p-4 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 text-white border border-indigo-800/60 shadow-lg space-y-3.5 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>Gemini 맞춤 합격 코칭</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                        자소서 & 면접 3선
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-300">
                      내 보유 스펙 맞춤형 공략 키워드 및 실전 예상 질문
                    </p>
                  </div>
                </div>

                {interviewPrep && !isPrepLoading && (
                  <button
                    type="button"
                    onClick={() => handleGenerateInterviewPrep(true)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-colors"
                    title="다시 생성"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span className="text-[10px] font-semibold">재생성</span>
                  </button>
                )}
              </div>

              {/* Not yet generated state */}
              {!interviewPrep && !isPrepLoading && !prepErrorMsg && (
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-2.5 text-center">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    지원자의 <strong className="text-indigo-300">보유 전공·기술</strong>과 이 포지션 요구역량을 분석하여,<br className="hidden sm:inline" />
                    서류 합격률을 높이는 <span className="text-emerald-300 font-semibold">자소서 공략 키워드 3가지</span>와 <span className="text-cyan-300 font-semibold">실전 면접 예상 질문 3가지</span>를 즉시 생성합니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleGenerateInterviewPrep(false)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                    <span>AI 자소서 키워드 & 면접 예상 질문 3선 생성</span>
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isPrepLoading && (
                <div className="p-4 rounded-xl bg-slate-800/70 border border-indigo-900/60 space-y-3 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-bold py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI가 지원자 스펙과 공고를 심층 분석하여 질문을 도출 중입니다...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-full bg-slate-700 rounded" />
                    <div className="h-3.5 w-5/6 bg-slate-700 rounded" />
                    <div className="h-3.5 w-4/6 bg-slate-700 rounded" />
                  </div>
                </div>
              )}

              {/* Error State */}
              {prepErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{prepErrorMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateInterviewPrep(true)}
                    className="px-2 py-1 bg-rose-700 hover:bg-rose-600 rounded text-[10px] font-bold shrink-0"
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {/* Generated Result Container */}
              {interviewPrep && !isPrepLoading && (
                <div className="space-y-3 pt-1">
                  {/* 1. 자소서 핵심 키워드 3가지 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-bold text-indigo-300">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>📝 자소서 핵심 공략 키워드 & 작성 팁 (3선)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">클릭하여 키워드 복사</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {interviewPrep.resumeKeyPoints.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold">
                              <span>#{item.keyword}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(`[${item.keyword}] ${item.tip}`, idx)}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                            >
                              {copiedKeyIdx === idx ? (
                                <>
                                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">복사됨!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>팁 복사</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            {item.tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. 실전 면접 예상 질문 3가지 & 모범 답변 */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1 text-xs font-bold text-cyan-300">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🎯 실전 면접 예상 질문 3선 & 모범 답변 가이드</span>
                    </div>

                    <div className="space-y-2">
                      {interviewPrep.interviewQuestions.map((q, idx) => {
                        const isExpanded = expandedQuestionIdx === idx;
                        return (
                          <div
                            key={idx}
                            className="rounded-xl bg-slate-800/90 border border-slate-700 overflow-hidden transition-all"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                              className="w-full p-3 text-left flex items-start justify-between gap-2 hover:bg-slate-700/50 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/30">
                                  Q{idx + 1}
                                </span>
                                <span className="text-xs font-bold text-white leading-snug">
                                  {q.question}
                                </span>
                              </div>
                              <span className="text-slate-400 shrink-0 mt-0.5">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="px-3 pb-3 pt-1 border-t border-slate-700/60 bg-slate-900/60 space-y-2 text-xs">
                                {/* Intent */}
                                <div className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/50 space-y-0.5">
                                  <div className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                                    <HelpCircle className="w-3 h-3 text-amber-400" />
                                    <span>면접관의 질문 의도</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed">
                                    {q.intent}
                                  </p>
                                </div>

                                {/* Answer Guide */}
                                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/50 space-y-1">
                                  <div className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                                    <Lightbulb className="w-3 h-3 text-emerald-400" />
                                    <span>모범 답변 전략 & 핵심 가이드</span>
                                  </div>
                                  <p className="text-[11px] text-slate-200 leading-relaxed whitespace-pre-line">
                                    {q.answerGuide}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          {/* Bookmark Toggle */}
          <button
            type="button"
            onClick={() => onToggleBookmark(job.id)}
            className={`flex-1 py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                isBookmarked ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
            <span>{isBookmarked ? '저장된 공고 ★' : '이 공고 저장하기'}</span>
          </button>

          {/* Open Original Source Link */}
          <button
            type="button"
            onClick={() => onOpenSourceUrl(job.sourceUrl, job.title)}
            className="flex-1 py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>원문 보기</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gemini AI Resume Assistant Modal */}
      {isResumeAssistantOpen && (
        <AiResumeAssistantModal
          job={job}
          onClose={() => setIsResumeAssistantOpen(false)}
          userGpa={userGpa}
          userMajors={myMajors}
          userSkills={mySkills}
          userCertificates={myCertificates}
          viewMode={viewMode}
        />
      )}
    </div>
  );
};
