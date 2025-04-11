import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next();
  }
  
  try {
  const parts = token.split('.');
    if (parts.length < 2) {
      return next(new Error('Invalid token format'));
    }
    
    const payload = JSON.parse(atob(parts[0]));
    
    if (payload.exp < Date.now()) {
      return next(new Error('Token expired'));
    }
    
    socket.data.authenticated = true;
    socket.data.username = payload.username;
    
    return next();
  } catch (error) {
    return next(new Error('Invalid token'));
  }
}; 