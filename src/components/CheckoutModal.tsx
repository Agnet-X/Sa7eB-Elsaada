import React, { useState } from 'react';
import { X, Send, MapPin, Phone, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartSubtotal, deliveryFee, cartTotal, placeOrder } = useApp();

  if (!isCheckoutOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('الفترة الصباحية (9 صباحاً - 2 ظهراً)');
  const [notes, setNotes] = useState('');

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || (deliveryType === 'delivery' && !address) || !deliveryDate) return;

    const createdOrder = placeOrder({
      customerName: name,
      customerPhone: phone,
      address: deliveryType === 'pickup' ? 'استلام من المحل' : address,
      landmark,
      deliveryType,
      deliveryDate,
      deliveryTimeSlot,
      notes,
    });

    if (createdOrder.whatsappLink) {
      window.open(createdOrder.whatsappLink, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-[#121218] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-full bg-neutral-900 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 border-b border-neutral-800 pb-4">
          <span className="text-xs font-bold text-amber-400 bg-red-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            تأكيد الطلب المباشر
          </span>
          <h2 className="text-2xl font-extrabold gold-gradient-text mt-1">
            بيانات التوصيل وإرسال الطلب عبر الواتساب 🥩
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            الدفع نقداً عند الاستلام فقط — لا يلزم إضافة أي بطاقة ائتمان.
          </p>
        </div>

        <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs font-semibold">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-300 mb-1">اسم العميل بالكامل: *</label>
              <input
                type="text"
                required
                placeholder="مثلاً: محمد إبراهيم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
            <div>
              <label className="block text-amber-300 mb-1">رقم الهاتف للتواصل: *</label>
              <input
                type="tel"
                required
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>

          {/* Delivery vs Pickup */}
          <div>
            <label className="block text-amber-300 mb-2">طريقة الحصول على الطلب:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  deliveryType === 'delivery'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                    : 'bg-neutral-900 border-neutral-800 text-slate-400'
                }`}
              >
                توصيل للمنزل 🚚
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  deliveryType === 'pickup'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                    : 'bg-neutral-900 border-neutral-800 text-slate-400'
                }`}
              >
                استلام من المحل 🏪
              </button>
            </div>
          </div>

          {/* Address — only for delivery */}
          {deliveryType === 'delivery' && (
            <div>
              <label className="block text-amber-300 mb-1">العنوان بالتفصيل: *</label>
              <input
                type="text"
                required
                placeholder="مثلاً: الجيزة - شارع زكريا إدريس"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-xs mb-2"
              />
              <input
                type="text"
                placeholder="أقرب علامة مميزة (اختياري)"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-300 focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                تاريخ الاستلام: *
              </label>
              <input
                type="date"
                required
                min={today}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">الفترة الزمنية المفضلة:</label>
              <select
                value={deliveryTimeSlot}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-xs"
              >
                <option value="الفترة الصباحية (9 صباحاً - 2 ظهراً)">الفترة الصباحية (9ص - 2ظ)</option>
                <option value="الفترة المسائية (5 مساءً - 9 مساءً)">الفترة المسائية (5م - 9م)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 mb-1">ملاحظات خاصة (اختياري):</label>
            <textarea
              rows={2}
              placeholder="مثلاً: يرجى الاتصال قبل الوصول بـ 10 دقائق..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Order Summary */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>إجمالي الأصناف ({cart.length}):</span>
              <span className="font-bold text-white">{cartSubtotal} ج.م</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل:</span>
              <span className="font-bold text-emerald-400">
                {deliveryType === 'pickup' ? 'مجاناً' : `${deliveryFee} ج.م`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-amber-400 pt-2 border-t border-neutral-800">
              <span>الإجمالي عند الاستلام:</span>
              <span className="text-lg text-amber-300">
                {deliveryType === 'pickup' ? cartSubtotal : cartTotal} ج.م
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 space-x-reverse"
          >
            <Send className="w-5 h-5 ml-2 text-white" />
            <span>إرسال الطلب فوراً عبر الواتساب</span>
          </button>
        </form>
      </div>
    </div>
  );
};
