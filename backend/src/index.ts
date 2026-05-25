import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import chapterRoutes from './routes/chapters';
import quizRoutes from './routes/quizzes';
import progressRoutes from './routes/progress';
import playgroundRoutes from './routes/playground';
import dashboardRoutes from './routes/dashboard';
import adminRoutes from './routes/admin';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Accept any localhost port in dev; restrict to FRONTEND_URL in production
const corsOrigin = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL || 'http://localhost:3000'
  : (origin: string | undefined, cb: (e: Error | null, allow?: boolean) => void) => {
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) cb(null, true);
      else cb(new Error('Not allowed by CORS'));
    };

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});

// Middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', limiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'AIRO BOTS API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/playground', playgroundRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// WebSocket
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
  });

  socket.on('code_update', (data: { roomId: string; code: string; userId: string }) => {
    socket.to(data.roomId).emit('code_updated', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     AIRO BOTS API Server Running      ║
  ║     Port: ${PORT}                        ║
  ║     Environment: ${process.env.NODE_ENV || 'development'}         ║
  ╚═══════════════════════════════════════╝
  `);
});

export { io };
export default app;
