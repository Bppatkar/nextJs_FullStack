import { io, Socket } from "socket.io-client";
import Env from "./env";

// const socket = io(Env.BACKEND_URL);

// export default socket;

let socket: Socket | null = null;

export function initializeSocket(): Socket {
  if (socket && socket.connected) {
    console.log('✅ Socket already initialized and connected');
    return socket;
  }

  const backendUrl = Env.BACKEND_URL || 'http://localhost:8000';
  
  console.log('🔌 Initializing Socket.io connection to:', backendUrl);

  socket = io(backendUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
    withCredentials: false,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Socket connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('⚠️ Socket error:', error);
  });

  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
}

export default getSocket();