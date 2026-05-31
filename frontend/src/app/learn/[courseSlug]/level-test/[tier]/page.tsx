'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../../components/layout/Navbar';
import api, {
  LevelTest, LevelTestQuestion, LevelTestAttemptResult, LevelTestBreakdownItem,
} from '../../../../../lib/api';
import {
  ChevronRight, ChevronLeft, Trophy, Clock, CheckCircle, XCircle,
  AlertCircle, Zap, BarChart2, ArrowRight, RotateCcw, BookOpen,
} from 'lucide-react';

// ─── Tier config (mirror) ─────────────────────────────────────────────────────
type TierKey = 'NOOB' | 'AMATEUR' | 'PRO' | 'MASTER' | 'GOD';

const TIER_CONFIG: Record<TierKey, { label: string; emoji: string; color: string; glow: string; bg: string; border: string }> = {
  NOOB:   { label: 'Noob',   emoji: '🌱', color: '#22c55e', glow: 'rgba(34,197,94,0.35)',   bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)'   },
  AMATEUR:{ label: 'Amateur',emoji: '⚡', color: '#0ea5e9', glow: 'rgba(14,165,233,0.35)',  bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.25)'  },
  PRO:    { label: 'Pro',    emoji: '🔥', color: '#f97316', glow: 'rgba(249,115,22,0.35)',  bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)'  },
  MASTER: { label: 'Master', emoji: '💎', color: '#a855f7', glow: 'rgba(168,85,247,0.35)',  bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.25)'  },
  GOD:    { label: 'GOD',    emoji: '👑', color: '#eab308', glow: 'rgba(234,179,8,0.40)',   bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.25)'   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Screen types ─────────────────────────────────────────────────────────────
type Screen = 'intro' | 'test' | 'result';

// ─── Intro Screen ─────────────────────────────────────────────────────────────
function IntroScreen({
  lt, cfg, onStart,
}: {
  lt: LevelTest;
  cfg: typeof TIER_CONFIG[TierKey];
  onStart: () => void;
}) {
  const rules = [
    { label: '30 Questions', desc: 'Covering the entire tier syllabus', icon: BookOpen },
    { label: '+3 / −1 scoring', desc: 'Correct: +3 pts  •  Wrong: −1 pt  •  Skip: 0', icon: BarChart2 },
    { label: 'Pass: 60 / 90', desc: 'You need at least 60 out of 90 points to advance', icon: Trophy },
    { label: '60 Minutes', desc: 'Timer starts when you begin — manage your time', icon: Clock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header card */}
      <div
        className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 border text-center relative overflow-hidden"
        style={{ background: cfg.bg, borderColor: cfg.border, boxShadow: `0 0 60px ${cfg.glow}` }}
      >
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(105deg, transparent 35%, ${cfg.color}18 50%, transparent 65%)` }}
        />

        <div className="text-5xl sm:text-6xl mb-4">{cfg.emoji}</div>
        <div
          className="inline-block text-xs font-mono font-bold px-3 py-1 rounded-full border mb-3"
          style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
        >
          LEVEL TEST
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white mb-3">{lt.title}</h1>
        <p className="text-slate-400 text-sm leading-relaxed">{lt.description}</p>

        {lt.passed && (
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm">
            <CheckCircle size={16} />
            <span>You have already passed this test — retaking is for practice only (no extra XP).</span>
          </div>
        )}
      </div>

      {/* Rules */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {rules.map(({ label, desc, icon: Icon }) => (
          <div key={label} className="cyber-card p-3 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col gap-2">
            <Icon size={22} style={{ color: cfg.color }} />
            <div className="font-semibold text-white text-sm">{label}</div>
            <div className="text-xs text-slate-400">{desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="w-full py-4 rounded-2xl font-bold text-lg font-display flex items-center justify-center gap-3 text-white transition-all"
        style={{
          background: `linear-gradient(135deg, ${cfg.color}, ${cfg.glow.replace('0.35', '1')})`,
          boxShadow: `0 0 30px ${cfg.glow}`,
        }}
      >
        Begin Level Test <ArrowRight size={22} />
      </motion.button>
    </motion.div>
  );
}

// ─── Test Screen ──────────────────────────────────────────────────────────────
function TestScreen({
  lt, cfg, onSubmit,
}: {
  lt: LevelTest;
  cfg: typeof TIER_CONFIG[TierKey];
  onSubmit: (answers: Record<string, string>, timeSpent: number) => void;
}) {
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [answers, setAnswers]         = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft]       = useState(lt.timeLimit);
  const startTime                     = useRef(Date.now());

  // Countdown timer
  useEffect(() => {
    const iv = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(() => {
    const spent = Math.round((Date.now() - startTime.current) / 1000);
    onSubmit(answers, spent);
  }, [answers, onSubmit]);

  const q: LevelTestQuestion = lt.questions[currentIdx];
  const selected = answers[q.id] ?? null;
  const answered  = Object.keys(answers).length;
  const pct       = Math.round((answered / lt.questions.length) * 100);
  const urgent    = timeLeft < 300; // last 5 min

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Q {currentIdx + 1} / {lt.questions.length}</span>
            <span>{answered} answered</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.glow.replace('0.35', '1')})` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm flex-shrink-0 transition-colors duration-500 ${
            urgent ? 'text-red-400 border-red-500/30 bg-red-500/08' : 'text-slate-300 border-white/10 bg-white/04'
          }`}
        >
          <Clock size={14} className={urgent ? 'text-red-400' : 'text-slate-400'} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="cyber-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-5 sm:mb-6"
        >
          {/* Topic badge */}
          {q.topic && (
            <div
              className="inline-block text-xs font-mono px-2 py-0.5 rounded border mb-4"
              style={{ color: cfg.color, borderColor: cfg.border, background: cfg.bg }}
            >
              {q.topic}
            </div>
          )}

          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 leading-relaxed whitespace-pre-line">
            {q.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, oi) => {
              const letter = String.fromCharCode(65 + oi); // A B C D
              const isSelected = selected === opt;

              return (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className="w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4"
                  style={
                    isSelected
                      ? { background: cfg.bg, borderColor: cfg.color, boxShadow: `0 0 16px ${cfg.glow}` }
                      : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all"
                    style={
                      isSelected
                        ? { background: cfg.color, color: '#0a0a0f' }
                        : { background: 'rgba(255,255,255,0.06)', color: '#64748b' }
                    }
                  >
                    {letter}
                  </span>
                  <span className={`text-sm leading-snug pt-0.5 ${isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>
                    {opt}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
        >
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Dot nav */}
        <div className="flex-1 flex items-center justify-center gap-1 overflow-hidden">
          {lt.questions.map((question, i) => (
            <button
              key={question.id}
              onClick={() => setCurrentIdx(i)}
              className="w-2 h-2 rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                background: i === currentIdx
                  ? cfg.color
                  : answers[question.id]
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.08)',
                transform: i === currentIdx ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {currentIdx < lt.questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
          </button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.glow.replace('0.35', '1')})`, boxShadow: `0 0 20px ${cfg.glow}` }}
          >
            Submit <Trophy size={16} />
          </motion.button>
        )}
      </div>

      {/* Unanswered warning before submit on last question */}
      {currentIdx === lt.questions.length - 1 && answered < lt.questions.length && (
        <div className="mt-4 flex items-center gap-2 text-amber-400 text-xs">
          <AlertCircle size={14} />
          {lt.questions.length - answered} question{lt.questions.length - answered > 1 ? 's' : ''} unanswered — unanswered questions score 0.
        </div>
      )}
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({
  result, cfg, tier, courseSlug, onRetry,
}: {
  result: LevelTestAttemptResult;
  cfg: typeof TIER_CONFIG[TierKey];
  tier: TierKey;
  courseSlug: string;
  onRetry: () => void;
}) {
  const pct     = Math.round((result.score / result.maxScore) * 100);
  const correct = result.breakdown.filter(b => b.isCorrect).length;
  const wrong   = result.breakdown.filter(b => !b.isCorrect && b.selected !== null).length;
  const skipped = result.breakdown.filter(b => b.selected === null).length;

  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Score card */}
      <div
        className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 text-center border relative overflow-hidden"
        style={{
          background: result.passed ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
          borderColor: result.passed ? 'rgba(34,197,94,0.30)' : 'rgba(239,68,68,0.30)',
          boxShadow:   result.passed ? '0 0 60px rgba(34,197,94,0.20)' : '0 0 40px rgba(239,68,68,0.10)',
        }}
      >
        {/* Confetti emoji for pass */}
        {result.passed && (
          <motion.div
            className="absolute top-4 right-4 text-3xl"
            animate={{ rotate: [0, 20, -20, 0], y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉
          </motion.div>
        )}

        <div className="text-4xl sm:text-5xl mb-4">{result.passed ? '🏆' : '😤'}</div>

        <div className={`text-4xl sm:text-5xl font-display font-black mb-1 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
          {result.score}
          <span className="text-xl sm:text-2xl text-slate-500 font-normal"> / {result.maxScore}</span>
        </div>

        <div className="text-slate-400 text-sm mb-4">{pct}% score</div>

        <div
          className={`inline-block text-sm font-bold font-mono px-4 py-1.5 rounded-full border mb-5 sm:mb-6 ${
            result.passed
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
              : 'text-red-400 border-red-500/30 bg-red-500/10'
          }`}
        >
          {result.passed ? '✓ LEVEL PASSED' : '✗ NOT PASSED YET'}
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm">
          <div className="text-center">
            <div className="text-emerald-400 font-bold text-lg sm:text-xl">{correct}</div>
            <div className="text-slate-500 text-xs">Correct (+{correct * 3})</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-red-400 font-bold text-lg sm:text-xl">{wrong}</div>
            <div className="text-slate-500 text-xs">Wrong (−{wrong})</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-slate-400 font-bold text-lg sm:text-xl">{skipped}</div>
            <div className="text-slate-500 text-xs">Skipped</div>
          </div>
        </div>

        {result.xpEarned > 0 && (
          <div className="mt-5 flex items-center justify-center gap-2 text-yellow-400 font-bold">
            <Zap size={18} /> +{result.xpEarned} XP earned!
          </div>
        )}

        {result.passed && (
          <p className="mt-4 text-sm text-slate-400">
            The next tier is now unlocked — keep going! 🚀
          </p>
        )}
        {!result.passed && (
          <p className="mt-4 text-sm text-slate-400">
            You need {result.passingScore} pts to pass. Review the chapters and try again!
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        {result.passed && (
          <Link
            href={`/learn/${courseSlug}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white text-sm transition-all"
            style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.glow.replace('0.35', '1')})`, boxShadow: `0 0 24px ${cfg.glow}` }}
          >
            Continue Learning <ArrowRight size={16} />
          </Link>
        )}
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all"
        >
          <RotateCcw size={15} /> {result.passed ? 'Practice Again' : 'Retry Test'}
        </button>
        <Link
          href={`/learn/${courseSlug}`}
          className="flex items-center justify-center px-5 py-3 rounded-2xl border border-white/10 text-slate-400 hover:text-white text-sm transition-all"
        >
          Back to Course
        </Link>
      </div>

      {/* Breakdown */}
      <div className="cyber-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowBreakdown(v => !v)}
          className="w-full flex items-center justify-between p-5 text-sm font-semibold text-white hover:bg-white/02 transition-colors"
        >
          <span className="flex items-center gap-2"><BarChart2 size={16} style={{ color: cfg.color }} /> Answer Breakdown</span>
          <ChevronRight size={16} className={`transition-transform duration-200 ${showBreakdown ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="divide-y divide-white/5 border-t border-white/05">
                {result.breakdown.map((item: LevelTestBreakdownItem, idx: number) => (
                  <div key={item.questionId} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5">
                        {item.isCorrect
                          ? <CheckCircle size={16} className="text-emerald-400" />
                          : item.selected
                          ? <XCircle size={16} className="text-red-400" />
                          : <AlertCircle size={16} className="text-slate-500" />
                        }
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-500 mb-1">Q{idx + 1}{item.topic ? ` — ${item.topic}` : ''}</div>
                        {item.selected && !item.isCorrect && (
                          <div className="text-xs text-red-400 mb-0.5">Your answer: {item.selected}</div>
                        )}
                        {!item.isCorrect && (
                          <div className="text-xs text-emerald-400 mb-1">Correct: {item.correct}</div>
                        )}
                        {item.explanation && (
                          <div className="text-xs text-slate-400 leading-relaxed">{item.explanation}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LevelTestPage() {
  const { courseSlug, tier: tierParam } = useParams<{ courseSlug: string; tier: string }>();
  const router = useRouter();

  const tier      = tierParam.toUpperCase() as TierKey;
  const cfg       = TIER_CONFIG[tier] ?? TIER_CONFIG.NOOB;

  const [lt, setLt]           = useState<LevelTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen]   = useState<Screen>('intro');
  const [result, setResult]   = useState<LevelTestAttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Find the course first to get its id
        const courseRes = await api.get(`/courses/${courseSlug}`);
        const courseId  = courseRes.data.id;
        const ltRes     = await api.get(`/level-tests/course/${courseId}/tier/${tier}`);
        setLt(ltRes.data);
      } catch {
        // If no level test found, redirect back
        router.replace(`/learn/${courseSlug}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseSlug, tier, router]);

  const handleSubmit = async (answers: Record<string, string>, timeSpent: number) => {
    if (!lt || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/level-tests/${lt.id}/attempt`, { answers, timeSpent });
      setResult(data);
      setScreen('result');
    } catch {
      alert('Submission failed — please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setScreen('intro');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!lt) return null;

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-20 sm:pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/learn" className="hover:text-cyber-blue transition-colors">Courses</Link>
          <ChevronRight size={14} />
          <Link href={`/learn/${courseSlug}`} className="hover:text-cyber-blue transition-colors capitalize">
            {courseSlug.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: cfg.color }}>{cfg.emoji} {cfg.label} Level Test</span>
        </div>

        {/* Submitting overlay */}
        <AnimatePresence>
          {submitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="cyber-card p-8 rounded-3xl text-center">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white font-semibold">Evaluating your answers…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screens */}
        <AnimatePresence mode="wait">
          {screen === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IntroScreen lt={lt} cfg={cfg} onStart={() => setScreen('test')} />
            </motion.div>
          )}

          {screen === 'test' && (
            <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TestScreen lt={lt} cfg={cfg} onSubmit={handleSubmit} />
            </motion.div>
          )}

          {screen === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultScreen
                result={result}
                cfg={cfg}
                tier={tier}
                courseSlug={courseSlug}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
