import type { Tweet, TweetResponse } from '../types/tweet';

const handleApiError = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch tweets');
  }
  throw new Error('Network error occurred');
};

export async function fetchTweets(query: string, nextToken?: string): Promise<TweetResponse> {
  try {
    const params = new URLSearchParams({
      query: query,
      ...(nextToken && { next_token: nextToken })
    });

    const response = await fetch(`/.netlify/functions/tweets?${params}`);

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return { tweets: [], nextToken: null };
    }

    const tweets: Tweet[] = data.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      author: {
        name: tweet.author?.name || 'Unknown',
        username: tweet.author?.username || 'unknown',
        profileImage: tweet.author?.profile_image_url || `https://unavatar.io/twitter/${tweet.author?.username}`,
      },
      createdAt: tweet.created_at,
      hashtags: tweet.entities?.hashtags?.map((h: any) => h.tag) || [],
      labels: [],
    }));

    return {
      tweets,
      nextToken: data.meta?.next_token || null
    };
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch tweets');
  }
}