/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
  lang?: Language;
}

export const Toast: React.FC<ToastProps> = ({ message, lang = 'ru' }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/90 text-emerald-100 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-sm font-medium">
            <span className="font-semibold text-white">
              {lang === 'en' ? 'Copied to clipboard!' : 'Команда скопирована!'}
            </span>
            <div className="text-xs text-emerald-300/80 font-mono truncate max-w-xs">{message}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
