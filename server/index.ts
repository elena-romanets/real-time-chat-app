import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Import our modules
import { initializeStore } from './data/store';
import { socketAuthMiddleware } from './middleware/auth';
import { setupSocketHandlers } from './socket/handlers';
import apiRoutes from './routes/api';

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data store
initializeStore();

// Apply socket middleware
io.use(socketAuthMiddleware);

// Set up socket connection handler
io.on('connection', (socket) => {
  setupSocketHandlers(io, socket);
});

// API Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});