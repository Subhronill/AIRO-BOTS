'use client';
/**
 * ThemeProvider
 * Syncs the Zustand theme store to the <html> element's class list and
 * data-theme attribute on every change. Runs client-side only.
 *
 * The layout.tsx <head> script prevents the initial Flash of Wrong Theme (FOWT)
 * by reading localStorage synchronously before React hydrates.
 */
import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore(s => s.theme);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    } else {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  return <>{children}</>;
}
