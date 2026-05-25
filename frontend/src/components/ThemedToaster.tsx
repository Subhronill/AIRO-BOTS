'use client';
/**
 * ThemedToaster — a thin wrapper around react-hot-toast's <Toaster> that
 * reads the current theme and passes matching inline styles. This is needed
 * because react-hot-toast uses JS-driven inline styles that CSS cannot override.
 */
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '../store/themeStore';

export default function ThemedToaster() {
  const theme = useThemeStore(s => s.theme);
  const isLight = theme === 'light';

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isLight ? '#ffffff' : '#0d1b2e',
          color:      isLight ? '#0f172a' : '#e2e8f0',
          border:     '1px solid rgba(14, 165, 233, 0.3)',
          boxShadow:  isLight
            ? '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(14,165,233,0.08)'
            : '0 4px 24px rgba(14,165,233,0.1)',
        },
        success: {
          iconTheme: {
            primary:   '#22c55e',
            secondary: isLight ? '#ffffff' : '#0d1b2e',
          },
        },
        error: {
          iconTheme: {
            primary:   '#ef4444',
            secondary: isLight ? '#ffffff' : '#0d1b2e',
          },
        },
      }}
    />
  );
}
