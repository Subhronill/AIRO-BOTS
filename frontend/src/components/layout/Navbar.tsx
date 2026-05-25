'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Menu, X, Cpu, ChevronDown, Zap, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-warm the two most common destinations so clicks feel instant
  useEffect(() => {
    router.prefetch('/ai-room');
    router.prefetch('/auth/login');
    router.prefetch('/playground');
    router.prefetch('/leaderboard');
  }, [router]);

  const handleAIRoom = () => {
    setMobileOpen(false);
    if (isAuthenticated) {
      router.push('/ai-room');
    } else {
      router.push('/auth/login?redirect=/ai-room');
    }
  };

  // Secondary links (always visible)
  const secondaryLinks = [
    { href: '/playground', label: 'Playground' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-panel shadow-neon-blue/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-cyber-gradient flex items-center justify-center shadow-neon-blue">
                <Cpu size={20} className="text-white" />
              </div>
              <div className="absolute -inset-1 rounded-lg bg-cyber-gradient opacity-0 group-hover:opacity-30 blur transition-opacity" />
            </div>
            <div>
              <span className="font-display font-black text-xl text-white tracking-wider">AIRO</span>
              <span className="text-cyber-blue font-display font-bold text-xl tracking-widest"> BOTS</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* AI ROOM — primary highlighted link */}
            <button
              onClick={handleAIRoom}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-cyber-blue hover:text-white hover:bg-cyber-blue/15 transition-all border border-cyber-blue/20 hover:border-cyber-blue/50 mr-2"
            >
              <Zap size={14} className="text-cyber-green" />
              AI ROOM
            </button>

            {secondaryLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-slate-300 hover:text-cyber-blue transition-colors text-sm font-medium rounded-lg hover:bg-cyber-blue/10"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme toggle — desktop */}
          <div className="hidden md:flex items-center">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-cyber-blue/20 hover:border-cyber-blue/50 bg-cyber-blue/5 hover:bg-cyber-blue/10 transition-all relative overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                    exit={{    rotate: 90,  opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sun size={15} className="text-amber-400" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90,  opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                    exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Moon size={15} className="text-cyber-blue" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyber-gray/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-cyber-gradient flex items-center justify-center text-white font-bold text-sm">
                    {user.displayName[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{user.displayName}</div>
                    <div className="text-xs text-cyber-blue font-mono">Lv.{user.level} · {user.xp} XP</div>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 cyber-card rounded-xl shadow-neon-blue/20 py-1"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-cyber-gray/50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-cyber-gray/50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-cyber-purple hover:text-purple-300 hover:bg-cyber-gray/50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="border-cyber-gray/50 my-1" />
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="cyber-btn-primary text-white text-sm px-5 py-2">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-cyber-gray/50"
          >
            <div className="px-4 py-4 space-y-2">
              {/* AI ROOM — top of mobile menu */}
              <button
                onClick={handleAIRoom}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-cyber-blue font-semibold bg-cyber-blue/10 border border-cyber-blue/20 text-sm"
              >
                <Zap size={14} className="text-cyber-green" />
                AI ROOM
              </button>

              {secondaryLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-cyber-gray/50 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Theme toggle — mobile */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-cyber-blue/20 bg-cyber-blue/5 hover:bg-cyber-blue/10 transition-all text-sm"
              >
                {theme === 'dark'
                  ? <Sun size={14} className="text-amber-400" />
                  : <Moon size={14} className="text-cyber-blue" />
                }
                <span className="text-slate-300">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              <hr className="border-cyber-gray/50 my-2" />

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-slate-300 hover:text-white text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-slate-300 hover:text-white text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-red-400 text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-slate-300 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 text-cyber-blue font-medium text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
