/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Newspaper,
  Calendar as CalendarIcon,
  Compass,
  User,
  Moon,
  Sun,
  Car,
  Smartphone,
  Monitor,
} from 'lucide-react';
import {
  SAMPLE_JOBS,
  SAMPLE_NEWS,
  MOBILITY_FIELDS,
  Job,
  NewsItem,
  MobilityField,
} from './data';
import { JobsTab } from './tabs/JobsTab';
import { NewsTab } from './tabs/NewsTab';
import { CalendarTab } from './tabs/CalendarTab';
import { FieldsTab } from './tabs/FieldsTab';
import { MyTab } from './tabs/MyTab';
import { JobDetailModal } from './components/JobDetailModal';
import { FieldDetailModal } from './components/FieldDetailModal';
import { ExternalLinkModal } from './components/ExternalLinkModal';

type TabType = 'jobs' | 'news' | 'calendar' | 'fields' | 'my';
type ViewMode = 'mobile' | 'web';

const STORAGE_KEYS = {
  BOOKMARKS: 'mobility_job_bookmarks_v1',
  MY_SKILLS: 'mobility_job_my_skills_v1',
  CUSTOM_SKILLS: 'mobility_job_custom_skills_v1',
  MY_CERTS: 'mobility_job_my_certs_v1',
  CUSTOM_CERTS: 'mobility_job_custom_certs_v1',
  MY_MAJORS: 'mobility_job_my_majors_v1',
  CUSTOM_MAJORS: 'mobility_job_custom_majors_v1',
  THEME: 'mobility_job_theme_v1',
  VIEW_MODE: 'mobility_job_view_mode_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [jobs] = useState<Job[]>(SAMPLE_JOBS);
  const [news] = useState<NewsItem[]>(SAMPLE_NEWS);

  // View Mode: 'mobile' (440px phone container) or 'web' (wide desktop dashboard)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      return (saved === 'web' || saved === 'mobile') ? saved : 'mobile';
    } catch {
      return 'mobile';
    }
  });

  // Field filter state shared for "이 분야 공고 필터로 보기"
  const [selectedField, setSelectedField] = useState<string>('전체');

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedFieldForDetail, setSelectedFieldForDetail] = useState<MobilityField | null>(null);
  const [externalUrlModal, setExternalUrlModal] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Theme state (Light / Dark)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Bookmarks state
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : ['job-01', 'job-04'];
    } catch {
      return ['job-01', 'job-04'];
    }
  });

  // Skills state
  const [mySkills, setMySkills] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MY_SKILLS);
      return saved
        ? JSON.parse(saved)
        : ['C++', 'Python', 'ROS', 'Linux', 'Git', '딥러닝'];
    } catch {
      return ['C++', 'Python', 'ROS', 'Linux', 'Git', '딥러닝'];
    }
  });

  const [customSkills, setCustomSkills] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_SKILLS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Certificates state
  const [myCertificates, setMyCertificates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MY_CERTS);
      return saved ? JSON.parse(saved) : ['정보처리기사', '운전면허 1종'];
    } catch {
      return ['정보처리기사', '운전면허 1종'];
    }
  });

  const [customCertificates, setCustomCertificates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_CERTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Majors state
  const [myMajors, setMyMajors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MY_MAJORS);
      return saved
        ? JSON.parse(saved)
        : ['컴퓨터공학과', '소프트웨어학과'];
    } catch {
      return ['컴퓨터공학과', '소프트웨어학과'];
    }
  });

  const [customMajors, setCustomMajors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_MAJORS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync theme to HTML root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  // Persist View Mode
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (e) {
      console.error(e);
    }
  }, [viewMode]);

  // Persist Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(bookmarkedJobIds)
      );
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedJobIds]);

  // Persist Skills
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MY_SKILLS, JSON.stringify(mySkills));
    } catch (e) {
      console.error(e);
    }
  }, [mySkills]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_SKILLS,
        JSON.stringify(customSkills)
      );
    } catch (e) {
      console.error(e);
    }
  }, [customSkills]);

  // Persist Certs
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.MY_CERTS,
        JSON.stringify(myCertificates)
      );
    } catch (e) {
      console.error(e);
    }
  }, [myCertificates]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_CERTS,
        JSON.stringify(customCertificates)
      );
    } catch (e) {
      console.error(e);
    }
  }, [customCertificates]);

  // Persist Majors
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.MY_MAJORS,
        JSON.stringify(myMajors)
      );
    } catch (e) {
      console.error(e);
    }
  }, [myMajors]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_MAJORS,
        JSON.stringify(customMajors)
      );
    } catch (e) {
      console.error(e);
    }
  }, [customMajors]);

  // Toggle Bookmark
  const handleToggleBookmark = (jobId: string) => {
    setBookmarkedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  // Jump from Field Detail to Jobs tab with filter
  const handleViewFieldInJobs = (fieldName: string) => {
    setSelectedField(fieldName);
    setActiveTab('jobs');
  };

  const handleOpenSourceUrl = (url: string, title: string) => {
    setExternalUrlModal({
      isOpen: true,
      url,
      title,
    });
  };

  const navItems = [
    { key: 'jobs' as TabType, label: '공고', icon: Briefcase },
    { key: 'news' as TabType, label: '뉴스', icon: Newspaper },
    { key: 'calendar' as TabType, label: '캘린더', icon: CalendarIcon },
    { key: 'fields' as TabType, label: '분야', icon: Compass },
    { key: 'my' as TabType, label: 'MY', icon: User, badge: bookmarkedJobIds.length },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center items-start sm:py-4 transition-colors">
      {/* Screen Frame: Supports Mobile View (max-w-[440px]) and Web Wide View (max-w-6xl) */}
      <div
        className={`w-full ${
          viewMode === 'web' ? 'max-w-6xl' : 'max-w-[440px]'
        } min-h-screen sm:min-h-[920px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col sm:rounded-[24px] sm:shadow-2xl sm:border border-slate-200/80 dark:border-slate-800 overflow-hidden relative transition-all duration-300`}
      >
        {/* Top App Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-3.5 py-2.5 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Car className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Mobility<span className="text-blue-600 dark:text-blue-400">Job</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
                  모빌리티
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden xs:block">
                취업 준비생을 위한 특화 채용 플랫폼
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links in Web Mode */}
          {viewMode === 'web' && (
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Mode Switcher: Mobile 440px vs Web Wide */}
            <button
              type="button"
              onClick={() =>
                setViewMode((prev) => (prev === 'mobile' ? 'web' : 'mobile'))
              }
              title={
                viewMode === 'mobile'
                  ? '웹 와이드 화면으로 전환'
                  : '모바일 440px 화면으로 전환'
              }
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/80 dark:border-slate-700"
            >
              {viewMode === 'mobile' ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-bold">웹으로 보기</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px] font-bold">모바일 뷰</span>
                </>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </header>

        {/* Tab View Content Area */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'jobs' && (
            <JobsTab
              jobs={jobs}
              bookmarkedJobIds={bookmarkedJobIds}
              onToggleBookmark={handleToggleBookmark}
              onSelectJob={(job) => setSelectedJobForDetail(job)}
              selectedField={selectedField}
              onSelectField={setSelectedField}
              viewMode={viewMode}
            />
          )}

          {activeTab === 'news' && (
            <NewsTab
              newsList={news}
              onOpenNewsUrl={handleOpenSourceUrl}
              viewMode={viewMode}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarTab
              jobs={jobs}
              bookmarkedJobIds={bookmarkedJobIds}
              onToggleBookmark={handleToggleBookmark}
              onSelectJob={(job) => setSelectedJobForDetail(job)}
              viewMode={viewMode}
            />
          )}

          {activeTab === 'fields' && (
            <FieldsTab
              jobs={jobs}
              onSelectField={(field) => setSelectedFieldForDetail(field)}
              viewMode={viewMode}
            />
          )}

          {activeTab === 'my' && (
            <MyTab
              jobs={jobs}
              bookmarkedJobIds={bookmarkedJobIds}
              onToggleBookmark={handleToggleBookmark}
              onSelectJob={(job) => setSelectedJobForDetail(job)}
              mySkills={mySkills}
              onUpdateMySkills={setMySkills}
              customSkills={customSkills}
              onUpdateCustomSkills={setCustomSkills}
              myCertificates={myCertificates}
              onUpdateMyCertificates={setMyCertificates}
              customCertificates={customCertificates}
              onUpdateCustomCertificates={setCustomCertificates}
              myMajors={myMajors}
              onUpdateMyMajors={setMyMajors}
              customMajors={customMajors}
              onUpdateCustomMajors={setCustomMajors}
              viewMode={viewMode}
            />
          )}

          {/* Footer Notice */}
          <footer className="px-4 py-4 text-center border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 text-[11px] text-slate-400 dark:text-slate-500">
            <p className="font-medium">
              ⚡ 시연용 가상 데이터 · 본 서비스의 기업명, 채용공고 및 기사는 포트폴리오 시연용입니다.
            </p>
            <p className="text-[10px] text-slate-400/80 mt-0.5">
              MobilityJob © 2026. 모빌리티 취업 준비생을 위한 맞춤형 서비스
            </p>
          </footer>
        </main>

        {/* Bottom Navigation Bar (5 Tabs) */}
        <nav
          className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg"
          aria-label="하단 네비게이션"
        >
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
                }`}
              >
                <div className="relative">
                  <IconComponent
                    className={`w-5 h-5 mb-0.5 transition-transform ${
                      isActive ? 'scale-110' : ''
                    }`}
                  />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-400 text-slate-900 text-[8px] font-black rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Job Detail Screen / Modal */}
      <JobDetailModal
        job={selectedJobForDetail}
        onClose={() => setSelectedJobForDetail(null)}
        isBookmarked={
          selectedJobForDetail
            ? bookmarkedJobIds.includes(selectedJobForDetail.id)
            : false
        }
        onToggleBookmark={handleToggleBookmark}
        mySkills={mySkills}
        myCertificates={myCertificates}
        myMajors={myMajors}
        onOpenSourceUrl={handleOpenSourceUrl}
        viewMode={viewMode}
      />

      {/* Field Detail Screen / Modal */}
      <FieldDetailModal
        field={selectedFieldForDetail}
        onClose={() => setSelectedFieldForDetail(null)}
        allJobs={jobs}
        allNews={news}
        mySkills={mySkills}
        onSelectJob={(job) => {
          setSelectedFieldForDetail(null);
          setSelectedJobForDetail(job);
        }}
        onViewFieldInJobs={handleViewFieldInJobs}
        onOpenNewsUrl={handleOpenSourceUrl}
        viewMode={viewMode}
      />

      {/* External Link Safe Viewer Modal */}
      <ExternalLinkModal
        isOpen={externalUrlModal.isOpen}
        onClose={() =>
          setExternalUrlModal({ isOpen: false, url: '', title: '' })
        }
        url={externalUrlModal.url}
        title={externalUrlModal.title}
      />
    </div>
  );
}
