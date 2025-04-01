import { Socket } from 'socket.io-client';
import { Message, Room, RoomListItem, User } from '../../types';
import { Dispatch, SetStateAction } from 'react';

export const setupSocketEvents = (
  socket: Socket,
  setRooms: Dispatch<SetStateAction<RoomListItem[]>>,
  setCurrentRoom: Dispatch<SetStateAction<Room | null>>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  joinRoom: (roomId: string) => void
) => {

  socket.on('room_list', (roomsList: RoomListItem[]) => {
    console.log('Received room list:', roomsList);
    setRooms(roomsList);
  });

  socket.on('room_joined', ({ room, messages: roomMessages }) => {
    console.log('Joined room:', room);
    setCurrentRoom(room);
    setMessages(roomMessages);
  });

  socket.on('room_created', ({ roomId }) => {
    console.log('Room created successfully:', roomId);
    joinRoom(roomId);
  });

  socket.on('room_exists', ({ roomId }) => {
    console.log('Room already exists:', roomId);
  });

  socket.on('receive_message', (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  });

  socket.on('user_joined', ({ user }: { user: User }) => {
    setCurrentRoom(prevRoom => {
      if (!prevRoom) return null;
      return {
        ...prevRoom,
        users: [...prevRoom.users, user]
      };
    });
  });

  socket.on('user_left', ({ userId }: { userId: string }) => {
    setCurrentRoom(prevRoom => {
      if (!prevRoom) return null;
      return {
        ...prevRoom,
        users: prevRoom.users.filter(user => user.id !== userId)
      };
    });
  });
};

export const cleanupSocketEvents = (socket: Socket) => {
  socket.off('room_list');
  socket.off('room_joined');
  socket.off('room_created');
  socket.off('room_exists');
  socket.off('receive_message');
  socket.off('user_joined');
  socket.off('user_left');
}; 