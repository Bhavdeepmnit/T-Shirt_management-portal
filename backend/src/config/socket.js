const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Authenticate socket connections via JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role, branch } = socket.user;
    console.log(`🔌 Socket connected: ${role} (${id})`);

    // Admins join their branch room
    if (role === 'admin') {
      socket.join(`admin_branch_${branch}`);
    }

    // Super Admin joins global room
    if (role === 'superadmin') {
      socket.join('superadmin_global');
    }

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${role} (${id})`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
