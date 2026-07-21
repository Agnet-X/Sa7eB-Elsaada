import React from 'react';
import { Phone, MapPin, Send, ShieldCheck, ChefHat, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import butcheryLogo from '../assets/images/butchery_logo_updated_1784664060628.jpg';

export const Footer: React.FC<{ onOpenAiChef: () => void }> = ({ onOpenAiChef }) => {
  const { storeSettings, setIsAdminOpen, isAdminAuthenticated } = useApp();

  return (
    <footer className="bg-[#070709] border-t border-red-900/40 text-slate-300 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 space-x-reverse">
            <img
              src={butcheryLogo}
              alt="جزارة صاحب السعادة"
              className="w-10 h-10 rounded-full border border-amber-500/50"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl font-extrabold gold-gradient-text">جزارة صاحب السعادة</span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            الموقع الرسمي لجزارة صاحب السعادة بمزلقان مني الأمير للجيزة. نقدم أجود اللحوم البلدية والجاموسي والبقري الكندوز الفاخرة ذبح اليوم، بتقطيع وتغليف فاكيوم آلي.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAiChef}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center space-x-1.5 space-x-reverse hover:bg-amber-900/80 transition-colors"
            >
              <ChefHat className="w-4 h-4 text-amber-400 ml-1" />
              <span>مستشار اختيارات الطهي 👨‍🍳</span>
            </button>
          </div>
        </div>

        {/* Col 2: Fast Contact */}
        <div className="space-y-3 text-xs">
          <h4 className="font-extrabold text-white text-sm">التواصل والطلب المباشر</h4>
          <div className="flex items-start space-x-2 space-x-reverse">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5 ml-1" />
            <a
              href={storeSettings.gmapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              {storeSettings.address}
            </a>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
            <a href={`tel:${storeSettings.phone1}`} className="text-amber-400 font-bold hover:underline ml-2">
              {storeSettings.phone1}
            </a>
            <a href={`tel:${storeSettings.phone2}`} className="text-gray-400 hover:underline">
              ({storeSettings.phone2})
            </a>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Send className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
            <a
              href={`https://wa.me/${storeSettings.whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:underline"
            >
              محادثة الواتساب المباشرة
            </a>
          </div>
        </div>

        {/* Col 3: Meat Categories */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-white text-sm mb-3">أبرز القطعيات</h4>
          <ul className="space-y-1.5 font-medium text-slate-400">
            <li>• لحم الموزة الكندوز البلدي</li>
            <li>• السند الجاموسي البلدي</li>
            <li>• وش الفخذ للبوفتيك والستيك</li>
            <li>• المومبار والكوارع ناصعة النظافة</li>
            <li>• الكبدة البلدي طازجة ذبح اليوم</li>
            <li>• المفروم، البرجر والكفتة المتبلة</li>
          </ul>
        </div>

        {/* Col 4: Specialization Notice */}
        <div className="space-y-3 text-xs bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
          <div className="flex items-center space-x-2 space-x-reverse text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>ضمان الجودة والتخصص</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">
            نحن متخصصون حصرياً في اللحوم البلدي والجاموسي الكندوز، ولا نبيع الدواجن نهائياً لضمان أعلى مستويات الجودة والخدمة الملوكية.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          جميع الحقوق محفوظة © {new Date().getFullYear()} - جزارة صاحب السعادة ({storeSettings.phone1})
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-amber-400/80">صنع بكل حب ورعاية لأهالي الجيزة الكرام ❤️</span>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-gray-600 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-white/5 hover:border-amber-500/30"
            title="دخول لوحة التحكم للأدمن فقط"
          >
            <Lock className="w-3 h-3 text-amber-500/70" />
            <span>{isAdminAuthenticated ? 'لوحة الإدارة (مفعل)' : 'دخول الإدارة'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
