import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const client = new TwitterApi({
  appKey: process.env.VITE_TWITTER_API_KEY,
  appSecret: process.env.VITE_TWITTER_API_SECRET,
  accessToken: process.env.VITE_TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.VITE_TWITTER_ACCESS_SECRET,
  bearerToken: process.env.VITE_TWITTER_BEARER_TOKEN,
});

app.get('/api/tweets/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing query parameter',
        message: 'Search query is required'
      });
    }

    const searchParams = {
      'tweet.fields': ['created_at', 'entities', 'author_id'],
      'user.fields': ['name', 'username', 'profile_image_url'],
      'expansions': ['author_id'],
      'max_results': 20
    };

    if (req.query.next_token) {
      searchParams.pagination_token = req.query.next_token;
    }

    const response = await client.v2.search(decodeURIComponent(query), searchParams);

    if (!response?.data?.data || !Array.isArray(response.data.data)) {
      return res.status(200).json({
        data: [],
        meta: { next_token: null }
      });
    }

    const tweets = response.data.data.map(tweet => {
      const author = response.data.includes.users?.find(
        user => user.id === tweet.author_id
      );
      
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author: author ? {
          name: author.name,
          username: author.username,
          profile_image_url: author.profile_image_url,
        } : {
          name: 'Unknown',
          username: 'unknown',
          profile_image_url: null,
        },
        entities: tweet.entities || {},
      };
    });

    res.status(200).json({
      data: tweets,
      meta: response.data.meta || { next_token: null }
    });
  } catch (error) {
    console.error('Twitter API Error:', error);
    
    const errorMessage = error.data?.errors?.[0]?.message || error.message || 'Failed to fetch tweets';
    const statusCode = error.code || 500;

    res.status(statusCode).json({
      error: 'Twitter API Error',
      message: errorMessage
    });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});