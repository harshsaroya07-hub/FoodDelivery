import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant, FoodItem } from '../types';
import { X, Star, Clock, MapPin, Plus, Heart, GitCompare, Leaf, Search } from 'lucide-react';

export const RestaurantDetailModal: React.FC<{
  restaurant: Restaurant | null;
  onClose: () => void;
}> = ({ restaurant, onClose }) => {
  const { openCustomizationFor, addToCart, favorites, toggleFavorite, addToCompare } = useApp();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filterVeg, setFilterVeg] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (restaurant) {
      fetch(`/api/restaurants/${restaurant.id}/foods`)
        .then(res => res.json())
        .then(data => setFoods(data))
        .catch(err => console.error('Fetch restaurant foods error:', err));
    }
  }, [restaurant]);

  if (!restaurant) return null;

  const filteredFoods = foods.filter(f => {
    if (filterVeg === 'veg' && !f.isVeg) return false;
    if (filterVeg === 'nonveg' && f.isVeg) return false;
    if (searchQuery.trim()) {
      return (
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const isFav = favorites.includes(restaurant.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[92vh]">
        
        {/* Cover Header */}
        <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/60 text-white backdrop-blur-md hover:bg-slate-900 transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(restaurant.id)}
            className="absolute top-4 right-16 p-2.5 rounded-full bg-slate-900/60 text-white backdrop-blur-md hover:text-red-500 transition z-10"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Restaurant Header Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
            <div className="flex items-center space-x-3">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-lg shrink-0"
              />
              <div>
                <h2 className="font-black text-xl sm:text-2xl text-white">
                  {restaurant.name}
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  {restaurant.cuisines.join(' • ')}
                </p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-300 mt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{restaurant.deliveryTimeMinutes} mins</span>
                  </span>
                  <span>•</span>
                  <span>₹{restaurant.priceForTwo} for two</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500 text-white font-black text-sm px-3 py-1.5 rounded-2xl shadow flex items-center space-x-1 shrink-0">
              <Star className="w-4 h-4 fill-white" />
              <span>{restaurant.rating}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Veg/Nonveg Filters */}
          <div className="flex items-center space-x-2 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setFilterVeg('all')}
              className={`px-3 py-1.5 rounded-xl border transition ${
                filterVeg === 'all'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              All Dishes ({foods.length})
            </button>

            <button
              onClick={() => setFilterVeg('veg')}
              className={`px-3 py-1.5 rounded-xl border transition flex items-center space-x-1 ${
                filterVeg === 'veg'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>🟢 Pure Veg</span>
            </button>

            <button
              onClick={() => setFilterVeg('nonveg')}
              className={`px-3 py-1.5 rounded-xl border transition flex items-center space-x-1 ${
                filterVeg === 'nonveg'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>🔴 Non-Veg</span>
            </button>
          </div>

          {/* Search Input inside Menu */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search items in menu..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
            />
          </div>

        </div>

        {/* Menu Items List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFoods.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex justify-between gap-3 hover:border-orange-500/50 transition"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className={item.isVeg ? 'text-emerald-600 font-bold text-xs' : 'text-red-500 font-bold text-xs'}>
                      {item.isVeg ? '🟢' : '🔴'}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.name}
                    </h4>
                  </div>

                  <span className="font-black text-sm text-orange-600 dark:text-orange-400 block">
                    ₹{item.price}
                  </span>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center space-x-2 pt-1 text-[10px] text-slate-400">
                    <span>★ {item.rating}</span>
                    {item.calories && <span>• {item.calories} kcal</span>}
                  </div>
                </div>

                {/* Right Image & Action */}
                <div className="relative w-24 h-24 shrink-0 flex flex-col items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />

                  {item.customizationGroups && item.customizationGroups.length > 0 ? (
                    <button
                      onClick={() => openCustomizationFor(item)}
                      className="absolute -bottom-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-[10px] px-3 py-1 rounded-xl shadow transition"
                    >
                      Custom
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="absolute -bottom-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] px-3 py-1 rounded-xl shadow transition flex items-center space-x-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>ADD</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
