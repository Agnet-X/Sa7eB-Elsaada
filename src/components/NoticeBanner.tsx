import React from 'react';
import { ShieldCheck, Flame, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NoticeBanner: React.FC = () => {
  const { storeSettings } = useApp();

  return (
    <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 border-y border-amber-500/30 py-3 px-4 text-xs md:text-sm text-center font-medium text-amber-200 space-y-2">
      {/* Dynamic Today's Slaughter Live Banner */}
      {storeSettings.todaySlaughterStatus && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500/20 via-red-600/30 to-amber-500/20 border border-amber-500/50 py-1.5 px-4 rounded-2xl mx-auto max-w-4xl text-amber-200 font-extrabold text-xs shadow-lg animate-fadeIn">
          <span className="flex items-center gap-1.5 bg-[#e63946] text-white px-3 py-0.5 rounded-full text-[11px] font-black shadow-md animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-current text-amber-300" />
            ذبح اليوم المعتمد 🩸
          </span>

          <span className="text-white text-xs sm:text-sm font-bold">
            {storeSettings.todaySlaughterNote || 'كندوز بلدي صغير (لباني 🥩) - ذبح اليوم طازج 100%'}
          </span>

          {storeSettings.todaySlaughterTime && (
            <span className="text-amber-300 text-[11px] bg-black/60 px-2.5 py-0.5 rounded-lg font-mono flex items-center gap-1 border border-amber-500/30">
              <Clock className="w-3 h-3 text-amber-400" />
              {storeSettings.todaySlaughterTime}
            </span>
          )}
        </div>
      )}

      {/* Primary Quality Guarantee Notice */}
      <div className="flex items-center justify-center space-x-2 space-x-reverse pt-0.5">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong className="text-white font-extrabold underline decoration-amber-500 underline-offset-4">تنويه هام من جزارة صاحب السعادة:</strong> نحن متخصصون حصرياً في أجود اللحوم البلدي والجاموسي والبقري والكندوز ذبح اليوم، ولا نتعامل في الدواجن أو الفراخ نهائياً لضمان أرقى معايير الجودة والتخصص.
        </span>
      </div>
    </div>
  );
};
