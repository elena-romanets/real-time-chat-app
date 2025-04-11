import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { 
  rooms, 
  users, 
  getRoomList, 
  addUserToRoom, 
  removeUserFromRoom, 
  addMessageToRoom 
} from '../data/store';
import { User, Message, Room } from '../types';

export const setupSocketHandlers = (io: Server, socket: Socket) => {
  console.log('User connected:', socket.id, 
    socket.data.authenticated ? `(Authenticated as ${socket.data.username})` : '(Not authenticated)');

  socket.on('join_room', ({ username, roomId }) => {
    console.log(`User ${socket.id} (${username}) is joining room ${roomId}`);
    
    const existingUser = users[socket.id];
    if (existingUser) {
      console.log(`User ${username} (${socket.id}) is already in room ${existingUser.roomId}`);
      
      if (existingUser.roomId === roomId) {
        console.log(`User ${username} is already in room ${roomId}, doing nothing`);
        return;
      }
      
      if (existingUser.roomId && rooms[existingUser.roomId]) {
        console.log(`Removing user ${username} from previous room ${existingUser.roomId}`);
        
        removeUserFromRoom(socket.id, existingUser.roomId);
        socket.leave(existingUser.roomId);
        
        socket.to(existingUser.roomId).emit('user_left', { userId: socket.id });
      }
      
      existingUser.roomId = roomId;
      addUserToRoom(existingUser, roomId);
    } else {
      const user: User = {
        id: socket.id,
        username,
        roomId
      };

      users[socket.id] = user;
      addUserToRoom(user, roomId);
    }

    socket.join(roomId);
    socket.emit('room_joined', {
      room: {
        id: rooms[roomId].id,
        name: rooms[roomId].name,
        users: rooms[roomId].users.map(u => ({ id: u.id, username: u.username }))
      },
      messages: rooms[roomId].messages
    });

    socket.to(roomId).emit('user_joined', { 
      user: { id: socket.id, username: users[socket.id].username } 
    });

    io.emit('room_list', getRoomList());
  });

  socket.on('send_message', ({ text, roomId }) => {
    const user = users[socket.id];
    
    if (!user || !rooms[roomId]) return;

    const message: Message = {
      id: uuidv4(),
      text,
      username: user.username,
      roomId,
      timestamp: Date.now()
    };

    addMessageToRoom(message);
    io.to(roomId).emit('receive_message', message);
  });

  socket.on('create_room', ({ roomName }) => {
    console.log('Create room request received:', roomName);
    
    const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
    
    if (rooms[roomId]) {
      console.log('Room already exists:', roomId);
      socket.emit('room_exists', { roomId });
      return;
    }

    const newRoom: Room = {
      id: roomId,
      name: roomName,
      messages: [],
      users: []
    };

    rooms[roomId] = newRoom;
    console.log('Room created:', newRoom);
    io.emit('room_list', getRoomList());
    socket.emit('room_created', { roomId });
    console.log('Room created event emitted for:', roomId);
  });

  socket.on('get_rooms', () => {
    socket.emit('room_list', getRoomList());
  });

  socket.on('leave_room', ({ roomId }) => {
    const user = users[socket.id];
    
    console.log(`User ${socket.id} is trying to leave room ${roomId}`);
    
    if (!user) {
      console.log(`User ${socket.id} not found`);
      return;
    }
    
    if (!rooms[roomId]) {
      console.log(`Room ${roomId} not found`);
      return;
    }
    
    console.log(`Before: User ${user.username} (${socket.id}) is in room ${user.roomId}`);
    
    if (user.roomId !== roomId) {
      console.log(`User is not in room ${roomId}, they are in ${user.roomId}`);
      return;
    }

    removeUserFromRoom(socket.id, roomId);
    
    user.roomId = "";
    socket.leave(roomId);
    socket.emit('room_left');
    socket.to(roomId).emit('user_left', { userId: socket.id });

    console.log(`After: User ${user.username} (${socket.id}) has left room ${roomId}`);

    io.emit('room_list', getRoomList());
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    
    if (user) {
      console.log(`User ${user.username} (${socket.id}) disconnected from room ${user.roomId}`);
      
      const roomId = user.roomId;
      
      if (roomId && rooms[roomId]) {
        removeUserFromRoom(socket.id, roomId);
        socket.to(roomId).emit('user_left', { userId: socket.id });
        console.log(`User ${user.username} removed from room ${roomId}. Room now has ${rooms[roomId].users.length} users.`);
        io.emit('room_list', getRoomList());
      }

      delete users[socket.id];
    }

    console.log('User disconnected:', socket.id);
  });
}; 