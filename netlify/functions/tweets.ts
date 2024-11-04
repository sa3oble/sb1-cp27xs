import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  bearerToken: process.env.TWITTER_BEARER_TOKEN!,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { query, next_token } = event.queryStringParameters || {};
    
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing query parameter',
          message: 'Search query is required'
        })
      };
    }

    const searchParams = {
      'tweet.fields': ['created_at', 'entities', 'author_id'],
      'user.fields': ['name', 'username', 'profile_image_url'],
      'expansions': ['author_id'],
      'max_results': 20
    };

    if (next_token) {
      searchParams.pagination_token = next_token;
    }

    const response = await client.v2.search(decodeURIComponent(query), searchParams);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: response.data.data || [],
        meta: response.data.meta || { next_token: null },
        includes: response.data.includes
      })
    };
  } catch (error) {
    console.error('Twitter API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Twitter API Error',
        message: error instanceof Error ? error.message : 'Failed to fetch tweets'
      })
    };
  }
};