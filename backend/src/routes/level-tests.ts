import { Router, Response } from 'express';
import { authenticate, optionalAuthenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

function parseJson<T>(raw: unknown, fallback: T): T {
  // PostgreSQL Json fields arrive already parsed; SQLite stores them as strings.
  if (typeof raw !== 'string') return raw as T;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

// ── GET /api/level-tests/course/:courseId/tier/:tier ─────────────────────────
// Returns the level test + all questions + whether the current user has passed.
router.get(
  '/course/:courseId/tier/:tier',
  optionalAuthenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { courseId, tier } = req.params;

      const levelTest = await prisma.levelTest.findUnique({
        where: { courseId_tier: { courseId, tier } },
        include: { questions: { orderBy: { orderIndex: 'asc' } } },
      });

      if (!levelTest) {
        return res.status(404).json({ error: 'Level test not found for this tier' });
      }

      let passed = false;
      let bestScore: number | null = null;
      let attemptsCount = 0;

      if (req.user?.id) {
        const attempts = await prisma.levelTestAttempt.findMany({
          where: { levelTestId: levelTest.id, userId: req.user.id },
          orderBy: { score: 'desc' },
        });
        attemptsCount = attempts.length;
        if (attempts.length > 0) {
          bestScore = attempts[0].score;
          passed = attempts.some((a) => a.passed);
        }
      }

      return res.json({
        id: levelTest.id,
        courseId: levelTest.courseId,
        tier: levelTest.tier,
        title: levelTest.title,
        description: levelTest.description,
        timeLimit: levelTest.timeLimit,
        passingScore: levelTest.passingScore,
        xpReward: levelTest.xpReward,
        questions: levelTest.questions.map((q) => ({
          id: q.id,
          text: q.text,
          options: parseJson<string[]>(q.options, []),
          topic: q.topic,
          orderIndex: q.orderIndex,
          // correctAnswer & explanation sent only AFTER submission (not here)
        })),
        passed,
        bestScore,
        attemptsCount,
      });
    } catch (err) {
      console.error('GET level-test error:', err);
      return res.status(500).json({ error: 'Failed to fetch level test' });
    }
  }
);

// ── GET /api/level-tests/:id/status ──────────────────────────────────────────
// Lightweight check: did the current user pass this level test?
router.get(
  '/:id/status',
  optionalAuthenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      if (!req.user?.id) return res.json({ passed: false, attemptsCount: 0, bestScore: null });

      const attempts = await prisma.levelTestAttempt.findMany({
        where: { levelTestId: id, userId: req.user.id },
        orderBy: { score: 'desc' },
      });

      return res.json({
        passed: attempts.some((a) => a.passed),
        bestScore: attempts.length > 0 ? attempts[0].score : null,
        attemptsCount: attempts.length,
      });
    } catch {
      return res.status(500).json({ error: 'Failed to fetch status' });
    }
  }
);

// ── POST /api/level-tests/:id/attempt ────────────────────────────────────────
// Submit answers for a level test. Evaluates score, awards XP once on first pass.
// Body: { answers: Record<questionId, selectedAnswer>, timeSpent: number }
router.post(
  '/:id/attempt',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { answers, timeSpent = 0 } = req.body as {
        answers: Record<string, string>;
        timeSpent: number;
      };

      const userId = req.user!.id;

      const levelTest = await prisma.levelTest.findUnique({
        where: { id },
        include: { questions: true },
      });

      if (!levelTest) return res.status(404).json({ error: 'Level test not found' });

      // ── Scoring: +3 correct, -1 wrong, 0 for unanswered ──────────────────
      let score = 0;
      const breakdown: Array<{
        questionId: string;
        selected: string | null;
        correct: string;
        isCorrect: boolean;
        explanation: string | null;
        topic: string | null;
      }> = [];

      for (const q of levelTest.questions) {
        const selected = answers[q.id] ?? null;
        const isCorrect = selected !== null && selected === q.correctAnswer;
        const isWrong = selected !== null && selected !== q.correctAnswer;

        if (isCorrect) score += 3;
        else if (isWrong) score -= 1;

        breakdown.push({
          questionId: q.id,
          selected,
          correct: q.correctAnswer,
          isCorrect,
          explanation: q.explanation ?? null,
          topic: q.topic ?? null,
        });
      }

      const passed = score >= levelTest.passingScore;

      // Check if already passed before (XP given only once)
      const previousPass = await prisma.levelTestAttempt.findFirst({
        where: { levelTestId: id, userId, passed: true },
      });
      const xpEarned = passed && !previousPass ? levelTest.xpReward : 0;

      // Save attempt
      const attempt = await prisma.levelTestAttempt.create({
        data: {
          userId,
          levelTestId: id,
          score,
          answers: JSON.stringify(answers),
          passed,
          timeSpent,
          xpEarned,
        },
      });

      // Award XP
      if (xpEarned > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: xpEarned } },
        });
        await prisma.activity.create({
          data: {
            userId,
            type: 'LEVEL_TEST_PASSED',
            metadata: JSON.stringify({ levelTestId: id, tier: levelTest.tier, score }),
            xpGained: xpEarned,
          },
        });
      }

      return res.json({
        attemptId: attempt.id,
        score,
        maxScore: levelTest.questions.length * 3,
        passingScore: levelTest.passingScore,
        passed,
        xpEarned,
        breakdown,
      });
    } catch (err) {
      console.error('POST level-test attempt error:', err);
      return res.status(500).json({ error: 'Failed to submit attempt' });
    }
  }
);

export default router;
