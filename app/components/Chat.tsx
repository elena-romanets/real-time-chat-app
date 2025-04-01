'use client';

import { useSocket } from '../context/SocketContext';
import LoginScreen from './LoginScreen';
import RoomList from './RoomList';
import ChatRoom from './ChatRoom';

export default function Chat() {
  const { username, currentRoom } = useSocket();

  if (!username) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <RoomList />
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <ChatRoom />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Welcome, {username}!</h2>
              <p className="mt-2 text-gray-600">Select a room to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 