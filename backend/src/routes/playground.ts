import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { exec }  from 'child_process';
import * as fs   from 'fs';
import * as path from 'path';
import * as os   from 'os';
import * as vm   from 'vm';

const router = Router();

/* ─────────────────────────────────────────────────────────────────────────────
   Execution helpers
───────────────────────────────────────────────────────────────────────────── */

/**
 * Run Python code by writing it to a temp file and spawning the local
 * Python interpreter.  Works on Windows (python / py) and Unix (python3).
 */
async function executePython(code: string): Promise<string> {
  const tmpFile = path.join(
    os.tmpdir(),
    `airo_${Date.now()}_${Math.random().toString(36).slice(2)}.py`,
  );

  try {
    fs.writeFileSync(tmpFile, code, 'utf8');

    return await new Promise<string>((resolve) => {
      // Windows ships "python" and "py"; Unix ships "python3"
      const cmd =
        process.platform === 'win32'
          ? `python "${tmpFile}"`
          : `python3 "${tmpFile}"`;

      exec(
        cmd,
        { timeout: 10_000, maxBuffer: 2 * 1024 * 1024 },
        (error, stdout, stderr) => {
          const out = (stdout ?? '').trimEnd();
          const err = (stderr ?? '').trimEnd();

          if (error && error.code === null) {
            // killed due to timeout
            resolve('Error: execution timed out (>10 s)');
          } else if (out && err) {
            resolve(`${out}\n\n[stderr]\n${err}`);
          } else if (err) {
            resolve(err);           // Python tracebacks are readable as-is
          } else {
            resolve(out || '✓ Executed successfully (no output)');
          }
        },
      );
    });
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* best-effort */ }
  }
}

/**
 * Run JavaScript code inside a Node vm sandbox, capturing console output.
 * Blocks dangerous globals (process, require, fetch, timers).
 */
function executeJavaScript(code: string): string {
  const logs: string[] = [];

  const sandbox = vm.createContext({
    console: {
      log:   (...a: unknown[]) => logs.push(a.map(fmt).join(' ')),
      error: (...a: unknown[]) => logs.push('[error] ' + a.map(fmt).join(' ')),
      warn:  (...a: unknown[]) => logs.push('[warn]  ' + a.map(fmt).join(' ')),
      info:  (...a: unknown[]) => logs.push('[info]  ' + a.map(fmt).join(' ')),
    },
    Math, JSON, Array, Object, String, Number, Boolean, Date, RegExp,
    parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent,
    // blocked intentionally
    process: undefined, require: undefined, fetch: undefined,
    setTimeout: undefined, setInterval: undefined,
    __dirname: undefined, __filename: undefined,
  });

  try {
    vm.runInContext(code, sandbox, { timeout: 5000 });
    return logs.length > 0 ? logs.join('\n') : '✓ Executed successfully (no output)';
  } catch (err: unknown) {
    return `Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

function fmt(v: unknown): string {
  if (v === null)            return 'null';
  if (v === undefined)       return 'undefined';
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Routes
───────────────────────────────────────────────────────────────────────────── */

// GET / — list user's saves
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const saves = await prisma.playgroundSave.findMany({
      where:   { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
    });
    return res.json(saves.map((s) => ({ ...s, name: s.title })));
  } catch {
    return res.status(500).json({ error: 'Failed to fetch saves' });
  }
});

// POST / — create save (frontend sends { name, code, language })
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, language } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'name is required' });
    const save = await prisma.playgroundSave.create({
      data: { userId: req.user!.id, title: name.trim(), language, code },
    });
    return res.status(201).json({ ...save, name: save.title });
  } catch {
    return res.status(500).json({ error: 'Failed to save code' });
  }
});

// POST /execute — real execution, no auth required
router.post('/execute', async (req: Request, res: Response) => {
  const { code, language } = req.body as { code: string; language: string };

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'code is required' });
  }

  const start = Date.now();

  try {
    let output: string;

    if (language === 'javascript') {
      output = executeJavaScript(code);
    } else {
      // python and robotics both use local CPython
      output = await executePython(code);
    }

    return res.json({ output, executionTime: Date.now() - start, language });
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

/* ─── Legacy/compatibility routes ─────────────────────────────────────────── */

router.post('/save', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, name, language, code, output, isPublic } = req.body;
    const save = await prisma.playgroundSave.create({
      data: { userId: req.user!.id, title: title || name || 'Untitled', language, code, output, isPublic },
    });
    return res.status(201).json({ ...save, name: save.title });
  } catch {
    return res.status(500).json({ error: 'Failed to save code' });
  }
});

router.get('/saves', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const saves = await prisma.playgroundSave.findMany({
      where:   { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
    });
    return res.json(saves.map((s) => ({ ...s, name: s.title })));
  } catch {
    return res.status(500).json({ error: 'Failed to fetch saves' });
  }
});

router.get('/saves/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const save = await prisma.playgroundSave.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!save) return res.status(404).json({ error: 'Save not found' });
    return res.json({ ...save, name: save.title });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch save' });
  }
});

router.put('/saves/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.playgroundSave.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data:  req.body,
    });
    return res.json({ message: 'Updated' });
  } catch {
    return res.status(500).json({ error: 'Failed to update save' });
  }
});

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

export default router;
