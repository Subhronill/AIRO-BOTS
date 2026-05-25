import { Router, Response } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const adminRouter = Router();
const userRouter = Router();

// Admin: Get all users
adminRouter.get('/users', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true, displayName: true, role: true, xp: true, level: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(users);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Analytics
adminRouter.get('/analytics', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalChapters, totalQuizAttempts, totalActivities] = await Promise.all([
      prisma.user.count(),
      prisma.chapter.count(),
      prisma.quizAttempt.count(),
      prisma.activity.count(),
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, displayName: true, email: true, xp: true, createdAt: true },
    });

    // Activity by day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const activities = await prisma.activity.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    });

    const activityByDay: Record<string, number> = {};
    for (const a of activities) {
      const date = a.createdAt.toISOString().split('T')[0];
      activityByDay[date] = (activityByDay[date] || 0) + 1;
    }

    return res.json({
      totals: { users: totalUsers, chapters: totalChapters, quizAttempts: totalQuizAttempts, activities: totalActivities },
      recentUsers,
      activityByDay,
    });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Admin: Update user role
adminRouter.patch('/users/:id/role', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
    return res.json(user);
  } catch {
    return res.status(500).json({ error: 'Failed to update role' });
  }
});

// User: Update profile
userRouter.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
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

// User: Get leaderboard
userRouter.get('/leaderboard', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      take: 20,
      orderBy: { xp: 'desc' },
      select: { id: true, displayName: true, username: true, avatar: true, xp: true, level: true, streak: true },
    });
    return res.json(users);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// User: Get achievements
userRouter.get('/achievements', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const [allAchievements, earned] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({
        where: { userId: req.user!.id },
        include: { achievement: true },
      }),
    ]);

    const earnedIds = new Set(earned.map(e => e.achievementId));
    return res.json({
      earned: earned.map(e => ({ ...e.achievement, earnedAt: e.earnedAt })),
      locked: allAchievements.filter(a => !earnedIds.has(a.id)),
    });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export { adminRouter as default };
export { userRouter };
