import React from 'react';
import { History, Eye, Trash2, MapPin, Building2, Calendar, FileText } from 'lucide-react';
import { SolutionResponse } from '../types';

interface RecentReportsProps {
  reports: SolutionResponse[];
  onSelectReport: (report: SolutionResponse) => void;
  onClearReports: () => void;
  onDeleteReport: (id?: string) => void;
  onNewReport: () => void;
}

export const RecentReports: React.FC<RecentReportsProps> = ({
  reports,
  onSelectReport,
  onClearReports,
  onDeleteReport,
  onNewReport
}) => {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 sm:p-12 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <History className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          No Reports Filed Yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          When you report campus problems and generate solutions, they will be saved here so you can review tickets and action plans anytime.
        </p>
        <button
          type="button"
          onClick={onNewReport}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
        >
          Report Your First Issue
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Saved Campus Reports ({reports.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Past problem solutions and maintenance drafts from your current session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewReport}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
          >
            + New Problem
          </button>
          <button
            type="button"
            onClick={onClearReports}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((item, index) => {
          const reportId = item.problem.id || item.id || `report-${index}`;
          return (
            <div
              key={reportId}
              className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white text-slate-700 border border-slate-200">
                    {item.problem.id || 'CFX'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {item.problem.category}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 line-clamp-1">
                  {item.problem.title}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.problem.location}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {item.problem.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/60 mb-4">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">
                    Target: {item.authority.departmentName}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-400">
                  {new Date(item.generatedAt || Date.now()).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSelectReport(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteReport(item.problem.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
