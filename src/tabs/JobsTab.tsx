import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  MapPin,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { Job, MOBILITY_FIELDS } from '../data';
import { Banner } from '../components/Banner';
import { JobCard } from '../components/JobCard';
import {
  RegionBottomSheet,
  RegionFilterState,
  getRegionSummaryLabel,
  matchesRegionFilter,
} from '../components/RegionBottomSheet';

interface JobsTabProps {
  jobs: Job[];
  bookmarkedJobIds: string[];
  onToggleBookmark: (id: string) => void;
  onSelectJob: (job: Job) => void;
  selectedField: string;
  onSelectField: (field: string) => void;
  viewMode?: 'mobile' | 'web';
}

export type CareerFilter = '전체' | '신입' | '경력' | '경력무관';
export type SortOption = '최신순' | '마감임박순';

const ALL_FIELDS = [
  '전체',
  '자율주행',
  '전기차·배터리',
  'UAM·드론',
  '모빌리티 서비스',
  '차량용 SW·반도체',
  '자동차 부품',
];

export const JobsTab: React.FC<JobsTabProps> = ({
  jobs,
  bookmarkedJobIds,
  onToggleBookmark,
  onSelectJob,
  selectedField,
  onSelectField,
  viewMode = 'mobile',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [careerFilter, setCareerFilter] = useState<CareerFilter>('전체');
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [isRegionSheetOpen, setIsRegionSheetOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState<RegionFilterState>({
    selectedProvinces: [],
    districtMap: {},
  });

  // Filter evaluation logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Keyword search (company, title, skills)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesSkills = job.skills.some((sk) => sk.toLowerCase().includes(q));
        const matchesRegion = job.region.toLowerCase().includes(q);
        if (!matchesCompany && !matchesTitle && !matchesSkills && !matchesRegion) {
          return false;
        }
      }

      // 2. Field filter
      if (selectedField !== '전체' && job.field !== selectedField) {
        return false;
      }

      // 3. Career filter
      // 규칙: "신입·경력" 공고는 신입과 경력 양쪽에 모두 표시, "경력"은 경력무관 제외
      if (careerFilter === '신입') {
        const isEntry = job.level === '신입' || job.level === '신입·경력';
        if (!isEntry) return false;
      } else if (careerFilter === '경력') {
        const isExp =
          (job.level.startsWith('경력') && job.level !== '경력 무관') ||
          job.level === '신입·경력';
        if (!isExp) return false;
      } else if (careerFilter === '경력무관') {
        if (job.level !== '경력 무관') return false;
      }

      // 4. Region filter
      if (!matchesRegionFilter(job.region, regionFilter)) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedField, careerFilter, regionFilter]);

  // Sort logic
  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];
    if (sortOption === '마감임박순') {
      return list.sort((a, b) => {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }
    // 기본 '최신순': 원래 배열 순서 유지
    return list;
  }, [filteredJobs, sortOption]);

  const regionSummary = getRegionSummaryLabel(regionFilter);
  const isRegionActive = regionFilter.selectedProvinces.length > 0;

  const handleResetFilters = () => {
    setSearchQuery('');
    onSelectField('전체');
    setCareerFilter('전체');
    setSortOption('최신순');
    setRegionFilter({ selectedProvinces: [], districtMap: {} });
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedField !== '전체' ||
    careerFilter !== '전체' ||
    sortOption !== '최신순' ||
    isRegionActive;

  return (
    <div className="space-y-3 pb-8">
      {/* Top Banner with SVG and animation */}
      <Banner />

      {/* Search Bar */}
      <div className="px-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="회사명, 채용 포지션, 기술 스택 검색..."
            className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Field Chips (줄바꿈되어 모두 보이게 - flex flex-wrap) */}
      <div className="px-3">
        <div className="flex flex-wrap gap-1.5">
          {ALL_FIELDS.map((fieldName) => {
            const isSelected = selectedField === fieldName;
            return (
              <button
                key={fieldName}
                type="button"
                onClick={() => onSelectField(fieldName)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {fieldName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: [경력: 전체/신입/경력/경력무관] [📍지역] [정렬: 최신순/마감임박순] [초기화] [공고 N건] */}
      <div className="px-3">
        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            {/* Career Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
              {(['전체', '신입', '경력', '경력무관'] as CareerFilter[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setCareerFilter(level)}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    careerFilter === level
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Region Button */}
            <button
              type="button"
              onClick={() => setIsRegionSheetOpen(true)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isRegionActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{regionSummary}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
            {/* Count & Reset */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                공고 <span className="text-blue-600 dark:text-blue-400">{sortedJobs.length}</span>건
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>초기화</span>
                </button>
              )}
            </div>

            {/* Sort Toggle: 최신순 / 마감임박순 */}
            <div className="flex items-center gap-1 text-[11px]">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <button
                type="button"
                onClick={() => setSortOption('최신순')}
                className={`px-1.5 py-0.5 rounded ${
                  sortOption === '최신순'
                    ? 'font-bold text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                최신순
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                type="button"
                onClick={() => setSortOption('마감임박순')}
                className={`px-1.5 py-0.5 rounded ${
                  sortOption === '마감임박순'
                    ? 'font-bold text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                마감임박순
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div
        className={`px-3 ${
          viewMode === 'web'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
            : 'space-y-2.5'
        }`}
      >
        {sortedJobs.length > 0 ? (
          sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isBookmarked={bookmarkedJobIds.includes(job.id)}
              onToggleBookmark={onToggleBookmark}
              onClick={() => onSelectJob(job)}
            />
          ))
        ) : (
          <div className="p-8 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              조건에 맞는 채용 공고가 없습니다.
            </p>
            <p className="text-xs text-slate-400">
              선택한 분야, 경력 조건 또는 지역 필터를 조정해 보세요.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* Region Bottom Sheet Modal */}
      <RegionBottomSheet
        isOpen={isRegionSheetOpen}
        onClose={() => setIsRegionSheetOpen(false)}
        filterState={regionFilter}
        onApply={(newState) => setRegionFilter(newState)}
        matchingCount={sortedJobs.length}
      />
    </div>
  );
};
