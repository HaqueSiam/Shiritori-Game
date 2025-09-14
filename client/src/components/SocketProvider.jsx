import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const socketRef = useRef();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket']
    });
    socketRef.current = s;

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}
