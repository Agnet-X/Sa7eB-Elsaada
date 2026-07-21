import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, PhoneCall, Sparkles, Flame, ShieldCheck, Play, ArrowDown, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HERO_VIDEOS as FALLBACK_HERO_VIDEOS } from '../data/videos';

const HEADLINES = [
  'جزارة صاحب السعادة',
  'أجود اللحوم البلدية والجاموسي 100%',
  'ذبح يومي طازج بالجيزة',
  'تقطيع وتغليف فاخر حسب الطلب',
  'أعلى معايير النظافة والجودة المضمونة'
];

export const Hero: React.FC = () => {
  const { heroVideos, storeSettings } = useApp();
  const activeHeroVideos = heroVideos && heroVideos.length > 0 ? heroVideos : FALLBACK_HERO_VIDEOS;

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      {/* Bento Grid Header / Hero Container */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        
        {/* Bento Card 1: Main Video Showcase & Animated Headline (col-span-12 lg:col-span-8) */}
        <div className="col-span-12 lg:col-span-8 bg-[#16161a] border border-white/10 rounded-[2.5rem] relative overflow-hidden min-h-[420px] lg:min-h-[480px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl group">
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <video
              key={currentVideoIndex}
              ref={videoRef}
              src={activeHeroVideos[currentVideoIndex % activeHeroVideos.length]?.url}
              poster={activeHeroVideos[currentVideoIndex % activeHeroVideos.length]?.poster}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onLoadedData={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="w-full h-full object-cover opacity-50 filter brightness-90 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/40 to-transparent" />
          </div>

          {/* Top Controls Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#e63946] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow">
                مباشر
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 hidden sm:inline-block">
                جودة مضمونة 100%
              </span>
            </div>

            {/* Video switcher selector */}
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10">
              {activeHeroVideos.map((vid, idx) => (
                <button
                  key={vid.id || idx}
                  onClick={() => setCurrentVideoIndex(idx)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                    currentVideoIndex === idx
                      ? 'bg-[#e63946] text-white shadow'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={vid.title}
                >
                  فيديو {idx + 1}
                </button>
              ))}
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all ml-1"
                title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Bottom Headline & Call To Action */}
          <div className="relative z-10 mt-auto pt-12">
            <div className="min-h-[70px] sm:min-h-[90px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight uppercase"
                >
                  {HEADLINES[headlineIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm font-medium mt-2 max-w-xl leading-relaxed">
              شاهد سر السعادة في كل قطعة لحم نجهزها خصيصاً لك. ذبح يومي طازج وتغليف تفريغ هواء فاكيوم آلي للجيزة.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => scrollToSection('offers-section')}
                className="px-6 py-3 rounded-full bg-[#e63946] hover:bg-[#b91c1c] text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center space-x-2 space-x-reverse transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 ml-1.5 text-yellow-300" />
                <span>شاهد عروض اليوم المميزة</span>
              </button>
              <button
                onClick={() => scrollToSection('products-section')}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
              >
                تصفح قائمة اللحوم البلدي
              </button>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Daily Offer Highlight (col-span-12 sm:col-span-6 lg:col-span-4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-gradient-to-br from-[#e63946] to-[#b91c1c] rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-red-900/40 relative overflow-hidden group">
          <div className="absolute -left-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="font-extrabold text-xs uppercase tracking-widest text-white/90">عرض اليوم الفاخر</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">لحم فخدة بلدي</h3>
            </div>
            <span className="bg-black/20 text-white px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border border-white/10">
              توفير خاص
            </span>
          </div>

          <div className="relative z-10 my-6">
            <div className="text-4xl sm:text-5xl font-black text-white">
              380 <span className="text-sm font-normal text-white/80">ج.م / كيلو</span>
            </div>
            <p className="text-white/80 text-xs font-medium mt-1">قطعيات ناعمة وطرية مناسبة لكافة الطواجن والبوفتيك</p>
          </div>

          <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs font-bold text-white/90 flex items-center">
              <Flame className="w-4 h-4 ml-1 text-yellow-300" />
              ذبح الصباح طازج
            </span>
            <button
              onClick={() => scrollToSection('offers-section')}
              className="p-2.5 rounded-full bg-white text-red-900 font-extrabold text-xs hover:bg-neutral-100 transition-transform active:scale-90 shadow"
              title="احجز العرض"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bento Card 3: Direct WhatsApp Action Block (col-span-12 sm:col-span-6 lg:col-span-4) */}
        <a
          href="https://wa.me/201124795553"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-12 sm:col-span-6 lg:col-span-4 bg-emerald-500 hover:bg-emerald-400 rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-emerald-400/50 text-black shadow-xl group hover:scale-[1.02]"
        >
          <div className="w-14 h-14 bg-black/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-7 h-7 text-black" />
          </div>
          <h3 className="text-2xl font-black text-black">اطلب الآن عبر واتس آب</h3>
          <p className="text-black/80 text-xs font-bold mt-1 uppercase tracking-tight">التوصيل مباشر طازج بالجيزة</p>
          <div className="mt-4 px-5 py-2 rounded-full bg-black text-emerald-400 font-black text-base tracking-widest shadow-lg">
            01124795553
          </div>
        </a>

        {/* Bento Card 4: Location & Operating Info (col-span-12 lg:col-span-8) */}
        <div className="col-span-12 lg:col-span-8 bg-[#121216] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center shrink-0 border border-red-600/20 text-3xl">
            📍
          </div>
          <div className="flex-1 text-center sm:text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e63946] bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40">
              عنوان السعادة بالجيزة
            </span>
            <h4 className="text-xl font-bold text-white mt-2">مزلقان منى الأمير - شارع زكريا إدريس</h4>
            <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              بجوار صيدلية د. محمد حامد | يومياً من الساعة 8:00 صباحاً وحتى 11:00 مساءً.
            </p>
          </div>
          <button
            onClick={() => scrollToSection('location-section')}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs shrink-0 border border-white/10 transition-colors"
          >
            فتح الخريطة 🗺️
          </button>
        </div>

      </div>

      {/* Bento Mini Feature Strip */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#16161a] border border-white/5 flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-300 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% لحم بلدي وجاموسي</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#16161a] border border-white/5 flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-300 font-bold">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>تغليف تفريغ هواء Vacuum</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#16161a] border border-white/5 flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-300 font-bold">
          <Flame className="w-4 h-4 text-[#e63946] shrink-0" />
          <span>تقطيع وتجهيز مخصص</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#16161a] border border-white/5 flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-300 font-bold">
          <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
          <span>توصيل سريع للجيزة</span>
        </div>
      </div>
    </section>
  );
};
