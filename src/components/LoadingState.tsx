import React, { useEffect, useState } from 'react';
import { Sparkles, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    'Evaluating reported issue and campus location...',
    'Identifying responsible university maintenance authority...',
    'Generating 3 prioritized, safety-first student actions...',
    'Drafting official maintenance ticket template...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto">
      {/* Animated icon pulse */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-30" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Sparkles className="w-8 h-8 animate-pulse text-indigo-100" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        CampusFix AI is Solving This Problem
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        Analyzing your report and finding the quickest, most realistic resolution path on campus.
      </p>

      {/* Progress steps */}
      <div className="max-w-md mx-auto space-y-2.5 text-left bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
        {steps.map((text, idx) => {
          const isDone = idx < step;
          const isCurrent = idx === step;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                isDone
                  ? 'text-emerald-700 font-medium'
                  : isCurrent
                  ? 'text-indigo-700 font-semibold'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
