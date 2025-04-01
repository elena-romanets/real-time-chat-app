'use client';

import { RoomListItem as RoomItemType } from '../../types';
import { Room } from '../../types';
import RoomListItem from './RoomListItem';

interface RoomsListProps {
  rooms: RoomItemType[];
  currentRoom: Room | null;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomsList({ rooms, currentRoom, onJoinRoom }: RoomsListProps) {
  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
      <ul className="divide-y divide-gray-200">
        {rooms.map((room) => (
          <RoomListItem 
            key={room.id} 
            room={room} 
            currentRoom={currentRoom} 
            onJoinRoom={onJoinRoom} 
          />
        ))}
      </ul>
    </div>
  );
} 