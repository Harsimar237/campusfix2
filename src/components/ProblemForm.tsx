import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Droplets,
  Building2,
  Trash2,
  HelpCircle,
  MapPin,
  FileText,
  AlertCircle,
  Shuffle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { ProblemCategory } from '../types';
import { CAMPUS_EXAMPLES, CampusExample } from '../data/examples';

interface ProblemFormProps {
  onSubmit: (formData: {
    title: string;
    category: ProblemCategory;
    description: string;
    location: string;
  }) => void;
  isLoading: boolean;
}

const CATEGORIES: {
  id: ProblemCategory;
  label: string;
  icon: React.ElementType;
  badgeColor: string;
  activeColor: string;
}[] = [
  {
    id: 'Cleanliness',
    label: 'Cleanliness',
    icon: Trash2,
    badgeColor: 'border-emerald-200 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50',
    activeColor: 'border-emerald-600 bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200'
  },
  {
    id: 'Infrastructure',
    label: 'Infrastructure',
    icon: Building2,
    badgeColor: 'border-blue-200 text-blue-800 bg-blue-50/50 hover:bg-blue-50',
    activeColor: 'border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-200'
  },
  {
    id: 'Electricity',
    label: 'Electricity',
    icon: Zap,
    badgeColor: 'border-amber-200 text-amber-800 bg-amber-50/50 hover:bg-amber-50',
    activeColor: 'border-amber-600 bg-amber-500 text-white shadow-sm ring-2 ring-amber-200'
  },
  {
    id: 'Water',
    label: 'Water',
    icon: Droplets,
    badgeColor: 'border-cyan-200 text-cyan-800 bg-cyan-50/50 hover:bg-cyan-50',
    activeColor: 'border-cyan-600 bg-cyan-600 text-white shadow-sm ring-2 ring-cyan-200'
  },
  {
    id: 'Other',
    label: 'Other',
    icon: HelpCircle,
    badgeColor: 'border-purple-200 text-purple-800 bg-purple-50/50 hover:bg-purple-50',
    activeColor: 'border-purple-600 bg-purple-600 text-white shadow-sm ring-2 ring-purple-200'
  }
];

export const ProblemForm: React.FC<ProblemFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProblemCategory>('Infrastructure');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [lastExampleIndex, setLastExampleIndex] = useState(-1);

  const fillExample = (example?: CampusExample) => {
    let selected: CampusExample;
    if (example) {
      selected = example;
    } else {
      const nextIndex = (lastExampleIndex + 1) % CAMPUS_EXAMPLES.length;
      selected = CAMPUS_EXAMPLES[nextIndex];
      setLastExampleIndex(nextIndex);
    }

    setTitle(selected.title);
    setCategory(selected.category);
    setLocation(selected.location);
    setDescription(selected.description);
    setErrors({});
  };

  const handleReset = () => {
    setTitle('');
    setCategory('Infrastructure');
    setLocation('');
    setDescription('');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a short title for the problem.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title should be at least 5 characters long.';
    }

    if (!category) {
      newErrors.category = 'Please select a problem category.';
    }

    if (!location.trim()) {
      newErrors.location = 'Please specify where on campus this problem is located.';
    } else if (location.trim().length < 4) {
      newErrors.location = 'Please provide a more specific campus location.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe the issue in a few sentences.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Please provide more details (at least 15 characters) so we can suggest exact solutions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    onSubmit({
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim()
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
      {/* Header bar with Try Example */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Report a Campus Issue</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Describe the problem accurately to receive prioritized solutions and official contact routing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fillExample()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200/70"
            title="Pre-fill form with a realistic campus scenario"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Try Example</span>
          </button>

          {(title || location || description) && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Clear all fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Example Scenarios Chips */}
      <div className="mt-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Scenarios:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CAMPUS_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => fillExample(ex)}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors text-left flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{ex.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="problem-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Problem Title <span className="text-red-500">*</span>
          </label>
          <input
            id="problem-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="e.g., Water Cooler Leaking & Pooling in Hallway"
            maxLength={120}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              errors.title
                ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          <div className="flex items-center justify-between mt-1 text-xs">
            {errors.title ? (
              <span className="text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </span>
            ) : (
              <span className="text-slate-400">Be concise and specific</span>
            )}
            <span className="text-slate-400">{title.length}/120</span>
          </div>
        </div>

        {/* Category Radio / Pills */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? cat.activeColor
                      : `${cat.badgeColor} border`
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : ''}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
          {errors.category && (
            <span className="text-red-600 text-xs flex items-center gap-1 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.category}
            </span>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="problem-location" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Campus Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              id="problem-location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
              }}
              placeholder="e.g., Central Library 3rd Floor, West Elevator Bank"
              maxLength={150}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.location
                  ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.location ? (
            <span className="text-red-600 text-xs flex items-center gap-1 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.location}
            </span>
          ) : (
            <span className="text-xs text-slate-400 mt-1 block">
              Specify building name, floor, room number, or nearby landmark
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="problem-description" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Description of the Problem <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="problem-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Describe what happened, any visible hazard (sparks, water pool, smoke, obstruction), and how it affects students..."
              maxLength={800}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs">
            {errors.description ? (
              <span className="text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </span>
            ) : (
              <span className="text-slate-400">
                Mention if someone is at immediate risk or if equipment is damaged
              </span>
            )}
            <span className="text-slate-400">{description.length}/800</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Campus Problem...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                <span className="text-base font-bold">Suggest Solutions</span>
                <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
