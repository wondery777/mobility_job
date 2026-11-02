import React from 'react';
import {
  X,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Newspaper,
  CheckCircle2,
} from 'lucide-react';
import { MobilityField, Job, NewsItem } from '../data';
import { getFieldIcon } from './FieldIcons';
import { calculateDday } from './JobCard';

interface FieldDetailModalProps {
  field: MobilityField | null;
  onClose: () => void;
  allJobs: Job[];
  allNews: NewsItem[];
  mySkills: string[];
  onSelectJob: (job: Job) => void;
  onViewFieldInJobs: (fieldName: string) => void;
  onOpenNewsUrl: (url: string, title: string) => void;
  viewMode?: 'mobile' | 'web';
}

export const FieldDetailModal: React.FC<FieldDetailModalProps> = ({
  field,
  onClose,
  allJobs,
  allNews,
  mySkills,
  onSelectJob,
  onViewFieldInJobs,
  onOpenNewsUrl,
  viewMode = 'mobile',
}) => {
  if (!field) return null;

  // Compute field stats
  const relatedJobs = allJobs.filter((j) => j.field === field.name);
  const relatedNews = allNews.filter((n) => n.field === field.name);

  // 진행 공고 수
  const activeJobsCount = relatedJobs.length;

  // 신입 지원 가능 수 ("신입", "신입·경력", "경력 무관")
  const entryLevelJobsCount = relatedJobs.filter(
    (j) => j.level === '신입' || j.level === '신입·경력' || j.level === '경력 무관'
  ).length;

  // 마감 임박 수 (D-day <= 3)
  const urgentJobsCount = relatedJobs.filter((j) => {
    const dday = calculateDday(j.deadline);
    return dday.isUrgent;
  }).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full ${
          viewMode === 'web' ? 'max-w-2xl sm:max-w-3xl' : 'max-w-[440px]'
        } h-full sm:h-[94vh] bg-white dark:bg-slate-900 sm:rounded-[20px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all`}
      >
        {/* Navigation Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3.5 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xs font-semibold">이전</span>
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            분야 상세 정보
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Top Gradient Banner */}
          <div
            className={`rounded-[14px] p-5 text-white shadow-md relative overflow-hidden ${field.gradient.bgClass}`}
          >
            <div className="relative z-10 flex items-center gap-3.5 mb-2.5">
              <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-inner">
                {getFieldIcon(field.name, 'w-8 h-8')}
              </div>
              <div>
                <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
                  Mobility Domain
                </span>
                <h1 className="text-xl font-extrabold text-white leading-tight">
                  {field.name}
                </h1>
              </div>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-normal relative z-10">
              {field.description}
            </p>

            {/* Decorative background circle */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          </div>

          {/* 📊 채용 현황 Stats */}
          <div className="rounded-[14px] p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-800 dark:text-slate-200">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>📊 채용 현황 요약</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-2xs">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  진행 공고
                </div>
                <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                  {activeJobsCount}
                  <span className="text-xs font-normal text-slate-500">건</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-2xs">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  신입 지원가능
                </div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {entryLevelJobsCount}
                  <span className="text-xs font-normal text-slate-500">건</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-2xs">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  마감 임박
                </div>
                <div className="text-lg font-black text-rose-500 dark:text-rose-400 mt-0.5">
                  {urgentJobsCount}
                  <span className="text-xs font-normal text-slate-500">건</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🧩 세부 분야 칩 */}
          <div className="rounded-[14px] p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🧩 세부 직무 및 연구 분야</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {field.subFields.map((sub, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* 🛠 핵심 기술 칩 (내 보유 기술은 초록색) */}
          <div className="rounded-[14px] p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🛠 핵심 요구 기술 역량</span>
              </h3>
              <span className="text-[10px] text-slate-400">
                (초록색: 내 보유 기술)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {field.coreSkills.map((sk) => {
                const hasSkill = mySkills.includes(sk);
                return (
                  <span
                    key={sk}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all ${
                      hasSkill
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {hasSkill && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>{sk}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* 📜 참고 자격증 · 추천 교육 */}
          <div className="rounded-[14px] p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>📜 관련 자격증</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {field.certificates.map((cert) => (
                  <span
                    key={cert}
                    className="px-2 py-0.5 text-[11px] rounded bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>추천 정부지원 및 전문 교육</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {field.educationRecommend.map((edu, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 관련 공고 목록 (미리보기) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{field.name} 진행 공고 ({relatedJobs.length}건)</span>
              </span>
            </div>

            {relatedJobs.length > 0 ? (
              <div className="space-y-2">
                {relatedJobs.map((j) => {
                  const dday = calculateDday(j.deadline);
                  return (
                    <div
                      key={j.id}
                      onClick={() => onSelectJob(j)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 cursor-pointer flex items-center justify-between gap-2 transition-all active:scale-[0.99]"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-slate-400">
                          {j.company} · {j.region}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {j.title}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          dday.isUrgent
                            ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {dday.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                현재 등록된 공고가 없습니다.
              </div>
            )}
          </div>

          {/* 관련 뉴스 목록 */}
          {relatedNews.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>관련 모빌리티 뉴스</span>
              </span>
              <div className="space-y-1.5">
                {relatedNews.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => onOpenNewsUrl(news.url, news.title)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400">
                        {news.source} · {news.publishedAt}
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {news.title}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Button */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewFieldInJobs(field.name);
            }}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <span>이 분야 공고 필터로 보기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
