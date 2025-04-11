export interface User {
  id: string;
  username: string;
  roomId: string;
}

export interface Message {
  id: string;
  text: string;
  username: string;
  roomId: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  messages: Message[];
  users: User[];
}

export interface RoomListItem {
  id: string;
  name: string;
  userCount: number;
} 