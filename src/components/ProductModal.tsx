import React, { useState } from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Flame, Sparkles, Scale, Info, CheckCircle2 } from 'lucide-react';
import { Product, CuttingMethod, PackagingType, FatLevel } from '../types';
import { useApp } from '../context/AppContext';

export const ProductModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useApp();

  if (!selectedProduct) return null;

  const [weightKg, setWeightKg] = useState<number>(1);
  const [customWeight, setCustomWeight] = useState<string>('');
  const [cutting, setCutting] = useState<CuttingMethod>('cubes');
  const [packaging, setPackaging] = useState<PackagingType>('vacuum');
  const [fatLevel, setFatLevel] = useState<FatLevel>(
    selectedProduct.fatLevelOptions ? selectedProduct.fatLevelOptions[0] : 'medium'
  );
  const [notes, setNotes] = useState<string>('');

  const finalWeight = customWeight && !isNaN(parseFloat(customWeight)) ? parseFloat(customWeight) : weightKg;
  const calculatedPrice = Math.round(selectedProduct.pricePerKg * finalWeight);

  const handleAddToCart = () => {
    addToCart(
      selectedProduct,
      finalWeight,
      `${finalWeight} كجم`,
      cutting,
      packaging,
      selectedProduct.fatLevelOptions ? fatLevel : undefined,
      notes
    );
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#121218] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/70 text-slate-300 hover:text-white hover:bg-red-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-5/12 relative h-64 md:h-auto bg-neutral-900">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover filter brightness-95"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent md:bg-gradient-to-r" />

          {/* Badges Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow">
              ذبح اليوم طازج 🥩
            </span>
            <span className="bg-amber-950/90 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow">
              {selectedProduct.meatType === 'buffalo' ? 'جاموسي بلدي 🐂' : 'كندوز بقري 🐄'}
            </span>
          </div>
        </div>

        {/* Customization & Details Column */}
        <div className="md:w-7/12 p-6 overflow-y-auto max-h-[80vh] space-y-6">
          <div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-amber-400 font-bold mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span>{selectedProduct.rating}</span>
              <span className="text-slate-400">({selectedProduct.reviewsCount} تقييم حقيقي)</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">{selectedProduct.name}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedProduct.description}</p>
          </div>

          {/* Recommended Cooking */}
          <div className="bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800">
            <span className="block text-xs font-bold text-amber-400 mb-2 flex items-center">
              <Flame className="w-4 h-4 ml-1 text-red-500" /> طرائق الطهي الموصى بها:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {selectedProduct.recommendedCooking.map((cook, idx) => (
                <span
                  key={idx}
                  className="bg-red-950/60 border border-red-800/40 text-slate-200 px-2.5 py-1 rounded-lg"
                >
                  {cook}
                </span>
              ))}
            </div>
          </div>

          {/* Weight Picker */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-2">
              1. اختر الوزن (كجم):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-xs font-bold mb-2">
              {[
                { label: '0.25 كجم', val: 0.25 },
                { label: '0.5 كجم', val: 0.5 },
                { label: '0.75 كجم', val: 0.75 },
                { label: '1 كجم', val: 1 },
                { label: '2 كجم', val: 2 },
                { label: '3 كجم', val: 3 },
                { label: '5 كجم', val: 5 }
              ].map((w) => (
                <button
                  key={w.val}
                  onClick={() => {
                    setWeightKg(w.val);
                    setCustomWeight('');
                  }}
                  className={`py-2 rounded-xl border transition-all ${
                    finalWeight === w.val && !customWeight
                      ? 'bg-gradient-to-r from-red-800 to-amber-600 border-amber-400 text-white shadow-md'
                      : 'bg-neutral-900 border-neutral-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            {/* Custom Weight Input */}
            <div className="flex items-center space-x-2 space-x-reverse mt-2">
              <span className="text-xs text-slate-400">وزن مخصص:</span>
              <input
                type="number"
                step="0.1"
                placeholder="مثلاً 1.5 كجم"
                value={customWeight}
                onChange={(e) => setCustomWeight(e.target.value)}
                className="w-28 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Cutting Method */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-2">
              2. طريقة التقطيع المطلوبة:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              {[
                { id: 'cubes', label: 'مكعبات طاجن 🥩' },
                { id: 'slices', label: 'شرائح بوفتيك 🔪' },
                { id: 'steak', label: 'قطعيات ستيك 🥩' },
                { id: 'shawarma', label: 'شرائح شاورما 🥙' },
                { id: 'minced', label: 'مفروم طازج 🍔' },
                { id: 'kofta', label: 'خلطة كفتة 🍢' },
                { id: 'bbq', label: 'تقطيع شوي 🔥' },
                { id: 'whole', label: 'قطعة كاملة 🥩' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCutting(c.id as CuttingMethod)}
                  className={`p-2 rounded-xl border text-right transition-all ${
                    cutting === c.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-neutral-900 border-neutral-800 text-slate-300 hover:border-neutral-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fat Level Option if applicable */}
          {selectedProduct.fatLevelOptions && (
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-2">
                3. نسبة الدهن (للمفروم والكفتة):
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                {[
                  { id: 'low', label: 'قليل الدهن (صحي / دايت)' },
                  { id: 'medium', label: 'متوسط الدهن (متوازن)' },
                  { id: 'high', label: 'دسم (للحواوشي والبرجر)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFatLevel(f.id as FatLevel)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      fatLevel === f.id
                        ? 'bg-red-950/80 border-red-500 text-amber-300'
                        : 'bg-neutral-900 border-neutral-800 text-slate-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Packaging Type */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-2">
              4. طريقة التغليف:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {[
                { id: 'vacuum', label: 'تفريغ هواء Vacuum (موصى به) ✨' },
                { id: 'regular', label: 'أطباق فل ونيلون عادي 📦' },
                { id: 'family-ice', label: 'تغليف حافظ مع كيس ثلج 🧊' },
                { id: 'gift', label: 'تغليف فاخر هدايا 🎁' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPackaging(p.id as PackagingType)}
                  className={`p-2.5 rounded-xl border text-right transition-all ${
                    packaging === p.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-neutral-900 border-neutral-800 text-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              ملاحظات خاصة للجزار:
            </label>
            <textarea
              rows={2}
              placeholder="مثلاً: يرجى إزالة الدهن الزائد، إرسال العظم منفصل..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Price & Add to Cart Action */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div>
              <span className="block text-xs text-slate-400">الإجمالي لهذا الصنف:</span>
              <span className="text-2xl font-extrabold gold-gradient-text">
                {calculatedPrice} ج.م
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-800 via-amber-600 to-amber-500 hover:from-red-700 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl red-glow flex items-center space-x-2 space-x-reverse"
            >
              <ShoppingBag className="w-4 h-4 ml-2" />
              <span>أضف إلى السلة الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
