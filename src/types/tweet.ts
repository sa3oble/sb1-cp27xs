export interface Tweet {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
    profileImage: string;
  };
  createdAt: string;
  hashtags: string[];
  labels: string[];
}

export interface TweetResponse {
  tweets: Tweet[];
  nextPage: string | null;
}