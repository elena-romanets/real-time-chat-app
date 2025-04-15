'use client';

import { useSocket } from '@/app/context/SocketContext';
import { RoomListItem as RoomItem } from '../../types';

interface RoomListItemProps {
  room: RoomItem;
}

export default function RoomListItem({ room }: RoomListItemProps) {
  const { currentRoom, joinRoom } = useSocket();
  const isActive = currentRoom?.id === room.id;
  
  return (
    <li>
      <button
        onClick={() => joinRoom(room.id)}
        className={`w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
          isActive ? 'bg-indigo-50' : ''
        }`}
        disabled={isActive}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-medium ${
              isActive ? 'text-indigo-600' : 'text-gray-900'
            }`}>
              {room.name}
            </h3>
            <p className="text-xs text-gray-500">
              {room.userCount} {room.userCount === 1 ? 'user' : 'users'}
            </p>
          </div>
          {isActive && (
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </div>
      </button>
    </li>
  );
} 