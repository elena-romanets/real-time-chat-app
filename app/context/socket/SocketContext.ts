import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Room, RoomListItem } from '../../types';

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  username: string;
  setUsername: (username: string) => void;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  messages: Message[];
  sendMessage: (text: string) => void;
  rooms: RoomListItem[];
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  createRoom: (roomName: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
  authError: null,
  username: '',
  setUsername: () => {},
  login: async () => false,
  logout: () => {},
  currentRoom: null,
  setCurrentRoom: () => {},
  messages: [],
  sendMessage: () => {},
  rooms: [],
  joinRoom: () => {},
  leaveRoom: () => {},
  createRoom: () => {}
});

export default SocketContext; 