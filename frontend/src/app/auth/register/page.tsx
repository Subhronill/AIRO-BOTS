'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';
import { Cpu, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '' });
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created! Welcome to AIRO BOTS! 🚀');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="cyber-card p-6 sm:p-8 rounded-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyber-gradient mb-4 shadow-neon-blue">
              <Cpu size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-black text-white">Join AIRO BOTS</h1>
            <p className="text-slate-400 text-sm mt-1">Start your AI & Robotics journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'displayName', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
              { key: 'username', label: 'Username', placeholder: 'john_ai', type: 'text' },
              { key: 'email', label: 'Email', placeholder: 'john@email.com', type: 'email' },
              { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-gray/50 border border-cyber-gray-light/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-blue transition-colors"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 cyber-btn-primary text-white font-semibold text-sm rounded-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Account — Free →'}
            </motion.button>
          </form>

          <div className="mt-4 p-3 rounded-lg bg-cyber-green/10 border border-cyber-green/20 text-xs text-cyber-green text-center">
            🎁 Free forever • No credit card • Instant access
          </div>

          <p className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-cyber-blue hover:text-cyber-cyan transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
