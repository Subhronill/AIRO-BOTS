# 🤖 AIRO BOTS — AI & Robotics Educational Platform

**Artificially Intelligent Robotic Operating Bots**

A futuristic, full-stack educational platform for learning AI, Machine Learning, Deep Learning, Robotics, NLP, Computer Vision, Generative AI, ROS, and MLOps — from zero to mastery.

> Coursera + LeetCode + Replit + Robotics Lab — in one cyberpunk platform.

---

## ✨ Features

- 🧠 **9-Level Learning Roadmap** — Structured path from basics to production AI
- 📚 **Interactive Courses** — Markdown lessons with code examples and theory
- ⚡ **Code Playground** — Browser-based Python/JS/Robotics code editor with execution
- 🎯 **Quiz System** — MCQ quizzes with XP rewards and score tracking
- 📊 **User Dashboard** — XP graphs, progress tracking, activity heatmap
- 🏆 **Leaderboard** — Compete with other learners
- 🛸 **Roadmap View** — Full 9-level curriculum overview
- 👑 **Admin Panel** — Manage users, courses, and content
- 🎨 **Cyberpunk UI** — Futuristic neon-glow dark design with animations
- 🔐 **JWT Auth** — Register, login, role-based access
- 🔄 **Real-time** — WebSocket support via Socket.io

---

## 🚀 Quick Start

### Option 1: Docker (Recommended — One Command)

```bash
# 1. Clone or extract the project
cd airo-bots

# 2. Launch everything
docker-compose up --build

# 3. Wait ~60s for DB migrations and seeding, then open:
#    Frontend → http://localhost:3000
#    Backend  → http://localhost:4000
#    API Docs → http://localhost:4000/health
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- PostgreSQL 14+ running locally

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env .env.local
# Edit .env and set your DATABASE_URL if different from default

# Setup database (migrate + seed)
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed/seed.ts

# Start backend (port 4000)
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@airobots.dev` | `admin123` |
| 🎓 Student | `student@airobots.dev` | `student123` |

---

## 📁 Project Structure

```
airo-bots/
├── docker-compose.yml          # Docker setup (postgres + backend + frontend)
├── README.md                   # This file
│
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── index.ts            # Express app + Socket.io
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT middleware
│   │   └── routes/
│   │       ├── auth.ts         # Register, login, refresh
│   │       ├── courses.ts      # Course listing & detail
│   │       ├── chapters.ts     # Chapter content
│   │       ├── quizzes.ts      # Quiz engine + scoring
│   │       ├── progress.ts     # Chapter completion tracking
│   │       ├── playground.ts   # Code saves + execution
│   │       ├── dashboard.ts    # User stats + analytics
│   │       ├── users.ts        # Profile + leaderboard
│   │       └── admin.ts        # Admin panel APIs
│   ├── prisma/
│   │   ├── schema.prisma       # Full DB schema
│   │   └── seed/seed.ts        # Seed data (courses, quizzes, users)
│   ├── .env                    # Environment variables
│   ├── Dockerfile
│   └── package.json
│
└── frontend/                   # Next.js 14 + TypeScript
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                    # Landing page
    │   │   ├── dashboard/page.tsx          # User dashboard
    │   │   ├── learn/page.tsx              # Course listing
    │   │   ├── learn/[course]/page.tsx     # Course detail
    │   │   ├── learn/[course]/[ch]/page.tsx # Chapter (lesson/quiz/code)
    │   │   ├── playground/page.tsx         # Code playground
    │   │   ├── roadmap/page.tsx            # Learning roadmap
    │   │   ├── leaderboard/page.tsx        # Leaderboard
    │   │   ├── admin/page.tsx              # Admin panel
    │   │   └── auth/                       # Login/register
    │   ├── components/
    │   │   ├── landing/                    # Hero, Features, Stats, etc.
    │   │   └── layout/                     # Navbar, Footer
    │   ├── lib/api.ts                      # Axios + JWT interceptor
    │   └── store/authStore.ts              # Zustand auth state
    ├── tailwind.config.js                  # Cyberpunk theme
    ├── .env.local                          # NEXT_PUBLIC_API_URL
    └── package.json
```

---

## 🗄️ Database Schema

Key models:

| Model | Description |
|-------|-------------|
| `User` | Auth, XP, level, streak |
| `Course` | Course metadata + slug |
| `Chapter` | Lesson content (Markdown) |
| `Quiz` + `Question` | MCQ quiz engine |
| `QuizAttempt` | Score history |
| `Progress` | Chapter completion per user |
| `PlaygroundSave` | Saved code snippets |
| `Achievement` | Gamification badges |
| `Activity` | User activity log |

---

## 🌐 API Endpoints

### Auth
```
POST /api/auth/register     Register new user
POST /api/auth/login        Login → JWT tokens
POST /api/auth/refresh      Refresh access token
GET  /api/auth/me           Get current user
POST /api/auth/logout       Logout
```

### Courses
```
GET  /api/courses                     List all courses
GET  /api/courses/:slug               Course + chapters
POST /api/courses                     Create course (admin)
```

### Chapters
```
GET  /api/chapters/:courseSlug/:chapterSlug    Chapter content + quiz
POST /api/chapters                             Create chapter (admin)
```

### Progress
```
POST /api/progress/complete    Mark chapter complete (+XP)
GET  /api/progress             User progress across courses
```

### Quiz
```
GET  /api/quizzes/:chapterId       Get quiz for chapter
POST /api/quizzes/:id/attempt      Submit quiz attempt
GET  /api/quizzes/:id/attempts     View past attempts
```

### Playground
```
GET  /api/playground               List saved snippets
POST /api/playground               Save snippet
POST /api/playground/execute       Execute code (simulated)
DELETE /api/playground/:id         Delete snippet
```

### Dashboard
```
GET /api/dashboard/stats    User stats, XP history, activity heatmap
```

### Leaderboard & Profile
```
GET  /api/users/leaderboard     Top users by XP
PUT  /api/users/profile         Update profile
GET  /api/users/achievements    User badges
```

### Admin
```
GET   /api/admin/users               All users
GET   /api/admin/analytics           Platform analytics
PATCH /api/admin/users/:id/role      Change user role
```

---

## 🎨 UI Design

The platform uses a custom **Cyberpunk** theme:

- `cyber-black` `#050a0f` — Background
- `cyber-dark` `#0a1628` — Cards
- `cyber-blue` `#0066ff` — Primary accent
- `cyber-cyan` `#00ffff` — Highlights
- `cyber-green` `#00ff88` — Success/progress
- `neon-pink` `#ff0080` — Alerts

Custom CSS utilities: `glass-panel`, `cyber-card`, `neon-text`, `cyber-btn-primary`, `grid-bg`

---

## 🐳 Docker Services

```yaml
postgres:    Port 5432  (PostgreSQL 15)
backend:     Port 4000  (Node.js API)
frontend:    Port 3000  (Next.js)
```

---

## ⚙️ Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://airo:airo_pass@localhost:5432/airobots"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Animations | Framer Motion |
| State | Zustand |
| Charts | Recharts |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Realtime | Socket.io |
| DevOps | Docker, Docker Compose |

---

## 🛠️ Development

```bash
# Backend dev (hot reload)
cd backend && npm run dev

# Frontend dev (hot reload)
cd frontend && npm run dev

# Prisma Studio (DB GUI)
cd backend && npx prisma studio

# Re-seed database
cd backend && npx ts-node prisma/seed/seed.ts

# Type check frontend
cd frontend && npx tsc --noEmit
```

---

## 📝 Seeded Content

The database seed includes:

- **2 Users** (admin + student)
- **8 Courses** across the full roadmap
- **Full chapter content** for AI Foundations, Python for AI, Math for AI, ML Intro, Neural Networks, Robotics
- **Quizzes** with 4 questions each for main chapters
- **5 Achievements** (First Steps, Quiz Master, Speed Runner, Perfect Score, Dedicated Learner)
- **Sample progress** and activity data for the student user

---

## 🚧 Roadmap / Coming Soon

- [ ] Monaco Editor integration (full VSCode-like experience)
- [ ] Python execution via Pyodide (client-side)
- [ ] AI Mentor chatbot (Claude API)
- [ ] Three.js robotics visualization
- [ ] Real-time collaboration
- [ ] Certificate generation
- [ ] Mobile app (React Native)

---

## 📄 License

MIT — Build on it, learn from it, ship it.

---

**Built with ❤️ by AIRO BOTS**
*The future of AI + Robotics education*
