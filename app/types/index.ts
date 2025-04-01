export interface User {
  id: string;
  username: string;
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
  users: User[];
}

export interface RoomListItem {
  id: string;
  name: string;
  userCount: number;
} 