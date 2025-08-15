#!/bin/bash

echo "🚀 Setting up AI-Integrated Coding Practice Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Some features may not work."
    echo "   Visit: https://docker.com/ to install Docker"
    DOCKER_AVAILABLE=false
else
    echo "✅ Docker detected"
    DOCKER_AVAILABLE=true
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose is not available. Some features may not work."
    echo "   Visit: https://docs.docker.com/compose/install/ to install Docker Compose"
    COMPOSE_AVAILABLE=false
else
    echo "✅ Docker Compose detected"
    COMPOSE_AVAILABLE=true
fi

echo ""
echo "📦 Installing dependencies..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "🔧 Setting up environment files..."

# Create frontend environment file
if [ ! -f .env.local ]; then
    echo "Creating .env.local for frontend..."
    cat > .env.local << EOF
# Frontend Environment Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Programming+
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

# Create backend environment file
if [ ! -f backend/.env ]; then
    echo "Creating backend .env..."
    cat > backend/.env << EOF
# Backend Environment Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=dev-jwt-secret-change-this-in-production
JWT_EXPIRES_IN=7d

# OpenAI Configuration (Add your API key here)
OPENAI_API_KEY=your-openai-api-key-here

# Database Configuration
DATABASE_URL=postgresql://coding_user:coding_password@localhost:5432/coding_platform

# Judge0 API Configuration
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-judge0-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ Created backend .env"
else
    echo "✅ Backend .env already exists"
fi

echo ""
echo "🚨 IMPORTANT: Please update the following environment variables:"
echo "   - backend/.env: OPENAI_API_KEY, JUDGE0_API_KEY"
echo "   - backend/.env: JWT_SECRET (for production)"

echo ""
echo "🎯 Setup complete! You can now start the platform:"
echo ""
echo "Option 1: Start individual services"
echo "  Terminal 1: npm run dev (Frontend)"
echo "  Terminal 2: cd backend && npm run dev (Backend)"
echo ""

if [ "$DOCKER_AVAILABLE" = true ] && [ "$COMPOSE_AVAILABLE" = true ]; then
    echo "Option 2: Start with Docker (Recommended)"
    echo "  docker-compose up -d"
    echo ""
    echo "This will start all services including PostgreSQL and Redis"
fi

echo "🌐 Access the application at: http://localhost:3000"
echo "🔗 Backend API at: http://localhost:5000"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🎉"
