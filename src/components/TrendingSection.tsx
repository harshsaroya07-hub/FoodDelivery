import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Plus, GitCompare, Flame, Star, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';

export const TrendingSection: React.FC<{
  foodItems: FoodItem[];
}> = ({ foodItems }) => {
  const { openCustomizationFor, addToCart, favorites, toggleFavorite, addToCompare } = useApp();

  const trendingList = foodItems.slice(0, 8);

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>Hot & Popular</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Trending Near You 🔥
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingList.map(item => {
            const isFav = favorites.includes(item.id);
            return (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Veg/Nonveg Badge */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow backdrop-blur-md ${
                        item.isVeg
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-red-500/90 text-white'
                      }`}
                    >
                      {item.isVeg ? '🟢 Pure Veg' : '🔴 Non-Veg'}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-red-500 transition shadow"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    {/* Rating Pill */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-xl flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {item.restaurantName}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="font-black text-lg text-slate-900 dark:text-white">
                      ₹{item.price}
                    </span>
                    {item.calories && (
                      <span className="block text-[10px] text-slate-400">
                        {item.calories} kcal
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => addToCompare(item)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition"
                      title="Add to Compare Matrix"
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>

                    {item.customizationGroups && item.customizationGroups.length > 0 ? (
                      <button
                        onClick={() => openCustomizationFor(item)}
                        className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition shadow-sm"
                      >
                        Customize
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:shadow-lg shadow-orange-500/20 transition flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
