'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
};

export function Accordion({ items, defaultOpenId, allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() =>
    defaultOpenId ? new Set([defaultOpenId]) : new Set(),
  );

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
      {items.map(item => (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => toggleItem(item.id)}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
            aria-expanded={openIds.has(item.id)}
          >
            <span className="text-base font-semibold text-gray-900">{item.title}</span>
            <svg
              className={`size-5 text-gray-500 transition-transform ${
                openIds.has(item.id) ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIds.has(item.id) && (
            <div className="px-6 pt-2 pb-4 text-sm text-gray-600">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
