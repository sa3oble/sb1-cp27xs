import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
        <p className="text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center text-red-700 hover:text-red-800"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Retry
        </button>
      )}
    </div>
  );
}