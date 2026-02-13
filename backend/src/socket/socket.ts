import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust this to your frontend's origin
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('a user connected', socket.id);

    // Join a room based on userId
    socket.on('join', userId => {
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
  });

  return io;
};

export const getSocketIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
