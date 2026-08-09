import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Plus, Sparkles, Star } from 'lucide-react';
import { FoodItem } from '../types';

export const MoodFoodFinder: React.FC = () => {
  const { openCustomizationFor, addToCart } = useApp();
  const [selectedMood, setSelectedMood] = useState<string>('Spicy Mood');
  const [moodItems, setMoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const moods = [
    { id: 'Hungry', emoji: '😋', label: 'Hungry' },
    { id: 'Spicy Mood', emoji: '🔥', label: 'Spicy Mood' },
    { id: 'Healthy', emoji: '🥗', label: 'Healthy' },
    { id: 'Comfort Food', emoji: '😴', label: 'Comfort Food' },
    { id: 'Party', emoji: '🎉', label: 'Party Vibes' },
    { id: 'Fitness', emoji: '💪', label: 'High Protein' },
    { id: 'Sweet Tooth', emoji: '🍰', label: 'Sweet Tooth' },
    { id: 'Chill', emoji: '☕', label: 'Tea & Chill' }
  ];

  const fetchMoodItems = async (moodId: string) => {
    setSelectedMood(moodId);
    setIsLoading(true);
    try {
      const res = await fetch('/api/mood-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodId })
      });
      const data = await res.json();
      setMoodItems(data.items || []);
    } catch (err) {
      console.error('Mood fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMoodItems('Spicy Mood');
  }, []);

  return (
    <section className="py-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-rose-500" />
              <span>Personalized Mood Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tell us your mood ❤️
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Select how you are feeling and let our smart algorithm curate dishes matched to your state of mind.
          </p>
        </div>

        {/* Mood Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {moods.map(m => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => fetchMoodItems(m.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent shadow-lg shadow-rose-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-base">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mood Filtered Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {moodItems.map(item => (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-28 rounded-xl overflow-hidden mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      ★ {item.rating}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.restaurantName}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2">
                  <span className="font-extrabold text-xs text-orange-600 dark:text-orange-400">
                    ₹{item.price}
                  </span>

                  {item.customizationGroups && item.customizationGroups.length > 0 ? (
                    <button
                      onClick={() => openCustomizationFor(item)}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-[10px] py-1 px-2.5 rounded-lg transition"
                    >
                      Options
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-1.5 rounded-lg transition"
                      title="Add to Cart"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
