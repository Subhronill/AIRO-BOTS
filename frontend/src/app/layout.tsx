import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import TransitionWrapper from '../components/layout/TransitionWrapper';

export const metadata: Metadata = {
  title: 'AIRO BOTS — AI & Robotics Academy',
  description: 'The most advanced platform for learning Artificial Intelligence, Machine Learning, Deep Learning, and Robotics — from zero to mastery.',
  keywords: 'AI, robotics, machine learning, deep learning, NLP, computer vision, ROS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cyber-black text-slate-200 font-body antialiased">
        <TransitionWrapper>{children}</TransitionWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1b2e',
              color: '#e2e8f0',
              border: '1px solid rgba(14, 165, 233, 0.3)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0d1b2e' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0d1b2e' } },
          }}
        />
      </body>
    </html>
  );
}
