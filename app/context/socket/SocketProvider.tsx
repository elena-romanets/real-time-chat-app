"use client";

import { ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Message, Room, RoomListItem } from "../../types";
import SocketContext from "./SocketContext";
import { initializeSocket, disconnectSocket } from "./socketConnection";
import { setupSocketEvents, cleanupSocketEvents } from "./socketEvents";
import {
  joinRoom as joinRoomAction,
  leaveRoom as leaveRoomAction,
  createRoom as createRoomAction,
  sendMessage as sendMessageAction,
} from "./socketActions";
import {
  generateToken,
  storeToken,
  getStoredToken,
  verifyToken,
  removeToken,
} from "../../utils/auth";

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<RoomListItem[]>([]);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      const { valid, username: storedUsername } = verifyToken(storedToken);
      if (valid && storedUsername) {
        setUsername(storedUsername);
        setIsAuthenticated(true);
      } else {
        removeToken();
      }
    }
  }, []);

  useEffect(() => {
    const newSocket = initializeSocket();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setAuthError("Could not connect to server");
    });

    newSocket.on("auth_error", (error) => {
      console.error("Authentication error:", error);
      setAuthError(error.message || "Authentication failed");
      setIsAuthenticated(false);
    });

    newSocket.emit("get_rooms");

    return () => {
      disconnectSocket(newSocket);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const joinRoomHandler = (roomId: string) => joinRoom(roomId);
    setupSocketEvents(
      socket,
      setRooms,
      setCurrentRoom,
      setMessages,
      joinRoomHandler
    );

    return () => {
      cleanupSocketEvents(socket);
    };
  }, [socket]);

  const login = async (
    usernameInput: string,
    password?: string
  ): Promise<boolean> => {
    setAuthError(null);

    if (!usernameInput.trim()) {
      setAuthError("Username is required");
      return false;
    }

    try {
      const token = generateToken(usernameInput);
      storeToken(token);

      setUsername(usernameInput);
      setIsAuthenticated(true);

      if (socket) {
        socket.disconnect().connect();
      }

      return true;
    } catch (error) {
      setAuthError("Authentication failed");
      return false;
    }
  };

  const logout = () => {
    if (currentRoom) {
      leaveRoom();
    }

    removeToken();
    setIsAuthenticated(false);
    setUsername("");
    setAuthError(null);
    setCurrentRoom(null);
    setMessages([]);
    setRooms([]);

    if (socket) {
      socket.disconnect().connect();
    }
  };

  const joinRoom = (roomId: string) => {
    if (!isAuthenticated || !socket) {
      console.log('Cannot join room - user not authenticated or socket not connected');
      return;
    }

    joinRoomAction(socket, username, currentRoom, leaveRoom, roomId);
  };

  const leaveRoom = () => {
    const success = leaveRoomAction(socket, currentRoom);
    if (success) {
      setCurrentRoom(null);
      setMessages([]);
    }
  };

  const createRoom = (roomName: string) => {
    if (!isAuthenticated || !socket) {
      console.log('Cannot create room - user not authenticated or socket not connected');
      return;
    }

    createRoomAction(socket, roomName);
  };

  const sendMessage = (text: string) => {
    if (!isAuthenticated || !socket || !currentRoom) {
      console.log('Cannot send message - user not authenticated, no socket, or not in a room');
      return;
    }

    sendMessageAction(socket, currentRoom, text);
  };

  const value = {
    socket,
    isConnected,
    isAuthenticated,
    authError,
    username,
    setUsername,
    login,
    logout,
    currentRoom,
    setCurrentRoom,
    messages,
    sendMessage,
    rooms,
    joinRoom,
    leaveRoom,
    createRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
