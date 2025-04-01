"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatRoom() {
  const { currentRoom, messages, leaveRoom } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentRoom) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentRoom.name}
            </h2>
            <p className="text-sm text-gray-600">
              {currentRoom.users.length}{" "}
              {currentRoom.users.length === 1 ? "user" : "users"} online
            </p>
          </div>
          <button
            onClick={leaveRoom}
            className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Leave Room
          </button>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Be first to send a message!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput />
    </div>
  );
}
