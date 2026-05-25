import { Router, Response } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get quiz with questions
// Prisma middleware in lib/prisma.ts already deserialises options → no manual JSON.parse needed
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { orderIndex: 'asc' } }, _count: { select: { attempts: true } } },
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    return res.json(quiz);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Submit quiz attempt
// Scoring: +3 per correct, −1 per wrong. Need ≥10/15 correct to pass (min 25 marks).
router.post('/:id/attempt', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { answers, timeSpent } = req.body;
    const userId = req.user!.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // +3/-1 marking system
    let correct = 0;
    for (const q of quiz.questions) {
      if (answers[q.id] === q.correctAnswer) correct++;
    }
    const wrong    = quiz.questions.length - correct;
    const marks    = correct * 3 - wrong;           // range: −15 to 45 for 15 Qs
    const maxMarks = quiz.questions.length * 3;     // 45 for 15 questions
    const passed   = correct >= 10;                 // need 10/15 to pass

    // Record the attempt
    await prisma.quizAttempt.create({
      data: {
        userId, quizId: quiz.id,
        score: marks,                               // store actual marks
        answers: JSON.stringify(answers),
        passed, timeSpent: timeSpent ?? 0, xpEarned: 0,
      },
    });

    // On pass: auto-complete the chapter and award chapter XP (once only)
    let xpEarned       = 0;
    let alreadyCompleted = false;

    if (passed) {
      const chapter = await prisma.chapter.findUnique({ where: { id: quiz.chapterId } });
      if (chapter) {
        const existing = await prisma.progress.findUnique({
          where: { userId_chapterId: { userId, chapterId: chapter.id } },
        });

        alreadyCompleted = existing?.completed ?? false;

        if (!alreadyCompleted) {
          xpEarned = chapter.xpReward;

          await prisma.progress.upsert({
            where:  { userId_chapterId: { userId, chapterId: chapter.id } },
            update: { completed: true, completedAt: new Date() },
            create: { userId, courseId: chapter.courseId, chapterId: chapter.id, completed: true, completedAt: new Date() },
          });

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data:  { xp: { increment: xpEarned } },
          });

          // Level-up check
          const newLevel = Math.floor(updatedUser.xp / 1000) + 1;
          if (newLevel > updatedUser.level) {
            await prisma.user.update({ where: { id: userId }, data: { level: newLevel } });
          }

          await prisma.activity.create({
            data: {
              userId,
              type: 'chapter_complete',
              metadata: JSON.stringify({ chapterId: chapter.id, title: chapter.title, quiz: true }),
              xpGained: xpEarned,
            },
          });
        }
      }
    }

    return res.json({
      marks, maxMarks,
      correct, wrong,
      total: quiz.questions.length,
      passed, xpEarned, alreadyCompleted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get user's quiz attempts
router.get('/:id/attempts', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId: req.params.id, userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return res.json(attempts);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// Admin: Create quiz with questions
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { chapterId, title, description, timeLimit, passingScore, xpReward, questions } = req.body;
    const quiz = await prisma.quiz.create({
      data: {
        chapterId, title, description, timeLimit, passingScore, xpReward,
        questions: {
          create: questions.map((q: { text: string; options: object; correctAnswer: string; explanation: string }, i: number) => ({
            text: q.text, options: JSON.stringify(q.options), correctAnswer: q.correctAnswer,
            explanation: q.explanation, orderIndex: i,
          })),
        },
      },
      include: { questions: true },
    });
    return res.status(201).json(quiz);
  } catch {
    return res.status(500).json({ error: 'Failed to create quiz' });
  }
});

export default router;
