'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';
import { Cpu, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  // Redirect already-authenticated users — but only AFTER session check completes
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back! 🚀');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || 'Login failed. Check your credentials.');
    }
  };

  const fillDemo = (role: 'admin' | 'student') => {
    if (role === 'admin') { setEmail('admin@airobots.dev'); setPassword('admin123'); }
    else { setEmail('student@airobots.dev'); setPassword('student123'); }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyber-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="cyber-card p-8 rounded-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyber-gradient mb-4 shadow-neon-blue">
              <Cpu size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-black text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your AIRO BOTS account</p>
          </div>

          {/* Demo credentials */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button onClick={() => fillDemo('student')} className="text-xs px-3 py-2 rounded-lg border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue hover:bg-cyber-blue/20 transition-colors">
              👨‍💻 Demo Student
            </button>
            <button onClick={() => fillDemo('admin')} className="text-xs px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors">
              🔑 Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-cyber-gray/50 border border-cyber-gray-light/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-blue transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-cyber-gray/50 border border-cyber-gray-light/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-blue transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 cyber-btn-primary text-white font-semibold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Sign In →'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            No account?{' '}
            <Link href="/auth/register" className="text-cyber-blue hover:text-cyber-cyan transition-colors font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
