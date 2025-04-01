'use client';

import { SocketProvider } from './context/SocketContext';
import Chat from './components/Chat';

export default function Home() {
  return (
    <SocketProvider>
      <Chat />
    </SocketProvider>
  );
}
