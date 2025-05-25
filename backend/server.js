const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (update in production)
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log('🚪 ${socket.id} joined room ${roomId}');
  });

  socket.on('codeUpdate', ({ roomId, newCode }) => {
    socket.to(roomId).emit('remoteUpdate', newCode);
    console.log('📝 Code updated in room ${roomId}');
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Server running successfully');
});
