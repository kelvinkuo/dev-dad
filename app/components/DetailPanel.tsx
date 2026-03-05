"use client";

import type { ScheduleItem } from "../schedule-data";

export interface DetailPanelProps {
  item: ScheduleItem;
}

export default function DetailPanel({ item }: DetailPanelProps) {
  return (
    <>
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm text-4xl mb-6">
          {item.icon}
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">
          {item.title}
        </h2>
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-lg font-bold text-slate-500">
            {item.time}
          </span>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full border ${item.bgClass} ${item.borderClass}`}
          >
            {item.category} ({item.duration}h)
          </span>
        </div>
      </div>

      <div
        className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed border-t border-slate-100 pt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_strong]:text-slate-700"
        dangerouslySetInnerHTML={{ __html: item.details }}
      />

      <div className="mt-auto pt-12">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Dev Dad 指南
          </div>
          <p className="text-sm text-slate-500 font-medium italic">
            &ldquo;优秀的开发者不仅能管理好代码的 State，也能管理好生活的步伐。&rdquo;
          </p>
        </div>
      </div>
    </>
  );
}
