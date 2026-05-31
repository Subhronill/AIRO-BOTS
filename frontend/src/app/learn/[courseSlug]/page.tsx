'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import api, { Course, Chapter, LevelTestStatus } from '../../../lib/api';
import {
  ChevronRight, CheckCircle, Lock, Star, Zap,
  Trophy, ClipboardList, ShieldCheck, ArrowRight,
} from 'lucide-react';

// ─── Difficulty badge colours ─────────────────────────────────────────────────
const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: '#22c55e', INTERMEDIATE: '#0ea5e9', ADVANCED: '#a855f7', EXPERT: '#ef4444',
};

// ─── Tier config ──────────────────────────────────────────────────────────────
type TierKey = 'NOOB' | 'AMATEUR' | 'PRO' | 'MASTER' | 'GOD';

const TIER_CONFIG: Record<TierKey, {
  label: string;
  subtitle: string;
  emoji: string;
  color: string;
  glow: string;
  bg: string;
  border: string;
  headerBg: string;
  badge: string;
}> = {
  NOOB: {
    label:     'Noob Level',
    subtitle:  'Zero to Basics — Start here, no experience required',
    emoji:     '🌱',
    color:     '#22c55e',
    glow:      'rgba(34,197,94,0.35)',
    bg:        'rgba(34,197,94,0.04)',
    border:    'rgba(34,197,94,0.20)',
    headerBg:  'rgba(34,197,94,0.08)',
    badge:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  },
  AMATEUR: {
    label:     'Amateur Level',
    subtitle:  'Building Foundations — Core tools and real workflows',
    emoji:     '⚡',
    color:     '#0ea5e9',
    glow:      'rgba(14,165,233,0.35)',
    bg:        'rgba(14,165,233,0.04)',
    border:    'rgba(14,165,233,0.20)',
    headerBg:  'rgba(14,165,233,0.08)',
    badge:     'bg-sky-500/10 text-sky-400 border-sky-500/25',
  },
  PRO: {
    label:     'Pro Level',
    subtitle:  'Getting Serious — Advanced techniques, real projects',
    emoji:     '🔥',
    color:     '#f97316',
    glow:      'rgba(249,115,22,0.35)',
    bg:        'rgba(249,115,22,0.04)',
    border:    'rgba(249,115,22,0.20)',
    headerBg:  'rgba(249,115,22,0.08)',
    badge:     'bg-orange-500/10 text-orange-400 border-orange-500/25',
  },
  MASTER: {
    label:     'Master Level',
    subtitle:  'Expert Territory — Deep expertise, industry-level skills',
    emoji:     '💎',
    color:     '#a855f7',
    glow:      'rgba(168,85,247,0.35)',
    bg:        'rgba(168,85,247,0.04)',
    border:    'rgba(168,85,247,0.20)',
    headerBg:  'rgba(168,85,247,0.08)',
    badge:     'bg-purple-500/10 text-purple-400 border-purple-500/25',
  },
  GOD: {
    label:     'GOD Level',
    subtitle:  'Transcendent Skills — Elite mastery, the 1% club',
    emoji:     '👑',
    color:     '#eab308',
    glow:      'rgba(234,179,8,0.40)',
    bg:        'rgba(234,179,8,0.04)',
    border:    'rgba(234,179,8,0.25)',
    headerBg:  'rgba(234,179,8,0.10)',
    badge:     'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
  },
};

const TIER_ORDER: TierKey[] = ['NOOB', 'AMATEUR', 'PRO', 'MASTER', 'GOD'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function groupByTier(chapters: (Chapter & { isCompleted?: boolean; isUnlocked?: boolean })[]) {
  const map = new Map<TierKey, typeof chapters>();
  for (const t of TIER_ORDER) map.set(t, []);
  for (const ch of chapters) {
    if (!ch.tier) continue; // skip legacy un-tiered chapters — shown below in flat section
    const tier = ch.tier as TierKey;
    if (map.has(tier)) map.get(tier)!.push(ch);
  }
  return map;
}

/** True if any chapter has an explicit tier — even a single-tier course shows the Learning Path view */
function hasTieredContent(chapters: Chapter[]) {
  return chapters.some(ch => !!ch.tier);
}

// ─── Chapter card ─────────────────────────────────────────────────────────────
function ChapterCard({
  chapter, index, courseSlug,
}: {
  chapter: Chapter & { isCompleted?: boolean; isUnlocked?: boolean };
  index: number;
  courseSlug: string;
}) {
  const isCompleted = chapter.isCompleted ?? false;
  const isUnlocked  = chapter.isUnlocked  ?? (index === 0);
  const diffColor   = DIFFICULTY_COLORS[chapter.difficulty] ?? '#64748b';

  const card = (
    <div className={[
      'cyber-card p-3 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all duration-200',
      isUnlocked && !isCompleted ? 'cursor-pointer hover:shadow-neon-blue/20 hover:border-cyber-blue/40' : '',
      isCompleted               ? 'border-cyber-green/30'                                                 : '',
      !isUnlocked               ? 'opacity-50 cursor-not-allowed'                                        : '',
    ].join(' ')}>

      {/* Index / status bubble */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm"
        style={{
          background: isCompleted ? 'rgba(34,197,94,0.15)'  : !isUnlocked ? 'rgba(100,116,139,0.08)' : 'rgba(14,165,233,0.10)',
          color:      isCompleted ? '#22c55e'                : !isUnlocked ? '#475569'                 : '#0ea5e9',
          border:    `1px solid ${isCompleted ? 'rgba(34,197,94,0.3)' : !isUnlocked ? 'rgba(100,116,139,0.15)' : 'rgba(14,165,233,0.2)'}`,
        }}
      >
        {isCompleted ? <CheckCircle size={18} /> : !isUnlocked ? <Lock size={15} /> : index + 1}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
          {chapter.title}
        </h3>
        <p className="text-sm text-slate-400 truncate">
          {!isUnlocked ? 'Complete the previous chapter to unlock' : chapter.description}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {isUnlocked ? (
          <>
            <span className="hidden md:flex items-center gap-1 text-xs" style={{ color: diffColor }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: diffColor }} />
              {chapter.difficulty}
            </span>
            <span className="text-xs text-yellow-400 flex items-center gap-1">
              <Star size={12} /> {chapter.xpReward} XP
            </span>
            {chapter._count?.quizzes ? (
              <span className="text-xs text-slate-500 font-mono">Quiz</span>
            ) : null}
            <ChevronRight size={16} className="text-slate-400" />
          </>
        ) : (
          <Lock size={14} className="text-slate-600" />
        )}
      </div>
    </div>
  );

  return isUnlocked
    ? <Link href={`/learn/${courseSlug}/${chapter.slug}`}>{card}</Link>
    : card;
}

// ─── Level Test Card ──────────────────────────────────────────────────────────
function LevelTestCard({
  lt, tierKey, courseSlug, tierIndex,
}: {
  lt: LevelTestStatus;
  tierKey: TierKey;
  courseSlug: string;
  tierIndex: number;
}) {
  const cfg = TIER_CONFIG[tierKey];

  const state: 'passed' | 'available' | 'locked' =
    lt.passed ? 'passed' : lt.available ? 'available' : 'locked';

  const stateConfig = {
    passed: {
      bg:     'rgba(34,197,94,0.06)',
      border: 'rgba(34,197,94,0.30)',
      icon:   <ShieldCheck size={28} className="text-emerald-400" />,
      label:  'LEVEL PASSED',
      badge:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      desc:   'You have passed this level test. Well done!',
      cta:    'View Results',
    },
    available: {
      bg:     `rgba(${cfg.color.replace('#', '').match(/.{2}/g)!.map(h => parseInt(h, 16)).join(',')}, 0.06)`,
      border: cfg.border,
      icon:   <Trophy size={28} style={{ color: cfg.color }} />,
      label:  'LEVEL TEST READY',
      badge:  '',
      desc:   `All ${tierKey} chapters complete! Take the 30-question Level Test to advance to the next tier.`,
      cta:    'Take the Test',
    },
    locked: {
      bg:     'rgba(100,116,139,0.04)',
      border: 'rgba(100,116,139,0.15)',
      icon:   <Lock size={28} className="text-slate-600" />,
      label:  'LEVEL TEST LOCKED',
      badge:  '',
      desc:   'Complete all chapters in this tier to unlock the Level Test.',
      cta:    '',
    },
  }[state];

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: tierIndex * 0.08 + 0.15 }}
      whileHover={state !== 'locked' ? { scale: 1.01 } : {}}
      className="relative overflow-hidden rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-5 border transition-all duration-300"
      style={{
        background: stateConfig.bg,
        borderColor: stateConfig.border,
        boxShadow: state === 'available' ? `0 0 24px ${cfg.glow}` : 'none',
        cursor: state === 'locked' ? 'not-allowed' : 'pointer',
        opacity: state === 'locked' ? 0.55 : 1,
      }}
    >
      {/* Shimmer on available */}
      {state === 'available' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${cfg.color}18 50%, transparent 60%)`,
          }}
        />
      )}

      {/* Icon bubble */}
      <div
        className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
        style={{
          background: state === 'passed'
            ? 'rgba(34,197,94,0.12)'
            : state === 'available'
            ? cfg.bg
            : 'rgba(100,116,139,0.06)',
          border: `1px solid ${stateConfig.border}`,
          boxShadow: state === 'available' ? `0 0 16px ${cfg.glow}` : 'none',
        }}
      >
        {stateConfig.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
            style={
              state === 'passed'
                ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e', borderColor: 'rgba(34,197,94,0.3)' }
                : state === 'available'
                ? { background: cfg.bg, color: cfg.color, borderColor: cfg.border }
                : { background: 'rgba(100,116,139,0.08)', color: '#475569', borderColor: 'rgba(100,116,139,0.15)' }
            }
          >
            {stateConfig.label}
          </span>
          {state !== 'locked' && (
            <span className="text-xs text-yellow-400 flex items-center gap-1">
              <Zap size={11} /> {lt.xpReward} XP
            </span>
          )}
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <ClipboardList size={11} /> 30 Questions
          </span>
        </div>
        <p className="text-sm font-semibold text-white mb-0.5">{lt.title}</p>
        <p className="text-xs text-slate-400 truncate">{stateConfig.desc}</p>
      </div>

      {/* Arrow */}
      {state !== 'locked' && (
        <ArrowRight size={20} style={{ color: state === 'passed' ? '#22c55e' : cfg.color, flexShrink: 0 }} />
      )}
    </motion.div>
  );

  if (state === 'locked') return inner;
  return (
    <Link href={`/learn/${courseSlug}/level-test/${lt.tier.toLowerCase()}`}>
      {inner}
    </Link>
  );
}

// ─── Tier section header ──────────────────────────────────────────────────────
function TierHeader({
  tierKey, chapters, tierIndex,
}: {
  tierKey: TierKey;
  chapters: (Chapter & { isCompleted?: boolean; isUnlocked?: boolean })[];
  tierIndex: number;
}) {
  const cfg          = TIER_CONFIG[tierKey];
  const completed    = chapters.filter(ch => ch.isCompleted).length;
  const totalXP      = chapters.reduce((s, ch) => s + ch.xpReward, 0);
  const allDone      = completed === chapters.length && chapters.length > 0;
  const pct          = chapters.length > 0 ? Math.round((completed / chapters.length) * 100) : 0;

  return (
    <div className="mt-8 mb-3 first:mt-0">
      {/* Connector line between tiers */}
      {tierIndex > 0 && (
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${cfg.color}40)` }} />
          <span className="text-xs font-mono text-slate-500">LEVEL UP</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${cfg.color}40)` }} />
        </div>
      )}

      {/* Tier header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: tierIndex * 0.08 }}
        className="rounded-xl p-5 mb-4 border"
        style={{ background: cfg.headerBg, borderColor: cfg.border }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Glowing emoji */}
            <div
              className="text-4xl flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: cfg.bg, boxShadow: `0 0 20px ${cfg.glow}`, border: `1px solid ${cfg.border}` }}
            >
              {cfg.emoji}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-lg font-display font-black" style={{ color: cfg.color }}>
                  {cfg.label}
                </h3>
                {allDone && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    ✓ COMPLETE
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{cfg.subtitle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 text-sm flex-shrink-0">
            <div className="text-center">
              <div className="font-mono font-bold text-sm" style={{ color: cfg.color }}>{chapters.length}</div>
              <div className="text-xs text-slate-500">ch.</div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="text-center">
              <div className="font-mono font-bold text-yellow-400 flex items-center gap-0.5 text-sm">
                <Zap size={11} /> {totalXP}
              </div>
              <div className="text-xs text-slate-500">XP</div>
            </div>
            {completed > 0 && (
              <>
                <div className="w-px h-6 bg-white/10" />
                <div className="text-center">
                  <div className="font-mono font-bold text-emerald-400 text-sm">{pct}%</div>
                  <div className="text-xs text-slate-500">done</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress bar inside tier header */}
        {completed > 0 && (
          <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.glow})` }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CoursePage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse]   = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/courses/${courseSlug}`);
        setCourse(data);
      } catch { /* silent */ }
      finally  { setLoading(false); }
    };
    fetchData();
  }, [courseSlug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Not found ── */
  if (!course) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Course not found</p>
          <Link href="/learn" className="text-cyber-blue hover:text-cyber-cyan">← Back to Courses</Link>
        </div>
      </div>
    );
  }

  const chapters        = course.chapters ?? [];
  // Count only tiered chapters for header stats (ignore old legacy chapters)
  const tieredChapters  = chapters.filter(ch => !!ch.tier);
  const countForStats   = tieredChapters.length > 0 ? tieredChapters : chapters;
  const totalChapters   = countForStats.length;
  const completedCount  = countForStats.filter(ch => ch.isCompleted).length;
  const completionPct  = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
  const useTiers       = hasTieredContent(chapters);
  const tierMap        = groupByTier(chapters);
  // Legacy chapters that have no tier — shown below the Learning Path (or as full list if no tiers)
  const legacyChapters = chapters.filter(ch => !ch.tier);

  // Build a quick lookup: tier → LevelTestStatus
  const ltByTier: Record<string, LevelTestStatus> = {};
  for (const lt of course.levelTestStatus ?? []) {
    ltByTier[lt.tier] = lt;
  }

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-20 sm:pt-24 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/learn" className="hover:text-cyber-blue transition-colors">Courses</Link>
          <ChevronRight size={14} />
          <span className="text-white">{course.title}</span>
        </div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-5 sm:p-8 mb-10 border-cyber-blue/30"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-5xl sm:text-6xl">{course.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
                  Level {course.level}
                </span>
                {useTiers && (
                  <span className="text-xs font-mono px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    5 Tiers
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white mb-3">{course.title}</h1>
              <p className="text-slate-400 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className="text-slate-400">{totalChapters} chapters</span>
                {completedCount > 0 && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-cyber-green">{completedCount} completed</span>
                  </>
                )}
                {useTiers && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      {TIER_ORDER.filter(t => (tierMap.get(t)?.length ?? 0) > 0).map(t => (
                        <span key={t} title={TIER_CONFIG[t].label}>{TIER_CONFIG[t].emoji}</span>
                      ))}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Progress ring */}
            {completedCount > 0 && totalChapters > 0 && (
              <div className="text-center min-w-[7rem]">
                <div className="text-3xl font-display font-black text-cyber-blue mb-1">{completionPct}%</div>
                <div className="text-xs text-slate-400 mb-2">Complete</div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Tiered layout ── */}
        {useTiers ? (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-2">Learning Path</h2>
            <p className="text-sm text-slate-500 mb-6">
              Progress through 5 tiers — from Noob to GOD. Complete each tier and pass its Level Test to advance.
            </p>

            {TIER_ORDER.map((tierKey, tierIndex) => {
              const tierChapters = tierMap.get(tierKey) ?? [];
              if (tierChapters.length === 0) return null;

              // global index offset so chapter numbers are continuous across tiers
              const offset = TIER_ORDER
                .slice(0, tierIndex)
                .reduce((sum, t) => sum + (tierMap.get(t)?.length ?? 0), 0);

              const lt = ltByTier[tierKey];

              return (
                <div key={tierKey}>
                  <TierHeader tierKey={tierKey} chapters={tierChapters} tierIndex={tierIndex} />

                  <div className="space-y-3 pl-2 border-l-2 mb-4" style={{ borderColor: TIER_CONFIG[tierKey].border }}>
                    {tierChapters.map((chapter, i) => (
                      <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (tierIndex * 0.06) + (i * 0.04) }}
                      >
                        <ChapterCard
                          chapter={chapter}
                          index={offset + i}
                          courseSlug={courseSlug}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* ── Level Test card (if one exists for this tier) ── */}
                  {lt && (
                    <div className="pl-2 mb-2">
                      <LevelTestCard
                        lt={lt}
                        tierKey={tierKey}
                        courseSlug={courseSlug}
                        tierIndex={tierIndex}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── Legacy / introductory chapters (no tier set) ── */}
            {legacyChapters.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs font-mono text-slate-600 px-2">INTRODUCTORY CHAPTERS</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="space-y-3 opacity-60">
                  {legacyChapters.map((chapter, i) => (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ChapterCard chapter={chapter} index={i} courseSlug={courseSlug} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Flat layout (courses without any tiered chapters) ── */
          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-white mb-4">Chapters</h2>
            {chapters.map((chapter, i) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ChapterCard chapter={chapter} index={i} courseSlug={courseSlug} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
