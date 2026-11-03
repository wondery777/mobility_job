import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileText,
  CheckCheck,
  Copy,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  Send,
  Lightbulb,
} from 'lucide-react';
import { Job } from '../data';
import {
  fetchAiResumeDraft,
  fetchAiResumeFeedback,
  AiResumeDraftResponse,
  AiResumeFeedbackResponse,
} from '../services/api';

interface AiResumeAssistantModalProps {
  job: Job | null;
  onClose: () => void;
  userGpa?: string;
  userMajors?: string[];
  userSkills?: string[];
  userCertificates?: string[];
  viewMode?: 'mobile' | 'web';
}

export const AiResumeAssistantModal: React.FC<AiResumeAssistantModalProps> = ({
  job,
  onClose,
  userGpa = '3.85',
  userMajors = [],
  userSkills = [],
  userCertificates = [],
  viewMode = 'mobile',
}) => {
  if (!job) return null;

  const [activeTab, setActiveTab] = useState<'draft' | 'feedback'>('draft');

  // Tab 1: Draft States
  const [draftResult, setDraftResult] = useState<AiResumeDraftResponse | null>(null);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftCopied, setDraftCopied] = useState(false);

  // Tab 2: Feedback States
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackResult, setFeedbackResult] = useState<AiResumeFeedbackResponse | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [revisedCopied, setRevisedCopied] = useState(false);

  // Handle Generate Draft
  const handleGenerateDraft = async () => {
    setIsDraftLoading(true);
    setDraftError(null);

    try {
      const data = await fetchAiResumeDraft({
        jobTitle: job.title,
        company: job.company,
        field: job.field,
        required: job.required,
        preferred: job.preferred,
        userGpa,
        userMajors,
        userSkills,
        userCertificates,
      });

      setDraftResult(data);
    } catch (err: any) {
      setDraftError(err?.message || '자소서 초안 작성 중 오류가 발생했습니다.');
    } finally {
      setIsDraftLoading(false);
    }
  };

  // Handle Generate Feedback
  const handleAnalyzeFeedback = async () => {
    if (!feedbackInput.trim()) {
      setFeedbackError('진단 및 첨삭을 받을 자소서 텍스트를 입력해주세요.');
      return;
    }

    setIsFeedbackLoading(true);
    setFeedbackError(null);

    try {
      const data = await fetchAiResumeFeedback({
        resumeText: feedbackInput,
        jobTitle: job.title,
        company: job.company,
        field: job.field,
        required: job.required,
        preferred: job.preferred,
      });

      setFeedbackResult(data);
    } catch (err: any) {
      setFeedbackError(err?.message || '자소서 첨삭 중 오류가 발생했습니다.');
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  // Copy Draft
  const handleCopyDraft = () => {
    if (draftResult?.draft && navigator.clipboard) {
      navigator.clipboard.writeText(draftResult.draft);
      setDraftCopied(true);
      setTimeout(() => setDraftCopied(false), 2000);
    }
  };

  // Copy Revised Draft
  const handleCopyRevised = () => {
    if (feedbackResult?.revisedDraft && navigator.clipboard) {
      navigator.clipboard.writeText(feedbackResult.revisedDraft);
      setRevisedCopied(true);
      setTimeout(() => setRevisedCopied(false), 2000);
    }
  };

  // Transfer Draft to Feedback Tab
  const handleTransferToFeedback = () => {
    if (draftResult?.draft) {
      setFeedbackInput(draftResult.draft);
      setActiveTab('feedback');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 animate-in fade-in duration-200">
      <div
        className={`w-full ${
          viewMode === 'web' ? 'max-w-2xl' : 'max-w-[440px]'
        } max-h-[92vh] bg-white dark:bg-slate-900 rounded-[20px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Gemini AI 자소서 올인원 도우미</span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {job.company} · {job.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Tabs Segmented Control */}
        <div className="px-4 pt-3 pb-1">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('draft')}
              className={`py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'draft'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>✨ AI 맞춤 초안 생성</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'feedback'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>🔍 AI 자소서 첨삭 및 진단</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
          {/* TAB 1: AI 맞춤 초안 생성 */}
          {activeTab === 'draft' && (
            <div className="space-y-3">
              {/* My Specs Summary Pill Card */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold">
                  <span>내 등록 스펙 반영</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                    학점 {userGpa} / 4.5
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
                    {userMajors.slice(0, 2).join(', ') || '전공 미등록'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                    기술 {userSkills.slice(0, 3).join(', ')}
                  </span>
                  {userCertificates.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                      {userCertificates.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Generate Action Button */}
              {!draftResult && !isDraftLoading && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-slate-800 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/60 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      원클릭 500자 맞춤 초안 생성
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[320px] mx-auto leading-relaxed">
                      지원자의 전공·기술 강점과 {job.company}의 직무 요건을 매칭하여 1번 항목(지원 동기 및 기여 방안)을 완성합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateDraft}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Gemini AI 맞춤 초안 작성 시작</span>
                  </button>
                </div>
              )}

              {/* Loading Skeleton */}
              {isDraftLoading && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-3 animate-pulse">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>지원자의 스펙을 분석하여 500자 자소서 초안을 작성 중입니다...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
              )}

              {/* Error */}
              {draftError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-start justify-between">
                  <span>{draftError}</span>
                  <button
                    type="button"
                    onClick={handleGenerateDraft}
                    className="text-xs font-bold underline"
                  >
                    재시도
                  </button>
                </div>
              )}

              {/* Draft Generated Result Card */}
              {draftResult && !isDraftLoading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        1번 문항 지원동기 & 직무역량 초안
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {draftResult.wordCount}자
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleGenerateDraft}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs flex items-center gap-1"
                        title="다시 생성"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span className="text-[10px]">재작성</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyDraft}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        {draftCopied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{draftCopied ? '복사됨!' : '초안 복사'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-slate-400">반영된 강점:</span>
                    {draftResult.keyStrengthsUsed.map((str, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold"
                      >
                        #{str}
                      </span>
                    ))}
                  </div>

                  {/* Draft Text Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line select-text">
                    {draftResult.draft}
                  </div>

                  {/* Transfer to Feedback Action */}
                  <button
                    type="button"
                    onClick={handleTransferToFeedback}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>이 초안으로 즉시 AI 첨삭·피드백 진단받기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI 자소서 첨삭 및 피드백 진단 */}
          {activeTab === 'feedback' && (
            <div className="space-y-3">
              {/* Input Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>첨삭 및 진단받을 자기소개서 본문</span>
                  <span className="text-slate-400 text-[10px]">
                    {feedbackInput.length}자
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="자기소개서 작성 내용을 이곳에 붙여넣으세요 (초안 탭에서 가져오거나 직접 입력 가능)..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAnalyzeFeedback}
                disabled={isFeedbackLoading || !feedbackInput.trim()}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {isFeedbackLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                <span>Gemini 서류 평가관 모드 정밀 첨삭 시작</span>
              </button>

              {/* Error */}
              {feedbackError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs text-rose-700 dark:text-rose-300">
                  {feedbackError}
                </div>
              )}

              {/* Feedback Result View */}
              {feedbackResult && !isFeedbackLoading && (
                <div className="space-y-3 pt-1">
                  {/* 1. Fit Score Header */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-xs">
                    <div>
                      <div className="text-[10px] text-cyan-300 font-bold">
                        {job.company} 직무 적합도 점수
                      </div>
                      <div className="text-2xl font-black text-white mt-0.5">
                        {feedbackResult.fitScore}점{' '}
                        <span className="text-xs font-medium text-slate-300">/ 100점</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200">
                      {feedbackResult.fitScore >= 85
                        ? '서류 통과 유력 🚀'
                        : feedbackResult.fitScore >= 70
                        ? '보완 후 합격 가능 👍'
                        : '전면 수정 권장 💡'}
                    </div>
                  </div>

                  {/* 2. Strengths & Improvements */}
                  <div className="grid grid-cols-1 gap-2">
                    {/* Strengths */}
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                      <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>잘된 점 (강점 요소)</span>
                      </div>
                      <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1 pl-4 list-disc">
                        {feedbackResult.strengths.map((s, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
                      <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>보완할 점 (합격률 개선 제안)</span>
                      </div>
                      <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1 pl-4 list-disc">
                        {feedbackResult.improvements.map((imp, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3. Revised Model Draft */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                        <span>✨ AI 수정 추천 모범 답안 예시</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyRevised}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        {revisedCopied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{revisedCopied ? '복사됨!' : '수정본 복사'}</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line select-text">
                      {feedbackResult.revisedDraft}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
