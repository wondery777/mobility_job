import React from 'react';
import { X, ExternalLink, Globe, Copy, Check } from 'lucide-react';

interface ExternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const ExternalLinkModal: React.FC<ExternalLinkModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[380px] bg-white dark:bg-slate-900 rounded-[20px] shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Globe className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              외부 채용 / 뉴스 원문 링크
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mb-2">
            {title}
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 break-all text-[11px] text-blue-600 dark:text-blue-400 font-mono flex items-center justify-between gap-2">
            <span className="truncate">{url}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 shrink-0"
              title="URL 복사"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
          💡 모바일 앱 미리보기 환경에서는 보안 정책에 따라 외부 원본 페이지로 이동 시 브라우저 새 탭에서 열거나 위 URL을 복사하여 확인하실 수 있습니다.
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            닫기
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 text-center shadow-xs"
          >
            <span>원문 바로가기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
