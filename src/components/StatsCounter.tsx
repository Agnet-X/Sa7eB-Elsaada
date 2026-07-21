import React from 'react';
import { Award, Users, ShoppingBag, ThumbsUp } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    { icon: <Award className="w-6 h-6 text-amber-400" />, number: '+20', label: 'عاماً من الخبرة بالجيزة' },
    { icon: <Users className="w-6 h-6 text-amber-400" />, number: '+10,000', label: 'عميل سعيد وواثق' },
    { icon: <ShoppingBag className="w-6 h-6 text-amber-400" />, number: '+50,000', label: 'طلب تم تسليمه بنجاح' },
    { icon: <ThumbsUp className="w-6 h-6 text-amber-400" />, number: '100%', label: 'لحم بلدي وجاموسي طازج' }
  ];

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#16161a] border border-white/10 p-6 sm:p-8 rounded-[2.5rem] text-center hover:border-[#e63946]/50 transition-all shadow-xl"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center mb-3">
              {stat.icon}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
              {stat.number}
            </div>
            <div className="text-xs text-gray-400 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
