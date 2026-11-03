import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Award,
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
  const [selectedDateStr, setSelectedDateStr] = useState('2026-11-10'); // Default selected day with bootcamp

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

  // Group events into Educations/Bootcamps and Fairs/Seminars
  const educationEvents = selectedDateEvents.filter(
    (e) => e.category === '추천교육' || e.category === '부트캠프'
  );
  const generalEvents = selectedDateEvents.filter(
    (e) => e.category !== '추천교육' && e.category !== '부트캠프'
  );

  const handleOpenExternal = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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
              공고 마감일 및 국비·부트캠프 모집 일정을 관리하세요
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
          <div className="p-3.5 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
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

            {/* Legend (4 Color Dots) */}
            <div className="flex items-center gap-2.5 text-[10.5px] text-slate-500 dark:text-slate-400 pt-1 pb-1 border-b border-slate-100 dark:border-slate-800 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>공고 마감</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>저장 공고 마감</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="font-semibold text-purple-700 dark:text-purple-300">추천 교육·부트캠프</span>
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
                  return <div key={`empty-${idx}`} className="h-11" />;
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

                const eventsOnDate = SAMPLE_EVENTS.filter((e) => e.date === dateStr);
                const hasEducation = eventsOnDate.some(
                  (e) => e.category === '추천교육' || e.category === '부트캠프'
                );
                const hasGeneralEvent = eventsOnDate.some(
                  (e) => e.category !== '추천교육' && e.category !== '부트캠프'
                );

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`relative h-12 flex flex-col items-center justify-between py-1 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : isToday
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-[12px]">{dayNumber}</span>

                    {/* Dot Indicators */}
                    <div className="flex items-center justify-center gap-0.5 h-1.5 flex-wrap">
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
                      {/* 보라 점: 추천 교육/부트캠프 */}
                      {hasEducation && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-purple-200' : 'bg-purple-500'
                          }`}
                          title="추천 교육·부트캠프"
                        />
                      )}
                      {/* 파랑 점: 박람회 및 세미나 */}
                      {hasGeneralEvent && (
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
        <div className={`space-y-3 ${viewMode === 'web' ? 'lg:col-span-5' : 'pt-1'}`}>
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
              마감 {selectedDateJobs.length}건 · 교육/행사 {selectedDateEvents.length}건
            </span>
          </div>

          {/* 🎓 1. 진행 중인 추천 교육 & 부트캠프 섹션 */}
          {educationEvents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 px-1">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>🎓 모빌리티 추천 교육 & 부트캠프 ({educationEvents.length}건)</span>
              </div>

              <div className="space-y-2">
                {educationEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3.5 rounded-[14px] bg-gradient-to-br from-purple-50/80 to-indigo-50/50 dark:from-slate-800/90 dark:to-purple-950/40 border border-purple-200 dark:border-purple-900/60 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                            {event.badge || event.category}
                          </span>
                          {event.organizer && (
                            <span className="text-[11px] font-semibold text-purple-800 dark:text-purple-300">
                              {event.organizer}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                          {event.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                        <span>{event.location || '온라인 / 오프라인'}</span>
                      </div>
                      {event.targetMajor && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{event.targetMajor}</span>
                        </div>
                      )}
                    </div>

                    {/* [신청 홈페이지 바로가기 ›] External Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenExternal(event.linkUrl)}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                    >
                      <span>신청 홈페이지 바로가기</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🎪 2. 일반 채용 행사 & 세미나 섹션 */}
          {generalEvents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 px-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>채용 박람회 & 행사 ({generalEvents.length}건)</span>
              </div>

              <div className="space-y-2">
                {generalEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3.5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {event.category}
                      </span>
                      {event.organizer && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {event.organizer}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {event.title}
                    </h4>
                    {event.location && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.linkUrl && (
                      <button
                        type="button"
                        onClick={() => handleOpenExternal(event.linkUrl)}
                        className="w-full py-1.5 mt-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>공식 안내 보기</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 💼 3. 마감 공고 섹션 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                마감 채용 공고 ({selectedDateJobs.length}건)
              </span>
            </div>

            {selectedDateJobs.length > 0 ? (
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
            ) : (
              <div className="p-5 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  선택한 날짜에 마감되는 공고가 없습니다.
                </p>
                <p className="text-[10px] text-slate-400">
                  달력의 빨간색/초록색 점이 표시된 날짜를 클릭해보세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
