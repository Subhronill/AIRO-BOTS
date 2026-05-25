'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import api, { DashboardStats } from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import Link from 'next/link';
import { Flame, Star, BookOpen, Trophy, Code, Target, TrendingUp, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const xpToNextLevel = ((user?.level || 1) * 1000);
  const currentLevelXp = ((user?.level || 1) - 1) * 1000;
  const xpProgress = user ? ((user.xp - currentLevelXp) / (xpToNextLevel - currentLevelXp)) * 100 : 0;

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
            Welcome back, <span className="text-cyber-blue">{user?.displayName}</span> 👋
          </h1>
          <p className="text-slate-400">Track your progress and continue learning.</p>
        </motion.div>

        {/* Level & XP Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="cyber-card p-6 mb-6 border-cyber-blue/30"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-cyber-gradient flex items-center justify-center text-2xl font-display font-black text-white shadow-neon-blue">
                  {user?.level}
                </div>
                <div className="absolute -top-1 -right-1 bg-cyber-green text-white text-xs font-bold px-1.5 py-0.5 rounded-full">LVL</div>
              </div>
              <div>
                <div className="text-xl font-display font-bold text-white">{user?.displayName}</div>
                <div className="text-cyber-blue font-mono text-sm">{user?.xp.toLocaleString()} XP</div>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="text-center">
                <div className="flex items-center gap-1 text-orange-400 text-2xl font-bold">
                  <Flame size={20} /> {user?.streak}
                </div>
                <div className="text-xs text-slate-400">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-blue">{stats?.stats.completedChapters}</div>
                <div className="text-xs text-slate-400">Chapters Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats?.stats.achievements}</div>
                <div className="text-xs text-slate-400">Achievements</div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Level {user?.level}</span>
              <span>{user ? (user.xp - currentLevelXp) : 0} / {xpToNextLevel - currentLevelXp} XP</span>
              <span>Level {(user?.level || 1) + 1}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <BookOpen size={20} />, label: 'Chapters Done', value: stats?.stats.completedChapters || 0, color: 'text-cyber-blue', border: 'border-cyber-blue/30' },
            { icon: <Trophy size={20} />, label: 'Quizzes Passed', value: stats?.stats.passedQuizzes || 0, color: 'text-yellow-400', border: 'border-yellow-400/30' },
            { icon: <Target size={20} />, label: 'Avg Quiz Score', value: `${stats?.stats.avgScore || 0}%`, color: 'text-cyber-green', border: 'border-cyber-green/30' },
            { icon: <Code size={20} />, label: 'Saved Projects', value: stats?.stats.saves || 0, color: 'text-purple-400', border: 'border-purple-400/30' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
              className={`cyber-card p-4 ${stat.border}`}
            >
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <div className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* XP History Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="cyber-card p-6 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-cyber-blue" />
              <h2 className="font-display font-bold text-white">XP Earned — Last 7 Days</h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats?.xpHistory || []}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0d1b2e', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '8px', color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="xp" stroke="#0ea5e9" fill="url(#xpGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Course Progress */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="cyber-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-cyber-cyan" />
              <h2 className="font-display font-bold text-white">Course Progress</h2>
            </div>
            <div className="space-y-3">
              {(stats?.progressByCourse || []).slice(0, 5).map(course => (
                <div key={course.courseId}>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span className="truncate max-w-32">{course.title}</span>
                    <span>{course.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${course.percentage}%` }} />
                  </div>
                </div>
              ))}
              {(!stats?.progressByCourse || stats.progressByCourse.length === 0) && (
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm">No progress yet</p>
                  <Link href="/learn" className="text-cyber-blue text-sm hover:text-cyber-cyan mt-2 block">Start learning →</Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="cyber-card p-6"
          >
            <h2 className="font-display font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {(stats?.recentActivity || []).slice(0, 6).map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-cyber-gray/30 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-cyber-gray/50 flex items-center justify-center text-sm">
                    {activity.type === 'chapter_complete' ? '📚' : activity.type === 'quiz_attempt' ? '🎯' : '⚡'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white capitalize">{activity.type.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-slate-400">{new Date(activity.createdAt).toLocaleDateString()}</div>
                  </div>
                  {activity.xpGained > 0 && (
                    <span className="xp-badge">+{activity.xpGained} XP</span>
                  )}
                </div>
              ))}
              {!stats?.recentActivity?.length && (
                <p className="text-slate-400 text-sm text-center py-4">No activity yet. Start learning!</p>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="cyber-card p-6"
          >
            <h2 className="font-display font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📚', label: 'Continue Learning', href: '/learn', color: 'border-cyber-blue/30 hover:border-cyber-blue/60 hover:bg-cyber-blue/10' },
                { icon: '⚡', label: 'Open Playground', href: '/playground', color: 'border-cyber-cyan/30 hover:border-cyber-cyan/60 hover:bg-cyber-cyan/10' },
                { icon: '🏆', label: 'Leaderboard', href: '/leaderboard', color: 'border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10' },
                { icon: '🎯', label: 'Take a Quiz', href: '/learn', color: 'border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10' },
              ].map(action => (
                <Link key={action.label} href={action.href}>
                  <div className={`cyber-card p-4 text-center transition-all duration-200 cursor-pointer ${action.color} h-full`}>
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className="text-sm font-medium text-white">{action.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
