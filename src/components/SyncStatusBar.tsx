/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Sparkles, CheckCircle, Database } from 'lucide-react';
import { formatFriendlyTime } from '../services/api';

interface SyncStatusBarProps {
  lastUpdated: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenAiParser: () => void;
  label?: string;
}

export const SyncStatusBar: React.FC<SyncStatusBarProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  onOpenAiParser,
  label = '실시간 채용 데이터',
}) => {
  const friendlyTime = lastUpdated ? formatFriendlyTime(lastUpdated) : '방금 전';

  return (
    <div className="mx-3 p-2.5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50/80 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-100/80 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
            {label}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            · 갱신: {friendlyTime}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100/60 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            <Database className="w-2.5 h-2.5" />
            워크넷·공공API 연동
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95"
          title="외부 데이터 새로고침 및 캐시 동기화"
        >
          <RefreshCw className={`w-3 h-3 text-blue-600 dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? '최신화 중...' : '공고 최신화'}</span>
        </button>

        {/* AI Parser Button */}
        <button
          type="button"
          onClick={onOpenAiParser}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          title="공고 텍스트/URL을 붙여넣어 Gemini AI로 등록"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI 공고 등록</span>
        </button>
      </div>
    </div>
  );
};
