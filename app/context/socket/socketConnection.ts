import { io, Socket } from 'socket.io-client';
import { getStoredToken } from '../../utils/auth';

const SERVER_URL = 'http://localhost:5001';

export const initializeSocket = (): Socket => {
  const token = getStoredToken();
  
  const socket = io(SERVER_URL, {
    auth: token ? { token } : undefined,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    reconnection: true
  });
  
  socket.on('reconnect', () => {
    console.log('Socket reconnected, requesting rooms');
    setTimeout(() => {
      socket.emit('get_rooms');
    }, 300);
  });
  
  return socket;
};

export const disconnectSocket = (socket: Socket | null) => {
  if (socket) {
    socket.disconnect();
  }
}; 