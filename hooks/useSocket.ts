'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { apiBaseUrl } from '@/app/utils/env';

const SOCKET_URL = apiBaseUrl;

export const useSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      query: { userId },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('notification', (message) => {
      console.log('Notification received:', message);

      // Show toast
      console.log("message", message)
      toast.success(`🔔 ${message.text || 'You have a new notification'}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
