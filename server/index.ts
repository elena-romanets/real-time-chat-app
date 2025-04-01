import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
interface User {
  id: string;
  username: string;
  roomId: string;
}

interface Message {
  id: string;
  text: string;
  username: string;
  roomId: string;
  timestamp: number;
}

interface Room {
  id: string;
  name: string;
  messages: Message[];
  users: User[];
}

const rooms: Record<string, Room> = {};
const users: Record<string, User> = {};

// Create a default room
const generalRoom: Room = {
  id: 'general',
  name: 'General',
  messages: [],
  users: []
};

rooms[generalRoom.id] = generalRoom;

// Add middleware for auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    // Allow connection without token for now, but user will be limited
    // until they authenticate
    return next();
  }
  
  try {
    // In a real app, this would verify the token signature and decode
    // For simplicity, we're just checking if there's a payload with a username
    const parts = token.split('.');
    if (parts.length < 2) {
      return next(new Error('Invalid token format'));
    }
    
    const payload = JSON.parse(atob(parts[0]));
    
    // Check if token has expired
    if (payload.exp < Date.now()) {
      return next(new Error('Token expired'));
    }
    
    // Attach user data to socket for later use
    socket.data.authenticated = true;
    socket.data.username = payload.username;
    
    return next();
  } catch (error) {
    return next(new Error('Invalid token'));
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id, 
    socket.data.authenticated ? `(Authenticated as ${socket.data.username})` : '(Not authenticated)');

  // Join a room
  socket.on('join_room', ({ username, roomId }) => {
    // Create a new user
    const user: User = {
      id: socket.id,
      username,
      roomId
    };

    // Add user to users list
    users[socket.id] = user;

    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        name: roomId,
        messages: [],
        users: []
      };
    }

    // Add user to room
    rooms[roomId].users.push(user);

    // Join socket room
    socket.join(roomId);

    // Send room info to user
    socket.emit('room_joined', {
      room: {
        id: rooms[roomId].id,
        name: rooms[roomId].name,
        users: rooms[roomId].users.map(u => ({ id: u.id, username: u.username }))
      },
      messages: rooms[roomId].messages
    });

    // Broadcast to room that user joined
    socket.to(roomId).emit('user_joined', { 
      user: { id: user.id, username: user.username } 
    });

    // Update room list for everyone
    io.emit('room_list', Object.values(rooms).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.length
    })));
  });

  // Send message
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

    // Save message to room
    rooms[roomId].messages.push(message);
    
    // Keep only last 100 messages
    if (rooms[roomId].messages.length > 100) {
      rooms[roomId].messages = rooms[roomId].messages.slice(-100);
    }

    // Broadcast message to room
    io.to(roomId).emit('receive_message', message);
  });

  // Create room
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

    // Update room list for everyone
    io.emit('room_list', Object.values(rooms).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.length
    })));

    socket.emit('room_created', { roomId });
    console.log('Room created event emitted for:', roomId);
  });

  // Get room list
  socket.on('get_rooms', () => {
    socket.emit('room_list', Object.values(rooms).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.length
    })));
  });

  // Leave room
  socket.on('leave_room', ({ roomId }) => {
    const user = users[socket.id];
    
    if (!user || !rooms[roomId]) return;

    // Remove user from room
    rooms[roomId].users = rooms[roomId].users.filter(u => u.id !== socket.id);

    // Leave socket room
    socket.leave(roomId);

    // Broadcast to room that user left
    socket.to(roomId).emit('user_left', { userId: socket.id });

    // Update room list for everyone
    io.emit('room_list', Object.values(rooms).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.length
    })));

    // No longer removing empty rooms - all rooms persist
    // Rooms will stay available even when empty
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    
    if (user) {
      const roomId = user.roomId;
      
      if (rooms[roomId]) {
        // Remove user from room
        rooms[roomId].users = rooms[roomId].users.filter(u => u.id !== socket.id);

        // Broadcast to room that user left
        socket.to(roomId).emit('user_left', { userId: socket.id });

        // Update room list for everyone
        io.emit('room_list', Object.values(rooms).map(room => ({
          id: room.id,
          name: room.name,
          userCount: room.users.length
        })));

        // No longer removing empty rooms - all rooms persist
        // Rooms will stay available even when empty
      }

      // Remove user from users list
      delete users[socket.id];
    }

    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/rooms', (req, res) => {
  res.json(Object.values(rooms).map(room => ({
    id: room.id,
    name: room.name,
    userCount: room.users.length
  })));
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 