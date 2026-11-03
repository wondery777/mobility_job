import React from 'react';
import {
  X,
  Layers,
  MapPin,
  Briefcase,
  Calendar,
  ExternalLink,
  Target,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Job, MOBILITY_FIELDS } from '../data';
import { calculateDday } from './JobCard';
import { getFieldIcon } from './FieldIcons';

interface CompareJobsModalProps {
  jobs: Job[];
  onClose: () => void;
  mySkills: string[];
  myCertificates: string[];
  myMajors: string[];
  onSelectJob: (job: Job) => void;
  onOpenSourceUrl: (url: string, title: string) => void;
  viewMode?: 'mobile' | 'web';
}

export const CompareJobsModal: React.FC<CompareJobsModalProps> = ({
  jobs,
  onClose,
  mySkills,
  myCertificates,
  myMajors,
  onSelectJob,
  onOpenSourceUrl,
  viewMode = 'mobile',
}) => {
  if (jobs.length === 0) return null;

  const calculateMatchPercent = (job: Job) => {
    if (!job.skills || job.skills.length === 0) return 100;
    const matched = job.skills.filter((sk) =>
      mySkills.some((my) => my.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(my.toLowerCase()))
    );
    return Math.round((matched.length / job.skills.length) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 animate-in fade-in duration-200">
      <div
        className={`w-full ${
          viewMode === 'web' || jobs.length >= 3 ? 'max-w-4xl' : 'max-w-2xl'
        } max-h-[92vh] bg-white dark:bg-slate-900 rounded-[20px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>모빌리티 공고 1:1 스마트 비교</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {jobs.length}개 선택됨
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                연봉, 복지, 내 스펙 매칭률, 기술 스택 조건 비교
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table / Grid Body */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
          <div
            className={`grid gap-3 min-w-[500px] ${
              jobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {jobs.map((job) => {
              const dDay = calculateDday(job.deadline);
              const fieldDef = MOBILITY_FIELDS.find((f) => f.name === job.field);
              const matchPercent = calculateMatchPercent(job);

              return (
                <div
                  key={job.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 space-y-3.5 flex flex-col justify-between"
                >
                  {/* Company & Title Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {job.company}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          dDay.isUrgent
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {dDay.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Field & Meta */}
                    <div className="flex flex-wrap items-center gap-1 text-[11px] pt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-semibold">
                        {job.field}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {job.level}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {job.region}
                      </span>
                    </div>
                  </div>

                  {/* 🎯 내 스펙 매칭률 Progress Card */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-cyan-500" />
                        <span>내 기술 매칭률</span>
                      </span>
                      <span className="font-black text-cyan-600 dark:text-cyan-400">
                        {matchPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          matchPercent >= 70
                            ? 'bg-emerald-500'
                            : matchPercent >= 40
                            ? 'bg-blue-600'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${matchPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* 💰 연봉 & 복지 뱃지 */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-slate-400">연봉 / 처우</div>
                    <div className="font-extrabold text-slate-800 dark:text-slate-200">
                      {job.salary || '회사 내규 협의'}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(job.benefits || ['💰 초봉 협의', '🏠 재택가능', '⏰ 탄력근무']).map((b) => (
                        <span
                          key={b}
                          className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 🛠 요구 기술 스택 */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-slate-400">요구 기술 스택</div>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((sk) => {
                        const hasSkill = mySkills.some(
                          (my) => my.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(my.toLowerCase())
                        );
                        return (
                          <span
                            key={sk}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              hasSkill
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {hasSkill ? '✓ ' : ''}{sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* 👥 합격자 평균 스펙 (Benchmark) */}
                  {job.benchmark && (
                    <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[10px] space-y-1 text-slate-600 dark:text-slate-300">
                      <div className="font-bold text-blue-700 dark:text-blue-300">
                        합격자 평균 컷라인
                      </div>
                      <div className="flex justify-between">
                        <span>평균 학점:</span>
                        <strong className="text-slate-900 dark:text-white">{job.benchmark.avgGpa}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>자격증 개수:</span>
                        <strong className="text-slate-900 dark:text-white">{job.benchmark.avgCertCount}개</strong>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectJob(job);
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <span>공고 상세 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenSourceUrl(job.sourceUrl, job.title)}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>원문 공고</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            비교 창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
