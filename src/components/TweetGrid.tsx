import React from 'react';
import { TweetCard } from './TweetCard';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import type { Tweet } from '../types/tweet';

interface TweetGridProps {
  tweets: Tweet[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function TweetGrid({ tweets, isLoading, error, onRetry }: TweetGridProps) {
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (isLoading && tweets.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg h-48"
          />
        ))}
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tweets found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}