import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function StatusMessage({ text, isError, isLoading }) {
  if (!text) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
          px-4 py-2 text-sm
          ${isError ? 'bg-[#5a1d1d] text-red-400' : 
            isLoading ? 'bg-[#063b49] text-blue-400' : 
            'bg-[#404040] text-[var(--vscode-text)]'}
        `}
      >
        <div className="container mx-auto flex items-center gap-2">
          {isLoading && (
            <div 
              className="w-3 h-3 border-2 border-current rounded-full animate-spin"
              style={{ borderTopColor: 'transparent' }}
            />
          )}
          {isError && (
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{text}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StatusMessage;