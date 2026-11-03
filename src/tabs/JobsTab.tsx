import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  MapPin,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { Job, MOBILITY_FIELDS, MobilityFieldType } from '../data';
import { Banner } from '../components/Banner';
import { JobCard } from '../components/JobCard';
import { JobCardSkeleton } from '../components/SkeletonLoader';
import { SyncStatusBar } from '../components/SyncStatusBar';
import { CompareJobsModal } from '../components/CompareJobsModal';
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
  mySkills?: string[];
  myCertificates?: string[];
  myMajors?: string[];
  onOpenSourceUrl?: (url: string, title: string) => void;
  viewMode?: 'mobile' | 'web';
  isLoading?: boolean;
  isRefreshing?: boolean;
  lastUpdated?: string | null;
  onRefresh?: () => void;
  onOpenAiParser?: () => void;
}

export type CareerFilter = '전체' | '신입' | '경력' | '경력무관';
export type SortOption = '최신순' | '마감임박순';
export type PageSizeOption = 5 | 10 | 'all';
export type BenefitFilterOption = '전체' | '초봉5000' | '재택근무' | '탄력근무' | '스톡옵션';

const ALL_FIELDS = [
  '전체',
  '자율주행 & 로보틱스',
  'SDV & 차량용 SW',
  '전기차·배터리 & 충전 인프라',
  'UAM · 드론 & 항공우주',
  'C-ITS & 스마트시티 관제',
  '모빌리티 서비스 & MaaS',
  '차체·부품 & 신소재',
  '스마트 해양 & 자율운항',
  '스마트 물류 & 풀필먼트',
  '에너지 & hydrogen',
];

export const JobsTab: React.FC<JobsTabProps> = ({
  jobs,
  bookmarkedJobIds,
  onToggleBookmark,
  onSelectJob,
  selectedField,
  onSelectField,
  mySkills = [],
  myCertificates = [],
  myMajors = [],
  onOpenSourceUrl = (url) => window.open(url, '_blank'),
  viewMode = 'mobile',
  isLoading = false,
  isRefreshing = false,
  lastUpdated = null,
  onRefresh,
  onOpenAiParser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [careerFilter, setCareerFilter] = useState<CareerFilter>('전체');
  const [benefitFilter, setBenefitFilter] = useState<BenefitFilterOption>('전체');
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [pageSize, setPageSize] = useState<PageSizeOption>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRegionSheetOpen, setIsRegionSheetOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState<RegionFilterState>({
    selectedProvinces: [],
    districtMap: {},
  });

  // Compare Jobs states
  const [compareJobIds, setCompareJobIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const jobListTopRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedField, careerFilter, benefitFilter, regionFilter, sortOption, pageSize]);

  // Handle Toggle Compare
  const handleToggleCompare = (jobId: string) => {
    setCompareJobIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      if (prev.length >= 3) {
        alert('공고는 최대 3개까지 한 번에 비교할 수 있습니다.');
        return prev;
      }
      return [...prev, jobId];
    });
  };

  // Filter evaluation logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Keyword search (company, title, skills, region)
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

      // 2. Field filter (support both exact match and legacy aliases)
      if (selectedField !== '전체') {
        const fieldMatch =
          job.field === selectedField ||
          (selectedField === '자율주행 & 로보틱스' && job.field === '자율주행') ||
          (selectedField === 'SDV & 차량용 SW' && job.field === '차량용 SW·반도체') ||
          (selectedField === '전기차·배터리 & 충전 인프라' && job.field === '전기차·배터리') ||
          (selectedField === 'UAM · 드론 & 항공우주' && job.field === 'UAM·드론') ||
          (selectedField === '모빌리티 서비스 & MaaS' && job.field === '모빌리티 서비스') ||
          (selectedField === '차체·부품 & 신소재' && job.field === '자동차 부품');

        if (!fieldMatch) return false;
      }

      // 3. Career filter
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

      // 4. Welfare & Salary Benefit filter
      if (benefitFilter !== '전체') {
        if (benefitFilter === '초봉5000') {
          const isHighSalary =
            (job.salaryMin && job.salaryMin >= 5000) ||
            job.salary?.includes('5,') ||
            job.salary?.includes('6,') ||
            job.benefits?.some((b) => b.includes('5,') || b.includes('5,000') || b.includes('5,400') || b.includes('5,200') || b.includes('5,300'));
          if (!isHighSalary) return false;
        } else if (benefitFilter === '재택근무') {
          const hasRemote = job.benefits?.some((b) => b.includes('재택'));
          if (!hasRemote) return false;
        } else if (benefitFilter === '탄력근무') {
          const hasFlexible = job.benefits?.some(
            (b) => b.includes('탄력') || b.includes('시차') || b.includes('유연')
          );
          if (!hasFlexible) return false;
        } else if (benefitFilter === '스톡옵션') {
          const hasStock =
            job.benefits?.some((b) => b.includes('스톡옵션')) ||
            job.salary?.includes('스톡옵션');
          if (!hasStock) return false;
        }
      }

      // 5. Region filter
      if (!matchesRegionFilter(job.region, regionFilter)) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedField, careerFilter, benefitFilter, regionFilter]);

  // Sort logic
  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];
    if (sortOption === '마감임박순') {
      return list.sort((a, b) => {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }
    return list;
  }, [filteredJobs, sortOption]);

  // Pagination calculation
  const totalItems = sortedJobs.length;
  const numericPageSize = pageSize === 'all' ? (totalItems || 1) : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / numericPageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * numericPageSize;
  const endIndex = Math.min(startIndex + numericPageSize, totalItems);
  const paginatedJobs = pageSize === 'all' ? sortedJobs : sortedJobs.slice(startIndex, endIndex);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [];
    if (safeCurrentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
    } else if (safeCurrentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, 'ellipsis', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, 'ellipsis', totalPages);
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (jobListTopRef.current) {
      jobListTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const regionSummary = getRegionSummaryLabel(regionFilter);
  const isRegionActive = regionFilter.selectedProvinces.length > 0;

  const handleResetFilters = () => {
    setSearchQuery('');
    onSelectField('전체');
    setCareerFilter('전체');
    setBenefitFilter('전체');
    setSortOption('최신순');
    setPageSize(5);
    setCurrentPage(1);
    setRegionFilter({ selectedProvinces: [], districtMap: {} });
    setCompareJobIds([]);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedField !== '전체' ||
    careerFilter !== '전체' ||
    benefitFilter !== '전체' ||
    sortOption !== '최신순' ||
    pageSize !== 5 ||
    isRegionActive;

  const jobsToCompare = useMemo(() => {
    return jobs.filter((j) => compareJobIds.includes(j.id));
  }, [jobs, compareJobIds]);

  return (
    <div className="space-y-3 pb-8">
      {/* Top Banner with SVG and animation */}
      <Banner />

      {/* Real-time Data Sync Status Bar & AI Parser Trigger */}
      {onRefresh && onOpenAiParser && (
        <SyncStatusBar
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
          onOpenAiParser={onOpenAiParser}
          label="모빌리티 실제 채용 데이터"
        />
      )}

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

      {/* 10대 모빌리티 분야 칩 (Field Chips - 줄바꿈 flex-wrap) */}
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

      {/* Filter Bar: [경력: 전체/신입/경력] [📍지역] + 💼 [연봉·복지 스마트 필터] */}
      <div className="px-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
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

          {/* 💼 연봉 및 복지 혜택 필터 (Job Benefits Smart Filter) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            <span className="text-slate-400 text-[10px] shrink-0 font-medium mr-0.5">
              복지필터:
            </span>
            {[
              { id: '전체', label: '전체 복지' },
              { id: '초봉5000', label: '💰 초봉 5,000만+' },
              { id: '재택근무', label: '🏠 재택가능' },
              { id: '탄력근무', label: '⏰ 탄력근무' },
              { id: '스톡옵션', label: '🚀 스톡옵션' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setBenefitFilter(item.id as BenefitFilterOption)}
                className={`px-2 py-0.5 rounded-md shrink-0 font-semibold border transition-all ${
                  benefitFilter === item.id
                    ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex-wrap gap-2">
            {/* Count & Reset */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                공고 <span className="text-blue-600 dark:text-blue-400">{totalItems}</span>건
              </span>
              {totalItems > 0 && pageSize !== 'all' && (
                <span className="text-[11px] text-slate-400">
                  ({startIndex + 1}-{endIndex}건 / {safeCurrentPage}p)
                </span>
              )}
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

            <div className="flex items-center gap-3">
              {/* Page size selector */}
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400">보기:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPageSize(v === 'all' ? 'all' : Number(v) as 5 | 10);
                  }}
                  className="bg-transparent text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={5} className="dark:bg-slate-900">5개씩</option>
                  <option value={10} className="dark:bg-slate-900">10개씩</option>
                  <option value="all" className="dark:bg-slate-900">전체</option>
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1 text-[11px]">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="최신순" className="dark:bg-slate-900">최신순</option>
                  <option value="마감임박순" className="dark:bg-slate-900">마감임박순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target anchor for smooth scrolling on page change */}
      <div ref={jobListTopRef} />

      {/* Job Card List */}
      <div className="px-3 space-y-2.5">
        {isLoading ? (
          <>
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </>
        ) : paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isBookmarked={bookmarkedJobIds.includes(job.id)}
              onToggleBookmark={onToggleBookmark}
              onClick={() => onSelectJob(job)}
              isSelectedForCompare={compareJobIds.includes(job.id)}
              onToggleCompare={handleToggleCompare}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              조건에 맞는 공고가 없습니다.
            </p>
            <p className="text-xs text-slate-400">
              필터를 변경하거나 검색어를 초기화해보세요.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                필터 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {!isLoading && pageSize !== 'all' && totalPages > 1 && (
        <div className="px-3 pt-3 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-1 select-none flex-wrap">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={safeCurrentPage === 1}
              title="첫 페이지"
              aria-label="첫 페이지"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              title="이전 페이지"
              aria-label="이전 페이지"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 mx-1">
              {pageNumbers.map((p, idx) => {
                if (p === 'ellipsis') {
                  return (
                    <span key={`ell-${idx}`} className="px-1 text-slate-400 text-xs">
                      …
                    </span>
                  );
                }
                const isCurrent = p === safeCurrentPage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p as number)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              title="다음 페이지"
              aria-label="다음 페이지"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={safeCurrentPage === totalPages}
              title="마지막 페이지"
              aria-label="마지막 페이지"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {safeCurrentPage} / {totalPages} 페이지 (총 {totalItems}개 공고 중 {startIndex + 1} - {endIndex}번째)
          </div>
        </div>
      )}

      {/* 🎯 Floating Bottom Dock: 공고 비교하기 (Compare Jobs Dock) */}
      {compareJobIds.length >= 2 && (
        <div className="fixed bottom-18 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-5 duration-200">
          <div className="pointer-events-auto bg-slate-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-blue-500/50 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>선택 공고 {compareJobIds.length}개</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1"
            >
              <span>1:1 비교하기 ›</span>
            </button>
            <button
              type="button"
              onClick={() => setCompareJobIds([])}
              className="text-[11px] text-slate-400 hover:text-white underline pl-1"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CompareJobsModal
          jobs={jobsToCompare}
          onClose={() => setIsCompareModalOpen(false)}
          mySkills={mySkills}
          myCertificates={myCertificates}
          myMajors={myMajors}
          onSelectJob={onSelectJob}
          onOpenSourceUrl={onOpenSourceUrl}
          viewMode={viewMode}
        />
      )}

      {/* Region Bottom Sheet Modal */}
      <RegionBottomSheet
        isOpen={isRegionSheetOpen}
        onClose={() => setIsRegionSheetOpen(false)}
        filterState={regionFilter}
        onApply={(newState) => setRegionFilter(newState)}
        matchingCount={totalItems}
      />
    </div>
  );
};
