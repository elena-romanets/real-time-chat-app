import { Socket } from 'socket.io-client';
import { Room } from '../../types';


export const joinRoom = (
  socket: Socket | null, 
  username: string,
  currentRoom: Room | null,
  leaveRoom: () => void,
  roomId: string
) => {
  if (!socket || !username) return;
  
  if (currentRoom) {
    leaveRoom();
  }
  
  socket.emit('join_room', { username, roomId });
};

export const leaveRoom = (
  socket: Socket | null,
  currentRoom: Room | null
) => {
  if (!socket || !currentRoom) return;
  
  socket.emit('leave_room', { roomId: currentRoom.id });
  return true;
};

export const createRoom = (
  socket: Socket | null,
  roomName: string
) => {
  if (!socket) {
    console.error('Cannot create room: Socket not connected');
    return false;
  }
  
  console.log('Attempting to create room:', roomName);
  socket.emit('create_room', { roomName });
  return true;
};

export const sendMessage = (
  socket: Socket | null,
  currentRoom: Room | null,
  text: string
) => {
  if (!socket || !currentRoom || !text.trim()) return false;
  
  socket.emit('send_message', { 
    text, 
    roomId: currentRoom.id
  });
  return true;
}; 