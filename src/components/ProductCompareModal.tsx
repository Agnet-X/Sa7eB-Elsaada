import React from 'react';
import { X, Scale, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductCompareModal: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, isCompareOpen, setIsCompareOpen, addToCart } = useApp();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#121218] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-x-auto">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Scale className="w-6 h-6 text-amber-400 ml-2" />
            <h2 className="text-xl font-extrabold gold-gradient-text">مقارنة القطعيات والمنتجات</h2>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-red-400 hover:text-red-300 flex items-center"
              >
                <Trash2 className="w-3.5 h-3.5 ml-1" />
                مسح القائمة
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 rounded-full bg-neutral-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">لم تقم بإضافة أي منتجات للمقارنة بعد.</p>
            <p className="text-xs mt-1 text-slate-500">اضغط على أيقونة الميزان ⚖️ على أي منتج لإضافته هنا.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative"
              >
                <button
                  onClick={() => toggleCompare(product)}
                  className="absolute top-2 left-2 p-1 rounded-full bg-black/60 text-slate-400 hover:text-red-400"
                  title="إزالة"
                >
                  <X className="w-4 h-4" />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />

                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">
                    {product.meatType === 'buffalo' ? 'جاموسي بلدي' : 'كندوز بقري'}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{product.name}</h3>
                  <div className="text-base font-extrabold text-amber-400 mt-1">
                    {product.pricePerKg} ج.م / كجم
                  </div>
                </div>

                <div className="text-xs space-y-2 border-t border-neutral-800 pt-2 text-slate-300 font-medium">
                  <div>
                    <span className="text-slate-500 block">طريقة الطهي:</span>
                    <span>{product.recommendedCooking.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">السعرات الحرارية:</span>
                    <span>{product.caloriesPer100g} كالوجري / 100ج</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">البروتين والدهون:</span>
                    <span>{product.proteinPer100g}ج بروتين | {product.fatPer100g}ج دهن</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, 1, '1 كجم', 'cubes', 'regular');
                    setIsCompareOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-red-800 to-amber-600 hover:from-red-700 text-white font-bold text-xs flex items-center justify-center"
                >
                  <ShoppingBag className="w-3.5 h-3.5 ml-1" />
                  أضف للسلة
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
