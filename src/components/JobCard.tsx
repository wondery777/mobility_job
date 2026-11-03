import React from 'react';
import { Star, MapPin, Briefcase, CheckSquare, Square, Layers } from 'lucide-react';
import { Job, MOBILITY_FIELDS } from '../data';
import { getFieldIcon } from './FieldIcons';

interface JobCardProps {
  job: Job;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
  onClick: () => void;
  // Compare selection
  isCompareMode?: boolean;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (jobId: string) => void;
}

export const calculateDday = (
  deadlineStr: string
): { label: string; days: number; isUrgent: boolean } => {
  const targetYear = 2026;
  const targetMonth = 10; // 0-indexed: 10 is November
  const targetDay = 1;

  // Anchor to 2026-11-01
  const today = new Date(targetYear, targetMonth, targetDay);
  const [dYear, dMonth, dDate] = deadlineStr.split('-').map(Number);
  const deadline = new Date(dYear, dMonth - 1, dDate);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: '마감', days: diffDays, isUrgent: false };
  }
  if (diffDays === 0) {
    return { label: '오늘 마감', days: 0, isUrgent: true };
  }
  return {
    label: `D-${diffDays}`,
    days: diffDays,
    isUrgent: diffDays <= 3,
  };
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isBookmarked,
  onToggleBookmark,
  onClick,
  isCompareMode = false,
  isSelectedForCompare = false,
  onToggleCompare,
}) => {
  const dDayInfo = calculateDday(job.deadline);
  const fieldDef = MOBILITY_FIELDS.find((f) => f.name === job.field);

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-slate-900 rounded-[14px] p-4 border shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.995] ${
        isSelectedForCompare
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
      }`}
    >
      {/* Top row: Company, Compare Button & Bookmark */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {/* Field Icon Badge */}
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
              fieldDef ? fieldDef.gradient.bgClass : 'bg-blue-600'
            }`}
          >
            {getFieldIcon(job.field, 'w-4 h-4')}
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {job.company}
          </span>
        </div>

        {/* Right Action Icons: Compare Checkbox + Bookmark Star */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(job.id)}
              className={`p-1 px-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 border transition-all ${
                isSelectedForCompare
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
              title="비교함 담기"
            >
              {isSelectedForCompare ? (
                <CheckSquare className="w-3.5 h-3.5" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              <span>비교</span>
            </button>
          )}

          {/* Bookmark Star Button */}
          <button
            type="button"
            onClick={() => onToggleBookmark(job.id)}
            aria-label={isBookmarked ? '공고 저장 해제' : '공고 저장'}
            className="p-1 rounded-full text-slate-300 hover:text-amber-400 dark:text-slate-600 dark:hover:text-amber-400 transition-colors"
          >
            <Star
              className={`w-5 h-5 transition-transform active:scale-125 ${
                isBookmarked
                  ? 'fill-amber-400 text-amber-400'
                  : 'stroke-[1.7]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2">
        {job.title}
      </h3>

      {/* Meta tags: Field, Experience, Region */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2 text-xs">
        {/* Field Tag */}
        <span
          className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
            fieldDef
              ? `${fieldDef.gradient.textClass} bg-slate-100 dark:bg-slate-800`
              : 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
          }`}
        >
          {job.field}
        </span>

        {/* Experience Level */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
          <Briefcase className="w-3 h-3 text-slate-400" />
          {job.level}
        </span>

        {/* Region */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
          <MapPin className="w-3 h-3 text-slate-400" />
          {job.region}
        </span>
      </div>

      {/* 💼 Benefits & Salary Pills */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mb-2.5">
          {job.benefits.slice(0, 3).map((benefit, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40 font-medium"
            >
              {benefit}
            </span>
          ))}
          {job.benefits.length > 3 && (
            <span className="text-[10px] text-slate-400">
              +{job.benefits.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: Skill preview + D-day */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1 overflow-hidden pr-2">
          {job.skills.slice(0, 3).map((sk) => (
            <span
              key={sk}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 truncate max-w-[80px]"
            >
              {sk}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] text-slate-400">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        {/* D-day badge: 3일 이하는 빨간색 */}
        <div
          className={`px-2 py-0.5 rounded-md font-bold text-xs shrink-0 ${
            dDayInfo.isUrgent
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          {dDayInfo.label}
        </div>
      </div>
    </div>
  );
};
