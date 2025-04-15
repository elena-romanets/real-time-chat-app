"use client";

import { RoomHeader, CreateRoomForm, RoomsList } from "./rooms";

export default function Sidebar() {
  return (
    <div className="w-full max-w-xs bg-gray-50 border-r border-gray-200">
      <RoomHeader  />
      <CreateRoomForm />
      <RoomsList />
    </div>
  );
}
