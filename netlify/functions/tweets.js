import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
});

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query, next_token } = event.queryStringParameters || {};
    
    if (!query) {
      return {
        statusCode: 400,
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        data: response.data.data || [],
        meta: response.data.meta || { next_token: null }
      })
    };
  } catch (error) {
    console.error('Twitter API Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Twitter API Error',
        message: error.message || 'Failed to fetch tweets'
      })
    };
  }
}