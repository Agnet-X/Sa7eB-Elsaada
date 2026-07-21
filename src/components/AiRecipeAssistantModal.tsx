import React, { useState } from 'react';
import { ChefHat, X, Sparkles, Send, Flame, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiRecipeAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { products, setSelectedProduct } = useApp();

  const [occasion, setOccasion] = useState('عزومة عائلية');
  const [cookingType, setCookingType] = useState('طاجن في الفرن');
  const [peopleCount, setPeopleCount] = useState('4 أفراد');
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [suggestedProductId, setSuggestedProductId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateRecommendation = () => {
    // Culinary recommendation logic
    if (cookingType.includes('طاجن')) {
      setAiRecommendation(
        'ننصحك بقطعية *لحم الموزة الكندوز البلدي* أو *العكاوي البلدي*. تمتاز بنسبة جيلاتين عالية ونعومة فائقة تجعل الطاجن دايب بصوص البصل الأورمة.'
      );
      setSuggestedProductId('prod-moza-kandouz');
    } else if (cookingType.includes('شوي')) {
      setAiRecommendation(
        'أفضل خيار لشوي الفحم هو *ستيك ريب آي بلدي* مع *كفتة الحاتي المتبلة*. التداخل الطبيعي للدهن يضمن طراوة وطعم مشوي رائع.'
      );
      setSuggestedProductId('prod-ribeye-steak');
    } else if (cookingType.includes('فتة')) {
      setAiRecommendation(
        'لعمل أحلى طبق فتة بالخل والثوم، استخدم *لحم السند الجاموسي البلدي* أو *الكوارع والمومبار البلدي*. المرقة تكون دسمة وعنية بالطعوم الأصيلة.'
      );
      setSuggestedProductId('prod-sanad-gamousi');
    } else {
      setAiRecommendation(
        'ننصحك بـ *وش الفخذ الكندوز* للبوفتيك والشاورما، أو *اللحم المفروم البلدي* لعمل المكرونة البشاميل والحواوشي.'
      );
      setSuggestedProductId('prod-fakhd-kandouz');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#121218] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-neutral-900 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 space-x-reverse mb-4">
          <div className="p-2 rounded-xl bg-red-950 border border-amber-500/50 text-amber-400">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold gold-gradient-text">مستشار الطهي واختيار القطعيات 👨‍🍳</h3>
            <p className="text-xs text-slate-400 font-medium">اختر تفاصيل أكلتك وسنحدد لك أحسن قطعية لحم بلدي</p>
          </div>
        </div>

        <div className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-300 mb-1">المناسبة / الوجبة:</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
            >
              <option value="غداء يومي">غداء يومي عائلي</option>
              <option value="عزومة عائلية">عزومة ضيوف فاخرة</option>
              <option value="حفلة شواء">حفلة شواء باربيكيو</option>
              <option value="وجبة دسمة">وجبة طواجن ملوكي</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">طريقة الطهي المفضلة:</label>
            <select
              value={cookingType}
              onChange={(e) => setCookingType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
            >
              <option value="طاجن في الفرن">طاجن بالفرن والبصل</option>
              <option value="سلق وفتة">سلق ملوكي وفتة بالخل والثوم</option>
              <option value="شوي على الفحم">شوي على الفحم / جريل</option>
              <option value="بوفتيك وشاورما">بوفتيك / شاورما سريعة</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">عدد الأفراد المتوقع:</label>
            <select
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
            >
              <option value="2-3 أفراد">2 - 3 أفراد (حوالي 1 كجم)</option>
              <option value="4-6 أفراد">4 - 6 أفراد (حوالي 2 كجم)</option>
              <option value="8+ أفراد">8+ أفراد (عائلية كبيرة 3-5 كجم)</option>
            </select>
          </div>

          <button
            onClick={handleGenerateRecommendation}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-800 via-amber-600 to-amber-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 space-x-reverse"
          >
            <Sparkles className="w-4 h-4 ml-1.5 text-yellow-300 animate-spin-slow" />
            <span>اقترح لي أحسن قطعية لحم الآن</span>
          </button>

          {aiRecommendation && (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/40 text-amber-200 space-y-3 animate-fade-in">
              <div className="flex items-center space-x-1.5 space-x-reverse text-amber-400 font-bold">
                <ChefHat className="w-4 h-4" />
                <span>توصية الجزار صاحب السعادة:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{aiRecommendation}</p>

              {suggestedProductId && (
                <button
                  onClick={() => {
                    const matched = products.find((p) => p.id === suggestedProductId);
                    if (matched) {
                      setSelectedProduct(matched);
                      onClose();
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  عرض هذه القطعية وتحديد الوزن والتقطيع 🥩
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
