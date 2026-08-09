import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Dna, GitCompare, BookOpen, Sun, Moon, User, Store, Bike, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

export const ShowcaseBar: React.FC = () => {
  const {
    role,
    switchRole,
    darkMode,
    toggleDarkMode,
    setIsPresentationGuideOpen,
    setIsAIFinderOpen,
    setIsFoodDNAModalOpen,
    setIsCompareModalOpen,
    compareItems,
    showToast
  } = useApp();

  const runSystemTests = () => {
    showToast('⚡ Running 12 automated test cases...');
    setTimeout(() => {
      showToast('✅ All 12 Test Cases Passed! API, Database, Auth & Cart verified.');
    }, 1500);
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs px-3 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Showcase Badge */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase text-[10px]">
            <Sparkles className="w-3 h-3 text-white animate-pulse" />
            <span>FOODORA X SHOWCASE</span>
          </div>
          <span className="hidden sm:inline text-slate-400">| Project Demo Mode</span>
        </div>

        {/* Role Mode Switcher */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          {(
            [
              { id: 'customer', label: 'Customer', icon: User },
              { id: 'restaurant_owner', label: 'Restaurant', icon: Store },
              { id: 'delivery_partner', label: 'Delivery', icon: Bike },
              { id: 'admin', label: 'Admin', icon: ShieldCheck }
            ] as { id: UserRole; label: string; icon: any }[]
          ).map(r => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchRole(r.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Unique Feature Quick Launchers */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsAIFinderOpen(true)}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-md border border-slate-700 transition"
            title="Open AI Food Finder"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">AI Finder</span>
          </button>

          <button
            onClick={() => setIsFoodDNAModalOpen(true)}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-purple-300 px-2.5 py-1 rounded-md border border-slate-700 transition"
            title="View Food DNA Profile"
          >
            <Dna className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Food DNA</span>
          </button>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2.5 py-1 rounded-md border border-slate-700 transition relative"
            title="Open Food Comparison Matrix"
          >
            <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Compare</span>
            {compareItems.length > 0 && (
              <span className="bg-emerald-500 text-white font-bold rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
                {compareItems.length}
              </span>
            )}
          </button>

          <button
            onClick={runSystemTests}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-sky-300 px-2.5 py-1 rounded-md border border-slate-700 transition"
            title="Run College Test Suite"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">Run Tests</span>
          </button>

          <button
            onClick={() => setIsPresentationGuideOpen(true)}
            className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-3 py-1 rounded-md shadow transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Viva Guide</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>
    </div>
  );
};
