import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Dna, X, Award, ShieldCheck, Flame, Heart } from 'lucide-react';
import { FoodDNA } from '../types';

export const FoodDNAModal: React.FC = () => {
  const { isFoodDNAModalOpen, setIsFoodDNAModalOpen, user } = useApp();
  const [dna, setDna] = useState<FoodDNA | null>(null);

  useEffect(() => {
    if (isFoodDNAModalOpen) {
      fetch('/api/user/food-dna')
        .then(res => res.json())
        .then(data => setDna(data))
        .catch(err => console.error('Food DNA fetch error:', err));
    }
  }, [isFoodDNAModalOpen]);

  if (!isFoodDNAModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <Dna className="w-6 h-6 text-purple-200 animate-spin" />
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tight">YOUR FOOD DNA 🧬</h2>
              <p className="text-xs text-purple-200">Algorithmic analysis of your culinary habits</p>
            </div>
          </div>
          <button
            onClick={() => setIsFoodDNAModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto text-slate-800 dark:text-slate-100">
          
          {/* User Tier Header Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-300 uppercase block">
                Culinary Explorer
              </span>
              <h3 className="font-extrabold text-base">{user?.name}</h3>
              <span className="text-xs text-slate-300">Foodora Points: {user?.foodoraPoints || 350} pts</span>
            </div>
            <div className="bg-purple-500/20 border border-purple-400/30 px-3 py-1.5 rounded-xl text-center">
              <Award className="w-5 h-5 text-amber-400 mx-auto" />
              <span className="text-[10px] font-bold text-amber-300 block mt-0.5">
                {user?.rewardTier}
              </span>
            </div>
          </div>

          {/* DNA Badges Stack */}
          {dna && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-purple-500 uppercase block">
                    Favorite Cuisine
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    🍕 {dna.favoriteCuisine}
                  </span>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase block">
                    Spice Preference
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    🌶️ {dna.spicePreference}
                  </span>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-600 uppercase block">
                    Ordering Habit
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {dna.orderingTimeHabit}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">
                    Healthy Score
                  </span>
                  <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    🌱 {dna.healthyFoodScore}/100
                  </span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-around text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Total Orders
                  </span>
                  <span className="font-black text-lg text-slate-900 dark:text-white">
                    {dna.totalOrdersCount}
                  </span>
                </div>
                <div className="border-r border-slate-200 dark:border-slate-700" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Total Savings
                  </span>
                  <span className="font-black text-lg text-emerald-500">
                    ₹{dna.totalSavings}
                  </span>
                </div>
                <div className="border-r border-slate-200 dark:border-slate-700" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Avg Order Value
                  </span>
                  <span className="font-black text-lg text-orange-500">
                    ₹{dna.avgOrderValue}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
