import React from 'react';

export const CategorySection: React.FC<{
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}> = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { name: 'All', icon: '🍽️', count: '50+ Items' },
    { name: 'Pizza', icon: '🍕', count: '12 Items' },
    { name: 'Burgers', icon: '🍔', count: '8 Items' },
    { name: 'Chinese', icon: '🍜', count: '15 Items' },
    { name: 'Indian', icon: '🍛', count: '24 Items' },
    { name: 'Mexican', icon: '🌮', count: '6 Items' },
    { name: 'Japanese', icon: '🍣', count: '5 Items' },
    { name: 'Healthy', icon: '🥗', count: '10 Items' },
    { name: 'Desserts', icon: '🍰', count: '9 Items' },
    { name: 'Beverages', icon: '☕', count: '14 Items' },
    { name: 'Fast Food', icon: '🥪', count: '18 Items' }
  ];

  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
              Explore Cuisines
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Food Categories
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Scroll to discover →
          </span>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[90px] transition shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white border-transparent shadow-lg shadow-orange-500/25 scale-105 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs font-bold whitespace-nowrap">{cat.name}</span>
                <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
