import React from 'react';
import { MeatCategory } from '../types';
import { useApp } from '../context/AppContext';
import { Sparkles, Beef, Flame, Package } from 'lucide-react';

const CATEGORIES: { id: MeatCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'الكل', icon: '🥩' },
  { id: 'buffalo', label: 'لحوم جاموسي بلدي', icon: '🐂' },
  { id: 'kandouz', label: 'لحوم كندوز وبقري', icon: '🐄' },
  { id: 'special-cuts', label: 'قطعيات مميزة وستيك', icon: '🔪' },
  { id: 'liver-offals', label: 'كبدة وقلوب وكلاوي', icon: '🍳' },
  { id: 'mombar-kawaree', label: 'مومبار وكوارع وكرشة', icon: '🥣' },
  { id: 'minced-processed', label: 'مفروم، برجر وكفتة', icon: '🍔' },
  { id: 'family-boxes', label: 'بكجات عائلية', icon: '📦' }
];

export const CategoryBar: React.FC = () => {
  const { activeCategory, setActiveCategory, meatAgeFilter, setMeatAgeFilter } = useApp();

  return (
    <div className="w-full space-y-4 my-4">
      {/* Category Tabs */}
      <div className="w-full overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center space-x-3 space-x-reverse min-w-max px-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center space-x-2 space-x-reverse whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#e63946] border-[#e63946] text-white shadow-lg shadow-red-900/40 scale-105'
                    : 'bg-[#16161a] border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meat Age / Size Filter Toggle Bar (لحم صغير / لحم كبير) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121218] p-3 rounded-2xl border border-amber-500/30 text-xs shadow-md">
        <div className="flex items-center gap-2 text-amber-300 font-extrabold">
          <Beef className="w-4 h-4 text-red-500" />
          <span>تصفية حسب سن الذبيحة وحجم اللحم:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'جميع القطعيات 🥩' },
            { id: 'small', label: 'لحم صغير (كندوز/لباني) 🥩' },
            { id: 'large', label: 'لحم كبير (عجالي/جاموسي) 🍖' }
          ].map((f) => {
            const isSelected = meatAgeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setMeatAgeFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-md scale-105'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
