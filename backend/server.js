// server.js (ESM version)
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();
app.set('trust proxy', true);
app.use(cors({ origin: CORS_ORIGIN, methods: ['GET', 'POST'] }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Socket.IO Server Running', status: 'online' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`🚪 ${socket.id} joined room ${roomId}`);
  });

  socket.on('codeUpdate', ({ roomId, newCode }) => {
    socket.to(roomId).emit('remoteUpdate', newCode);
    console.log(`📝 Code updated in room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
