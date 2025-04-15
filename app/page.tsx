'use client';

import { SocketProvider } from './context/SocketContext';
import App from './components/App';

export default function Home() {
  return (
    <SocketProvider>
      <App />
    </SocketProvider>
  );
}
