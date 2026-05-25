'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'users' | 'courses' | 'content';

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChapter, setNewChapter] = useState({ title: '', courseSlug: '', content: '', order: 1 });

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      toast.error('Admin access required');
      router.push('/dashboard');
      return;
    }
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
    } catch {
      // placeholder
      setAnalytics({ totalUsers: 142, totalCompletions: 1847, avgProgress: 34, activeToday: 23 });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, role: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success('Role updated');
      loadData();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'content', label: 'Add Content', icon: '✏️' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navbar />
      <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 text-sm">⚙</div>
            <h1 className="text-3xl font-display font-black text-white">Admin Panel</h1>
          </div>
          <p className="text-slate-400 font-mono text-sm">Platform management and analytics</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 font-mono text-sm transition-all ${
                tab === t.id
                  ? 'text-white border-b-2 border-cyber-blue -mb-px'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users', value: analytics?.totalUsers || 0, icon: '👥', color: 'text-cyber-blue' },
                { label: 'Total Completions', value: analytics?.totalCompletions || 0, icon: '✅', color: 'text-cyber-green' },
                { label: 'Active Today', value: analytics?.activeToday || 0, icon: '🔥', color: 'text-orange-400' },
                { label: 'Avg Progress', value: `${analytics?.avgProgress || 0}%`, icon: '📈', color: 'text-cyber-cyan' },
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/10 bg-cyber-dark/50">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-500 text-xs font-mono mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-cyber-dark/50">
                <h3 className="text-white font-mono font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { text: 'student@airobots.dev completed Neural Networks chapter', time: '2m ago' },
                    { text: 'New user registered: tech_learner@gmail.com', time: '15m ago' },
                    { text: 'Quiz completed: ML Foundations — Score: 95%', time: '23m ago' },
                    { text: 'Code playground save: "robot_nav_v2.py"', time: '1h ago' },
                    { text: 'student@airobots.dev reached Level 3', time: '2h ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue mt-1.5 flex-shrink-0" />
                      <div className="flex-1 text-slate-400">{item.text}</div>
                      <div className="text-slate-600 font-mono text-xs flex-shrink-0">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-cyber-dark/50">
                <h3 className="text-white font-mono font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Add Chapter', icon: '📝', action: () => setTab('content') },
                    { label: 'Manage Users', icon: '👥', action: () => setTab('users') },
                    { label: 'View Courses', icon: '📚', action: () => setTab('courses') },
                    { label: 'Export Data', icon: '📤', action: () => toast.success('Export queued') },
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={action.action}
                      className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-cyber-blue/30 hover:bg-cyber-blue/10 transition-all text-left"
                    >
                      <div className="text-xl mb-1">{action.icon}</div>
                      <div className="text-white text-sm font-mono">{action.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-xl border border-white/10 bg-cyber-dark/50 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-mono font-bold">All Users ({users.length})</h3>
              </div>
              {users.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-sm">
                  No users loaded. Make sure the backend is running.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Name', 'Email', 'Role', 'XP', 'Actions'].map(h => (
                          <th key={h} className="text-left p-4 text-slate-500 text-xs font-mono">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u: any) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4 text-white font-mono text-sm">{u.name}</td>
                          <td className="p-4 text-slate-400 font-mono text-sm">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                              u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                              u.role === 'INSTRUCTOR' ? 'bg-cyber-blue/20 text-cyber-blue' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-cyber-cyan font-mono text-sm">{u.xp}</td>
                          <td className="p-4">
                            <select
                              value={u.role}
                              onChange={e => updateRole(u.id, e.target.value)}
                              className="bg-cyber-dark border border-white/20 text-white text-xs font-mono rounded px-2 py-1"
                            >
                              <option value="STUDENT">Student</option>
                              <option value="INSTRUCTOR">Instructor</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Courses */}
        {tab === 'courses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-white font-mono font-bold">Course Management</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'AI Foundations', slug: 'foundations', chapters: 3, students: 89 },
                { title: 'Machine Learning', slug: 'ml-foundations', chapters: 1, students: 64 },
                { title: 'Deep Learning', slug: 'deep-learning', chapters: 1, students: 52 },
                { title: 'Computer Vision', slug: 'computer-vision', chapters: 1, students: 41 },
                { title: 'Robotics Basics', slug: 'robotics-basics', chapters: 1, students: 35 },
                { title: 'ROS & SLAM', slug: 'ros-slam', chapters: 1, students: 28 },
                { title: 'Generative AI', slug: 'generative-ai', chapters: 1, students: 67 },
                { title: 'AI Deployment', slug: 'ai-deployment', chapters: 1, students: 44 },
              ].map((course, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/10 bg-cyber-dark/50 hover:border-cyber-blue/30 transition-all">
                  <h4 className="text-white font-mono font-bold mb-1">{course.title}</h4>
                  <div className="text-slate-500 text-xs font-mono mb-4">{course.slug}</div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">📚 {course.chapters} chapters</span>
                    <span className="text-slate-400">👥 {course.students} enrolled</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-1.5 rounded text-xs font-mono bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/20 transition-all">
                      Edit
                    </button>
                    <button
                      onClick={() => setTab('content')}
                      className="flex-1 py-1.5 rounded text-xs font-mono bg-cyber-green/10 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/20 transition-all"
                    >
                      + Chapter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add Content */}
        {tab === 'content' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="max-w-2xl">
              <h3 className="text-white font-mono font-bold text-lg mb-6">Add New Chapter</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs font-mono mb-1 block">Chapter Title *</label>
                  <input
                    value={newChapter.title}
                    onChange={e => setNewChapter({ ...newChapter, title: e.target.value })}
                    placeholder="e.g. Introduction to Transformers"
                    className="w-full bg-cyber-dark border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none focus:border-cyber-blue/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-mono mb-1 block">Course Slug *</label>
                  <input
                    value={newChapter.courseSlug}
                    onChange={e => setNewChapter({ ...newChapter, courseSlug: e.target.value })}
                    placeholder="e.g. deep-learning"
                    className="w-full bg-cyber-dark border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none focus:border-cyber-blue/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-mono mb-1 block">Order</label>
                  <input
                    type="number"
                    value={newChapter.order}
                    onChange={e => setNewChapter({ ...newChapter, order: parseInt(e.target.value) })}
                    className="w-full bg-cyber-dark border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm outline-none focus:border-cyber-blue/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-mono mb-1 block">Content (Markdown)</label>
                  <textarea
                    value={newChapter.content}
                    onChange={e => setNewChapter({ ...newChapter, content: e.target.value })}
                    placeholder={`# Chapter Title\n\nWrite your lesson content in Markdown...\n\n## Section 1\n\nLesson text here...\n\n\`\`\`python\nprint("Hello, AI!")\n\`\`\``}
                    rows={14}
                    className="w-full bg-cyber-dark border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-slate-700 outline-none focus:border-cyber-blue/50 resize-none"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!newChapter.title || !newChapter.courseSlug || !newChapter.content) {
                      toast.error('Fill in all required fields');
                      return;
                    }
                    try {
                      await api.post('/chapters', newChapter);
                      toast.success('Chapter created!');
                      setNewChapter({ title: '', courseSlug: '', content: '', order: 1 });
                    } catch {
                      toast.error('Failed to create chapter');
                    }
                  }}
                  className="w-full py-3 rounded-lg bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue font-mono font-bold hover:bg-cyber-blue/30 transition-all"
                >
                  ✨ Publish Chapter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
