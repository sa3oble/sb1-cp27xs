import React from 'react';
import { Hash, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
}

export function Header({ onRefresh }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Twitter Hashtag Monitor
            </h1>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <p className="mt-2 text-gray-600">
          Monitoring #journorequest and #prrequest in real-time
        </p>
      </div>
    </header>
  );
}