import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, Newspaper, RefreshCw, Rss } from 'lucide-react';
import { NewsItem, MOBILITY_FIELDS } from '../data';
import { getFieldIcon } from '../components/FieldIcons';
import { NewsCardSkeleton } from '../components/SkeletonLoader';
import { formatFriendlyTime } from '../services/api';

interface NewsTabProps {
  newsList: NewsItem[];
  onOpenNewsUrl: (url: string, title: string) => void;
  viewMode?: 'mobile' | 'web';
  isLoading?: boolean;
  isRefreshing?: boolean;
  lastUpdated?: string | null;
  onRefresh?: () => void;
}

const ALL_FIELDS = [
  '전체',
  '자율주행',
  '전기차·배터리',
  'UAM·드론',
  '모빌리티 서비스',
  '차량용 SW·반도체',
  '자동차 부품',
];

export const NewsTab: React.FC<NewsTabProps> = ({
  newsList,
  onOpenNewsUrl,
  viewMode = 'mobile',
  isLoading = false,
  isRefreshing = false,
  lastUpdated = null,
  onRefresh,
}) => {
  const [selectedField, setSelectedField] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      // 1. Field
      if (selectedField !== '전체' && item.field !== selectedField) {
        return false;
      }
      // 2. Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSource) {
          return false;
        }
      }
      return true;
    });
  }, [newsList, selectedField, searchQuery]);

  return (
    <div className="space-y-3 px-3 py-3 pb-8">
      {/* Tab Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
                모빌리티 최신 뉴스
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800">
                <Rss className="w-2.5 h-2.5 text-amber-500" />
                구글 RSS 실시간
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              기술 트렌드와 산업 동향을 실시간으로 확인하세요
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              {formatFriendlyTime(lastUpdated)} 갱신
            </span>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3 h-3 text-blue-600 dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? '갱신 중...' : '뉴스 새로고침'}</span>
            </button>
          )}
          <span className="text-xs font-semibold text-slate-400">
            총 {filteredNews.length}건
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="뉴스 키워드, 매체명 검색..."
          className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

      {/* Field Chips */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_FIELDS.map((fieldName) => {
          const isSelected = selectedField === fieldName;
          return (
            <button
              key={fieldName}
              type="button"
              onClick={() => setSelectedField(fieldName)}
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

      {/* News Cards List */}
      <div
        className={`pt-1 ${
          viewMode === 'web'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
            : 'space-y-2.5'
        }`}
      >
        {isLoading ? (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        ) : filteredNews.length > 0 ? (
          filteredNews.map((news) => {
            const fieldDef = MOBILITY_FIELDS.find((f) => f.name === news.field);

            return (
              <div
                key={news.id}
                onClick={() => onOpenNewsUrl(news.url, news.title)}
                className="group p-3.5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer active:scale-[0.995]"
              >
                {/* Meta header: Field Icon, Source, Published time */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 ${
                        fieldDef ? fieldDef.gradient.bgClass : 'bg-blue-600'
                      }`}
                    >
                      {getFieldIcon(news.field, 'w-3.5 h-3.5')}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {news.source}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      · {news.publishedAt}
                    </span>
                  </div>

                  {/* Field tag */}
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      fieldDef
                        ? `${fieldDef.gradient.textClass} bg-slate-100 dark:bg-slate-800`
                        : 'text-blue-600 bg-blue-50'
                    }`}
                  >
                    {news.field}
                  </span>
                </div>

                {/* News Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2 mb-2">
                  {news.title}
                </h3>

                {/* Card footer: 원문 보기 › */}
                <div className="flex items-center justify-end text-xs font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  <span>원문 보기</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              일치하는 뉴스가 없습니다.
            </p>
            <p className="text-xs text-slate-400">
              분야 필터나 검색어를 변경해 보세요.
            </p>
          </div>
        )}
      </div>

      <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
        기사 전문은 언론사 저작권 보호를 위해 원문 링크로 직접 연결됩니다.
      </div>
    </div>
  );
};
