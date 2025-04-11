import { Room, User, Message, RoomListItem } from '../types';

export const rooms: Record<string, Room> = {};
export const users: Record<string, User> = {};

export const initializeStore = (): void => {
  const generalRoom: Room = {
    id: 'general',
    name: 'General',
    messages: [],
    users: []
  };

  rooms[generalRoom.id] = generalRoom;
};

export const getRoomList = (): RoomListItem[] => {
  return Object.values(rooms).map(room => ({
    id: room.id,
    name: room.name,
    userCount: room.users.length
  }));
};

export const addUserToRoom = (user: User, roomId: string): void => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      name: roomId,
      messages: [],
      users: []
    };
  }
  
  rooms[roomId].users.push(user);
};

export const removeUserFromRoom = (userId: string, roomId: string): void => {
  if (rooms[roomId]) {
    rooms[roomId].users = rooms[roomId].users.filter(u => u.id !== userId);
  }
};

export const addMessageToRoom = (message: Message): void => {
  if (rooms[message.roomId]) {
    rooms[message.roomId].messages.push(message);
    
    if (rooms[message.roomId].messages.length > 100) {
      rooms[message.roomId].messages = rooms[message.roomId].messages.slice(-100);
    }
  }
}; 