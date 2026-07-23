import React, { useState } from 'react';
import { Heart, Scale, ShoppingBag, Eye, Star, Sparkles, Flame, Check } from 'lucide-react';
import { Product, CuttingMethod, PackagingType, FatLevel } from '../types';
import { useApp } from '../context/AppContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, compareList, toggleCompare, setSelectedProduct } = useApp();

  const [selectedWeightKg, setSelectedWeightKg] = useState<number>(1);
  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);

  const calculatedPrice = Math.round(product.pricePerKg * selectedWeightKg);

  return (
    <div className="bg-[#16161a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col justify-between group relative hover:border-[#e63946]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl">
      {/* Top Badges */}
      <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-wrap gap-1.5">
          {product.isFreshToday && (
            <span className="bg-emerald-500/90 text-black font-extrabold text-[10px] px-3 py-1 rounded-full backdrop-blur-md shadow">
              ذبح اليوم 🥩
            </span>
          )}
          {product.meatAge === 'small' && (
            <span className="bg-rose-500/90 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md shadow">
              كندوز صغير 🥩
            </span>
          )}
          {product.meatAge === 'large' && (
            <span className="bg-amber-600/90 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md shadow">
              لحم كبير 🍖
            </span>
          )}
          {product.customBadge && (
            <span className="bg-blue-600/90 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md shadow">
              {product.customBadge}
            </span>
          )}
          {product.meatType === 'buffalo' && (
            <span className="bg-amber-400 text-black font-extrabold text-[10px] px-3 py-1 rounded-full backdrop-blur-md shadow">
              جاموسي بلدي 🐂
            </span>
          )}
          {product.discountPercent && (
            <span className="bg-[#e63946] text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all pointer-events-auto ${
            isWishlisted
              ? 'bg-[#e63946] text-white shadow-lg scale-110'
              : 'bg-black/60 text-gray-300 hover:text-[#e63946] hover:bg-black/80'
          }`}
          title="إضافة للمفضلة"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative h-56 overflow-hidden bg-black cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-transparent to-transparent opacity-90" />

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 space-x-reverse">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="px-4 py-2.5 rounded-full bg-[#e63946] text-white font-black text-xs shadow-lg hover:bg-[#b91c1c] flex items-center"
          >
            <Eye className="w-4 h-4 ml-1.5" />
            التفاصيل والخيارات
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`p-2.5 rounded-full border text-xs font-bold transition-all ${
              isCompared
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-black/80 text-white border-white/20 hover:border-amber-400'
            }`}
            title="مقارنة"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 space-x-reverse text-xs text-amber-400 mb-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-gray-500">({product.reviewsCount} تقييم)</span>
          </div>

          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-lg font-bold text-white cursor-pointer hover:text-[#e63946] transition-colors line-clamp-1 mb-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Quick Weight Selector Chips */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
            اختر الوزن المطلوب:
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
            {[
              { label: '0.5 كجم', val: 0.5 },
              { label: '1 كجم', val: 1 },
              { label: '2 كجم', val: 2 },
              { label: '3 كجم', val: 3 }
            ].map((w) => (
              <button
                key={w.val}
                onClick={() => setSelectedWeightKg(w.val)}
                className={`py-1.5 rounded-full border text-[11px] transition-all font-bold ${
                  selectedWeightKg === w.val
                    ? 'bg-[#e63946] border-[#e63946] text-white'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Add Button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-400 font-medium">
              سعر الكيلو: <span className="text-gray-200">{product.pricePerKg} ج.م</span>
            </div>
            <div className="text-xl font-black text-white">
              {calculatedPrice} <span className="text-xs font-normal text-gray-400">ج.م ({selectedWeightKg} كجم)</span>
            </div>
          </div>

          <button
            onClick={() =>
              addToCart(
                product,
                selectedWeightKg,
                `${selectedWeightKg} كجم`,
                'cubes',
                'regular',
                product.fatLevelOptions ? product.fatLevelOptions[0] : undefined
              )
            }
            className="px-5 py-2.5 rounded-full bg-[#e63946] hover:bg-[#b91c1c] text-white font-extrabold text-xs shadow-lg flex items-center space-x-1.5 space-x-reverse active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 ml-1" />
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
