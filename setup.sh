#!/bin/bash
# AIRO BOTS — Quick Setup Script
# Run this after extracting the ZIP to get everything running

set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║       🤖 AIRO BOTS — Setup Script            ║"
echo "║   AI & Robotics Educational Platform         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check prerequisites
check_command() {
  if ! command -v "$1" &> /dev/null; then
    echo "❌ $1 not found. Please install $1 first."
    exit 1
  fi
  echo "✅ $1 found"
}

echo "Checking prerequisites..."
check_command node
check_command npm
check_command psql

echo ""
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required (found: $(node -v))"
  exit 1
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "🗄️  Setting up database..."
echo "Note: Make sure PostgreSQL is running and the DATABASE_URL in backend/.env is correct"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  .env not found, using defaults..."
  cat > .env << 'ENV'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/airobots"
JWT_SECRET="airo-bots-super-secret-jwt-key-2024"
JWT_REFRESH_SECRET="airo-bots-refresh-secret-key-2024"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
ENV
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate dev --name init --skip-generate

echo "Seeding database with sample data..."
npx ts-node prisma/seed/seed.ts

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║              ✅ Setup Complete!              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "To start the platform:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  → cd backend && npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  → cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:3000"
echo ""
echo "Demo credentials:"
echo "  Admin:   admin@airobots.dev / admin123"
echo "  Student: student@airobots.dev / student123"
echo ""
