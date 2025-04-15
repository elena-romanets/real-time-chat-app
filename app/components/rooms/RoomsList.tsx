"use client";

import { useSocket } from "@/app/context/SocketContext";
import RoomListItem from "./RoomListItem";

export default function RoomsList() {
  const { rooms } = useSocket();

  return (
    <div
      className="overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 15rem)" }}
    >
      <ul className="divide-y divide-gray-200">
        {rooms.map((room) => (
          <RoomListItem
            key={room.id}
            room={room}
          />
        ))}
      </ul>
    </div>
  );
}
