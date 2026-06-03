import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (boardId) => {
  socket.auth = { boardId };
  socket.connect();
};

export default socket;