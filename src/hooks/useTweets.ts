import { useState, useEffect, useCallback } from 'react';
import { fetchTweets } from '../services/twitter';
import type { Tweet } from '../types/tweet';

const HASHTAGS = ['journorequest', 'prrequest'];
const KEYWORDS = ['technology', 'tech', 'software', 'ai', 'startup'];

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const loadTweets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const query = HASHTAGS.map(tag => `#${tag}`).join(' OR ');
      const response = await fetchTweets(query, nextPageToken);
      
      const tweetsWithLabels = response.tweets.map(tweet => ({
        ...tweet,
        labels: KEYWORDS.filter(keyword => 
          tweet.text.toLowerCase().includes(keyword.toLowerCase())
        ),
      }));

      setTweets(tweetsWithLabels);
      setNextPageToken(response.nextToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching tweets');
      setTweets([]);
    } finally {
      setIsLoading(false);
    }
  }, [nextPageToken]);

  useEffect(() => {
    loadTweets();
  }, [loadTweets, page]);

  const retry = useCallback(() => {
    loadTweets();
  }, [loadTweets]);

  return {
    tweets,
    isLoading,
    error,
    page,
    setPage,
    hasNextPage: !!nextPageToken,
    retry
  };
}