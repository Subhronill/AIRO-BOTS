'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import api, { Course } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Cpu, ChevronRight, Lock, Zap } from 'lucide-react';

const LEVEL_COLORS: Record<number, string> = {
  0: '#22c55e', 1: '#0ea5e9', 2: '#06b6d4', 3: '#a855f7',
  4: '#ec4899', 5: '#f59e0b', 6: '#ef4444', 7: '#8b5cf6', 8: '#14b8a6',
};

const LEVEL_LABELS: Record<number, string> = {
  0: 'Beginner', 1: 'Fundamentals', 2: 'Intermediate', 3: 'Advanced',
  4: 'Expert', 5: 'Robotics', 6: 'Autonomous', 7: 'Pro', 8: 'Master',
};

export default function AIRoomPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login?redirect=/ai-room');
      return;
    }
    api.get('/courses')
      .then(({ data }) => setCourses(data))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  // Redirect splash while navigating
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Lock size={48} className="text-cyber-blue/50 mx-auto" />
          <p className="text-slate-500 font-mono text-sm">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-12"
        >
          {/* Room badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-xs font-mono mb-5">
            <Cpu size={12} />
            AI ROOM
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-3 leading-tight">
            Welcome back,{' '}
            <span className="bg-clip-text text-transparent bg-cyber-gradient">
              {user?.displayName || 'Student'}
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl">
            Your AI &amp; Robotics learning hub. All courses, quizzes, and material — right here.
          </p>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-gray/30 border border-cyber-gray/50">
              <Zap size={14} className="text-cyber-green" />
              <span className="text-sm text-slate-300 font-mono">{user?.xp ?? 0} XP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-gray/30 border border-cyber-gray/50">
              <span className="text-sm text-slate-300 font-mono">Level {user?.level ?? 1}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-gray/30 border border-cyber-gray/50">
              <span className="text-sm text-slate-300 font-mono">🔥 {user?.streak ?? 0} day streak</span>
            </div>
          </div>
        </motion.div>

        {/* Section label */}
        <div className="mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            All Learning Paths
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Structured from beginner to expert — progress at your own pace.
          </p>
        </div>

        {/* Course grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="cyber-card p-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-cyber-gray/50 mb-4" />
                <div className="h-6 bg-cyber-gray/50 rounded mb-2 w-3/4" />
                <div className="h-4 bg-cyber-gray/30 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-500 text-lg">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => {
              const color = LEVEL_COLORS[course.level] ?? '#0ea5e9';
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/learn/${course.slug}`}>
                    <div
                      className="cyber-card p-6 h-full cursor-pointer transition-all duration-300 hover:shadow-lg"
                      style={{ borderColor: `${color}35` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{course.icon}</div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className="text-xs font-mono px-2 py-0.5 rounded-full"
                            style={{
                              background: `${color}1a`,
                              color,
                              border: `1px solid ${color}30`,
                            }}
                          >
                            Level {course.level}
                          </span>
                          <span className="text-xs text-slate-500">
                            {LEVEL_LABELS[course.level]}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-display font-bold text-white mb-2">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-5 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-mono">
                          {course._count?.chapters ?? 0} chapters
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs font-semibold"
                          style={{ color }}
                        >
                          Start Learning <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
