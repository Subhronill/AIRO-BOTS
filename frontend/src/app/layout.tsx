import type { Metadata } from 'next';
import './globals.css';
import TransitionWrapper from '../components/layout/TransitionWrapper';
import AuthProvider from '../components/AuthProvider';
import ThemeProvider from '../components/ThemeProvider';
import ThemedToaster from '../components/ThemedToaster';

export const metadata: Metadata = {
  title: 'AIRO BOTS — AI & Robotics Academy',
  description: 'The most advanced platform for learning Artificial Intelligence, Machine Learning, Deep Learning, and Robotics — from zero to mastery.',
  keywords: 'AI, robotics, machine learning, deep learning, NLP, computer vision, ROS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        {/*
          Anti-FOUC script — runs synchronously before React hydrates so
          the correct theme class/attribute is set from the very first paint.
          Must stay inline (no defer / async).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('airo-theme');var t=s&&JSON.parse(s).state&&JSON.parse(s).state.theme;var el=document.documentElement;if(t==='light'){el.classList.remove('dark');el.setAttribute('data-theme','light');}else{el.classList.add('dark');el.setAttribute('data-theme','dark');}}catch(e){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cyber-black text-slate-200 font-body antialiased">
        <ThemeProvider>
          <AuthProvider>
            <TransitionWrapper>{children}</TransitionWrapper>
          </AuthProvider>
        </ThemeProvider>
        <ThemedToaster />
      </body>
    </html>
  );
}
