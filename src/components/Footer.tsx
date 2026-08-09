import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, ShieldCheck, Award, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsPresentationGuideOpen, setIsAIFinderOpen, setIsFoodDNAModalOpen } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-lg">
                X
              </div>
              <span className="font-black text-xl text-white tracking-tight">FOODORA X</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Next-generation food delivery platform featuring Gemini AI Craving Search, Eco Score tracking, and Food DNA rewards.
            </p>
            <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack College Capstone Project</span>
            </div>
          </div>

          {/* Col 2: Unique Features */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Smart Innovations
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setIsAIFinderOpen(true)} className="hover:text-orange-400 transition">
                  🤖 AI Craving Finder
                </button>
              </li>
              <li>
                <button onClick={() => setIsFoodDNAModalOpen(true)} className="hover:text-purple-400 transition">
                  🧬 Personalized Food DNA
                </button>
              </li>
              <li>
                <a href="#eco" className="hover:text-emerald-400 transition">
                  🌱 Eco Carbon Score (88/100)
                </a>
              </li>
              <li>
                <button onClick={() => setIsPresentationGuideOpen(true)} className="hover:text-amber-400 transition">
                  📚 Viva & Presentation Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Role Portals */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Operational Portals
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Customer Web Application</li>
              <li>Restaurant Partner Portal</li>
              <li>Delivery Driver Partner Portal</li>
              <li>Executive Admin Dashboard</li>
            </ul>
          </div>

          {/* Col 4: Tech Stack Info */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Built With
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              React 19, Vite, Express.js, TypeScript, Tailwind CSS v4, Google Gemini 3.6 Flash AI SDK, Lucide Icons.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© 2026 FOODORA X. Developed for Startup Demonstration & College Viva Evaluation.</p>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>and Full-Stack Engineering Craft</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
