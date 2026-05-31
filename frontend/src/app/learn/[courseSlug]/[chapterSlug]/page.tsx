'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../../components/layout/Navbar';
import api, { Chapter, CodingChallenge, ChallengeTestCase } from '../../../../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuthStore } from '../../../../store/authStore';
import toast from 'react-hot-toast';
import {
  CheckCircle, ChevronRight, ChevronLeft, Play,
  BookOpen, Code2, Target, Star, Clock, Zap, Lock,
  Lightbulb, FlaskConical, SkipForward, Trophy,
} from 'lucide-react';
import DiagramBlock from '../../../../components/DiagramBlock';

/* ─────────────────────────── Local types ────────────────────────────────────── */
type QuizOption   = { id: string; text: string };
type QuizQuestion = {
  id: string; text: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation?: string;
};
type QuizData = {
  id: string; title: string;
  timeLimit: number; passingScore: number;
  questions?: QuizQuestion[];
};
interface QuizResultData {
  marks: number; maxMarks: number;
  correct: number; wrong: number; total: number;
  passed: boolean; xpEarned: number;
  alreadyCompleted?: boolean;
}
interface AdjacentChapters {
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

const OPT_LABELS         = ['A', 'B', 'C', 'D', 'E'];
const MIN_PASSING_MARKS  = 25; // 10×3 − 5×1 = 25 (worst-case pass)

/** Safely coerce options to QuizOption[] regardless of what the backend sends */
function parseOptions(raw: unknown): QuizOption[] {
  if (Array.isArray(raw)) return raw as QuizOption[];
  if (typeof raw === 'string' && raw.trim()) {
    try { return JSON.parse(raw) as QuizOption[]; } catch { /* fall through */ }
  }
  return [];
}

/** Normalise all questions in a QuizData so options are always QuizOption[] */
function normaliseQuiz(data: QuizData): QuizData {
  return {
    ...data,
    questions: (data.questions ?? []).map(q => ({
      ...q,
      options: parseOptions((q as QuizQuestion & { options: unknown }).options),
    })),
  };
}

/* ═════════════════════════════ Main page ════════════════════════════════════════ */
export default function ChapterPage() {
  const { courseSlug, chapterSlug } = useParams<{ courseSlug: string; chapterSlug: string }>();
  const [chapter, setChapter]             = useState<Chapter | null>(null);
  const [loading, setLoading]             = useState(true);
  const [locked, setLocked]               = useState(false);
  const [completed, setCompleted]         = useState(false);
  const [activeTab, setActiveTab]         = useState<'lesson' | 'code' | 'quiz' | 'challenge'>('lesson');
  const [code, setCode]                   = useState('');
  const [output, setOutput]               = useState('');
  const [running, setRunning]             = useState(false);
  /* ── Quiz states ── */
  const [quizData, setQuizData]           = useState<QuizData | null>(null);
  const [quizLoading, setQuizLoading]     = useState(false);
  const [quizStarted, setQuizStarted]     = useState(false);
  const [quizAnswers, setQuizAnswers]     = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult]       = useState<QuizResultData | null>(null);
  const [adjacent, setAdjacent]           = useState<AdjacentChapters | null>(null);
  /* ── Challenge states ── */
  const [challenge, setChallenge]         = useState<CodingChallenge | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeCode, setChallengeCode] = useState('');
  const [challengeOutput, setChallengeOutput] = useState('');
  const [challengeRunning, setChallengeRunning] = useState(false);
  const [challengeTestResults, setChallengeTestResults] = useState<{ id: string; passed: boolean; actual: string }[]>([]);
  const [challengeSubmitting, setChallengeSubmitting] = useState(false);
  const [challengeResult, setChallengeResult] = useState<{ passed: boolean; xpAwarded: number; message: string } | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const { isAuthenticated } = useAuthStore();

  /* ── Fetch chapter + course data ── */
  useEffect(() => {
    setQuizData(null); // reset on slug change
    const fetchChapter = async () => {
      try {
        const { data: chData } = await api.get(`/chapters/${courseSlug}/${chapterSlug}`);
        setChapter(chData);
        setCode(chData.codeExample || '');
        // Seed quizData immediately from chapter so options are always present
        if (chData.quizzes?.[0]) {
          setQuizData(normaliseQuiz(chData.quizzes[0] as unknown as QuizData));
        }

        try {
          const { data: courseData } = await api.get(`/courses/${courseSlug}`);
          const chapters: (Chapter & { isUnlocked?: boolean; isCompleted?: boolean })[] =
            courseData.chapters ?? [];
          const idx  = chapters.findIndex(c => c.slug === chapterSlug);
          const meta = chapters[idx];

          const isUnlocked  = meta?.isUnlocked  ?? (idx === 0 || idx === -1);
          const isCompleted = meta?.isCompleted  ?? false;
          setCompleted(isCompleted);

          if (!isUnlocked) { setLocked(true); return; }

          setAdjacent({
            prev: idx > 0                   ? { slug: chapters[idx - 1].slug, title: chapters[idx - 1].title } : undefined,
            next: idx < chapters.length - 1 ? { slug: chapters[idx + 1].slug, title: chapters[idx + 1].title } : undefined,
          });
        } catch { /* course fetch optional */ }
      } catch { /* chapter not found */ } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [courseSlug, chapterSlug]);

  /* ── Enhance quiz data when Quiz tab opens (quizData already seeded from chapter) ── */
  useEffect(() => {
    if (activeTab !== 'quiz') return;
    if (!chapter?.quizzes?.[0]?.id) return;

    const quizId = chapter.quizzes[0].id;
    // Only fetch if not already loaded with questions
    if (quizData?.questions && quizData.questions.length > 0) return;

    setQuizLoading(true);
    api.get(`/quizzes/${quizId}`)
      .then(({ data }) => setQuizData(normaliseQuiz(data as QuizData)))
      .catch(() => { /* quizData already set from chapter; ignore */ })
      .finally(() => setQuizLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, chapter]);

  /* ── Fetch coding challenge when Challenge tab first opens ── */
  useEffect(() => {
    if (activeTab !== 'challenge') return;
    if (!chapter?.id) return;
    if (challenge !== null) return; // already loaded

    setChallengeLoading(true);
    api.get(`/challenges/chapter/${chapter.id}`)
      .then(({ data }) => {
        setChallenge(data as CodingChallenge);
        setChallengeCode(data.starterCode || '');
        setChallengeTestResults(
          (data.testCases as ChallengeTestCase[]).map((tc) => ({ id: tc.id, passed: false, actual: '' }))
        );
      })
      .catch(() => { /* no challenge for this chapter — tab stays empty */ })
      .finally(() => setChallengeLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, chapter]);

  /* ── Handlers ── */
  const handleRunCode = async () => {
    setRunning(true); setOutput('');
    try {
      const { data } = await api.post('/playground/execute', { code, language: chapter?.language || 'python' });
      setOutput(data.output);
    } catch {
      setOutput('Error: Failed to execute code');
    } finally {
      setRunning(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!quizData) return;
    try {
      const { data } = await api.post(`/quizzes/${quizData.id}/attempt`, {
        answers: quizAnswers, timeSpent: 120,
      });
      setQuizResult(data);
      setQuizSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (data.passed) {
        setCompleted(true);
        if (data.xpEarned > 0) toast.success(`+${data.xpEarned} XP! Chapter complete! 🏆`);
        else toast.success('Quiz passed! ✓');
      } else {
        const shown = Math.max(0, data.marks as number);
        toast.error(`${data.correct}/15 correct · ${shown} marks. Need 25+ to pass!`);
      }
    } catch {
      toast.error('Failed to submit quiz');
    }
  };

  const handleRetry = () => {
    setQuizSubmitted(false);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizStarted(false); // back to intro screen
  };

  /* ── Challenge: run code + evaluate test cases ── */
  const handleChallengeRunAndTest = async () => {
    if (!challenge) return;
    setChallengeRunning(true);
    setChallengeOutput('');
    try {
      const { data } = await api.post('/playground/execute', {
        code: challengeCode,
        language: challenge.language || 'python',
      });
      const output: string = data.output || '';
      setChallengeOutput(output);

      // Evaluate: check expected string against BOTH output and code
      // This lets test cases verify structure ("def ", "for ", "import numpy")
      // as well as computed values that appear in print() output.
      const results = challenge.testCases.map((tc) => {
        const expected   = tc.expectedOutput.trim().toLowerCase();
        const actualOut  = output.trim().toLowerCase();
        const actualCode = challengeCode.trim().toLowerCase();
        const passed     = actualOut.includes(expected) || actualCode.includes(expected);
        return { id: tc.id, passed, actual: output.trim() };
      });
      setChallengeTestResults(results);
    } catch {
      setChallengeOutput('Error: Failed to execute code');
    } finally {
      setChallengeRunning(false);
    }
  };

  /* ── Challenge: submit attempt (record in backend) ── */
  const handleChallengeSubmit = async () => {
    if (!challenge || challengeTestResults.length === 0) return;
    setChallengeSubmitting(true);
    try {
      const { data } = await api.post(`/challenges/${challenge.id}/attempt`, {
        code: challengeCode,
        testResults: challengeTestResults.map(({ id, passed }) => ({ id, passed })),
      });
      setChallengeResult({ passed: data.passed, xpAwarded: data.xpAwarded, message: data.message });
      if (data.passed && data.xpAwarded > 0) toast.success(`+${data.xpAwarded} XP! Challenge complete! 🏆`);
      else if (data.passed) toast.success('Challenge solved! ✓');
    } catch {
      toast.error('Failed to submit challenge');
    } finally {
      setChallengeSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading chapter…</p>
      </div>
    </div>
  );

  /* ── Locked chapter ── */
  if (locked) return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-5 max-w-xs px-6">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center
            bg-white/[0.03] border border-white/[0.07]">
            <Lock size={32} className="text-slate-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Chapter Locked</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isAuthenticated
                ? "Complete the previous chapter's quiz to unlock this one."
                : 'Sign in and complete earlier chapters to unlock this one.'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 pt-1">
            <Link href={`/learn/${courseSlug}`}
              className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400
                text-white text-sm font-semibold transition-colors">
              ← Back to Course
            </Link>
            {!isAuthenticated && (
              <Link href="/auth/login"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Not found ── */
  if (!chapter) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-slate-400 text-sm">Chapter not found.</p>
        <Link href={`/learn/${courseSlug}`} className="text-sky-400 hover:text-sky-300 text-sm transition-colors">
          ← Back to course
        </Link>
      </div>
    </div>
  );

  // hasChallenge is optimistic — we attempt fetch; tab appears always for chapters that have one
  // We don't know at this point, so we show the tab and handle the 404 gracefully in the tab body
  const tabs = [
    { id: 'lesson',    label: 'Lesson',    Icon: BookOpen,      optional: false },
    { id: 'code',      label: 'Code',      Icon: Code2,         optional: false },
    ...(chapter.quizzes?.length ? [{ id: 'quiz', label: 'Quiz', Icon: Target, optional: false }] : []),
    { id: 'challenge', label: 'Challenge', Icon: FlaskConical,  optional: true  },
  ] as { id: 'lesson' | 'code' | 'quiz' | 'challenge'; label: string; Icon: React.ElementType; optional: boolean }[];

  const nextHref =
    completed && adjacent?.next != null
      ? `/learn/${courseSlug}/${adjacent.next.slug}`
      : null;

  /* ══════════════════════════════ Page ══════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 py-5">
          <Link href="/learn" className="hover:text-sky-400 transition-colors">Courses</Link>
          <ChevronRight size={11} className="opacity-40" />
          <Link href={`/learn/${courseSlug}`} className="hover:text-sky-400 transition-colors capitalize">
            {courseSlug.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={11} className="opacity-40" />
          <span className="text-slate-300 truncate max-w-[200px]">{chapter.title}</span>
        </nav>

        <div className="flex gap-8 items-start">

          {/* ══════ Sidebar ══════ */}
          <aside className="hidden lg:flex flex-col gap-3 w-[268px] flex-shrink-0 sticky top-24">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 mb-2">Chapter</p>
                <h1 className="text-base font-bold text-white leading-snug">{chapter.title}</h1>
                {chapter.description && (
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{chapter.description}</p>
                )}
              </div>

              <div className="h-px bg-white/[0.06]" />

              <ul className="space-y-2.5">
                <MetaRow icon={<Star size={12} />} label="XP Reward">
                  <span className="text-sky-400 font-semibold text-sm">{chapter.xpReward} XP</span>
                </MetaRow>
                {chapter.language && (
                  <MetaRow icon={<Code2 size={12} />} label="Language">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 capitalize">
                      {chapter.language}
                    </span>
                  </MetaRow>
                )}
                <MetaRow icon={<Clock size={12} />} label="Est. Time">
                  <span className="text-slate-300 text-sm">~15 min</span>
                </MetaRow>
                {chapter.quizzes?.length ? (
                  <MetaRow icon={<Target size={12} />} label="Quiz">
                    <span className="text-slate-300 text-sm">15 Qs · 25+ marks</span>
                  </MetaRow>
                ) : null}
              </ul>

              <div className="h-px bg-white/[0.06]" />

              {/* ── Chapter status badge ── */}
              {completed ? (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg
                  bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold">
                  <CheckCircle size={14} />
                  Chapter Passed ✓
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                    bg-amber-500/[0.07] border border-amber-500/20 text-amber-400 text-xs font-medium
                    hover:bg-amber-500/15 hover:border-amber-500/40 hover:text-amber-300
                    active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  <Target size={12} />
                  Pass the quiz to complete
                  <ChevronRight size={12} />
                </button>
              )}
            </div>

            <Link href={`/learn/${courseSlug}`}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-1 py-1">
              <ChevronRight size={12} className="rotate-180" />
              Back to course
            </Link>
          </aside>

          {/* ══════ Main content ══════ */}
          <main className="flex-1 min-w-0">

            {/* Mobile header */}
            <div className="lg:hidden mb-6 space-y-2">
              <h1 className="text-xl font-bold text-white">{chapter.title}</h1>
              {chapter.description && <p className="text-sm text-slate-400">{chapter.description}</p>}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold">
                  ⭐ {chapter.xpReward} XP
                </span>
                {completed ? (
                  <span className="text-xs flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle size={11} /> Passed ✓
                  </span>
                ) : (
                  <span className="text-xs flex items-center gap-1 text-amber-400/70">
                    <Target size={11} /> Pass quiz to complete
                  </span>
                )}
              </div>
            </div>

            {/* Tab bar */}
            <div className="border-b border-white/[0.07] mb-7 overflow-x-auto">
              <div className="flex min-w-max sm:min-w-0">
                {tabs.map(({ id, label, Icon, optional }) => {
                  const active = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`relative flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors select-none whitespace-nowrap ${
                        active ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Icon size={13} />
                      {label}
                      {/* OPTIONAL badge on challenge tab */}
                      {optional && (
                        <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5
                          rounded bg-violet-500/20 border border-violet-500/30 text-violet-400 leading-none">
                          optional
                        </span>
                      )}
                      {/* Completed dot on quiz tab */}
                      {id === 'quiz' && completed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
                      )}
                      {/* Solved dot on challenge tab */}
                      {id === 'challenge' && challenge?.alreadyPassed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 ml-0.5" />
                      )}
                      {active && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 rounded-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">

              {/* ── Lesson ── */}
              {activeTab === 'lesson' && (
                <motion.div key="lesson"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}  transition={{ duration: 0.15 }}
                  className="chapter-content"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children }) {
                        const lang = /language-(\w+)/.exec(className ?? '')?.[1] ?? '';
                        if (lang === 'diagram') return <DiagramBlock content={String(children)} />;
                        return <code className={className}>{children}</code>;
                      },
                    }}
                  >
                    {chapter.content}
                  </ReactMarkdown>
                  <ChapterNav adjacent={adjacent} courseSlug={courseSlug} completed={completed} />
                </motion.div>
              )}

              {/* ── Code ── */}
              {activeTab === 'code' && (
                <motion.div key="code"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3
                      bg-white/[0.025] border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                        </div>
                        <span className="text-xs text-slate-500 font-mono select-none">
                          {chapter.language || 'python'} · playground
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={handleRunCode} disabled={running}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                          bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold
                          transition-colors disabled:opacity-40"
                      >
                        <Play size={11} fill="currentColor" />
                        {running ? 'Running…' : 'Run'}
                      </motion.button>
                    </div>
                    <textarea
                      value={code} onChange={e => setCode(e.target.value)}
                      className="w-full p-5 bg-[#07101e] text-slate-200 font-mono text-sm
                        resize-none focus:outline-none leading-relaxed caret-sky-400"
                      style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '340px', tabSize: 4 }}
                      spellCheck={false}
                    />
                  </div>
                  {(output || running) && (
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5
                        bg-white/[0.02] border-b border-white/[0.06]">
                        <span className={`w-2 h-2 rounded-full ${running ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                        <span className="text-xs text-slate-500 font-mono select-none">
                          {running ? 'Executing…' : 'Output'}
                        </span>
                      </div>
                      <pre className="p-5 text-sm font-mono text-emerald-400 overflow-auto max-h-60 whitespace-pre-wrap leading-relaxed"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {running ? '…' : output}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Quiz ── */}
              {activeTab === 'quiz' && chapter.quizzes?.[0] && (
                <motion.div key="quiz"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}  transition={{ duration: 0.15 }}
                >
                  {/* Loading quiz data */}
                  {quizLoading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                      <div className="w-9 h-9 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                      <p className="text-slate-500 text-sm">Loading quiz…</p>
                    </div>
                  )}

                  {/* Stage 1 — Intro / Rules (before start) */}
                  {!quizLoading && !quizStarted && !quizSubmitted && (
                    <QuizIntro
                      quiz={quizData}
                      completed={completed}
                      onStart={() => setQuizStarted(true)}
                    />
                  )}

                  {/* Stage 2 — Questions (after start, before submit) */}
                  {!quizLoading && quizStarted && !quizSubmitted && quizData && (
                    <QuizComponent
                      quiz={quizData}
                      answers={quizAnswers}
                      setAnswers={setQuizAnswers}
                      onSubmit={handleQuizSubmit}
                    />
                  )}

                  {/* Stage 3 — Full review (after submit) */}
                  {!quizLoading && quizSubmitted && quizResult && quizData && (
                    <QuizReviewPage
                      quiz={quizData}
                      answers={quizAnswers}
                      result={quizResult}
                      onRetry={handleRetry}
                      nextHref={nextHref}
                    />
                  )}
                </motion.div>
              )}

              {/* ── Challenge ── */}
              {activeTab === 'challenge' && (
                <motion.div key="challenge"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}  transition={{ duration: 0.15 }}
                >
                  <ChallengeTab
                    challenge={challenge}
                    loading={challengeLoading}
                    code={challengeCode}
                    setCode={setChallengeCode}
                    output={challengeOutput}
                    running={challengeRunning}
                    testResults={challengeTestResults}
                    submitting={challengeSubmitting}
                    result={challengeResult}
                    hintsRevealed={hintsRevealed}
                    setHintsRevealed={setHintsRevealed}
                    onRunAndTest={handleChallengeRunAndTest}
                    onSubmit={handleChallengeSubmit}
                    onSkip={() => setActiveTab('lesson')}
                    onReset={() => {
                      if (challenge) {
                        setChallengeCode(challenge.starterCode);
                        setChallengeOutput('');
                        setChallengeTestResults(
                          challenge.testCases.map((tc) => ({ id: tc.id, passed: false, actual: '' }))
                        );
                        setChallengeResult(null);
                      }
                    }}
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ Chapter nav ════════════════════════════════════════ */
function ChapterNav({
  adjacent, courseSlug, completed,
}: {
  adjacent: AdjacentChapters | null;
  courseSlug: string;
  completed: boolean;
}) {
  if (!adjacent) return null;
  const { prev, next } = adjacent;
  return (
    <div className="mt-14 space-y-4">
      {next && (
        completed ? (
          <Link href={`/learn/${courseSlug}/${next.slug}`}>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="group flex items-center justify-between p-5 rounded-xl
                border border-sky-500/20 bg-sky-500/[0.04]
                hover:border-sky-500/40 hover:bg-sky-500/[0.08] transition-all cursor-pointer"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 mb-1">Up Next</p>
                <p className="text-base font-semibold text-white group-hover:text-sky-50 transition-colors leading-snug">
                  {next.title}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                bg-sky-500/10 border border-sky-500/20
                group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all">
                <ChevronRight size={18} className="text-sky-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ) : (
          <div className="flex items-center justify-between p-5 rounded-xl
            border border-white/[0.05] bg-white/[0.015] opacity-60 cursor-not-allowed select-none">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Up Next</p>
              <p className="text-sm font-semibold text-slate-400 leading-snug mb-2">{next.title}</p>
              <p className="text-xs text-amber-400/70 flex items-center gap-1.5">
                <Lock size={10} /> Pass the quiz to unlock
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              bg-white/[0.03] border border-white/[0.05]">
              <Lock size={16} className="text-slate-600" />
            </div>
          </div>
        )
      )}
      <div className="flex items-center justify-between pt-2">
        {prev ? (
          <Link href={`/learn/${courseSlug}/${prev.slug}`}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group">
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-0.5">Previous</div>
              <div className="font-medium truncate max-w-[200px]">{prev.title}</div>
            </div>
          </Link>
        ) : <span />}
        <Link href={`/learn/${courseSlug}`}
          className="text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors">
          All Chapters
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════ Sidebar meta row ═══════════════════════════════════ */
function MetaRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-slate-500 text-xs">{icon} {label}</span>
      {children}
    </li>
  );
}

/* ══════════════════════════ Quiz Rules panel ═══════════════════════════════════ */
function QuizRules({ timeLimit }: { timeLimit: number }) {
  const minutes = Math.round(timeLimit / 60);
  const rules = [
    { icon: '📋', text: '15 Multiple Choice Questions',                cls: 'text-slate-300' },
    { icon: '✅', text: '+3 marks for each correct answer',            cls: 'text-emerald-400' },
    { icon: '❌', text: '−1 mark for each wrong answer',              cls: 'text-red-400' },
    { icon: '🏆', text: `Pass: ${MIN_PASSING_MARKS}+ marks (≥10/15 correct)`, cls: 'text-amber-400' },
    { icon: '🎯', text: 'Maximum score: 45 marks',                     cls: 'text-slate-300' },
    { icon: '⏱', text: `Time limit: ${minutes} minutes`,              cls: 'text-slate-300' },
  ];
  return (
    <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Target size={12} className="text-amber-400" />
        </div>
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Quiz Rules</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {rules.map(r => (
          <div key={r.text} className={`flex items-center gap-2.5 text-sm ${r.cls}`}>
            <span className="text-base leading-none flex-shrink-0">{r.icon}</span>
            <span>{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STAGE 1 — Quiz intro / landing screen (shown before user clicks Start)
══════════════════════════════════════════════════════════════════════════════ */
function QuizIntro({
  quiz, completed, onStart,
}: {
  quiz: QuizData | null;
  completed: boolean;
  onStart: () => void;
}) {
  return (
    <div className="space-y-5 max-w-2xl">
      {/* Already completed banner */}
      {completed && (
        <div className="flex items-start gap-3 p-4 rounded-xl
          border border-emerald-500/30 bg-emerald-500/[0.05]">
          <CheckCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-400 font-semibold text-sm">Chapter Already Passed!</p>
            <p className="text-slate-400 text-xs mt-0.5">
              You can retake the quiz to challenge yourself — it won&apos;t affect your XP.
            </p>
          </div>
        </div>
      )}

      {/* Quiz header card */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-8 text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-xl font-bold text-white mb-2">
          {quiz?.title ?? 'Chapter Quiz'}
        </h2>
        <p className="text-slate-400 text-sm">
          15 questions · Score {MIN_PASSING_MARKS}+ marks out of 45 to pass
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} /> {Math.round((quiz?.timeLimit ?? 1800) / 60)} min limit
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            ✅ +3 correct
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-xs text-red-400">
            ❌ −1 wrong
          </span>
        </div>
      </div>

      {/* Full rules */}
      <QuizRules timeLimit={quiz?.timeLimit ?? 1800} />

      {/* Start button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="w-full py-4 rounded-xl flex items-center justify-center gap-2
          bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all"
      >
        {completed ? '↩  Retake Quiz' : '🚀  Start Quiz'}
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STAGE 2 — Quiz component (questions + options, pre-submit)
══════════════════════════════════════════════════════════════════════════════ */
function QuizComponent({
  quiz, answers, setAnswers, onSubmit,
}: {
  quiz: QuizData;
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  onSubmit: () => void;
}) {
  const questions = quiz.questions || [];
  const answered  = Object.keys(answers).length;
  const allDone   = answered === questions.length && questions.length > 0;
  const pct       = questions.length ? (answered / questions.length) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Quiz header row */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h2 className="font-bold text-white text-sm">{quiz.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Score {MIN_PASSING_MARKS}+ marks out of 45 to pass · +3 correct · −1 wrong
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xl font-black text-sky-400 leading-none">
            {answered}
            <span className="text-slate-600 text-sm font-normal">/{questions.length}</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-600 mt-0.5">answered</div>
        </div>
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="rounded-xl border border-white/[0.07] p-12 text-center">
          <p className="text-slate-500 text-sm">No questions found. Please try again.</p>
        </div>
      ) : (
        questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            selected={answers[q.id]}
            onSelect={optId => setAnswers({ ...answers, [q.id]: optId })}
          />
        ))
      )}

      {/* Progress */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">{answered} of {questions.length} answered</span>
          {!allDone && (
            <span className="text-amber-400/70">Answer all questions before submitting</span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-sky-500"
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          />
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        onClick={onSubmit}
        disabled={!allDone}
        className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-400
          text-white font-bold text-sm transition-all
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {!allDone
          ? `Answer all ${questions.length} questions  (${answered} / ${questions.length})`
          : '🎯  Submit Quiz →'}
      </motion.button>
    </div>
  );
}

/* ─── Single MCQ question card ───────────────────────────────────────────────── */
function QuestionCard({
  question, index, selected, onSelect,
}: {
  question: QuizQuestion;
  index: number;
  selected?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
      {/* Question text */}
      <div className="flex gap-3 px-5 pt-5 pb-4">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0
          bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold mt-0.5">
          {index + 1}
        </span>
        <p className="text-sm text-slate-100 leading-relaxed font-medium">{question.text}</p>
      </div>

      {/* Options */}
      <div className="px-5 pb-5 space-y-2">
        {parseOptions(question.options as unknown).map((opt, j) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={[
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border text-left text-sm',
                'transition-all duration-150',
                isSelected
                  ? 'border-sky-500/50 bg-sky-500/10 text-white'
                  : 'border-white/[0.06] bg-transparent text-slate-300 hover:border-sky-500/30 hover:bg-sky-500/[0.04] hover:text-white',
              ].join(' ')}
            >
              <span className={[
                'w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all',
                isSelected
                  ? 'border-sky-400 bg-sky-400 text-white'
                  : 'border-slate-600 text-slate-500',
              ].join(' ')}>
                {OPT_LABELS[j] ?? j + 1}
              </span>
              <span className="flex-1">{opt.text}</span>
              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STAGE 3 — Post-submit: scorecard + full question review
══════════════════════════════════════════════════════════════════════════════ */
function QuizReviewPage({
  quiz, answers, result, onRetry, nextHref,
}: {
  quiz: QuizData;
  answers: Record<string, string>;
  result: QuizResultData;
  onRetry: () => void;
  nextHref: string | null;
}) {
  const questions    = quiz.questions || [];
  const displayMarks = result.marks; // can show negative to be authentic

  return (
    <div className="space-y-8">

      {/* ── Scorecard ── */}
      <div className={`rounded-2xl border p-6 ${
        result.passed
          ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
          : 'border-red-500/20 bg-red-500/[0.03]'
      }`}>
        {/* Header */}
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">{result.passed ? '🏆' : '📖'}</div>
          <h2 className={`text-2xl font-black mb-1 ${result.passed ? 'text-emerald-400' : 'text-white'}`}>
            {result.passed ? 'Quiz Passed!' : 'Keep Learning!'}
          </h2>
          <p className="text-slate-400 text-sm">
            {result.passed
              ? 'Excellent work — chapter complete!'
              : `Need ${MIN_PASSING_MARKS}+ marks (≥10 correct). Review your mistakes below.`}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4 text-center">
            <div className={`text-3xl font-black leading-none ${
              result.passed ? 'text-emerald-400' : displayMarks < 0 ? 'text-red-400' : 'text-slate-200'
            }`}>
              {displayMarks}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1.5">
              Marks / {result.maxMarks}
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4 text-center">
            <div className="text-3xl font-black leading-none text-emerald-400">{result.correct}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1.5">
              Correct / {result.total}
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4 text-center">
            <div className="text-3xl font-black leading-none text-red-400">{result.wrong}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1.5">
              Wrong / {result.total}
            </div>
          </div>
        </div>

        {/* Score breakdown formula */}
        <div className="flex items-center justify-center gap-2 text-sm mb-6 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
            +{result.correct * 3}
          </span>
          <span className="text-slate-500 text-xs">({result.correct} × 3)</span>
          <span className="text-slate-600 mx-1">−</span>
          <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs">
            {result.wrong}
          </span>
          <span className="text-slate-500 text-xs">({result.wrong} × 1)</span>
          <span className="text-slate-600 mx-1">=</span>
          <span className={`px-3 py-1 rounded-full font-bold text-sm border ${
            result.passed
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-white/[0.05] border-white/10 text-slate-300'
          }`}>
            {displayMarks} marks
          </span>
        </div>

        {/* XP badge */}
        {result.xpEarned > 0 && (
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full
              bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold">
              <Zap size={13} /> +{result.xpEarned} XP earned
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {result.passed && nextHref && (
            <Link href={nextHref}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400
                text-white font-semibold text-sm transition-colors">
              Next Chapter →
            </Link>
          )}
          <button onClick={onRetry}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400
              hover:text-white hover:border-white/25 transition-colors text-sm">
            {result.passed ? '↩ Retake Quiz' : '↩ Try Again'}
          </button>
        </div>
      </div>

      {/* ── Question review ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-1 h-5 bg-sky-400 rounded-full" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Question Review</h3>
          <span className="text-xs text-slate-500 ml-1">
            ({result.correct} correct · {result.wrong} wrong)
          </span>
        </div>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const selected  = answers[q.id];
            const isCorrect = selected === q.correctAnswer;
            return (
              <ReviewQuestion key={q.id} question={q} index={i} selected={selected} isCorrect={isCorrect} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   CHALLENGE TAB — optional coding challenge
══════════════════════════════════════════════════════════════════════════════ */
function ChallengeTab({
  challenge, loading, code, setCode, output, running,
  testResults, submitting, result, hintsRevealed, setHintsRevealed,
  onRunAndTest, onSubmit, onSkip, onReset,
}: {
  challenge: CodingChallenge | null;
  loading: boolean;
  code: string;
  setCode: (c: string) => void;
  output: string;
  running: boolean;
  testResults: { id: string; passed: boolean; actual: string }[];
  submitting: boolean;
  result: { passed: boolean; xpAwarded: number; message: string } | null;
  hintsRevealed: number;
  setHintsRevealed: (n: number) => void;
  onRunAndTest: () => void;
  onSubmit: () => void;
  onSkip: () => void;
  onReset: () => void;
}) {
  /* Loading */
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-9 h-9 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">Loading challenge…</p>
    </div>
  );

  /* No challenge for this chapter */
  if (!loading && !challenge) return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center
        bg-white/[0.03] border border-white/[0.07]">
        <FlaskConical size={28} className="text-slate-600" />
      </div>
      <div className="text-center space-y-1.5 max-w-sm">
        <h3 className="text-white font-semibold">No Challenge Yet</h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          This chapter doesn&apos;t have an optional coding challenge yet. Check back later!
        </p>
      </div>
      <button onClick={onSkip}
        className="px-5 py-2 rounded-lg border border-white/10 text-slate-400
          hover:text-white hover:border-white/25 transition-colors text-sm">
        ← Back to Lesson
      </button>
    </div>
  );

  if (!challenge) return null;

  const allPassed     = testResults.length > 0 && testResults.every(t => t.passed);
  const anyRun        = testResults.some(t => t.actual !== '');
  const passedCount   = testResults.filter(t => t.passed).length;

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
              Optional Challenge
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5
              rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
              +{challenge.xpReward} XP
            </span>
            {(challenge.alreadyPassed || result?.passed) && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5
                rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Trophy size={9} /> Solved
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white">{challenge.title}</h2>
        </div>
        <button onClick={onSkip}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300
            transition-colors flex-shrink-0 mt-1">
          <SkipForward size={12} />
          Skip
        </button>
      </div>

      {/* ── Problem Statement ── */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="chapter-content prose-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {challenge.problemStatement}
          </ReactMarkdown>
        </div>
      </div>

      {/* ── Already solved banner ── */}
      {(challenge.alreadyPassed || result?.passed) && !result && (
        <div className="flex items-center gap-3 p-4 rounded-xl
          border border-emerald-500/30 bg-emerald-500/[0.05]">
          <Trophy size={16} className="text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-emerald-400 font-semibold text-sm">Already Solved!</p>
            <p className="text-slate-400 text-xs mt-0.5">
              You&apos;ve already earned the XP for this challenge. Practice again anytime.
            </p>
          </div>
        </div>
      )}

      {/* ── Result banner ── */}
      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${
          result.passed
            ? 'border-emerald-500/30 bg-emerald-500/[0.05]'
            : 'border-red-500/20 bg-red-500/[0.03]'
        }`}>
          {result.passed
            ? <Trophy size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            : <FlaskConical size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className={`font-semibold text-sm ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.passed ? 'Challenge Solved! 🎉' : 'Not quite — keep trying!'}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">{result.message}</p>
          </div>
          {result.passed && result.xpAwarded > 0 && (
            <div className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full
              bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold flex-shrink-0">
              <Zap size={11} /> +{result.xpAwarded} XP
            </div>
          )}
        </div>
      )}

      {/* ── Code Editor ── */}
      <div className="rounded-xl border border-white/[0.07] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3
          bg-white/[0.025] border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs text-slate-500 font-mono select-none">
              {challenge.language || 'python'} · challenge
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onReset}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors px-2 py-1 rounded">
              Reset
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={onRunAndTest} disabled={running || submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-violet-500 hover:bg-violet-400 text-white text-xs font-bold
                transition-colors disabled:opacity-40"
            >
              <Play size={11} fill="currentColor" />
              {running ? 'Running…' : 'Run & Test'}
            </motion.button>
          </div>
        </div>
        <textarea
          value={code} onChange={e => setCode(e.target.value)}
          className="w-full p-5 bg-[#07101e] text-slate-200 font-mono text-sm
            resize-none focus:outline-none leading-relaxed caret-violet-400"
          style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '300px', tabSize: 4 }}
          spellCheck={false}
        />
      </div>

      {/* ── Output ── */}
      {(output || running) && (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5
            bg-white/[0.02] border-b border-white/[0.06]">
            <span className={`w-2 h-2 rounded-full ${running ? 'bg-amber-400 animate-pulse' : 'bg-violet-400'}`} />
            <span className="text-xs text-slate-500 font-mono select-none">
              {running ? 'Executing…' : 'Output'}
            </span>
          </div>
          <pre className="p-5 text-sm font-mono text-violet-300 overflow-auto max-h-48 whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {running ? '…' : output}
          </pre>
        </div>
      )}

      {/* ── Test Cases ── */}
      {challenge.testCases.length > 0 && (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5
            bg-white/[0.025] border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <FlaskConical size={13} className="text-slate-500" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Test Cases
              </span>
            </div>
            {anyRun && (
              <span className={`text-xs font-bold ${allPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {passedCount} / {testResults.length} passed
              </span>
            )}
          </div>
          <div className="divide-y divide-white/[0.05]">
            {challenge.testCases.map((tc, i) => {
              const tr = testResults.find(r => r.id === tc.id);
              const hasRun = tr && tr.actual !== '';
              return (
                <div key={tc.id} className={`px-5 py-3.5 flex items-start gap-3 ${
                  hasRun
                    ? tr!.passed
                      ? 'bg-emerald-500/[0.03]'
                      : 'bg-red-500/[0.03]'
                    : ''
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    border text-[10px] font-bold ${
                      !hasRun
                        ? 'border-slate-700 text-slate-600 bg-transparent'
                        : tr!.passed
                          ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                          : 'border-red-500/40 bg-red-500/20 text-red-400'
                    }`}>
                    {!hasRun ? i + 1 : tr!.passed ? '✓' : '✗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 font-medium">{tc.description}</p>
                    <p className="text-xs text-slate-600 mt-0.5 font-mono">
                      Expected: <span className="text-slate-400">{tc.expectedOutput}</span>
                    </p>
                    {hasRun && !tr!.passed && (
                      <p className="text-xs text-red-400/80 mt-0.5 font-mono truncate">
                        Got: {tr!.actual || '(no output)'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Hints ── */}
      {challenge.hints.length > 0 && (
        <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.03] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-500/10">
            <div className="flex items-center gap-2">
              <Lightbulb size={13} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Hints</span>
              <span className="text-xs text-slate-600">
                ({hintsRevealed}/{challenge.hints.length} revealed)
              </span>
            </div>
            {hintsRevealed < challenge.hints.length && (
              <button
                onClick={() => setHintsRevealed(hintsRevealed + 1)}
                className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/25
                  text-amber-400 hover:bg-amber-500/10 transition-colors font-medium">
                Reveal Hint {hintsRevealed + 1}
              </button>
            )}
          </div>
          {hintsRevealed > 0 && (
            <div className="p-4 space-y-2">
              {challenge.hints.slice(0, hintsRevealed).map((hint, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">💡</span>
                  <span className="leading-relaxed">{hint}</span>
                </div>
              ))}
            </div>
          )}
          {hintsRevealed === 0 && (
            <div className="px-5 py-4 text-xs text-slate-600 italic">
              Click &quot;Reveal Hint 1&quot; when you&apos;re stuck.
            </div>
          )}
        </div>
      )}

      {/* ── Action row ── */}
      <div className="flex items-center gap-3 pt-1">
        {anyRun && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={submitting || !!result}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              allPassed
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 cursor-not-allowed'
            } disabled:opacity-40`}
          >
            {submitting ? 'Submitting…' : allPassed ? '🏆  Submit & Claim XP' : `Run & pass all tests first`}
          </motion.button>
        )}
        <button
          onClick={onSkip}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/[0.08]
            text-slate-500 hover:text-slate-300 hover:border-white/[0.15] transition-colors text-sm font-medium">
          <SkipForward size={14} />
          {anyRun ? 'Skip' : 'Skip for now'}
        </button>
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-xs text-slate-600 text-center pb-4">
        This challenge is completely optional — skipping it won&apos;t affect your progress.
      </p>
    </div>
  );
}

/* ─── Single question review card (post-submit) ─────────────────────────────── */
function ReviewQuestion({
  question, index, selected, isCorrect,
}: {
  question: QuizQuestion;
  index: number;
  selected?: string;
  isCorrect: boolean;
}) {
  return (
    <div className={`rounded-xl border overflow-hidden ${
      isCorrect ? 'border-emerald-500/25' : 'border-red-500/20'
    }`}>
      {/* Question header */}
      <div className={`flex items-start gap-3 px-5 pt-4 pb-3 ${
        isCorrect ? 'bg-emerald-500/[0.04]' : 'bg-red-500/[0.03]'
      }`}>
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 mt-0.5
          text-xs font-bold border ${
          isCorrect
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-red-500/20 text-red-400 border-red-500/30'
        }`}>
          {isCorrect ? '✓' : '✗'}
        </span>
        <div className="flex-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            isCorrect ? 'text-emerald-500' : 'text-red-500'
          }`}>Q{index + 1}</span>
          <p className="text-sm text-slate-100 leading-relaxed font-medium mt-0.5">{question.text}</p>
        </div>
      </div>

      {/* Options review */}
      <div className="px-5 pt-3 pb-3 space-y-1.5 bg-black/20">
        {parseOptions(question.options as unknown).map((opt, j) => {
          const isCorrectOpt  = opt.id === question.correctAnswer;
          const isSelectedOpt = opt.id === selected;
          const isWrongPick   = isSelectedOpt && !isCorrect;

          const rowCls = isCorrectOpt
            ? 'border-emerald-500/40 bg-emerald-500/[0.07] text-emerald-200'
            : isWrongPick
              ? 'border-red-500/35 bg-red-500/[0.06] text-red-300'
              : 'border-white/[0.04] bg-transparent text-slate-600';

          const bubbleCls = isCorrectOpt
            ? 'border-emerald-400 bg-emerald-400 text-white'
            : isWrongPick
              ? 'border-red-400 bg-red-400 text-white'
              : 'border-slate-700 text-slate-600';

          return (
            <div key={opt.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm ${rowCls}`}>
              <span className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center
                justify-center flex-shrink-0 ${bubbleCls}`}>
                {OPT_LABELS[j] ?? j + 1}
              </span>
              <span className="flex-1">{opt.text}</span>
              {isCorrectOpt && (
                <span className="text-[10px] text-emerald-400 flex-shrink-0 font-semibold">✓ Correct</span>
              )}
              {isWrongPick && (
                <span className="text-[10px] text-red-400 flex-shrink-0 font-semibold">✗ Your answer</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="mx-5 mb-4 mt-1 px-4 py-3 rounded-lg
          bg-sky-500/[0.05] border border-sky-500/15 text-xs text-slate-400 leading-relaxed">
          <span className="text-sky-400 font-semibold">💡 </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
