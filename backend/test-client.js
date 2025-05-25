// Import the Socket.IO client library
const io = require('socket.io-client');

// Initialize connection to your server
const socket = io('http://localhost:3000', {
  transports: ['websocket'],  // Force WebSocket transport
  path: '/socket.io/',        // Must match server path
  extraHeaders: {
    // Optional: Add headers if your server requires them
    "Access-Control-Allow-Origin": "*"
  }
});

// Log connection success
socket.on('connect', () => {
  console.log('✅ Connected to server! Socket ID:', socket.id);
});

// Log connection errors
socket.on('connect_error', (err) => {
  console.error('❌ Connection failed:', err.message);
});

// Log disconnections
socket.on('disconnect', () => {
  console.log('⚠️ Disconnected from server');
});
