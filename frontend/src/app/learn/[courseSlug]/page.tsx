'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import api, { Course } from '../../../lib/api';
import { ChevronRight, CheckCircle, Lock, Star } from 'lucide-react';

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: '#22c55e', INTERMEDIATE: '#0ea5e9', ADVANCED: '#a855f7', EXPERT: '#ef4444',
};

export default function CoursePage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/courses/${courseSlug}`);
        setCourse(data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
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

  const totalChapters  = course.chapters?.length ?? 0;
  const completedCount = course.chapters?.filter(ch => ch.isCompleted).length ?? 0;
  const completionPct  = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/learn" className="hover:text-cyber-blue transition-colors">Courses</Link>
          <ChevronRight size={14} />
          <span className="text-white">{course.title}</span>
        </div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-8 mb-8 border-cyber-blue/30"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-6xl">{course.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
                  Level {course.level}
                </span>
              </div>
              <h1 className="text-3xl font-display font-black text-white mb-3">{course.title}</h1>
              <p className="text-slate-400 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">{totalChapters} chapters</span>
                {completedCount > 0 && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-cyber-green">{completedCount} completed</span>
                  </>
                )}
              </div>
            </div>

            {/* Progress ring — only shown once user has progress */}
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

        {/* Chapter list */}
        <div className="space-y-3">
          <h2 className="text-xl font-display font-bold text-white mb-4">Chapters</h2>

          {course.chapters?.map((chapter, i) => {
            const isCompleted = chapter.isCompleted ?? false;
            // First chapter always unlocked client-side as a fallback
            const isUnlocked  = chapter.isUnlocked  ?? (i === 0);
            const diffColor   = DIFFICULTY_COLORS[chapter.difficulty] ?? '#64748b';

            const card = (
              <div className={[
                'cyber-card p-5 flex items-center gap-4 transition-all duration-200',
                isUnlocked && !isCompleted ? 'cursor-pointer hover:shadow-neon-blue/20 hover:border-cyber-blue/40' : '',
                isCompleted               ? 'border-cyber-green/30'                                                 : '',
                !isUnlocked               ? 'opacity-50 cursor-not-allowed'                                        : '',
              ].join(' ')}>

                {/* Index / status bubble */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                  style={{
                    background: isCompleted ? 'rgba(34,197,94,0.15)'   : !isUnlocked ? 'rgba(100,116,139,0.08)' : 'rgba(14,165,233,0.10)',
                    color:      isCompleted ? '#22c55e'                 : !isUnlocked ? '#475569'                : '#0ea5e9',
                    border:    `1px solid ${isCompleted ? 'rgba(34,197,94,0.3)' : !isUnlocked ? 'rgba(100,116,139,0.15)' : 'rgba(14,165,233,0.2)'}`,
                  }}
                >
                  {isCompleted ? <CheckCircle size={18} /> : !isUnlocked ? <Lock size={15} /> : i + 1}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-slate-400 truncate">
                    {!isUnlocked
                      ? 'Complete the previous chapter to unlock'
                      : chapter.description}
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

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {isUnlocked
                  ? <Link href={`/learn/${courseSlug}/${chapter.slug}`}>{card}</Link>
                  : card}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
