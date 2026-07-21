import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import butcheryLogo from '../assets/images/butchery_logo_updated_1784664060628.jpg';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] text-white px-4"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-red-950/30 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-6 text-center"
      >
        <div className="w-28 h-28 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-yellow-600 via-red-800 to-yellow-400 shadow-2xl gold-glow relative overflow-hidden">
          <img
            src={butcheryLogo}
            alt="شعار جزارة صاحب السعادة"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
          {/* Light reflection effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold gold-gradient-text tracking-wide mb-1">
          جزارة صاحب السعادة
        </h1>
        <p className="text-xs text-amber-200/70 font-light">
          الجيزة - مزلقان مني الأمير | الفخامة والجودة العالية
        </p>
      </motion.div>

      {/* Progress bar container */}
      <div className="w-64 md:w-80 h-1.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-red-900/40 relative mb-3">
        <motion.div
          className="h-full bg-gradient-to-r from-red-800 via-amber-500 to-yellow-300 rounded-full shadow-lg"
          style={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center space-x-2 space-x-reverse text-xs text-slate-400 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <span>جارى تجهيز أفضل تجربة تسوق...</span>
        <span className="text-amber-400 font-bold tracking-widest">{progress}%</span>
      </div>
    </motion.div>
  );
};
