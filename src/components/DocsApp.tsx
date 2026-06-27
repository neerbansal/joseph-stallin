import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { docsConfig } from '../docs/config';
import { Menu, X } from 'lucide-react';

export function DocsApp() {
  const [activeDocId, setActiveDocId] = useState(docsConfig[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeDoc = docsConfig.find(doc => doc.id === activeDocId) || docsConfig[0];

  return (
    <div className="flex h-full w-full bg-white dark:bg-neutral-900 text-black dark:text-white rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 ease-in-out border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center whitespace-nowrap">
          <h2 className="font-bold text-lg">Documentation</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded md:hidden"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {docsConfig.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocId(doc.id)}
              className={`w-full text-left px-4 py-2 rounded-md mb-1 transition-colors whitespace-nowrap ${
                activeDocId === doc.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center bg-white dark:bg-neutral-900">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded mr-4"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-bold text-xl truncate">{activeDoc.title}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="prose prose-neutral dark:prose-invert max-w-3xl">
            <ReactMarkdown>{activeDoc.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
