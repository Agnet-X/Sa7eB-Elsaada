import React from 'react';
import { MapPin, Phone, Clock, Compass, Send, CheckCircle2 } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const gmapsUrl = 'https://maps.app.goo.gl/UzvBcroJ8unswcgC7';

  return (
    <section id="location-section" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="bg-[#16161a] p-6 sm:p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Location Info Text */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-flex items-center space-x-1.5 space-x-reverse text-[10px] font-extrabold uppercase tracking-widest text-[#e63946] bg-red-950/60 px-3.5 py-1 rounded-full border border-red-800/40 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#e63946]" />
                <span>موقعنا الفريد بالجيزة</span>
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                تفضل بزيارتنا في جزارة صاحب السعادة 🥩
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-medium mt-2 leading-relaxed">
                يسعدنا استقبالكم يومياً لاختيار أفضل قطعيات اللحم البلدي والجاموسي الكندوز بأنفسكم، أو الطلب الهاتفي والتوصيل المباشر.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5 ml-2" />
                <div>
                  <strong className="block text-white font-bold mb-0.5">العنوان بالتفصيل:</strong>
                  <span className="text-gray-300 font-medium">
                    الجيزة - مزلقان مني الأمير - شارع زكريا إدريس (بجوار صيدلية دكتور محمد حامد).
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 ml-2" />
                <div>
                  <strong className="block text-white font-bold mb-0.5">الهاتف والواتساب المباشر:</strong>
                  <a
                    href="tel:01124795553"
                    className="text-amber-400 font-extrabold hover:underline"
                  >
                    01124795553
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start space-x-3 space-x-reverse">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 ml-2" />
                <div>
                  <strong className="block text-white font-bold mb-0.5">مواعيد العمل الرسمية:</strong>
                  <span className="text-gray-300 font-medium">
                    يومياً من الساعة 8:00 صباحاً وحتى 11:00 مساءً (الذبح والتقطيع صباحاً طازج).
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Action */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#e63946] hover:bg-[#b91c1c] text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center space-x-2 space-x-reverse transition-transform active:scale-95"
              >
                <Compass className="w-4 h-4 ml-1.5 animate-spin-slow" />
                <span>ابدأ الملاحة عبر خرائط جوجل</span>
              </a>

              <a
                href="https://wa.me/201124795553"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-xl flex items-center space-x-2 space-x-reverse transition-transform active:scale-95"
              >
                <Send className="w-4 h-4 ml-1.5 text-black" />
                <span>مراسلة الواتساب مباشرة</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Placeholder Card */}
          <div className="lg:col-span-6 relative h-80 lg:h-96 rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
            <iframe
              title="موقع جزارة صاحب السعادة"
              src="https://maps.google.com/maps?q=30.0131,31.2089&z=15&output=embed"
              className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180 brightness-90 contrast-125"
              loading="lazy"
            />
            <div className="absolute bottom-4 right-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-xs flex items-center justify-between">
              <span className="text-amber-300 font-bold">📍 جزارة صاحب السعادة (مزلقان مني الأمير)</span>
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-extrabold"
              >
                فتح الخريطة
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
