/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3 shadow-2xs">
      {/* Top Row: company & badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="w-12 h-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
        </div>
        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <div className="w-4/5 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="w-2/3 h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      </div>

      {/* Skills chips */}
      <div className="flex items-center gap-1.5 pt-1">
        <div className="w-12 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="w-14 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="w-10 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="w-16 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Footer Info: Region, Deadline */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded-md" />
        <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
  );
};

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="w-16 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md" />
        <div className="w-12 h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      </div>
      <div className="w-11/12 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="w-3/4 h-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      <div className="pt-1 flex items-center justify-between">
        <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800/50 rounded-md" />
        <div className="w-14 h-3 bg-slate-100 dark:bg-slate-800/50 rounded-md" />
      </div>
    </div>
  );
};

interface EmptyStateWithRetryProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  isLoading?: boolean;
}

export const EmptyStateWithRetry: React.FC<EmptyStateWithRetryProps> = ({
  title = '데이터를 불러오지 못했습니다',
  message = '일시적인 네트워크 오류이거나 서버 응답이 지연되고 있습니다.',
  onRetry,
  isLoading = false,
}) => {
  return (
    <div className="py-12 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 stroke-[1.8]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">{message}</p>
      </div>
      <div>
        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? '재시도 중...' : '다시 시도'}</span>
        </button>
      </div>
    </div>
  );
};
