import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const client = new TwitterApi({
  appKey: process.env.VITE_TWITTER_API_KEY,
  appSecret: process.env.VITE_TWITTER_API_SECRET,
});

export default async function handler(req, res) {
  try {
    const { query, next_token } = req.query;
    
    const response = await client.v2.search(query, {
      'tweet.fields': ['created_at', 'entities', 'author_id'],
      'user.fields': ['name', 'username', 'profile_image_url'],
      'expansions': ['author_id'],
      ...(next_token && { next_token }),
      max_results: 20,
    });

    const tweets = response.data.data.map(tweet => {
      const author = response.data.includes.users.find(
        user => user.id === tweet.author_id
      );
      return {
        ...tweet,
        author: author ? {
          name: author.name,
          username: author.username,
          profile_image_url: author.profile_image_url,
        } : null,
      };
    });

    res.status(200).json({
      data: tweets,
      meta: response.data.meta,
    });
  } catch (error) {
    console.error('Twitter API Error:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
}