import React from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, ShieldCheck, TreePine, Award } from 'lucide-react';

export const EcoDeliveryBadge: React.FC = () => {
  const { plantTreeOptIn, setPlantTreeOptIn, deliveryMethod, setDeliveryMethod } = useApp();

  return (
    <section className="py-10 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-b border-emerald-900/50 relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>ENVIRONMENTAL RESPONSIBILITY ENGINE</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white">
              🌱 FOODORA ECO SCORE: <span className="text-emerald-400">88/100</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Every order placed on Foodora X tracks carbon footprint, plastic packaging reduction, and route efficiency. Group delivery cuts vehicle emissions by up to 40%!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-emerald-900/40 border border-emerald-800/60 p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-300 block uppercase">Packaging</span>
                <span className="text-sm font-black text-white">100% Biodegradable</span>
              </div>

              <div className="bg-emerald-900/40 border border-emerald-800/60 p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-300 block uppercase">Fleet Carbon</span>
                <span className="text-sm font-black text-white">Electric Scooters 🛵</span>
              </div>

              <div className="bg-emerald-900/40 border border-emerald-800/60 p-3 rounded-2xl col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-emerald-300 block uppercase">Group Bonus</span>
                <span className="text-sm font-black text-emerald-400">₹15 Off Eco Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Circular Score Gauge & Plant-A-Tree */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-700/40 text-center space-y-4">
            
            {/* Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="301"
                  strokeDashoffset="36" // 88%
                  strokeLinecap="round"
                  className="text-emerald-400"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">88</span>
                <span className="text-[9px] text-emerald-300 font-bold uppercase">Eco Score</span>
              </div>
            </div>

            {/* Checkbox for Plant a Tree */}
            <label className="flex items-center space-x-2.5 text-xs text-slate-200 cursor-pointer bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800/60 hover:bg-emerald-900/80 transition">
              <input
                type="checkbox"
                checked={plantTreeOptIn}
                onChange={e => setPlantTreeOptIn(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-left font-medium">
                Plant a tree for ₹5 with this order 🌲
              </span>
            </label>

          </div>

        </div>
      </div>
    </section>
  );
};
