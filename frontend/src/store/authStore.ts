import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, {
  User,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  registerForcedLogoutHandler,
} from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** True once initAuth() has finished its first run */
  isInitialized: boolean;

  /** Called once on app mount — validates stored tokens with the server */
  initAuth: () => Promise<void>;
  login:    (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string; displayName: string }) => Promise<void>;
  logout:   () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser:  (user: Partial<User>) => void;
  /** Internal: called by the forced-logout handler in api.ts */
  _clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Register forced-logout hook with api.ts (no circular import)
      // This runs once when the module is first imported
      if (typeof window !== 'undefined') {
        registerForcedLogoutHandler(() => get()._clearSession());
      }

      return {
        user:            null,
        isAuthenticated: false,
        isLoading:       false,
        isInitialized:   false,

        /* ── Session bootstrap ────────────────────────────────────────────── */
        initAuth: async () => {
          if (typeof window === 'undefined') return; // SSR guard

          const hasTokens = !!(getAccessToken() || getRefreshToken());
          if (!hasTokens) {
            set({ user: null, isAuthenticated: false, isInitialized: true });
            return;
          }

          set({ isLoading: true });
          try {
            // api.ts interceptor silently refreshes the access token if expired
            const { data } = await api.get<User>('/auth/me');
            set({ user: data, isAuthenticated: true, isLoading: false, isInitialized: true });
          } catch {
            // Both tokens expired or revoked — clean slate
            clearTokens();
            set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
          }
        },

        /* ── Login ───────────────────────────────────────────────────────── */
        login: async (email, password) => {
          set({ isLoading: true });
          try {
            const { data } = await api.post('/auth/login', { email, password });
            saveTokens(data.accessToken, data.refreshToken);
            set({
              user:            data.user,
              isAuthenticated: true,
              isLoading:       false,
            });
          } catch (err) {
            set({ isLoading: false });
            throw err;
          }
        },

        /* ── Register ────────────────────────────────────────────────────── */
        register: async (userData) => {
          set({ isLoading: true });
          try {
            const { data } = await api.post('/auth/register', userData);
            saveTokens(data.accessToken, data.refreshToken);
            set({
              user:            data.user,
              isAuthenticated: true,
              isLoading:       false,
            });
          } catch (err) {
            set({ isLoading: false });
            throw err;
          }
        },

        /* ── Logout ──────────────────────────────────────────────────────── */
        logout: async () => {
          try {
            const refreshToken = getRefreshToken();
            await api.post('/auth/logout', { refreshToken });
          } catch { /* best-effort — always clear local state */ }
          clearTokens();
          set({ user: null, isAuthenticated: false });
        },

        /* ── Refresh user profile from server ────────────────────────────── */
        refreshUser: async () => {
          try {
            const { data } = await api.get<User>('/auth/me');
            set({ user: data, isAuthenticated: true });
          } catch {
            // Keep current state; don't force logout on a transient error
          }
        },

        /* ── Partial user update (optimistic) ────────────────────────────── */
        updateUser: (userData) => {
          set(state => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        },

        /* ── Internal: forced logout from api.ts ─────────────────────────── */
        _clearSession: () => {
          set({ user: null, isAuthenticated: false });
        },
      };
    },
    {
      name: 'airo-auth',
      // Persist only user profile + auth flag — tokens live in plain localStorage keys
      partialize: (state) => ({
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
