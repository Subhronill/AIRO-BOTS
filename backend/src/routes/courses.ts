import { Router, Response } from 'express';
import { authenticate, optionalAuthenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get all courses
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' },
      include: { _count: { select: { chapters: true } } },
    });
    return res.json(courses);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by slug — includes per-chapter isCompleted + isUnlocked for authenticated users
router.get('/:slug', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        chapters: {
          where: { isPublished: true },
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true, slug: true, title: true, description: true,
            orderIndex: true, xpReward: true, difficulty: true, language: true,
            _count: { select: { quizzes: true } },
          },
        },
      },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Build completion set for authenticated user
    let completedIds = new Set<string>();
    if (req.user) {
      const rows = await prisma.progress.findMany({
        where: { userId: req.user.id, courseId: course.id, completed: true },
        select: { chapterId: true },
      });
      completedIds = new Set(rows.map(r => r.chapterId));
    }

    // Annotate chapters with isCompleted + isUnlocked
    const chapters = course.chapters.map((ch, idx) => ({
      ...ch,
      isCompleted: completedIds.has(ch.id),
      // First chapter always unlocked; others unlock when the previous is completed
      isUnlocked: idx === 0 || completedIds.has(course.chapters[idx - 1].id),
    }));

    return res.json({ ...course, chapters });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Admin: Create course
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { slug, title, description, icon, level, orderIndex } = req.body;
    const course = await prisma.course.create({ data: { slug, title, description, icon, level, orderIndex } });
    return res.status(201).json(course);
  } catch {
    return res.status(500).json({ error: 'Failed to create course' });
  }
});

// Admin: Update course
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.update({ where: { id: req.params.id }, data: req.body });
    return res.json(course);
  } catch {
    return res.status(500).json({ error: 'Failed to update course' });
  }
});

export default router;
