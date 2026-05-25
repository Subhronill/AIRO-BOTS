import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

const generateTokens = (userId: string, email: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' }          // short-lived — silently refreshed by interceptor
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: '30d' }          // 30-day rolling window — keeps users logged in
  );
  return { accessToken, refreshToken };
};

// Refresh token TTL in ms (must match jwt expiresIn above)
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 6 }),
  body('displayName').isLength({ min: 2, max: 50 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password, displayName } = req.body;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(400).json({ error: 'Email or username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, username, passwordHash, displayName, isEmailVerified: true },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    // Log activity
    await prisma.activity.create({
      data: { userId: user.id, type: 'register', xpGained: 0 },
    });

    return res.status(201).json({
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName, role: user.role, xp: user.xp, level: user.level },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    // Update streak
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate?.toDateString();
    let streak = user.streak;
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      streak = lastActive === yesterday ? streak + 1 : 1;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveDate: new Date(), streak },
    });

    await prisma.activity.create({
      data: { userId: user.id, type: 'login', xpGained: 0 },
    });

    return res.json({
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName, role: user.role, xp: user.xp, level: user.level, streak, avatar: user.avatar },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    const tokens = generateTokens(user.id, user.email, user.role);
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    return res.json(tokens);
  } catch {
    return res.status(401).json({ error: 'Token refresh failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, username: true, displayName: true, avatar: true, bio: true, role: true, xp: true, level: true, streak: true, createdAt: true },
    });
    return res.json(user);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    return res.json({ message: 'Logged out successfully' });
  } catch {
    return res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
