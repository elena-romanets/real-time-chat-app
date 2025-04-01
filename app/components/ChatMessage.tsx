'use client';

import { Message } from '../types';
import { useSocket } from '../context/SocketContext';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { username } = useSocket();
  const isCurrentUser = message.username === username;
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
        isCurrentUser 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        <div className="flex items-baseline mb-1">
          <span className={`text-xs font-medium ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
            {isCurrentUser ? 'You' : message.username}
          </span>
          <span className={`ml-2 text-xs ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
        <p className="text-sm break-words">{message.text}</p>
      </div>
    </div>
  );
} 