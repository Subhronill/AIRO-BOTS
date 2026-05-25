import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/* ─── Token storage helpers ────────────────────────────────────────────────── */
export const getAccessToken  = () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken')  : null);
export const getRefreshToken = () => (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken',  accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/* ─── Forced-logout hook (registered by authStore to avoid circular import) ── */
type LogoutHandler = () => void;
let _onForcedLogout: LogoutHandler | null = null;
export const registerForcedLogoutHandler = (handler: LogoutHandler) => {
  _onForcedLogout = handler;
};

/* ─── Request interceptor — attach access token ───────────────────────────── */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ─── Response interceptor — silent token refresh on 401 ──────────────────── */
let _isRefreshing = false;
let _refreshQueue: Array<(token: string) => void> = [];

const processQueue = (newToken: string) => {
  _refreshQueue.forEach(resolve => resolve(newToken));
  _refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Not a 401, or this is already a retry — propagate immediately
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Queue concurrent requests while a refresh is in flight
    if (_isRefreshing) {
      return new Promise<string>((resolve) => {
        _refreshQueue.push(resolve);
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    original._retry  = true;
    _isRefreshing    = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      saveTokens(data.accessToken, data.refreshToken);
      processQueue(data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch {
      // Refresh failed — force logout
      clearTokens();
      _onForcedLogout?.();
      if (typeof window !== 'undefined') window.location.replace('/auth/login');
      return Promise.reject(error);
    } finally {
      _isRefreshing = false;
    }
  }
);

export default api;

/* ─── Types ────────────────────────────────────────────────────────────────── */
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  xp: number;
  level: number;
  streak: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  orderIndex: number;
  chapters?: Chapter[];
  _count?: { chapters: number };
}

export interface Chapter {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  codeExample?: string;
  language: string;
  orderIndex: number;
  xpReward: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  quizzes?: Quiz[];
  _count?: { quizzes: number };
  /** Annotated server-side per authenticated user */
  isUnlocked?: boolean;
  isCompleted?: boolean;
}

export interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  xpReward: number;
  questions?: Question[];
  _count?: { questions: number; attempts: number };
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  orderIndex: number;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  chapterId: string;
  completed: boolean;
  completedAt?: string;
}

export interface DashboardStats {
  user: { xp: number; level: number; streak: number };
  stats: { completedChapters: number; achievements: number; saves: number; passedQuizzes: number; avgScore: number };
  progressByCourse: { courseId: string; title: string; completed: number; total: number; percentage: number }[];
  xpHistory: { date: string; xp: number }[];
  heatmap: Record<string, number>;
  recentActivity: { type: string; metadata?: object; xpGained: number; createdAt: string }[];
  recentQuizzes: { score: number; passed: boolean; createdAt: string }[];
}
