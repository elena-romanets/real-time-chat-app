'use client';

import { useSocket } from '@/app/context/SocketContext';
import { useState } from 'react';

export default function CreateRoomForm(){
  const { createRoom, username, isConnected }= useSocket();

  const [newRoomName, setNewRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      return;
    }
    
    if (!isConnected || !username) {
      console.error('Cannot create room: Not connected or not authenticated');
      return;
    }
    
    createRoom(newRoomName);
    setNewRoomName('');
    setIsCreating(false);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      {isCreating ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleCreateRoom}
              className="flex-1 px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewRoomName('');
              }}
              className="flex-1 px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full px-3 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create New Room
        </button>
      )}
    </div>
  );
} 