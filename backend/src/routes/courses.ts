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
            orderIndex: true, xpReward: true, difficulty: true, language: true, tier: true,
            _count: { select: { quizzes: true } },
          },
        },
        levelTests: {
          select: { id: true, tier: true, title: true, passingScore: true, xpReward: true, timeLimit: true },
        },
      },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Build completion set for authenticated user
    let completedIds = new Set<string>();
    let passedLevelTestTiers = new Set<string>();

    if (req.user) {
      const [rows, ltAttempts] = await Promise.all([
        prisma.progress.findMany({
          where: { userId: req.user.id, courseId: course.id, completed: true },
          select: { chapterId: true },
        }),
        prisma.levelTestAttempt.findMany({
          where: {
            userId: req.user.id,
            passed: true,
            levelTest: { courseId: course.id },
          },
          include: { levelTest: { select: { tier: true } } },
        }),
      ]);
      completedIds = new Set(rows.map(r => r.chapterId));
      passedLevelTestTiers = new Set(ltAttempts.map(a => a.levelTest.tier));
    }

    // Tier ordering for unlock logic
    const TIER_ORDER = ['NOOB', 'AMATEUR', 'PRO', 'MASTER', 'GOD'];

    // Pre-build per-tier chapter lists (ordered) for tier-aware unlock
    const chaptersByTier = new Map<string, typeof course.chapters>();
    for (const ch of course.chapters) {
      const key = ch.tier ?? '__legacy__';
      if (!chaptersByTier.has(key)) chaptersByTier.set(key, []);
      chaptersByTier.get(key)!.push(ch);
    }

    // Annotate chapters with isCompleted + isUnlocked
    const chapters = course.chapters.map((ch) => {
      const isCompleted = completedIds.has(ch.id);

      // ── Legacy (un-tiered) chapters ──────────────────────────────────────
      if (!ch.tier) {
        const legacyList = chaptersByTier.get('__legacy__')!;
        const pos = legacyList.findIndex(c => c.id === ch.id);
        const isUnlocked = pos === 0 || completedIds.has(legacyList[pos - 1].id);
        return { ...ch, isCompleted, isUnlocked };
      }

      // ── Tiered chapters ───────────────────────────────────────────────────
      const tierList   = chaptersByTier.get(ch.tier)!;
      const posInTier  = tierList.findIndex(c => c.id === ch.id);
      const myTierIdx  = TIER_ORDER.indexOf(ch.tier);

      if (posInTier === 0) {
        // First chapter of this tier
        if (myTierIdx === 0) {
          // NOOB first chapter — always unlocked
          return { ...ch, isCompleted, isUnlocked: true };
        }
        // Higher tier — requires previous tier's level test
        const prevTier   = TIER_ORDER[myTierIdx - 1];
        const isUnlocked = passedLevelTestTiers.has(prevTier);
        return { ...ch, isCompleted, isUnlocked };
      }

      // Subsequent chapter in same tier — requires previous tier chapter completed
      const prevTierCh = tierList[posInTier - 1];
      return { ...ch, isCompleted, isUnlocked: completedIds.has(prevTierCh.id) };
    });

    // Build level test status per tier
    const levelTestStatus = course.levelTests.map((lt) => {
      const tierChapters = course.chapters.filter(c => c.tier === lt.tier);
      const allDone = tierChapters.length > 0 && tierChapters.every(c => completedIds.has(c.id));
      const tierIdx = TIER_ORDER.indexOf(lt.tier);
      const prevTier = tierIdx > 0 ? TIER_ORDER[tierIdx - 1] : null;
      // Tier is accessible if all chapters done AND previous tier test passed (or it's NOOB)
      const prevTierOk = !prevTier || passedLevelTestTiers.has(prevTier);

      return {
        ...lt,
        available: allDone && prevTierOk,
        passed: passedLevelTestTiers.has(lt.tier),
      };
    });

    return res.json({ ...course, chapters, levelTestStatus });
  } catch (err) {
    console.error('GET course error:', err);
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
