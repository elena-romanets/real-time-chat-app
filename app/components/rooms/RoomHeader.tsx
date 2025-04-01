"use client";

import { useSocket } from "../../context/SocketContext";

interface RoomHeaderProps {
  roomCount: number;
}

export default function RoomHeader({ roomCount }: RoomHeaderProps) {
  const { logout, username } = useSocket();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-4 border-b border-gray-200 flex-col justify-between items-center">
      <div className="flex-col">
        <div className="font-medium">{username}</div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm mt-2"
        >
          Log Out
        </button>
      </div>

      <div className="flex-col  mt-4">
        <h2 className="text-lg font-semibold text-gray-800">Chat Rooms</h2>
        <p className="text-sm text-gray-600">
          {roomCount} {roomCount === 1 ? "room" : "rooms"} available
        </p>
      </div>
    </div>
  );
}
