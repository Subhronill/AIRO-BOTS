import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Save playground code
router.post('/save', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, language, code, output, isPublic } = req.body;
    const save = await prisma.playgroundSave.create({
      data: { userId: req.user!.id, title, language, code, output, isPublic },
    });
    return res.status(201).json(save);
  } catch {
    return res.status(500).json({ error: 'Failed to save code' });
  }
});

// Get user's saved code
router.get('/saves', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const saves = await prisma.playgroundSave.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
    });
    return res.json(saves);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch saves' });
  }
});

// Get single save
router.get('/saves/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const save = await prisma.playgroundSave.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!save) return res.status(404).json({ error: 'Save not found' });
    return res.json(save);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch save' });
  }
});

// Update save
router.put('/saves/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const save = await prisma.playgroundSave.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: req.body,
    });
    return res.json(save);
  } catch {
    return res.status(500).json({ error: 'Failed to update save' });
  }
});

// Delete save
router.delete('/saves/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.playgroundSave.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    });
    return res.json({ message: 'Deleted' });
  } catch {
    return res.status(500).json({ error: 'Failed to delete save' });
  }
});

// Execute code (simulated - returns mock output for safety)
router.post('/execute', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { code, language } = req.body;
    
    // Simulated execution results based on language
    const outputs: Record<string, string> = {
      python: simulatePythonOutput(code),
      javascript: simulateJSOutput(code),
      cpp: '✓ Compiled successfully\nOutput: Hello from C++!',
    };

    return res.json({
      output: outputs[language] || `Executed ${language} code successfully`,
      executionTime: Math.random() * 500 + 100,
      language,
    });
  } catch {
    return res.status(500).json({ error: 'Execution failed' });
  }
});

function simulatePythonOutput(code: string): string {
  const lines = [];
  
  if (code.includes('print')) {
    const prints = code.match(/print\(([^)]+)\)/g) || [];
    for (const p of prints) {
      const content = p.replace(/print\(["']?/, '').replace(/["']?\)$/, '');
      lines.push(content);
    }
  }
  
  if (code.includes('import numpy') || code.includes('import np')) {
    lines.push('NumPy loaded successfully');
    if (code.includes('array')) lines.push('array([1, 2, 3, 4, 5])');
  }
  
  if (code.includes('import pandas') || code.includes('import pd')) {
    lines.push('Pandas DataFrame created');
    lines.push('   col1  col2\n0     1     a\n1     2     b\n2     3     c');
  }

  if (code.includes('for ') || code.includes('while ')) {
    lines.push('Loop executed successfully');
  }

  if (lines.length === 0) {
    lines.push('✓ Code executed successfully (no output)');
  }

  return lines.join('\n');
}

function simulateJSOutput(code: string): string {
  const lines = [];
  const consoleLogs = code.match(/console\.log\(([^)]+)\)/g) || [];
  for (const log of consoleLogs) {
    const content = log.replace(/console\.log\(["']?/, '').replace(/["']?\)$/, '');
    lines.push(content);
  }
  if (lines.length === 0) lines.push('✓ JavaScript executed successfully');
  return lines.join('\n');
}

export default router;
