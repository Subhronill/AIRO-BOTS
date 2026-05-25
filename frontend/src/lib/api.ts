import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Types
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
