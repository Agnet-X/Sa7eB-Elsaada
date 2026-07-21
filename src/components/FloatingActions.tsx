import React, { useState, useEffect } from 'react';
import { Phone, Send, ArrowUp, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingActions: React.FC = () => {
  const { cart, setIsCartOpen } = useApp();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center space-y-3">
      {/* Floating Cart Button on Mobile */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="p-3.5 rounded-full bg-gradient-to-r from-red-800 to-amber-600 text-white shadow-2xl red-glow flex items-center justify-center relative hover:scale-110 transition-transform sm:hidden"
          title="افتح السلة"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-white text-red-900 font-extrabold text-[11px] rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        </button>
      )}

      {/* Direct Phone Call Button */}
      <a
        href="tel:01124795553"
        className="p-3.5 rounded-full bg-red-900/90 border border-amber-500/50 text-amber-300 shadow-2xl hover:scale-110 transition-transform backdrop-blur-md"
        title="اتصل بالمعلم الآن"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp Floating Chat Button */}
      <a
        href="https://wa.me/201124795553?text=السلام%20عليكم%20أرغب%20في%20الاستفسار%20والطلب%20من%20جزارة%20صاحب%20السعادة"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl hover:scale-110 transition-transform pulse-glow flex items-center justify-center"
        title="تواصل عبر الواتساب"
      >
        <Send className="w-6 h-6" />
      </a>

      {/* Back To Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-black/80 border border-neutral-700 text-slate-300 hover:text-white hover:border-amber-400 transition-all shadow-xl"
          title="إلى الأعلى"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
