'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import api, { Course } from '../../lib/api';
import { BookOpen, ChevronRight } from 'lucide-react';

const LEVEL_COLORS: Record<number, string> = {
  0: '#22c55e', 1: '#0ea5e9', 2: '#06b6d4', 3: '#a855f7',
  4: '#ec4899', 5: '#f59e0b', 6: '#ef4444', 7: '#8b5cf6', 8: '#14b8a6',
};

const LEVEL_LABELS: Record<number, string> = {
  0: 'Beginner', 1: 'Fundamentals', 2: 'Intermediate', 3: 'Advanced',
  4: 'Expert', 5: 'Robotics', 6: 'Autonomous', 7: 'Pro', 8: 'Master',
};

export default function LearnPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then(({ data }) => setCourses(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-20 sm:pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue text-xs font-mono mb-4">
            <BookOpen size={12} />
            Learning Paths
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white mb-3">
            AI & Robotics <span className="text-cyber-blue">Courses</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl">
            Structured learning paths from complete beginner to AI deployment expert.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="cyber-card p-4 sm:p-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-cyber-gray/50 mb-4" />
                <div className="h-6 bg-cyber-gray/50 rounded mb-2" />
                <div className="h-4 bg-cyber-gray/30 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course, i) => {
              const color = LEVEL_COLORS[course.level] || '#0ea5e9';
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/learn/${course.slug}`}>
                    <div className="cyber-card p-4 sm:p-6 h-full cursor-pointer transition-all duration-300 hover:shadow-neon-blue/30"
                      style={{ borderColor: `${color}30` }}
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="text-3xl sm:text-4xl">{course.icon}</div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
                            Level {course.level}
                          </span>
                          <span className="text-xs text-slate-500">{LEVEL_LABELS[course.level]}</span>
                        </div>
                      </div>
                      <h3 className="text-base sm:text-xl font-display font-bold text-white mb-2">{course.title}</h3>
                      <p className="text-slate-400 text-sm mb-3 sm:mb-4 leading-relaxed">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-mono">
                          {course._count?.chapters || 0} chapters
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
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
