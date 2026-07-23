import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { TODAY_OFFERS as FALLBACK_OFFERS } from '../data/offers';
import { useApp } from '../context/AppContext';

export const OffersSection: React.FC = () => {
  const { products, offers, addToCart, setSelectedProduct } = useApp();
  const activeOffers = offers && offers.length > 0 ? offers : FALLBACK_OFFERS;
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 18, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="offers-section" className="py-12 px-4 max-w-7xl mx-auto relative">
      {/* Header title in Bento style */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 space-x-reverse text-[#e63946] font-extrabold text-xs uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>تخفيضات اليوم المباشرة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            عروض صاحب السعادة اليومية 🥩
          </h2>
        </div>

        {/* Live Countdown Timer Bento Pill */}
        <div className="flex items-center space-x-2 space-x-reverse bg-[#16161a] border border-white/10 rounded-full px-5 py-2.5 shadow-xl">
          <Clock className="w-5 h-5 text-amber-400 animate-spin-slow ml-2" />
          <span className="text-xs text-gray-300 font-medium hidden sm:inline">ينتهي العرض خلال:</span>
          <div className="flex items-center space-x-1.5 space-x-reverse font-mono font-black text-white text-sm sm:text-base">
            <span className="bg-[#e63946] px-2.5 py-0.5 rounded-lg text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-[#e63946] px-2.5 py-0.5 rounded-lg text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-[#e63946] px-2.5 py-0.5 rounded-lg text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Offers Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeOffers.map((offer) => {
          const matchedProduct = products.find((p) => p.id === offer.productId) || products[0];

          return (
            <div
              key={offer.id}
              className="bg-[#16161a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col justify-between group relative hover:border-[#e63946]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-2xl"
            >
              {/* Top Badge */}
              <div className="absolute top-4 right-4 z-10 bg-[#e63946] text-white font-black text-xs px-3.5 py-1 rounded-full shadow-lg flex items-center space-x-1 space-x-reverse">
                <Tag className="w-3.5 h-3.5 ml-1" />
                <span>{offer.badge}</span>
              </div>

              {/* Offer Image */}
              <div className="relative h-56 overflow-hidden bg-black">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 text-amber-300 font-bold text-xs px-3 py-1 rounded-full">
                  {offer.weightLabel}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e63946] transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 line-through font-medium">
                      {offer.originalPrice} ج.م
                    </div>
                    <div className="text-2xl font-black text-white">
                      {offer.offerPrice} <span className="text-xs font-normal text-gray-400">ج.م شامل العرض</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => setSelectedProduct(matchedProduct)}
                      className="px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs transition-colors"
                    >
                      التفاصيل
                    </button>
                    <button
                      onClick={() =>
                        addToCart(
                          matchedProduct,
                          1,
                          offer.weightLabel,
                          'cubes',
                          'regular',
                          'medium',
                          `طلب عرض خاص: ${offer.title}`
                        )
                      }
                      className="px-5 py-2.5 rounded-full bg-[#e63946] hover:bg-[#b91c1c] text-white font-extrabold text-xs shadow-lg flex items-center space-x-1 space-x-reverse transition-transform active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 ml-1" />
                      <span>اطلب العرض</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
