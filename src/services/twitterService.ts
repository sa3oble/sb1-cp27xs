import type { Tweet } from '../types/tweet';

const HASHTAGS = ['journorequest', 'prrequest'];
const KEYWORDS = ['technology', 'tech', 'software', 'ai', 'startup'];

interface TwitterResponse {
  tweets: Tweet[];
  nextToken: string | null;
  error: string | null;
}

export async function fetchTweets(nextToken?: string | null): Promise<TwitterResponse> {
  try {
    const query = `(${HASHTAGS.map(tag => `#${tag}`).join(' OR ')}) (${KEYWORDS.join(' OR ')})`;
    const encodedQuery = encodeURIComponent(query);
    const url = `/.netlify/functions/tweets?query=${encodedQuery}${nextToken ? `&next_token=${nextToken}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || 'Failed to fetch tweets';
      } catch {
        errorMessage = 'Invalid server response';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    const tweets: Tweet[] = (data.data || []).map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      author: {
        name: tweet.author?.name || 'Unknown',
        username: tweet.author?.username || 'unknown',
        profileImage: tweet.author?.profile_image_url || `https://unavatar.io/twitter/${tweet.author?.username}`,
      },
      createdAt: tweet.created_at || new Date().toISOString(),
      hashtags: tweet.entities?.hashtags?.map((h: any) => h.tag) || [],
      labels: KEYWORDS.filter(keyword => 
        tweet.text.toLowerCase().includes(keyword.toLowerCase())
      ),
    }));

    return {
      tweets,
      nextToken: data.meta?.next_token || null,
      error: null,
    };
  } catch (err) {
    console.error('Error fetching tweets:', err);
    return {
      tweets: [],
      nextToken: null,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}