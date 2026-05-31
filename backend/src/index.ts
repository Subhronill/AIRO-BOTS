import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as os from 'os';
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
import challengeRoutes from './routes/challenges';
import levelTestRoutes from './routes/level-tests';

dotenv.config();

// Returns the machine's LAN IPv4 address (e.g. 192.168.1.x) for phone access
function getLocalIP(): string {
  const ifaces = os.networkInterfaces();
  for (const iface of Object.values(ifaces)) {
    for (const info of iface ?? []) {
      if (info.family === 'IPv4' && !info.internal) return info.address;
    }
  }
  return 'localhost';
}

const app = express();
const httpServer = createServer(app);

// Accept localhost + LAN (192.168.x.x / 10.x.x.x / 172.16-31.x.x) in dev
// so you can view the site on your phone while on the same Wi-Fi.
// In production: allow the configured FRONTEND_URL + any *.vercel.app preview URL.
function buildCorsOrigin() {
  if (process.env.NODE_ENV === 'production') {
    const allowed: (string | RegExp)[] = [
      /^https:\/\/.*\.vercel\.app$/,   // Vercel preview deployments
    ];
    if (process.env.FRONTEND_URL) allowed.push(process.env.FRONTEND_URL);
    return allowed;
  }
  return (origin: string | undefined, cb: (e: Error | null, allow?: boolean) => void) => {
    if (
      !origin ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  };
}
const corsOrigin = buildCorsOrigin();

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
app.use('/api/challenges', challengeRoutes);
app.use('/api/level-tests', levelTestRoutes);

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
// Listen on all interfaces so phones on the same Wi-Fi can reach the API
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\n  ╔═══════════════════════════════════════════════╗');
  console.log(  '  ║          AIRO BOTS API Server Running         ║');
  console.log(  '  ╠═══════════════════════════════════════════════╣');
  console.log(`  ║  Local:    http://localhost:${PORT}                ║`);
  console.log(`  ║  Network:  http://${ip}:${PORT}           ║`);
  console.log(`  ║  Mode:     ${(process.env.NODE_ENV || 'development').padEnd(36)}║`);
  console.log(  '  ╚═══════════════════════════════════════════════╝\n');
});

export { io };
export default app;
