/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ProblemForm } from './components/ProblemForm';
import { ResultCard } from './components/ResultCard';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { RecentReports } from './components/RecentReports';
import { Footer } from './components/Footer';
import { ProblemCategory, SolutionResponse } from './types';
import { Sparkles, ShieldAlert, CheckCircle, ArrowDown } from 'lucide-react';

const STORAGE_KEY = 'campusfix_saved_reports_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'solver' | 'history'>('solver');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSolution, setCurrentSolution] = useState<SolutionResponse | null>(null);
  const [savedReports, setSavedReports] = useState<SolutionResponse[]>([]);
  const [lastSubmitted, setLastSubmitted] = useState<{
    title: string;
    category: ProblemCategory;
    description: string;
    location: string;
  } | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // Load saved reports from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedReports(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read saved reports from localStorage', e);
    }
  }, []);

  // Save to localStorage when updated
  const saveReportsToStorage = (reports: SolutionResponse[]) => {
    setSavedReports(reports);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('Could not write reports to localStorage', e);
    }
  };

  const handleSubmitProblem = async (formData: {
    title: string;
    category: ProblemCategory;
    description: string;
    location: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setCurrentSolution(null);
    setLastSubmitted(formData);

    try {
      const response = await fetch('/api/solve-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with status ${response.status}: Failed to generate solutions.`
        );
      }

      const data: SolutionResponse = await response.json();
      setCurrentSolution(data);

      // Add to session saved reports (avoid duplicate ids)
      const updated = [data, ...savedReports.filter((r) => r.problem.id !== data.problem.id)];
      saveReportsToStorage(updated);

      // Scroll to result after state update
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Error submitting campus problem:', err);
      setError(err?.message || 'Failed to connect to the campus problem solver. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastSubmitted) {
      handleSubmitProblem(lastSubmitted);
    } else {
      setError(null);
    }
  };

  const handleReset = () => {
    setCurrentSolution(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReport = (report: SolutionResponse) => {
    setCurrentSolution(report);
    setActiveTab('solver');
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDeleteReport = (id?: string) => {
    if (!id) return;
    const updated = savedReports.filter((r) => r.problem.id !== id && r.id !== id);
    saveReportsToStorage(updated);
    if (currentSolution?.problem.id === id) {
      setCurrentSolution(null);
    }
  };

  const handleClearReports = () => {
    if (window.confirm('Are you sure you want to clear your saved reports history?')) {
      saveReportsToStorage([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setError(null);
        }}
        savedCount={savedReports.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Campus Problem Solver for Students</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Spot a campus problem? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Get practical solutions fast.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Report maintenance issues, plumbing leaks, electrical faults, or classroom damage.
            CampusFix pinpoints the exact campus authority and generates three realistic, prioritized actions.
          </p>
        </div>

        {/* Tab Content */}
        {activeTab === 'history' ? (
          <RecentReports
            reports={savedReports}
            onSelectReport={handleSelectReport}
            onClearReports={handleClearReports}
            onDeleteReport={handleDeleteReport}
            onNewReport={() => {
              setActiveTab('solver');
              setCurrentSolution(null);
            }}
          />
        ) : (
          <div className="space-y-8" ref={resultRef}>
            {/* Loading State */}
            {isLoading && <LoadingState />}

            {/* Error State */}
            {!isLoading && error && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {/* Result State */}
            {!isLoading && !error && currentSolution && (
              <ResultCard
                solution={currentSolution}
                onReset={handleReset}
              />
            )}

            {/* Form State (show form when not viewing solution or when viewing form) */}
            {!isLoading && !currentSolution && (
              <ProblemForm
                onSubmit={handleSubmitProblem}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
