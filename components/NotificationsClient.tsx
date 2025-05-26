'use client';

import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

type Props = {
  userId: string;
};

const NotificationsClient = ({ userId }: Props) => {
  useSocket(userId);

  return <div>WebSocket connected for user {userId}</div>;
};

export default NotificationsClient;
