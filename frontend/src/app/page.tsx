'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuthStore } from '../store/authStore';
import {
  Zap, ArrowRight, BookOpen, Code2, Trophy,
  Brain, Cpu, ChevronRight,
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
  { step: '01', title: 'Create your account', desc: 'Sign up for free — no credit card needed.' },
  { step: '02', title: 'Enter the AI ROOM',   desc: 'Access every course and resource in one place.' },
  { step: '03', title: 'Learn & build',        desc: 'Complete lessons, pass quizzes, earn XP, and level up.' },
];

// ---------- bubbles ----------
// size px | left % | dur s | del s | peak opacity | hex color | horizontal drift px
const BUBBLES = [
  { id:  1, size:  7, left:  4, dur:  9.0, del:  0.0, opacity: 0.55, color: '#0ea5e9', drift:  14 },
  { id:  2, size: 13, left: 12, dur: 13.0, del:  1.8, opacity: 0.28, color: '#a855f7', drift: -12 },
  { id:  3, size:  9, left: 22, dur: 11.0, del:  3.2, opacity: 0.42, color: '#0ea5e9', drift:  18 },
  { id:  4, size:  5, left: 31, dur:  8.0, del:  0.6, opacity: 0.40, color: '#22c55e', drift:  -8 },
  { id:  5, size: 17, left: 40, dur: 15.0, del:  2.4, opacity: 0.20, color: '#a855f7', drift:  10 },
  { id:  6, size:  7, left: 52, dur: 10.0, del:  4.1, opacity: 0.46, color: '#0ea5e9', drift: -16 },
  { id:  7, size: 21, left: 62, dur: 18.0, del:  1.0, opacity: 0.15, color: '#a855f7', drift:  14 },
  { id:  8, size:  8, left: 73, dur: 12.0, del:  5.7, opacity: 0.40, color: '#22c55e', drift: -10 },
  { id:  9, size:  6, left: 83, dur:  9.0, del:  2.6, opacity: 0.50, color: '#0ea5e9', drift:  16 },
  { id: 10, size: 15, left: 92, dur: 14.0, del:  0.9, opacity: 0.24, color: '#a855f7', drift: -14 },
  { id: 11, size:  5, left:  8, dur:  7.0, del:  6.3, opacity: 0.44, color: '#0ea5e9', drift:   8 },
  { id: 12, size: 11, left: 18, dur: 12.0, del:  3.8, opacity: 0.30, color: '#a855f7', drift: -18 },
  { id: 13, size:  6, left: 36, dur: 10.0, del:  7.2, opacity: 0.38, color: '#0ea5e9', drift:  12 },
  { id: 14, size: 19, left: 47, dur: 17.0, del:  1.3, opacity: 0.13, color: '#a855f7', drift:  -6 },
  { id: 15, size:  6, left: 58, dur:  8.0, del:  4.6, opacity: 0.46, color: '#22c55e', drift:  20 },
  { id: 16, size: 10, left: 68, dur: 13.0, del:  2.9, opacity: 0.28, color: '#0ea5e9', drift: -20 },
  { id: 17, size:  8, left: 78, dur: 10.0, del:  6.8, opacity: 0.38, color: '#a855f7', drift:  10 },
  { id: 18, size:  5, left: 88, dur:  7.0, del:  3.4, opacity: 0.48, color: '#0ea5e9', drift: -12 },
  { id: 19, size: 24, left: 55, dur: 22.0, del:  0.4, opacity: 0.10, color: '#a855f7', drift:   8 },
  { id: 20, size:  4, left: 43, dur:  6.0, del:  8.1, opacity: 0.52, color: '#22c55e', drift: -14 },
  { id: 21, size:  9, left: 28, dur: 11.0, del:  5.2, opacity: 0.34, color: '#0ea5e9', drift:  16 },
  { id: 22, size:  5, left: 96, dur:  8.0, del:  7.7, opacity: 0.44, color: '#a855f7', drift:  -8 },
  { id: 23, size: 12, left:  2, dur: 14.0, del:  4.9, opacity: 0.26, color: '#0ea5e9', drift:  12 },
  { id: 24, size:  7, left: 65, dur:  9.0, del:  9.2, opacity: 0.42, color: '#22c55e', drift: -10 },
  { id: 25, size: 10, left: 44, dur: 12.0, del:  6.5, opacity: 0.30, color: '#a855f7', drift:  14 },
  { id: 26, size:  6, left: 16, dur:  8.5, del:  2.1, opacity: 0.44, color: '#0ea5e9', drift: -16 },
  { id: 27, size: 14, left: 75, dur: 16.0, del:  5.0, opacity: 0.18, color: '#a855f7', drift:  10 },
  { id: 28, size:  5, left: 50, dur:  7.5, del: 10.0, opacity: 0.50, color: '#22c55e', drift: -18 },
  { id: 29, size:  8, left: 34, dur: 10.5, del:  8.8, opacity: 0.36, color: '#0ea5e9', drift:  22 },
  { id: 30, size: 16, left: 86, dur: 19.0, del:  3.6, opacity: 0.16, color: '#a855f7', drift: -12 },
];

function Bubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BUBBLES.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-0 rounded-full"
          style={{
            width:  b.size,
            height: b.size,
            left:   `${b.left}%`,
            // inner highlight at top-left makes it look like a real bubble
            background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.6) 0%, ${b.color}99 35%, ${b.color}22 100%)`,
            border: `0.5px solid ${b.color}55`,
            boxShadow: `0 0 ${b.size * 2}px ${b.color}44`,
          }}
          animate={{
            y:       [0, -1150],
            x:       [0, b.drift, 0, b.drift * -0.5, 0],
            opacity: [0, b.opacity, b.opacity, b.opacity * 0.4, 0],
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
  const router = useRouter();
  const [roomHovered, setRoomHovered] = useState(false);

  const goToRoom = () =>
    router.push(isAuthenticated ? '/ai-room' : '/auth/login?redirect=/ai-room');

  return (
    <div className="min-h-screen bg-cyber-black overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════
          HERO — full-viewport AI ROOM entry point
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* ambient layers */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-cyber-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-purple/5 rounded-full blur-2xl pointer-events-none" />

        <Bubbles />

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
            className="text-7xl md:text-9xl font-display font-black text-white mb-4 leading-none tracking-tight"
          >
            AIRO
            <span className="bg-clip-text text-transparent bg-cyber-gradient"> BOTS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.13 }}
            className="text-xl md:text-2xl text-slate-400 mb-14 max-w-md mx-auto"
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
              className="relative overflow-hidden text-white text-xl font-bold px-14 py-5 rounded-2xl"
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
            className="mt-20 flex flex-wrap items-center justify-center gap-5 text-slate-600 text-xs font-mono"
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
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...inView()} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-xs font-mono mb-4">
              <Cpu size={12} /> Everything you need
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              One platform.{' '}
              <span className="bg-clip-text text-transparent bg-cyber-gradient">All you need.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              From theory to code to deployment — it&apos;s all inside the AI ROOM.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div {...inView()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Get started in{' '}
              <span className="bg-clip-text text-transparent bg-cyber-gradient">3 steps</span>
            </h2>
            <p className="text-slate-400 text-lg">No setup. No friction. Just learning.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4">
            {STEPS.map((s, i) => (
              <motion.div key={s.step} {...inView(i * 0.1)} className="flex-1 relative">
                <div className="cyber-card p-6 h-full">
                  <div className="text-5xl font-display font-black text-cyber-blue/20 mb-3 select-none">
                    {s.step}
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight size={20} className="text-cyber-blue/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div {...inView(0.3)} className="text-center mt-14">
            <motion.button
              onClick={goToRoom}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 40px rgba(56,189,248,0.45), 0 0 80px rgba(192,132,252,0.2)',
              }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden text-white px-12 py-4 text-lg font-bold rounded-xl inline-flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)' }}
            >
              {/* sweep on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)' }} />
              <Zap size={20} className="text-cyber-green group-hover:text-yellow-300 transition-colors duration-200 relative z-10" />
              <span className="relative z-10 transition-all duration-300 group-hover:tracking-widest">Enter AI ROOM</span>
            </motion.button>
            {!isAuthenticated && (
              <p className="mt-4 text-slate-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-cyber-blue hover:underline">
                  Sign up free
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
