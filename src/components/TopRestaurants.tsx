import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Clock, MapPin, Leaf, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { Restaurant } from '../types';

export const TopRestaurants: React.FC<{
  restaurants: Restaurant[];
  onSelectRestaurant: (rest: Restaurant) => void;
}> = ({ restaurants, onSelectRestaurant }) => {
  const { favorites, toggleFavorite } = useApp();

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Curated Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Top Rated Restaurants ⭐
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Handpicked kitchen partners delivering hygiene, speed, and premium flavor.
          </p>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(rest => {
            const isFav = favorites.includes(rest.id);
            return (
              <div
                key={rest.id}
                onClick={() => onSelectRestaurant(rest)}
                className="group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image & Badges */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={rest.coverImage}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Logo Overlay */}
                    <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                      <img src={rest.logo} alt={rest.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Favorite Heart */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(rest.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-red-500 transition shadow"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    {/* Badges Stack */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {rest.badges.map((b, i) => (
                        <span
                          key={i}
                          className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                        {rest.name}
                      </h3>
                      <div className="flex items-center space-x-1 bg-amber-500 text-white font-extrabold text-xs px-2 py-0.5 rounded-lg shrink-0">
                        <Star className="w-3 h-3 fill-white" />
                        <span>{rest.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {rest.cuisines.join(' • ')}
                    </p>

                    <p className="text-[11px] text-slate-400 flex items-center space-x-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{rest.address}</span>
                    </p>
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{rest.deliveryTimeMinutes} mins</span>
                    </span>
                    <span>•</span>
                    <span>₹{rest.priceForTwo} for two</span>
                  </div>

                  <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
