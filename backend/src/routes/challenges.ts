/**
 * challenges.ts — Optional per-chapter coding challenge routes
 *
 * GET  /api/challenges/chapter/:chapterId
 *      Returns the coding challenge for a chapter (if any), plus whether
 *      the current user has already passed it.  Auth is optional.
 *
 * POST /api/challenges/:challengeId/attempt   (auth required)
 *      Body: { code: string, testResults: { id: string; passed: boolean }[] }
 *      Records the attempt and awards XP on first-time pass.
 */

import { Router, Response }                  from 'express';
import prisma                                 from '../lib/prisma';
import { authenticate, optionalAuthenticate, AuthRequest } from '../middleware/auth';

const router = Router();

/* ─── helpers ─────────────────────────────────────────────────────────────── */

interface ParsedTestCase {
  id: string;
  description: string;
  expectedOutput: string;
}

function parseJson<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   GET /api/challenges/chapter/:chapterId
   Auth optional — shows "alreadyPassed" when logged in.
═══════════════════════════════════════════════════════════════════════════ */
router.get('/chapter/:chapterId', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { chapterId } = req.params;

    const challenge = await prisma.codingChallenge.findUnique({ where: { chapterId } });
    if (!challenge) {
      return res.status(404).json({ error: 'No coding challenge for this chapter' });
    }

    let alreadyPassed = false;
    if (req.user?.id) {
      const prevPass = await prisma.codingAttempt.findFirst({
        where: { challengeId: challenge.id, userId: req.user.id, passed: true },
      });
      alreadyPassed = !!prevPass;
    }

    return res.json({
      ...challenge,
      hints:        parseJson<string[]>(challenge.hints, []),
      testCases:    parseJson<ParsedTestCase[]>(challenge.testCases, []),
      alreadyPassed,
    });
  } catch (err) {
    console.error('[challenges] GET /chapter/:chapterId', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   POST /api/challenges/:challengeId/attempt   (auth required)
   Body: { code: string, testResults: { id: string; passed: boolean }[] }
═══════════════════════════════════════════════════════════════════════════ */
router.post('/:challengeId/attempt', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorised' });

    const { code, testResults } = req.body as {
      code: string;
      testResults: { id: string; passed: boolean }[];
    };

    if (!code || !Array.isArray(testResults)) {
      return res.status(400).json({ error: 'code and testResults are required' });
    }

    const challenge = await prisma.codingChallenge.findUnique({ where: { id: challengeId } });
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    const passed = testResults.length > 0 && testResults.every(t => t.passed);

    // XP only awarded on first-time pass
    let xpAwarded = 0;
    const prevPass = await prisma.codingAttempt.findFirst({
      where: { challengeId, userId, passed: true },
    });

    if (passed && !prevPass) {
      xpAwarded = challenge.xpReward;
      await prisma.user.update({
        where: { id: userId },
        data:  { xp: { increment: xpAwarded } },
      });
      await prisma.activity.create({
        data: {
          userId,
          type:     'CHALLENGE_COMPLETED',
          metadata: JSON.stringify({ challengeId, title: challenge.title }),
          xpGained: xpAwarded,
        },
      });
    }

    const attempt = await prisma.codingAttempt.create({
      data: { userId, challengeId, code, passed, xpAwarded },
    });

    return res.json({
      id:               attempt.id,
      passed,
      xpAwarded,
      alreadyCompleted: !!prevPass,
      message: passed
        ? prevPass
          ? 'Challenge solved again! (XP already awarded)'
          : `Challenge complete! +${xpAwarded} XP 🏆`
        : 'Some tests failed — keep trying!',
    });
  } catch (err) {
    console.error('[challenges] POST /:challengeId/attempt', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
