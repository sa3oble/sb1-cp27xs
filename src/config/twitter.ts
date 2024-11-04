interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
  bearerToken: string;
}

export const twitterConfig: TwitterConfig = {
  apiKey: import.meta.env.VITE_TWITTER_API_KEY,
  apiSecret: import.meta.env.VITE_TWITTER_API_SECRET,
  accessToken: import.meta.env.VITE_TWITTER_ACCESS_TOKEN,
  accessSecret: import.meta.env.VITE_TWITTER_ACCESS_SECRET,
  bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN,
};