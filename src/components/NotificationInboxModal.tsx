/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Calendar,
  Sparkles,
  Info,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { NotificationHistoryItem } from '../services/api';
import { Job } from '../data';

interface NotificationInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationHistoryItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (item: NotificationHistoryItem) => void;
}

export const NotificationInboxModal: React.FC<NotificationInboxModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeBadge = (type: NotificationHistoryItem['type']) => {
    switch (type) {
      case 'deadline':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-2.5 h-2.5" />
            마감 임박
          </span>
        );
      case 'new_job':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-2.5 h-2.5" />
            맞춤 신규
          </span>
        );
      case 'system':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <Info className="w-2.5 h-2.5" />
            안내
          </span>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bell className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  알림 보관함
                </h2>
                {unreadCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                    {unreadCount}
                  </span>
                ) : null}
              </div>
              <p className="text-[10px] text-slate-400">
                수신된 마감 알림 및 맞춤 채용 정보를 확인하세요
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls Bar */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
            <span>총 {notifications.length}개의 알림</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  모두 읽음
                </button>
              )}
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                비우기
              </button>
            </div>
          </div>
        )}

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100/60 dark:divide-slate-800/60">
          {notifications.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Bell className="w-5 h-5 stroke-[1.5]" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                수신된 알림이 없습니다
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                MY 탭에서 마감 임박 알림과 관심 분야/기술 알림 설정을 켜보세요.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                className={`pt-2.5 first:pt-0 p-2.5 rounded-2xl transition-all cursor-pointer ${
                  item.read
                    ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75'
                    : 'bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getTypeBadge(item.type)}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.timestamp}
                    </span>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>

                {item.jobId && (
                  <div className="mt-2.5 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      공고 상세 확인하기
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
