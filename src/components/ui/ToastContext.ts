'use client';

import { createContext } from 'react';

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

export type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
