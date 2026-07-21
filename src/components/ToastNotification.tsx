import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 px-4 py-3 rounded-xl bg-gradient-to-r from-red-950/90 via-neutral-900/90 to-black/90 border border-amber-500/40 text-amber-200 shadow-2xl backdrop-blur-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 rounded-lg bg-red-900/50 text-amber-400">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <p className="text-sm font-semibold text-slate-100">{toastMessage}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
