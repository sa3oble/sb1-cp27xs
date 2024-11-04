import React from 'react';
import { Calendar, Tag, User } from 'lucide-react';
import type { Tweet } from '../types/tweet';

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <img 
          src={tweet.author.profileImage} 
          alt={tweet.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{tweet.author.name}</p>
          <p className="text-gray-500">@{tweet.author.username}</p>
        </div>
      </div>
      
      <p className="text-gray-800 mb-3">{tweet.text}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tweet.labels.map((label) => (
          <span 
            key={label}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            <Tag className="inline w-4 h-4 mr-1" />
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(tweet.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          {tweet.author.username}
        </div>
      </div>
    </div>
  );
}