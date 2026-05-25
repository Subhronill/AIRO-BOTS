import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Mark chapter as complete
router.post('/complete', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, chapterId } = req.body;
    const userId = req.user!.id;

    const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    const existing = await prisma.progress.findUnique({
      where: { userId_chapterId: { userId, chapterId } },
    });
    if (existing?.completed) {
      return res.json({ message: 'Already completed', xpEarned: 0 });
    }

    await prisma.progress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId, courseId, chapterId, completed: true, completedAt: new Date() },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: chapter.xpReward } },
    });

    const newLevel = Math.floor((user.xp + chapter.xpReward) / 1000) + 1;
    if (newLevel > user.level) {
      await prisma.user.update({ where: { id: userId }, data: { level: newLevel } });
    }

    await prisma.activity.create({
      data: { userId, type: 'chapter_complete', metadata: JSON.stringify({ chapterId, title: chapter.title }), xpGained: chapter.xpReward },
    });

    return res.json({ message: 'Chapter completed!', xpEarned: chapter.xpReward });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to mark progress' });
  }
});

// Get user progress for a course
router.get('/course/:courseId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.user!.id, courseId: req.params.courseId },
    });
    return res.json(progress);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get all progress
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.user!.id, completed: true },
      include: { chapter: { select: { title: true, xpReward: true } }, course: { select: { title: true } } },
    });
    return res.json(progress);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
