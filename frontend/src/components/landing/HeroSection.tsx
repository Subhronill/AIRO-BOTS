'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  speed: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.6 + 0.1,
}));

const FLOATING_WORDS = ['Python', 'TensorFlow', 'PyTorch', 'ROS2', 'SLAM', 'CNN', 'LLM', 'Transformer', 'Numpy', 'OpenCV', 'RL', 'GANs', 'YOLO', 'BERT', 'Arduino', 'RPi'];

export default function HeroSection() {
  const [activeWord, setActiveWord] = useState(0);
  const words = ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Robotics', 'Computer Vision', 'Generative AI'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord(prev => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg animate-grid-move" />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyber-blue"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [p.opacity, p.opacity * 0.3, p.opacity],
            }}
            transition={{
              duration: p.speed * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Floating tech words */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_WORDS.map((word, i) => (
          <motion.div
            key={word}
            className="absolute text-xs font-mono text-cyber-blue/20 whitespace-nowrap"
            style={{
              left: `${(i * 6.25) % 100}%`,
              top: `${15 + (i * 17) % 70}%`,
            }}
            animate={{ y: [-10, 10, -10], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-sm font-mono mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
          v2.0 — The Future of AI Education is Here
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-white leading-none mb-4 tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-cyber-gradient">AIRO</span>
          {' '}<span className="text-white">BOTS</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl md:text-3xl font-display font-light text-slate-300 mb-6 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-h-[3rem]"
        >
          <span>Master</span>
          <span className="text-cyber-cyan font-semibold text-center sm:text-left sm:min-w-64">
            <AnimatedWord words={words} activeIndex={activeWord} />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          The most comprehensive platform for learning AI, ML, Deep Learning, and Robotics.
          From <strong className="text-white">absolute zero</strong> to{' '}
          <strong className="text-cyber-blue">production-ready mastery</strong>.
          Hands-on labs, real code, and actual robots.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link href="/auth/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-btn-primary text-white px-10 py-4 text-lg font-bold tracking-wide"
            >
              🚀 Launch Your Journey — Free
            </motion.button>
          </Link>
          <Link href="/playground">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-btn text-cyber-cyan px-10 py-4 text-lg"
            >
              ⚡ Try Playground
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { value: '8', label: 'Learning Tracks', color: 'text-cyber-blue' },
            { value: '50+', label: 'Chapters', color: 'text-cyber-cyan' },
            { value: '200+', label: 'Code Exercises', color: 'text-cyber-purple' },
            { value: '∞', label: 'Possibilities', color: 'text-cyber-green' },
          ].map(stat => (
            <div key={stat.label} className="cyber-card p-4 min-w-32">
              <div className={`text-3xl font-display font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-cyber-blue/30 flex items-start justify-center pt-2"
          >
            <div className="w-1.5 h-3 rounded-full bg-cyber-blue animate-pulse" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedWord({ words, activeIndex }: { words: string[]; activeIndex: number }) {
  return (
    <motion.span
      key={activeIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {words[activeIndex]}
    </motion.span>
  );
}
