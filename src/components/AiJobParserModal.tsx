/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  Code,
  Check,
} from 'lucide-react';
import { Job } from '../data';
import { parseJobPostingWithGemini, saveUserAddedJob, addNotificationHistory } from '../services/api';

interface AiJobParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: (job: Job) => void;
}

const PRESET_EXAMPLES = [
  {
    label: '현대차 로보틱스랩 자율주행 공고',
    company: '현대자동차',
    sampleText: `[현대자동차] 로보틱스랩 실내외 배송 로봇 자율주행 SW 개발자 채용
모집 부문: 로보틱스랩 자율주행선행팀
근무지: 경기도 의왕시 중앙연구소
고용 형태: 정규직 (신입 및 경력 1년 이상)
접수 마감일: 2026-11-29

[담당 업무]
- 실내외 도심 배송 로봇용 3D 라이다 및 스테레오 카메라 기반 SLAM 알고리즘 개발
- 동적 장애물 회피를 위한 실시간 로컬 패스 플래닝 및 모션 컨트롤러 구현
- ROS2 기반 임베디드 리눅스 시스템 최적화 및 현장 실차 주행 테스트

[지원 자격]
- 컴퓨터공학, 기계공학, 로봇공학 전공 학사 이상 학위 소지자
- C++14/17 및 Python을 활용한 소프트웨어 개발 역량
- ROS 또는 ROS2 기반 로봇 시스템 개발 경험 1년 이상
- Linux 환경 개발 및 Git 형상 관리 능숙자

[우대 사항]
- 이동 로봇 대회 수상자 또는 자율주행 프로젝트 포트폴리오 보유자
- 점군 데이터(Point Cloud) 필터링 및 GPU CUDA 병렬처리 경험
- 관련 자격증: 정보처리기사, 로봇기사
- 우대 전공: 로봇공학과, 컴퓨터공학과, 제어계측공학과`,
  },
  {
    label: 'LG엔솔 차세대 전고체 배터리 공고',
    company: 'LG에너지솔루션',
    sampleText: `[LG에너지솔루션] 차세대 전고체/고용량 EV 배터리 셀 선행설계 엔지니어
소속: 자동차전지개발센터 선행셀개발담당
근무지: 충북 청주시 오창에너지플랜트
경력 여부: 신입
서류 마감: 2026-11-24

[수행 직무]
- 차세대 전기차용 전고체 배터리 전극 기구설계 및 조립 공정 최적화
- 배터리 셀 열폭주 방지 내부 구조 설계 및 ANSYS 기반 3D 열전달 시뮬레이션
- 글로벌 자동차 OEM 사양 대응 전지 셀 기계적 강도 해석

[필수 자격]
- 기계공학, 화학공학, 신소재공학 전공 학사 이상
- 2D/3D CAD (CATIA 또는 SolidWorks) 모델링 가능자
- 엔지니어링 문제 해결에 대한 집요함과 원활한 협업 마인드

[우대 요건]
- 배터리 팩 또는 셀 열해석 CAE 경험 (ANSYS, Fluent)
- 관련 기사 자격증: 일반기계기사, 화공기사
- 우대 전공: 신소재공학과, 기계공학과, 화학공학과`,
  },
];

export const AiJobParserModal: React.FC<AiJobParserModalProps> = ({
  isOpen,
  onClose,
  onJobAdded,
}) => {
  const [activeInputType, setActiveInputType] = useState<'text' | 'url'>('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedJob, setParsedJob] = useState<Job | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (sample: string) => {
    setActiveInputType('text');
    setInputText(sample);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    setErrorMsg(null);
    setParsedJob(null);

    const textToSubmit = activeInputType === 'text' ? inputText.trim() : '';
    const urlToSubmit = activeInputType === 'url' ? inputUrl.trim() : '';

    if (!textToSubmit && !urlToSubmit) {
      setErrorMsg('공고 원문 텍스트를 입력하거나 유효한 공고 링크 URL을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await parseJobPostingWithGemini(textToSubmit, urlToSubmit);
      setParsedJob(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message || 'Gemini API 분석에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAndAddJob = () => {
    if (!parsedJob) return;

    // 1. Save to persistent user added jobs in LocalStorage
    saveUserAddedJob(parsedJob);

    // 2. Dispatch to App state
    onJobAdded(parsedJob);

    // 3. Add to Notification history
    addNotificationHistory({
      title: '새 공고 등록 완료',
      message: `[${parsedJob.company}] ${parsedJob.title} 공고가 내 목록에 추가되었습니다.`,
      jobId: parsedJob.id,
      type: 'new_job',
    });

    // Close modal
    onClose();
  };

  const handleReset = () => {
    setParsedJob(null);
    setErrorMsg(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  AI 공고 실시간 파싱 & 간편 등록
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                원문 텍스트나 채용 링크를 넣으면 기술스택·전공·자격요건을 정밀 분석합니다.
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {!parsedJob ? (
            <>
              {/* Input Type Selector: Text vs URL */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setActiveInputType('text')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeInputType === 'text'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>공고 원문 텍스트 붙여넣기</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInputType('url')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeInputType === 'url'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>채용공고 웹 링크 (URL)</span>
                </button>
              </div>

              {/* Preset Sample Quick Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500">
                  빠른 테스트용 실제 채용 공고 샘플:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_EXAMPLES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset.sampleText)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      ⚡ {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              {activeInputType === 'text' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    공고 원문 내용 (회사명, 업무, 자격요건, 우대사항 등)
                  </label>
                  <textarea
                    rows={8}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="채용 사이트(사람인, 잡코리아, 원티드, 회사 채용페이지 등)에서 복사한 공고 본문 텍스트를 그대로 붙여넣으세요..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y leading-relaxed font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      공고 웹페이지 URL 링크
                    </label>
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://careers.example.com/jobs/12345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 외부 웹사이트 보호 정책(CORS)으로 인해 본문 텍스트 직접 붙여넣기를 사용하시면 가장 정확하고 빠른 분석이 가능합니다.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </>
          ) : (
            /* Parsed Result Preview */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Gemini AI가 공고 데이터를 성공적으로 추출했습니다!</span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] underline hover:opacity-80 cursor-pointer"
                >
                  다시 분석하기
                </button>
              </div>

              {/* Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {parsedJob.company}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {parsedJob.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
                    {parsedJob.field}
                  </span>
                </div>

                {/* Meta badges */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {parsedJob.level}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {parsedJob.region}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    마감일: {parsedJob.deadline}
                  </span>
                </div>

                {/* Summary */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="text-[10px] font-bold text-slate-400 mb-1">AI 3줄 요약</div>
                  {parsedJob.summary}
                </div>

                {/* Skills */}
                <div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-blue-500" />
                    추출된 요구 기술 스택 ({parsedJob.skills.length}개)
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {parsedJob.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Majors */}
                {parsedJob.majors && parsedJob.majors.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      관련 / 우대 대학 전공
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {parsedJob.majors.map((major, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                        >
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {parsedJob.certificates && parsedJob.certificates.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                      우대 자격증
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {parsedJob.certificates.map((cert, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            닫기
          </button>

          {!parsedJob ? (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Gemini 3.8 Flash 분석 중...' : 'Gemini AI로 분석하기'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmAndAddJob}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>내 공고 목록에 즉시 등록</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
