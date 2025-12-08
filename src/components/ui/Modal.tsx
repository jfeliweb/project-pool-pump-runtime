'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';

export type ModalProps = {
  isOpen: boolean;
  closeAction: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export function Modal({
  isOpen,
  closeAction,
  title,
  children,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAction();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeAction]);

  if (!isOpen) {
    return null;
  }

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeAction}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full ${sizeStyles[size]} max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={closeAction}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
