'use client';

import { useSocket } from '../context/SocketContext';
import { RoomHeader, CreateRoomForm, RoomsList } from './rooms';

export default function RoomList() {
  const { 
    rooms, 
    joinRoom, 
    createRoom, 
    currentRoom, 
    isConnected, 
    username 
  } = useSocket();

  return (
    <div className="w-full max-w-xs bg-gray-50 border-r border-gray-200">
      <RoomHeader roomCount={rooms.length} />
      
      <CreateRoomForm 
        onCreateRoom={createRoom} 
        isConnected={isConnected} 
        username={username} 
      />
      
      <RoomsList 
        rooms={rooms} 
        currentRoom={currentRoom} 
        onJoinRoom={joinRoom} 
      />
    </div>
  );
} 