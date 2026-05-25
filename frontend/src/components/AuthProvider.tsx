'use client';
/**
 * AuthProvider
 * Validates the stored session against the server on every app load.
 * Placed in layout.tsx so it runs once, before any page renders content.
 */
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth      = useAuthStore(s => s.initAuth);
  const isInitialized = useAuthStore(s => s.isInitialized);

  useEffect(() => {
    // Fire once on mount — validates token, refreshes if needed, or clears if expired
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * While the session check is in flight we don't block rendering —
   * pages that need auth already guard themselves.  A full-page spinner
   * here would cause a noticeable flash on every navigation.
   */
  return <>{children}</>;
}
