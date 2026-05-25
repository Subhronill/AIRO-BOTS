import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { displayName, bio, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { displayName, bio, avatar },
      select: { id: true, displayName: true, bio: true, avatar: true },
    });
    return res.json(user);
  } catch {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (_req, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      take: 20,
      orderBy: { xp: 'desc' },
      select: { id: true, displayName: true, username: true, xp: true, level: true, streak: true },
    });
    return res.json(users);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get achievements
router.get('/achievements', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const [all, earned] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({
        where: { userId: req.user!.id },
        include: { achievement: true },
      }),
    ]);
    const earnedIds = new Set(earned.map(e => e.achievementId));
    return res.json({
      earned: earned.map(e => ({ ...e.achievement, earnedAt: e.earnedAt })),
      locked: all.filter(a => !earnedIds.has(a.id)),
    });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;
