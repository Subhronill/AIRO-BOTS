'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const RANK_COLORS: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

const RANK_BG: Record<number, string> = {
  1: 'bg-yellow-400/10 border-yellow-400/30',
  2: 'bg-slate-400/10 border-slate-400/30',
  3: 'bg-amber-600/10 border-amber-600/30',
};

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await api.get('/users/leaderboard');
      setLeaders(res.data);
    } catch {
      // Use placeholder data if backend not available
      setLeaders([
        { id: '1', name: 'Neural_Ninja', xp: 15420, level: 8, completedChapters: 47, streak: 42, avatarUrl: null },
        { id: '2', name: 'RoboMaster_X', xp: 12980, level: 7, completedChapters: 39, streak: 28, avatarUrl: null },
        { id: '3', name: 'DeepLearner99', xp: 11340, level: 7, completedChapters: 35, streak: 21, avatarUrl: null },
        { id: '4', name: 'AIArchitect', xp: 9870, level: 6, completedChapters: 31, streak: 15, avatarUrl: null },
        { id: '5', name: 'CyberBot2077', xp: 8520, level: 6, completedChapters: 28, streak: 33, avatarUrl: null },
        { id: '6', name: 'TensorWizard', xp: 7640, level: 5, completedChapters: 24, streak: 12, avatarUrl: null },
        { id: '7', name: 'SlAMninja', xp: 6910, level: 5, completedChapters: 22, streak: 8, avatarUrl: null },
        { id: '8', name: 'EdgeAIHero', xp: 5830, level: 4, completedChapters: 19, streak: 19, avatarUrl: null },
        { id: '9', name: 'ROSPioneer', xp: 4720, level: 4, completedChapters: 16, streak: 7, avatarUrl: null },
        { id: '10', name: 'MLPathfinder', xp: 3910, level: 3, completedChapters: 13, streak: 5, avatarUrl: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => name?.slice(0, 2).toUpperCase() || '??';

  const xpBar = (xp: number, maxXp: number) => Math.min((xp / maxXp) * 100, 100);

  const maxXp = leaders[0]?.xp || 1;

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Live Rankings
          </div>
          <h1 className="text-5xl font-display font-black text-white mb-4">
            🏆{' '}
            <span className="bg-clip-text text-transparent bg-cyber-gradient">Leaderboard</span>
          </h1>
          <p className="text-slate-400 text-lg">The top AI & Robotics engineers on the platform.</p>
        </motion.div>

        {/* Top 3 podium */}
        {leaders.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-end justify-center gap-4 mb-12"
          >
            {[leaders[1], leaders[0], leaders[2]].map((leader, idx) => {
              const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const heights = ['h-32', 'h-40', 'h-28'];
              return (
                <div key={leader.id} className="flex flex-col items-center">
                  <div className="text-2xl mb-2">{RANK_ICONS[rank]}</div>
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-black mb-2 ${
                    rank === 1 ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400' :
                    rank === 2 ? 'border-slate-400 bg-slate-400/20 text-slate-300' :
                    'border-amber-600 bg-amber-600/20 text-amber-500'
                  }`}>
                    {getInitials(leader.name)}
                  </div>
                  <div className="text-white text-sm font-mono font-bold mb-1 text-center">{leader.name}</div>
                  <div className="text-xs text-slate-400 font-mono mb-2">{leader.xp.toLocaleString()} XP</div>
                  <div className={`w-20 ${heights[idx]} rounded-t-lg ${
                    rank === 1 ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' :
                    rank === 2 ? 'bg-gradient-to-t from-slate-700 to-slate-500' :
                    'bg-gradient-to-t from-amber-800 to-amber-600'
                  } flex items-start justify-center pt-2`}>
                    <span className="text-black font-black text-xl">#{rank}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {leaders.map((leader, idx) => {
            const rank = idx + 1;
            const isMe = user?.id === leader.id;
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={`relative p-4 rounded-xl border transition-all ${
                  isMe
                    ? 'border-cyber-blue/50 bg-cyber-blue/10'
                    : rank <= 3
                    ? `${RANK_BG[rank]} hover:opacity-90`
                    : 'border-white/10 bg-cyber-dark/50 hover:border-white/20'
                }`}
              >
                {isMe && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-cyber-blue rounded-full text-xs text-black font-bold font-mono">YOU</div>
                )}
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 text-center font-mono font-black text-lg ${RANK_COLORS[rank] || 'text-slate-500'}`}>
                    {rank <= 3 ? RANK_ICONS[rank] : `#${rank}`}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-black flex-shrink-0 ${
                    rank === 1 ? 'border-yellow-400/50 bg-yellow-400/20 text-yellow-400' :
                    rank === 2 ? 'border-slate-400/50 bg-slate-400/20 text-slate-300' :
                    rank === 3 ? 'border-amber-600/50 bg-amber-600/20 text-amber-500' :
                    'border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue'
                  }`}>
                    {getInitials(leader.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-mono font-bold text-sm">{leader.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue font-mono">
                        Lv.{leader.level || Math.floor(leader.xp / 2000)}
                      </span>
                      {leader.streak > 20 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono">
                          🔥 {leader.streak}d
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${xpBar(leader.xp, maxXp)}%` }}
                          transition={{ delay: 0.1 * idx, duration: 0.5 }}
                          className={`h-full rounded-full ${
                            rank === 1 ? 'bg-yellow-400' :
                            rank === 2 ? 'bg-slate-400' :
                            rank === 3 ? 'bg-amber-500' :
                            'bg-cyber-blue'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 text-right">
                    <div>
                      <div className="text-white font-mono text-sm font-bold">{leader.completedChapters || Math.floor(leader.xp / 300)}</div>
                      <div className="text-slate-600 text-xs font-mono">chapters</div>
                    </div>
                    <div>
                      <div className="text-white font-mono text-sm font-bold">🔥 {leader.streak || Math.floor(Math.random() * 30 + 1)}d</div>
                      <div className="text-slate-600 text-xs font-mono">streak</div>
                    </div>
                    <div>
                      <div className={`font-mono text-sm font-bold ${RANK_COLORS[rank] || 'text-cyber-cyan'}`}>
                        {leader.xp.toLocaleString()} XP
                      </div>
                      <div className="text-slate-600 text-xs font-mono">total</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* My rank placeholder if not in top */}
        {user && !leaders.find(l => l.id === user.id) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 rounded-xl border border-cyber-blue/30 bg-cyber-blue/10"
          >
            <div className="flex items-center gap-4">
              <div className="text-slate-500 font-mono font-black text-lg">#?</div>
              <div className="w-10 h-10 rounded-full border border-cyber-blue/50 bg-cyber-blue/20 flex items-center justify-center text-cyber-blue font-black text-sm">
                {getInitials(user.name)}
              </div>
              <div className="flex-1">
                <div className="text-white font-mono font-bold text-sm">{user.name} (You)</div>
                <div className="text-slate-500 text-xs font-mono">Keep learning to climb the rankings!</div>
              </div>
              <div className="text-cyber-blue font-mono text-sm font-bold">{user.xp || 0} XP</div>
            </div>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: '📚', title: 'Complete Chapters', desc: 'Each chapter gives 100 XP. More chapters = higher rank.' },
            { icon: '✅', title: 'Pass Quizzes', desc: 'Perfect quiz scores give bonus XP. Accuracy matters.' },
            { icon: '🔥', title: 'Build Streaks', desc: 'Daily streaks multiply XP gains. Stay consistent.' },
          ].map((tip, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/10 bg-cyber-dark/50 text-center">
              <div className="text-2xl mb-2">{tip.icon}</div>
              <div className="text-white font-mono text-sm font-bold mb-1">{tip.title}</div>
              <div className="text-slate-500 text-xs">{tip.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
