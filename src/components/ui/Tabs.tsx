'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

export type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

export type TabsProps = {
  tabs: Tab[];
  defaultTabId?: string;
};

export function Tabs({ tabs, defaultTabId }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTabId === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              aria-current={activeTabId === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-6">
        {activeTab?.content}
      </div>
    </div>
  );
}
