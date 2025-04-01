import { io, Socket } from 'socket.io-client';
import { getStoredToken } from '../../utils/auth';

const SERVER_URL = 'http://localhost:5001';

export const initializeSocket = (): Socket => {
  const token = getStoredToken();
  
  const socket = io(SERVER_URL, {
    auth: token ? { token } : undefined
  });
  
  return socket;
};

export const disconnectSocket = (socket: Socket | null) => {
  if (socket) {
    socket.disconnect();
  }
}; 