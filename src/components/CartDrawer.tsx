import React from 'react';
import { X, Trash2, ShoppingBag, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartItem,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0f0f13] border-r border-amber-500/30 h-full flex flex-col justify-between shadow-2xl text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center space-x-2 space-x-reverse">
            <ShoppingBag className="w-5 h-5 text-amber-400 ml-2" />
            <h2 className="text-lg font-extrabold gold-gradient-text">سلة المشتريات</h2>
            <span className="bg-red-900 text-amber-300 font-bold text-xs px-2 py-0.5 rounded-full">
              {cart.length} أصناف
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full bg-neutral-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-16 h-16 mx-auto text-neutral-700 animate-pulse" />
              <p className="text-sm font-bold text-slate-400">سلة المشتريات فارغة حالياً</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                تصفح قائمة اللحوم البلدية والجاموسي واختر ما يناسب أسرتك اليوم!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-5 py-2 rounded-full bg-amber-500 text-black font-extrabold text-xs"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 flex items-center space-x-3 space-x-reverse relative"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                  <div className="text-[11px] text-amber-400 font-medium">
                    الوزن: {item.selectedWeightLabel} | التقطيع: {item.selectedCutting}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    التغليف: {item.selectedPackaging}
                  </div>
                  <div className="text-sm font-extrabold text-amber-300 mt-1">
                    {item.calculatedPrice} ج.م
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-300 font-medium">
              <div className="flex justify-between">
                <span>إجمالي اللحوم:</span>
                <span className="font-bold text-white">{cartSubtotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل للجيزة:</span>
                <span className="font-bold text-emerald-400">
                  {deliveryFee === 0 ? 'مجاناً (عرض الطلبات > 1000)' : `${deliveryFee} ج.م`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-amber-400 pt-2 border-t border-neutral-800">
                <span>المبلغ الإجمالي:</span>
                <span className="text-xl gold-gradient-text">{cartTotal} ج.م</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-800 via-amber-600 to-amber-500 hover:from-red-700 text-white font-extrabold text-sm shadow-xl red-glow flex items-center justify-center space-x-2 space-x-reverse"
            >
              <span>المتابعة لتأكيد الطلب عبر الواتساب</span>
              <ArrowLeft className="w-4 h-4 mr-2" />
            </button>

            <button
              onClick={clearCart}
              className="w-full py-1 text-center text-[11px] text-slate-500 hover:text-red-400"
            >
              تفريع السلة بالكامل
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
