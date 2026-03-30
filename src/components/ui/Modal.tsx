import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const sizeClasses = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: keyof typeof sizeClasses;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, size = 'md', children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${sizeClasses[size]} bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
