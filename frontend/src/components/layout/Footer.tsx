'use client';
import Link from 'next/link';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cyber-gray/50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyber-gradient flex items-center justify-center">
                <Cpu size={16} className="text-white" />
              </div>
              <span className="font-display font-black text-white">AIRO <span className="text-cyber-blue">BOTS</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The ultimate platform for learning AI, Machine Learning, Deep Learning, and Robotics.
            </p>
          </div>
          {[
            {
              title: 'Platform',
              links: [{ label: 'AI ROOM', href: '/ai-room' }, { label: 'Playground', href: '/playground' }, { label: 'Roadmap', href: '/roadmap' }, { label: 'Leaderboard', href: '/leaderboard' }],
            },
            {
              title: 'Topics',
              links: [{ label: 'Machine Learning', href: '/learn' }, { label: 'Deep Learning', href: '/learn' }, { label: 'Robotics', href: '/learn' }, { label: 'ROS & SLAM', href: '/learn' }],
            },
            {
              title: 'Account',
              links: [{ label: 'Sign Up Free', href: '/auth/register' }, { label: 'Sign In', href: '/auth/login' }, { label: 'Dashboard', href: '/dashboard' }],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-4 font-mono text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-cyber-blue transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-cyber-gray/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2024 AIRO BOTS. All rights reserved.</p>
          <p className="text-sm text-slate-500 font-mono">
            Built for <span className="text-cyber-blue">AI Engineers</span> of the future
          </p>
        </div>
      </div>
    </footer>
  );
}
