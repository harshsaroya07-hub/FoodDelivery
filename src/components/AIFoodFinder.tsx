import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, Send, Plus, Loader2, Star, ShieldCheck } from 'lucide-react';
import { FoodItem } from '../types';

export const AIFoodFinder: React.FC = () => {
  const { isAIFinderOpen, setIsAIFinderOpen, addToCart, openCustomizationFor } = useApp();
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<{
    explanation: string;
    items: FoodItem[];
  } | null>(null);

  if (!isAIFinderOpen) return null;

  const handleSearch = async (queryText?: string) => {
    const textToSubmit = queryText || promptInput;
    if (!textToSubmit.trim()) return;

    setIsLoading(true);
    setRecommendationResult(null);

    try {
      const res = await fetch('/api/ai-food-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit })
      });
      const data = await res.json();
      setRecommendationResult(data);
    } catch (err) {
      console.error('AI food finder fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Something spicy under ₹250 🌶️',
    'Healthy high-protein dinner 💪',
    'Best vegetarian food for 2 people 🥗',
    'Something sweet & indulgent 🍰',
    'Comfort food for a rainy evening ☕',
    'Low calorie meal under 400 cal 🥑'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tight">AI FOOD FINDER 🤖</h2>
              <p className="text-xs text-amber-100 font-medium">
                Powered by Gemini 3.6 Flash Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAIFinderOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* Prompt Form */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tell us what you are craving right now:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder='e.g. "Spicy chicken under ₹300" or "Healthy vegetarian salad"'
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center space-x-2 transition disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </div>

            {/* Quick Sample Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(sample);
                    handleSearch(sample);
                  }}
                  className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/50 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl transition"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* AI Output Section */}
          {isLoading && (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Gemini AI is analyzing flavors, dietary tags, and restaurant menus...
              </p>
            </div>
          )}

          {recommendationResult && !isLoading && (
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4 animate-fade-in">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{recommendationResult.explanation}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {recommendationResult.items.map(item => (
                  <div
                    key={item.id}
                    className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/80 flex space-x-3 shadow-sm hover:shadow transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="font-bold text-xs text-orange-600 dark:text-orange-400 ml-1">
                            ₹{item.price}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.restaurantName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-[10px]">
                          <span className={item.isVeg ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                          </span>
                          <span className="text-slate-400">★ {item.rating}</span>
                        </div>
                      </div>

                      <div className="flex space-x-1 mt-2">
                        {item.customizationGroups && item.customizationGroups.length > 0 ? (
                          <button
                            onClick={() => {
                              openCustomizationFor(item);
                              setIsAIFinderOpen(false);
                            }}
                            className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-[10px] py-1 px-2 rounded-lg transition"
                          >
                            Customize
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] py-1 px-2 rounded-lg transition flex items-center justify-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 text-[10px] text-slate-400 text-center border-t border-slate-200 dark:border-slate-800">
          Tip: You can ask about dietary needs, group size, spice preference, or maximum pricing.
        </div>

      </div>
    </div>
  );
};
