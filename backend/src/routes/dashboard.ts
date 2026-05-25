import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [user, completedChapters, quizAttempts, activities, achievements, saves] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.progress.count({ where: { userId, completed: true } }),
      prisma.quizAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30 }),
      prisma.userAchievement.count({ where: { userId } }),
      prisma.playgroundSave.count({ where: { userId } }),
    ]);

    // Build activity heatmap (last 365 days)
    const heatmap: Record<string, number> = {};
    for (const activity of activities) {
      const date = activity.createdAt.toISOString().split('T')[0];
      heatmap[date] = (heatmap[date] || 0) + 1;
    }

    // Course progress
    const courseProgress = await prisma.progress.groupBy({
      by: ['courseId'],
      where: { userId },
      _count: { id: true },
    });

    const courses = await prisma.course.findMany({
      select: { id: true, title: true, _count: { select: { chapters: true } } },
    });

    const progressByCourse = courses.map(course => {
      const progress = courseProgress.find(p => p.courseId === course.id);
      return {
        courseId: course.id,
        title: course.title,
        completed: progress?._count.id || 0,
        total: course._count.chapters,
        percentage: Math.round(((progress?._count.id || 0) / course._count.chapters) * 100),
      };
    });

    // XP history (last 7 days)
    const xpHistory = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const dateStr = date.toISOString().split('T')[0];
      const dayActivities = activities.filter(a => a.createdAt.toISOString().split('T')[0] === dateStr);
      const xp = dayActivities.reduce((sum, a) => sum + a.xpGained, 0);
      xpHistory.push({ date: dateStr, xp });
    }

    // Quiz stats
    const passedQuizzes = quizAttempts.filter(a => a.passed).length;
    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : 0;

    return res.json({
      user: { xp: user?.xp, level: user?.level, streak: user?.streak },
      stats: { completedChapters, achievements, saves, passedQuizzes, avgScore },
      progressByCourse,
      xpHistory,
      heatmap,
      recentActivity: activities.slice(0, 10),
      recentQuizzes: quizAttempts.slice(0, 5),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
