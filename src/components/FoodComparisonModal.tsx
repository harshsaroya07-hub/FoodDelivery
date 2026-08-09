import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Star, Sparkles } from 'lucide-react';

export const FoodComparisonModal: React.FC = () => {
  const {
    isCompareModalOpen,
    setIsCompareModalOpen,
    compareItems,
    removeFromCompare,
    clearCompare,
    addToCart
  } = useApp();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-emerald-200" />
            <div>
              <h2 className="font-black text-xl tracking-tight">FOOD COMPARISON MATRIX 🍕</h2>
              <p className="text-xs text-emerald-100">
                Compare price, calories, ratings, and spice levels side-by-side
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs bg-emerald-700/80 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-5 overflow-y-auto flex-1">
          {compareItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="font-bold text-sm">No dishes added for comparison yet.</p>
              <p className="text-xs">
                Click the compare icon on any food card to view side-by-side metrics!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3 font-bold text-slate-400 w-1/4">Metric</th>
                    {compareItems.map(item => (
                      <th key={item.id} className="p-3 w-1/4 text-center">
                        <div className="relative group inline-block">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-2xl object-cover mx-auto mb-2"
                          />
                          <button
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block line-clamp-1">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.restaurantName}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Price (₹)</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-3 text-center font-black text-sm text-orange-600 dark:text-orange-400">
                        ₹{item.price}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-500">Rating ★</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-3 text-center font-bold text-amber-500">
                        ★ {item.rating}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-500">Diet Type</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-3 text-center font-bold">
                        {item.isVeg ? (
                          <span className="text-emerald-600">🟢 Veg</span>
                        ) : (
                          <span className="text-red-500">🔴 Non-Veg</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-500">Spice Level</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-3 text-center font-medium">
                        {item.spiceLevel || 'Mild'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-500">Calories</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-3 text-center font-medium">
                        {item.calories ? `${item.calories} kcal` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-500">Category</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-3 text-center font-medium">
                        {item.category}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-500">Action</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-3 text-center">
                        <button
                          onClick={() => {
                            addToCart(item);
                            setIsCompareModalOpen(false);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition inline-flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
