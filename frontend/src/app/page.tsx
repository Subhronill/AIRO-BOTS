'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import {
  Zap, ArrowRight, BookOpen, Code2, Trophy,
  Brain, Cpu, ChevronRight, UserPlus, Layers, Rocket,
} from 'lucide-react';

// ---------- data ----------

const FEATURES = [
  {
    icon: BookOpen,
    color: '#0ea5e9',
    title: 'Structured Learning Paths',
    description:
      'Go from complete beginner to deployment expert with curated courses in ML, Deep Learning, and Robotics.',
  },
  {
    icon: Code2,
    color: '#22c55e',
    title: 'Code Playground',
    description:
      'Write, run, and experiment with Python and more — right in the browser. Zero setup required.',
  },
  {
    icon: Trophy,
    color: '#a855f7',
    title: 'XP & Achievements',
    description:
      'Earn XP, level up, and unlock achievements as you progress. Streaks and leaderboards keep you sharp.',
  },
  {
    icon: Brain,
    color: '#f59e0b',
    title: 'Interactive Quizzes',
    description:
      'Test your understanding after every chapter with timed quizzes. Track scores and keep improving.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Create your account',
    desc: 'Sign up for free — no credit card needed. Your journey starts with one click.',
    Icon: UserPlus,
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.35)',
    badge: 'Free forever',
  },
  {
    step: '02',
    title: 'Enter the AI ROOM',
    desc: 'Access every course, playground, and resource in one unified space.',
    Icon: Layers,
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.35)',
    badge: '30+ courses',
  },
  {
    step: '03',
    title: 'Learn & level up',
    desc: 'Complete lessons, crack quizzes, earn XP and unlock your AI career.',
    Icon: Rocket,
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.35)',
    badge: 'XP & badges',
  },
];

// ---------- bubbles — fixed overlay, active across the whole page ----------
// size px | left % | dur s | del s | peak opacity | hex color | drift px
const BUBBLES = [
  // ── small vivid ──
  { id:  1, size:  6, left:  3, dur:  8.5, del:  0.0, opacity: 0.55, color: '#0ea5e9', drift:  14 },
  { id:  2, size:  5, left: 11, dur:  7.0, del:  2.4, opacity: 0.50, color: '#22c55e', drift: -10 },
  { id:  3, size:  7, left: 19, dur:  9.5, del:  5.1, opacity: 0.48, color: '#0ea5e9', drift:  18 },
  { id:  4, size:  5, left: 27, dur:  7.5, del:  1.2, opacity: 0.44, color: '#a855f7', drift:  -8 },
  { id:  5, size:  6, left: 36, dur:  8.0, del:  8.0, opacity: 0.46, color: '#22c55e', drift:  12 },
  { id:  6, size:  7, left: 44, dur:  9.0, del:  3.6, opacity: 0.50, color: '#0ea5e9', drift: -14 },
  { id:  7, size:  5, left: 53, dur:  7.5, del:  6.5, opacity: 0.44, color: '#a855f7', drift:  10 },
  { id:  8, size:  6, left: 61, dur:  8.5, del:  1.8, opacity: 0.48, color: '#0ea5e9', drift: -16 },
  { id:  9, size:  7, left: 70, dur: 10.0, del:  4.4, opacity: 0.42, color: '#22c55e', drift:  14 },
  { id: 10, size:  5, left: 79, dur:  7.0, del:  7.3, opacity: 0.50, color: '#0ea5e9', drift:  -8 },
  { id: 11, size:  6, left: 87, dur:  8.0, del:  2.7, opacity: 0.46, color: '#a855f7', drift:  16 },
  { id: 12, size:  7, left: 95, dur:  9.5, del:  5.9, opacity: 0.44, color: '#0ea5e9', drift: -12 },
  // ── medium ──
  { id: 13, size: 10, left:  7, dur: 12.5, del:  3.0, opacity: 0.32, color: '#a855f7', drift: -18 },
  { id: 14, size:  9, left: 15, dur: 11.0, del:  7.8, opacity: 0.34, color: '#0ea5e9', drift:  16 },
  { id: 15, size: 11, left: 23, dur: 13.0, del:  1.5, opacity: 0.30, color: '#22c55e', drift: -12 },
  { id: 16, size:  9, left: 33, dur: 11.5, del:  9.2, opacity: 0.32, color: '#a855f7', drift:  20 },
  { id: 17, size: 10, left: 42, dur: 12.0, del:  4.8, opacity: 0.34, color: '#0ea5e9', drift: -10 },
  { id: 18, size: 11, left: 50, dur: 13.5, del:  2.0, opacity: 0.28, color: '#a855f7', drift:  14 },
  { id: 19, size:  9, left: 59, dur: 11.0, del:  6.7, opacity: 0.32, color: '#22c55e', drift: -20 },
  { id: 20, size: 10, left: 67, dur: 12.5, del:  0.5, opacity: 0.34, color: '#0ea5e9', drift:  18 },
  { id: 21, size: 11, left: 76, dur: 13.0, del:  8.5, opacity: 0.28, color: '#a855f7', drift: -14 },
  { id: 22, size:  9, left: 84, dur: 11.5, del:  3.8, opacity: 0.32, color: '#0ea5e9', drift:  10 },
  { id: 23, size: 10, left: 92, dur: 12.0, del:  6.1, opacity: 0.30, color: '#22c55e', drift: -16 },
  // ── large ghost ──
  { id: 24, size: 16, left:  5, dur: 16.0, del:  1.0, opacity: 0.16, color: '#a855f7', drift:  10 },
  { id: 25, size: 20, left: 25, dur: 20.0, del:  4.2, opacity: 0.12, color: '#0ea5e9', drift: -14 },
  { id: 26, size: 14, left: 47, dur: 15.0, del:  0.7, opacity: 0.14, color: '#a855f7', drift:  12 },
  { id: 27, size: 18, left: 63, dur: 18.0, del:  5.5, opacity: 0.13, color: '#0ea5e9', drift: -10 },
  { id: 28, size: 22, left: 81, dur: 21.0, del:  2.3, opacity: 0.10, color: '#a855f7', drift:   8 },
  // ── extra-small accent ──
  { id: 29, size:  4, left: 39, dur:  6.5, del:  9.8, opacity: 0.56, color: '#22c55e', drift: -12 },
  { id: 30, size:  4, left: 56, dur:  6.0, del:  0.3, opacity: 0.54, color: '#0ea5e9', drift:  10 },
  { id: 31, size:  4, left: 73, dur:  7.0, del:  4.0, opacity: 0.52, color: '#a855f7', drift: -18 },
  { id: 32, size:  4, left: 90, dur:  6.5, del:  7.6, opacity: 0.54, color: '#22c55e', drift:  14 },
  { id: 33, size:  5, left: 30, dur:  7.5, del: 11.2, opacity: 0.46, color: '#0ea5e9', drift: -10 },
  { id: 34, size:  6, left: 48, dur:  8.5, del: 10.5, opacity: 0.44, color: '#a855f7', drift:  16 },
  { id: 35, size:  5, left: 65, dur:  7.0, del: 12.0, opacity: 0.48, color: '#22c55e', drift:  -8 },
];

function Bubbles() {
  return (
    // fixed: stays in the viewport as the user scrolls — covers every section
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {BUBBLES.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-0 rounded-full"
          style={{
            width:  b.size,
            height: b.size,
            left:   `${b.left}%`,
            background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.65) 0%, ${b.color}aa 35%, ${b.color}18 100%)`,
            border: `0.5px solid ${b.color}60`,
            boxShadow: `0 0 ${b.size * 2.5}px ${b.color}50`,
          }}
          animate={{
            y:       [0, -1300],
            x:       [0, b.drift, 0, b.drift * -0.5, 0],
            opacity: [0, b.opacity, b.opacity, b.opacity * 0.35, 0],
          }}
          transition={{
            duration: b.dur,
            delay:    b.del,
            repeat:   Infinity,
            ease:     'linear',
            x:       { ease: 'easeInOut', duration: b.dur, delay: b.del, repeat: Infinity },
            opacity: {
              ease:  'linear',
              times: [0, 0.07, 0.78, 0.94, 1],
              duration: b.dur,
              delay:    b.del,
              repeat:   Infinity,
            },
          }}
        />
      ))}
    </div>
  );
}

// ---------- helpers ----------

function inView(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-70px' },
    transition: { duration: 0.35, delay, ease: 'easeOut' },
  } as const;
}

// ---------- page ----------

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const router = useRouter();
  const [roomHovered, setRoomHovered] = useState(false);

  const goToRoom = () =>
    router.push(isAuthenticated ? '/ai-room' : '/auth/login?redirect=/ai-room');

  return (
    <div className="min-h-screen bg-cyber-black overflow-x-hidden">

      {/* ── global bubble layer — fixed so it covers every section ── */}
      <Bubbles />

      {/* Navbar sits above bubbles */}
      <div className="relative" style={{ zIndex: 50 }}>
        <Navbar />
      </div>

      {/* ═══════════════════════════════════════════════
          HERO — full-viewport AI ROOM entry point
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden" style={{ zIndex: 2 }}>
        {/* ambient layers */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-cyber-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-purple/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-sm font-mono mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            AI &amp; Robotics Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.07 }}
            className="text-5xl sm:text-7xl md:text-9xl font-display font-black text-white mb-4 leading-none tracking-tight"
          >
            AIRO
            <span className="bg-clip-text text-transparent bg-cyber-gradient"> BOTS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.13 }}
            className="text-base sm:text-xl md:text-2xl text-slate-400 mb-10 sm:mb-14 max-w-md mx-auto px-4"
          >
            Master AI &amp; Robotics. Build the future.
          </motion.p>

          {/* ── main CTA ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.38, delay: 0.2 }}
            className="relative inline-flex items-center justify-center"
          >
            {/* Sonar rings — pulse outward while hovered */}
            {roomHovered && [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: '1.5px solid rgba(14,165,233,0.55)' }}
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.55 + i * 0.22, opacity: 0 }}
                transition={{
                  duration: 1.0,
                  delay: i * 0.22,
                  ease: 'easeOut',
                  repeat: Infinity,
                  repeatDelay: 0.05,
                }}
              />
            ))}

            <motion.button
              onClick={goToRoom}
              onHoverStart={() => setRoomHovered(true)}
              onHoverEnd={() => setRoomHovered(false)}
              whileTap={{ scale: 0.95 }}
              animate={roomHovered ? { scale: 1.04 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden text-white text-base sm:text-xl font-bold px-8 sm:px-14 py-4 sm:py-5 rounded-xl sm:rounded-2xl"
              style={{
                background: roomHovered
                  ? 'linear-gradient(135deg, #38bdf8 0%, #c084fc 100%)'
                  : 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
                boxShadow: roomHovered
                  ? '0 0 40px rgba(56,189,248,0.5), 0 0 80px rgba(192,132,252,0.25)'
                  : '0 0 20px rgba(14,165,233,0.2)',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Light beam sweep */}
              <motion.span
                className="absolute top-0 bottom-0 w-2/5 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)',
                }}
                initial={{ left: '-40%' }}
                animate={roomHovered ? { left: '140%' } : { left: '-40%' }}
                transition={{ duration: 0.52, ease: 'easeInOut' }}
              />

              {/* Corner flash — top-left */}
              <motion.span
                className="absolute top-0 left-0 w-6 h-6 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at top left, rgba(255,255,255,0.6), transparent 70%)',
                }}
                animate={roomHovered ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              />
              {/* Corner flash — bottom-right */}
              <motion.span
                className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at bottom right, rgba(255,255,255,0.6), transparent 70%)',
                }}
                animate={roomHovered ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-3">
                {/* ⚡ spins + flashes yellow on hover */}
                <motion.span
                  animate={
                    roomHovered
                      ? { rotate: [0, -15, 360], scale: [1, 1.4, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                >
                  <Zap
                    size={22}
                    className="transition-colors duration-200"
                    style={{ color: roomHovered ? '#fde047' : '#22c55e' }}
                  />
                </motion.span>

                {/* Text — spreads letter-spacing on hover via CSS */}
                <span
                  className={`font-bold transition-all duration-300 ${
                    roomHovered ? 'tracking-widest' : 'tracking-normal'
                  }`}
                >
                  Enter AI ROOM
                </span>

                {/* Arrow — bounces right repeatedly while hovered */}
                <motion.span
                  animate={
                    roomHovered
                      ? { x: [0, 7, 0] }
                      : { x: 0 }
                  }
                  transition={
                    roomHovered
                      ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.15 }
                  }
                >
                  <ArrowRight size={22} />
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          {!isAuthenticated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="mt-6 text-slate-500 text-sm"
            >
              New here?{' '}
              <Link href="/auth/register" className="text-cyber-blue hover:text-sky-400 transition-colors">
                Create a free account
              </Link>
              {' · '}
              <Link href="/auth/login" className="text-slate-400 hover:text-white transition-colors">
                Sign in
              </Link>
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 sm:mt-20 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-slate-600 text-xs font-mono"
          >
            {['Structured Courses', 'Interactive Quizzes', 'Code Playground', 'XP & Achievements'].map(
              (feat) => (
                <span key={feat} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue/40" />
                  {feat}
                </span>
              )
            )}
          </motion.div>
        </div>

        {/* scroll nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
        >
          <span className="text-xs font-mono tracking-widest">scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-6 bg-gradient-to-b from-cyber-blue/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-28 px-4 relative" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...inView()} className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-xs font-mono mb-4">
              <Cpu size={12} /> Everything you need
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4">
              One platform.{' '}
              <span className="bg-clip-text text-transparent bg-cyber-gradient">All you need.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
              From theory to code to deployment — it&apos;s all inside the AI ROOM.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  {...inView(i * 0.07)}
                  className="cyber-card p-6 hover:-translate-y-1 transition-transform duration-200"
                  style={{ borderColor: `${f.color}25` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}15`, color: f.color }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-36 px-4 sm:px-6 relative overflow-hidden" style={{ zIndex: 2 }}>
        {/* background layers */}
        <div className="absolute inset-0 grid-bg opacity-[0.06] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(14,165,233,0.07) 0%, transparent 65%)' }} />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 65%)', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 65%)' }} />

        <div className="max-w-5xl mx-auto relative z-10">

          {/* ── heading ── */}
          <motion.div {...inView()} className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-white/[0.04] border border-white/[0.08] text-xs font-semibold
              text-slate-400 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4 leading-tight">
              Get started in{' '}
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)' }}>
                  3 steps
                </span>
                {/* underline glow */}
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full opacity-60"
                  style={{ background: 'linear-gradient(90deg, #0ea5e9, #a855f7)' }} />
              </span>
            </h2>
            <p className="text-slate-400 text-lg">No setup. No friction. Just learning.</p>
          </motion.div>

          {/* ── step cards + connectors ── */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
            {STEPS.map((s, i) => (
              <div key={s.step} className="w-full md:flex-1 flex flex-col md:flex-row items-stretch">

                {/* ── card ── */}
                <motion.div
                  {...inView(i * 0.13)}
                  whileHover={{ y: -8, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
                  className="group w-full flex-1 cursor-default"
                >
                  <div
                    className="relative h-full rounded-3xl border border-white/[0.07] overflow-hidden
                      transition-all duration-500 hover:border-white/[0.14]"
                    style={{
                      background: isLight
                        ? 'linear-gradient(160deg, #ffffff 0%, #f5f9ff 100%)'
                        : 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
                      boxShadow: isLight
                        ? '0 4px 20px rgba(14,165,233,0.08), 0 1px 4px rgba(0,0,0,0.06)'
                        : undefined,
                    }}
                  >
                    {/* glow halo — fades in on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow: isLight
                          ? `inset 0 0 30px ${s.glow}`
                          : `inset 0 0 40px ${s.glow}, 0 0 40px ${s.glow}`,
                      }}
                    />

                    {/* top accent line */}
                    <div
                      className="absolute top-0 left-8 right-8 h-[1.5px] rounded-b-full opacity-0
                        group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
                    />

                    {/* bottom-right glow orb */}
                    <div
                      className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full pointer-events-none
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                      style={{ background: s.glow }}
                    />

                    <div className="relative px-5 sm:px-8 pt-7 sm:pt-10 pb-5 sm:pb-8">

                      {/* watermark number */}
                      <div
                        className="absolute top-4 right-5 text-[4rem] sm:text-[6.5rem] font-display font-black leading-none
                          select-none pointer-events-none"
                        style={{
                          color: s.color,
                          opacity: isLight ? 0.10 : 0.07,
                          WebkitTextStroke: `1px ${s.color}`,
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {s.step}
                      </div>

                      {/* icon — bigger, more padded */}
                      <div className="mb-7">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center
                            border transition-all duration-400
                            group-hover:scale-110 group-hover:rotate-[-4deg]"
                          style={{
                            background: `linear-gradient(135deg, ${s.color}20 0%, ${s.color}08 100%)`,
                            borderColor: `${s.color}35`,
                            boxShadow: `0 4px 24px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
                          }}
                        >
                          <s.Icon size={24} style={{ color: s.color }} />
                        </div>
                      </div>

                      {/* badge */}
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                          border text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{
                          background: `${s.color}10`,
                          borderColor: `${s.color}25`,
                          color: s.color,
                        }}
                      >
                        <span className="w-1 h-1 rounded-full" style={{ background: s.color }} />
                        {s.badge}
                      </div>

                      {/* title + desc */}
                      <h3 className="font-display font-bold text-white text-xl mb-3 leading-snug">{s.title}</h3>
                      <p className="text-slate-400 text-sm leading-[1.75]">{s.desc}</p>

                      {/* bottom divider + step label */}
                      <div className="mt-8 pt-5 border-t border-white/[0.05] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {[0, 1, 2].map((dot) => (
                            <div
                              key={dot}
                              className="rounded-full transition-all duration-300"
                              style={{
                                width:  dot <= i ? '20px' : '6px',
                                height: '6px',
                                background: dot <= i ? s.color : (isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'),
                                boxShadow: dot === i ? `0 0 8px ${s.color}` : 'none',
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 tracking-widest">
                          {s.step} / 03
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── desktop connector ── */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-16 flex-shrink-0 relative">
                    {/* track line */}
                    <div
                      className="absolute left-1 right-1 h-px"
                      style={{
                        background: 'linear-gradient(90deg, rgba(14,165,233,0.2), rgba(168,85,247,0.2))',
                      }}
                    />
                    {/* dashes overlay */}
                    <div
                      className="absolute left-1 right-1 h-px"
                      style={{
                        background: 'transparent',
                        maskImage: 'repeating-linear-gradient(90deg, black 0px, black 5px, transparent 5px, transparent 10px)',
                        WebkitMaskImage: 'repeating-linear-gradient(90deg, black 0px, black 5px, transparent 5px, transparent 10px)',
                        backgroundImage: 'linear-gradient(90deg, rgba(14,165,233,0.5), rgba(168,85,247,0.5))',
                      }}
                    />
                    {/* travelling pulse */}
                    <motion.div
                      className="absolute w-2.5 h-2.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #7dd3fc, #0ea5e9)',
                        boxShadow: '0 0 10px rgba(14,165,233,1), 0 0 20px rgba(14,165,233,0.5)',
                        top: '50%',
                        marginTop: '-5px',
                      }}
                      animate={{ x: ['-20px', '20px'], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.1, 0.9, 1] }}
                    />
                    {/* central arrow circle */}
                    <div
                      className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center border"
                      style={{
                        background: isLight
                          ? 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(168,85,247,0.1))'
                          : 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(168,85,247,0.08))',
                        borderColor: isLight ? 'rgba(14,165,233,0.45)' : 'rgba(14,165,233,0.25)',
                        boxShadow: isLight
                          ? '0 2px 10px rgba(14,165,233,0.2)'
                          : '0 0 20px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
                      }}
                    >
                      <ArrowRight size={15} style={{ color: '#38bdf8', filter: 'drop-shadow(0 0 5px rgba(56,189,248,0.9))' }} />
                    </div>
                  </div>
                )}

                {/* ── mobile connector ── */}
                {i < STEPS.length - 1 && (
                  <div className="md:hidden flex justify-center py-4">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-px h-8 bg-gradient-to-b from-cyber-blue/25 to-transparent" />
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center border"
                        style={{
                          background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(168,85,247,0.06))',
                          borderColor: 'rgba(14,165,233,0.25)',
                        }}
                        animate={{ boxShadow: ['0 0 8px rgba(14,165,233,0.15)', '0 0 20px rgba(14,165,233,0.45)', '0 0 8px rgba(14,165,233,0.15)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ArrowRight size={14} className="rotate-90"
                          style={{ color: '#38bdf8', filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.8))' }} />
                      </motion.div>
                      <div className="w-px h-8 bg-gradient-to-b from-transparent to-purple-500/25" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <motion.div {...inView(0.35)} className="text-center mt-10 sm:mt-16">
            <motion.button
              onClick={goToRoom}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 50px rgba(56,189,248,0.5), 0 0 100px rgba(168,85,247,0.25)',
              }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden text-white px-8 sm:px-14 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl inline-flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)' }}
            >
              {/* shimmer sweep */}
              <motion.span
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
              />
              <Zap size={20}
                className="relative z-10 text-yellow-300 group-hover:scale-125 transition-transform duration-200" />
              <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
                Enter AI ROOM
              </span>
              <ArrowRight size={18}
                className="relative z-10 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0
                  transition-all duration-300" />
            </motion.button>
            {!isAuthenticated && (
              <p className="mt-4 text-slate-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-cyber-blue hover:text-sky-300 hover:underline transition-colors">
                  Sign up free →
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="relative" style={{ zIndex: 2 }}>
        <Footer />
      </div>
    </div>
  );
}
