import { Router, Response } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get chapter by courseSlug + chapterSlug — includes quiz with all questions
router.get('/:courseSlug/:chapterSlug', async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.findUnique({ where: { slug: req.params.courseSlug } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const chapter = await prisma.chapter.findUnique({
      where: { courseId_slug: { courseId: course.id, slug: req.params.chapterSlug } },
      include: {
        quizzes: {
          include: {
            questions: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    // Prisma middleware in lib/prisma.ts already deserialises JSON fields (options, etc.)
    // so q.options is already a parsed array — no manual JSON.parse needed.
    return res.json(chapter);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// Admin: Create chapter
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const chapter = await prisma.chapter.create({ data: req.body });
    return res.status(201).json(chapter);
  } catch {
    return res.status(500).json({ error: 'Failed to create chapter' });
  }
});

// Admin: Update chapter
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const chapter = await prisma.chapter.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.json(chapter);
  } catch {
    return res.status(500).json({ error: 'Failed to update chapter' });
  }
});

export default router;
