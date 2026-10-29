import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
  PhoneCall,
  CheckSquare,
  Square,
  FileCheck2,
  Tag
} from 'lucide-react';
import { SolutionResponse } from '../types';

interface ResultCardProps {
  solution: SolutionResponse;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ solution, onReset }) => {
  const { problem, authority, actions, safetyAdvisory, campusTicketDraft, source } = solution;

  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});

  const toggleStep = (priorityNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [priorityNumber]: !prev[priorityNumber]
    }));
  };

  const copyTicketDraft = () => {
    const textToCopy = `Subject: ${campusTicketDraft.subject}\n\n${campusTicketDraft.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const copySummary = () => {
    const textToCopy = `CampusFix Report [${problem.id || 'CFX'}]
Issue: ${problem.title}
Category: ${problem.category}
Location: ${problem.location}
Authority: ${authority.departmentName} (${authority.contactChannel})

Prioritized Actions:
${actions
  .map(
    (a) =>
      `[Priority ${a.priorityNumber}] ${a.title}\n- ${a.actionSteps}\n- Timeframe: ${a.timeframe}`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const getPriorityTheme = (num: number) => {
    switch (num) {
      case 1:
        return {
          border: 'border-rose-200',
          bg: 'bg-rose-50/40',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          accent: 'text-rose-600',
          numberBadge: 'bg-rose-600 text-white'
        };
      case 2:
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50/40',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          accent: 'text-blue-600',
          numberBadge: 'bg-blue-600 text-white'
        };
      case 3:
      default:
        return {
          border: 'border-emerald-200',
          bg: 'bg-emerald-50/40',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          accent: 'text-emerald-600',
          numberBadge: 'bg-emerald-600 text-white'
        };
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Cleanliness':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Infrastructure':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Electricity':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Water':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Submitted Problem Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/15 text-indigo-200 border border-white/10">
                {problem.id || 'CFX-REPORT'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(problem.category)} bg-white text-slate-800`}>
                {problem.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copySummary}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
                title="Copy entire problem and action summary"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                title="Report another issue"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Issue</span>
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            {problem.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-200 font-medium">
              <MapPin className="w-4 h-4 text-indigo-300 shrink-0" />
              <span>{problem.location}</span>
            </span>
            <span className="text-slate-400">
              Reported: {new Date(problem.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Student Problem Description:
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {problem.description}
          </p>
        </div>
      </div>

      {/* Safety Advisory Banner (if applicable) */}
      {safetyAdvisory && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-900 block sm:inline">Safety &amp; Precaution Advisory: </span>
            <span className="text-amber-800">{safetyAdvisory}</span>
          </div>
        </div>
      )}

      {/* 2. Responsible Campus Authority Card */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 block">
                Responsible Campus Authority
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {authority.departmentName}
              </h2>
            </div>
          </div>

          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {authority.urgencyLevel || 'Standard Dispatch'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
          {authority.departmentRole}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Primary Contact / Portal
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                {authority.contactChannel}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Typical Turnaround Time
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                {authority.typicalTurnaround}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Suggested Actions Ordered by Priority */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Prioritized Action Plan</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Three practical steps ordered by urgency for student safety and swift campus resolution.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {Object.values(completedSteps).filter(Boolean).length}/3 Completed
          </span>
        </div>

        <div className="space-y-3.5">
          {actions.map((action) => {
            const theme = getPriorityTheme(action.priorityNumber);
            const isCompleted = !!completedSteps[action.priorityNumber];

            return (
              <div
                key={action.priorityNumber}
                className={`rounded-2xl border ${theme.border} bg-white shadow-xs p-5 sm:p-6 transition-all ${
                  isCompleted ? 'opacity-70 bg-slate-50/60' : ''
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${theme.numberBadge}`}
                    >
                      {action.priorityNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme.badge}`}>
                      {action.priorityLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {action.timeframe}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleStep(action.priorityNumber)}
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-base font-bold text-slate-900 mb-2 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                  {action.title}
                </h3>

                {/* Action steps */}
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  {action.actionSteps}
                </p>

                {/* Practical Tip */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
                  <span className="font-bold text-indigo-700 shrink-0">Student Pro-Tip:</span>
                  <span>{action.practicalTip}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Pre-written Official Campus Ticket Draft */}
      {campusTicketDraft && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ready-to-Send Ticket / Email Draft
                </h3>
                <p className="text-xs text-slate-500">
                  Copy and paste into your campus work order portal or email to {authority.departmentName}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={copyTicketDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              {copiedDraft ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Draft Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Ticket Draft</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
            <div className="text-emerald-400 font-semibold border-b border-slate-800 pb-1.5">
              Subject: {campusTicketDraft.subject}
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
              {campusTicketDraft.body}
            </pre>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Analysis powered by {source === 'gemini-ai' ? 'Gemini 3.8 Flash' : 'Campus Problem Rules Engine'}</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Report Another Issue</span>
        </button>
      </div>
    </div>
  );
};
