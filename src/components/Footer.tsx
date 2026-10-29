import React from 'react';
import { ShieldAlert, Heart, Building, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs text-slate-600">
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Campus Emergency Protocol</h4>
              <p className="text-slate-500 leading-relaxed">
                For active fires, severe water mains breaks, gas smells, or immediate physical danger, call Campus Public Safety or 911 immediately.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Realistic Authority Routing</h4>
              <p className="text-slate-500 leading-relaxed">
                CampusFix does not invent fake claims of fixed issues. It provides concrete, prioritized student steps and official escalation channels.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Student Community Impact</h4>
              <p className="text-slate-500 leading-relaxed">
                By documenting specific locations, attaching ticket drafts, and following up systematically, campus facilities can resolve repairs faster.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-700">CampusFix</span> — Campus Problem Solver for Students &amp; Faculty
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with React, Express &amp; Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
