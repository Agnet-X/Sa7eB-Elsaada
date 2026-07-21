import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, PhoneCall, Copy, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderSuccessModal: React.FC = () => {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen, lastOrder, showToast } = useApp();

  useEffect(() => {
    if (isOrderSuccessOpen) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isOrderSuccessOpen]);

  if (!isOrderSuccessOpen || !lastOrder) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(lastOrder.id);
    showToast('تم نسخ رقم الطلب لحافظة جهازك! 📋');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#121218] border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
          تم إنشاء الطلب بنجاح! 🎉
        </span>

        <h2 className="text-2xl font-extrabold gold-gradient-text mt-2 mb-1">
          شكراً لثقتكم بجزارة صاحب السعادة 🥩
        </h2>

        <p className="text-xs text-slate-300 font-medium mb-6">
          جرى تسجيل طلبك بنجاح وسنقوم بتجهيز اللحوم البلدية والجاموسي الطازجة فوراً.
        </p>

        {/* Order ID Box */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 mb-6 text-right space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">رقم الطلب المميز:</span>
            <div className="flex items-center space-x-1 space-x-reverse font-mono font-bold text-amber-300">
              <span>{lastOrder.id}</span>
              <button
                onClick={handleCopyOrderId}
                className="p-1 text-slate-400 hover:text-white"
                title="نسخ"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">العميل:</span>
            <span className="text-white font-bold">{lastOrder.customerName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">الإجمالي عند الاستلام:</span>
            <span className="text-amber-400 font-extrabold text-sm">{lastOrder.total} ج.م</span>
          </div>
        </div>

        {/* WhatsApp Actions */}
        <div className="space-y-3">
          <a
            href={lastOrder.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 space-x-reverse"
          >
            <ExternalLink className="w-4 h-4 ml-2" />
            <span>فتح محادثة الواتساب وتأكيد التفاصيل</span>
          </a>

          <button
            onClick={() => setIsOrderSuccessOpen(false)}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-300 font-bold text-xs"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
