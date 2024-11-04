import React from 'react';
import { TweetGrid } from './components/TweetGrid';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTweets } from './hooks/useTweets';

function App() {
  const { tweets, isLoading, error, retry } = useTweets();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header onRefresh={retry} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <TweetGrid
            tweets={tweets}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;