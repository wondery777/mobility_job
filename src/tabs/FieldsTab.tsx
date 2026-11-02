import React from 'react';
import { Compass, ChevronRight, Briefcase } from 'lucide-react';
import { MobilityField, MOBILITY_FIELDS, Job } from '../data';
import { getFieldIcon } from '../components/FieldIcons';

interface FieldsTabProps {
  jobs: Job[];
  onSelectField: (field: MobilityField) => void;
  viewMode?: 'mobile' | 'web';
}

export const FieldsTab: React.FC<FieldsTabProps> = ({
  jobs,
  onSelectField,
  viewMode = 'mobile',
}) => {
  return (
    <div className="space-y-3.5 px-3 py-3 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
              모빌리티 6대 핵심 분야
            </h1>
            <p className="text-[11px] text-slate-400">
              분야별 직무 특성과 요구 기술 스택 탐색
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2-Column Mobile, 3-Column on Web */}
      <div
        className={`grid gap-2.5 ${
          viewMode === 'web' ? 'grid-cols-2 md:grid-cols-3 gap-3.5' : 'grid-cols-2'
        }`}
      >
        {MOBILITY_FIELDS.map((field) => {
          const fieldJobsCount = jobs.filter((j) => j.field === field.name).length;

          return (
            <div
              key={field.name}
              onClick={() => onSelectField(field)}
              className="group relative rounded-[14px] p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.985]"
            >
              {/* Top Gradient Banner Box */}
              <div
                className={`w-full h-24 rounded-xl p-3 flex flex-col justify-between text-white shadow-xs mb-3 transition-transform group-hover:scale-[1.01] ${field.gradient.bgClass}`}
              >
                <div className="flex items-start justify-between">
                  {/* Custom White Line SVG Icon */}
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/20">
                    {getFieldIcon(field.name, 'w-5 h-5 text-white')}
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    {field.name}
                  </h3>
                </div>
              </div>

              {/* Card below description & Job count */}
              <div className="space-y-1">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-tight">
                  {field.shortDesc}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">채용 진행</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                    <Briefcase className="w-3 h-3 text-blue-500" />
                    공고 {fieldJobsCount}건
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
