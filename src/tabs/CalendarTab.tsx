import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { Job, CalendarEvent, SAMPLE_EVENTS } from '../data';
import { JobCard } from '../components/JobCard';

interface CalendarTabProps {
  jobs: Job[];
  bookmarkedJobIds: string[];
  onToggleBookmark: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  viewMode?: 'mobile' | 'web';
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  jobs,
  bookmarkedJobIds,
  onToggleBookmark,
  onSelectJob,
  viewMode = 'mobile',
}) => {
  // Reference date: November 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // 1-indexed (11 = Nov)
  const [selectedDateStr, setSelectedDateStr] = useState('2026-11-03'); // default selected interesting day

  const todayStr = '2026-11-01';

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(11);
    setSelectedDateStr('2026-11-01');
  };

  // Build days for currentYear & currentMonth
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 is Sun

  const dayCells = [];
  // Empty padding cells for start of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    dayCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      '0'
    )}-${String(d).padStart(2, '0')}`;
    dayCells.push({ dayNumber: d, dateStr: formattedDate });
  }

  // Find items for selected date
  const selectedDateJobs = jobs.filter((j) => j.deadline === selectedDateStr);
  const selectedDateEvents = SAMPLE_EVENTS.filter(
    (e) => e.date === selectedDateStr
  );

  return (
    <div className="space-y-3.5 px-3 py-3 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
              모빌리티 캘린더
            </h1>
            <p className="text-[11px] text-slate-400">
              공고 마감일과 채용 행사 일정을 관리하세요
            </p>
          </div>
        </div>
        <button
          onClick={handleJumpToToday}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100"
        >
          오늘
        </button>
      </div>

      {/* Main Content: Split 2-column on Web */}
      <div className={viewMode === 'web' ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start' : 'space-y-3.5'}>
        {/* Calendar Card Column */}
        <div className={viewMode === 'web' ? 'lg:col-span-7' : ''}>
          <div className="p-3.5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {currentYear}년 {currentMonth}월
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1 pb-1 border-b border-slate-100 dark:border-slate-800 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>공고 마감</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>저장 공고 마감</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>박람회·행사</span>
              </div>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400">
              <span className="text-rose-500">일</span>
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span className="text-blue-500">토</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {dayCells.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-10" />;
                }

                const { dayNumber, dateStr } = cell;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDateStr;

                // Compute indicators
                const endingJobs = jobs.filter((j) => j.deadline === dateStr);
                const hasSavedEndingJob = endingJobs.some((j) =>
                  bookmarkedJobIds.includes(j.id)
                );
                const hasOtherEndingJob = endingJobs.some(
                  (j) => !bookmarkedJobIds.includes(j.id)
                );
                const hasEvent = SAMPLE_EVENTS.some((e) => e.date === dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`relative h-11 flex flex-col items-center justify-between py-1 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : isToday
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-[12px]">{dayNumber}</span>

                    {/* Dot Indicators */}
                    <div className="flex items-center justify-center gap-0.5 h-1.5">
                      {/* 빨강 점: 일반 공고 마감일 */}
                      {hasOtherEndingJob && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-rose-500'
                          }`}
                          title="공고 마감"
                        />
                      )}
                      {/* 초록 점: 내가 저장한 공고 마감일 */}
                      {hasSavedEndingJob && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                          }`}
                          title="저장 공고 마감"
                        />
                      )}
                      {/* 파랑 점: 박람회 및 행사 */}
                      {hasEvent && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-cyan-200' : 'bg-blue-500'
                          }`}
                          title="박람회·행사"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details Column */}
        <div className={`space-y-2 ${viewMode === 'web' ? 'lg:col-span-5' : 'pt-1'}`}>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {selectedDateStr} 일정
            </h3>
            {selectedDateStr === todayStr && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-semibold">
                오늘
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            마감 {selectedDateJobs.length}건 · 행사 {selectedDateEvents.length}건
          </span>
        </div>

        {/* Events first */}
        {selectedDateEvents.length > 0 && (
          <div className="space-y-2">
            {selectedDateEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-[14px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                      {ev.category}
                    </span>
                    {ev.location && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {ev.location}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {ev.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jobs ending on this day */}
        {selectedDateJobs.length > 0 && (
          <div className="space-y-2">
            {selectedDateJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isBookmarked={bookmarkedJobIds.includes(job.id)}
                onToggleBookmark={onToggleBookmark}
                onClick={() => onSelectJob(job)}
              />
            ))}
          </div>
        )}

        {/* Empty state if nothing on selected day */}
        {selectedDateJobs.length === 0 && selectedDateEvents.length === 0 && (
          <div className="p-6 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            선택하신 {selectedDateStr}에 예정된 공고 마감 및 행사가 없습니다.
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
