import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Leaf, Star, Flame } from 'lucide-react';

export const HeroSection: React.FC<{
  onSearch: (term: string) => void;
}> = ({ onSearch }) => {
  const { setIsAIFinderOpen, setIsFoodDNAModalOpen } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 md:py-16 border-b border-slate-200/60 dark:border-slate-800">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" />
              <span>NEXT-GEN FOOD TECH PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Your cravings. <br />
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Delivered in minutes.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Experience intelligent AI food recommendations, eco-friendly grouped delivery, live GPS order tracking, and personalized Food DNA rewards.
            </p>

            {/* Quick Search Tag Suggestions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Popular Craving Search:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  ' Butter Chicken Gold',
                  ' Woodfire Pizza',
                  ' Ghee Roast Dosa',
                  ' Schezwan Noodles',
                  ' Nutella Waffles',
                  ' Healthy Protein Bowl'
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSearch(tag.trim())}
                    className="bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:shadow transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsAIFinderOpen(true)}
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 transition flex items-center space-x-2 text-sm group"
              >
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span>Launch AI Food Finder</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsFoodDNAModalOpen(true)}
                className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition text-sm flex items-center space-x-2"
              >
                <span>View Food DNA 🧬</span>
              </button>
            </div>

            {/* Badges Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-slate-800 dark:text-slate-200">20-25 Min</span>
                  <span className="text-[10px] text-slate-400">Express Delivery</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-slate-800 dark:text-slate-200">Eco Score 88</span>
                  <span className="text-[10px] text-slate-400">Plastic-Free Food</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-slate-800 dark:text-slate-200">4.9 ★ Rating</span>
                  <span className="text-[10px] text-slate-400">10k+ Happy Orders</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Featured Dish Showcase Card */}
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 transform hover:scale-[1.02] transition-transform">
              <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80"
                  alt="Butter Chicken Gold"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow">
                  🔥 #1 TRENDING DISH
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-white flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold block">Punjab Grill & Tandoor</span>
                    <span className="text-[10px] text-slate-300">Connaught Place • 2.3 km</span>
                  </div>
                  <span className="font-extrabold text-amber-400">4.9 ★</span>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Butter Chicken Gold Special
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    Rich cashew tomato gravy with tandoori chicken
                  </p>
                </div>
                <span className="font-extrabold text-lg text-orange-600 dark:text-orange-400">
                  ₹380
                </span>
              </div>
            </div>

            {/* Floating Mini Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-xs animate-bounce">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                🌱
              </div>
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-100">Plant a Tree!</span>
                <span className="text-[10px] text-slate-400">12,400+ Trees planted</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
