# 🚀 AI-Integrated Coding Practice Platform

A modern, full-stack web application that combines coding practice with AI-powered feedback and personalized learning paths. Built with Next.js, Node.js, and OpenAI integration.

## ✨ Features

### 🎯 Core Functionality
- **Smart Code Editor**: Monaco Editor with syntax highlighting and auto-completion
- **Problem Library**: Curated coding challenges with varying difficulty levels
- **Real-time Execution**: Safe code execution with Judge0 integration
- **Automated Judging**: Test case validation and performance metrics

### 🤖 AI-Powered Features
- **Code Feedback**: Intelligent analysis and improvement suggestions
- **Problem Explanations**: Natural language breakdowns of complex problems
- **Personalized Hints**: Context-aware hints without spoiling solutions
- **Learning Paths**: AI-generated recommendations based on user progress

### 🎮 Gamification & Learning
- **Progress Tracking**: Points, streaks, and achievement system
- **Skill Analytics**: Detailed breakdown of strengths and weaknesses
- **Leaderboards**: Competitive ranking system
- **Personalized Recommendations**: Adaptive problem suggestions

### 🔐 User Management
- **Authentication**: JWT-based secure authentication
- **User Profiles**: Comprehensive progress tracking
- **Social Features**: Community interaction and sharing

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│     APIs        │
│                 │    │                 │    │                 │
│ • React         │    │ • REST API      │    │ • OpenAI GPT-4  │
│ • TypeScript    │    │ • JWT Auth      │    │ • Judge0        │
│ • Tailwind CSS  │    │ • Rate Limiting │    │ • PostgreSQL    │
│ • Monaco Editor │    │ • Validation    │    │ • Redis         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- OpenAI API key (for AI features)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-coding-platform.git
cd ai-coding-platform
```

### 2. Environment Setup
```bash
# Frontend environment
cp .env.example .env.local

# Backend environment
cd backend
cp env.example .env
```

Update the environment variables with your API keys:
```env
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:5000

# .env (Backend)
OPENAI_API_KEY=your-openai-api-key-here
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
```

### 4. Start Development Servers

#### Option A: Individual Services
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev
```

#### Option B: Docker Compose (Recommended)
```bash
docker-compose up -d
```

This will start all services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Judge0: localhost:2358

### 5. Access the Application
Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-coding-platform/
├── src/                          # Frontend source code
│   ├── app/                     # Next.js app directory
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── problems/           # Problem pages
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── CodeEditor.tsx      # Monaco code editor
│   │   └── providers/          # Context providers
│   └── types/                  # TypeScript definitions
├── backend/                     # Backend source code
│   ├── src/                    # Server source
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   └── server.js           # Main server file
│   ├── package.json            # Backend dependencies
│   └── env.example             # Environment template
├── docker-compose.yml          # Docker services
├── package.json                # Frontend dependencies
└── README.md                   # This file
```

## 🔧 Configuration

### Frontend Configuration
- **Port**: 3000 (configurable via `PORT` env var)
- **API URL**: Configurable via `NEXT_PUBLIC_API_URL`
- **Theme**: Light/dark mode support
- **Languages**: Python, JavaScript, Java, C++, C

### Backend Configuration
- **Port**: 5000 (configurable via `PORT` env var)
- **JWT Secret**: Required for authentication
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for frontend domain

### Database Configuration
- **PostgreSQL**: Main database for users, problems, submissions
- **Redis**: Caching and session storage
- **Judge0**: Code execution engine

## 🧪 Testing

### Frontend Tests
```bash
npm run test
npm run test:watch
```

### Backend Tests
```bash
cd backend
npm test
npm run test:watch
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build
npm start

# Backend
cd backend
NODE_ENV=production npm start
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your-production-secret
OPENAI_API_KEY=your-production-openai-key
DATABASE_URL=your-production-database-url
REDIS_URL=your-production-redis-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Write tests for new features
- Update documentation as needed

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### Problem Endpoints
- `GET /api/problems` - List problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems/:id/submit` - Submit solution

### AI Endpoints
- `POST /api/ai/code-feedback` - Get code analysis
- `POST /api/ai/problem-explanation` - Get problem explanation
- `POST /api/ai/hint-generator` - Generate hints
- `POST /api/ai/learning-path` - Get learning recommendations

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/profile` - Update user profile

## 🔒 Security Features

- JWT-based authentication
- Rate limiting and DDoS protection
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- Password hashing with bcrypt

## 📊 Performance Features

- Code splitting and lazy loading
- Redis caching layer
- Database query optimization
- CDN-ready static assets
- Compression middleware
- Connection pooling

## 🐛 Troubleshooting

### Common Issues

#### Frontend Won't Start
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check environment variables
cd backend
cat .env
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

#### AI Features Not Working
- Verify OpenAI API key is set
- Check API key has sufficient credits
- Review API rate limits

### Logs and Debugging
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 📈 Roadmap

### Phase 1 (Current)
- ✅ User authentication and profiles
- ✅ Problem library and code editor
- ✅ Basic AI feedback system
- ✅ Test case execution

### Phase 2 (Next)
- 🔄 Advanced AI features
- 🔄 Collaborative coding
- 🔄 Mobile app
- 🔄 Video explanations

### Phase 3 (Future)
- 📋 AI-powered problem generation
- 📋 Advanced analytics dashboard
- 📋 Integration with learning management systems
- 📋 Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor component
- [OpenAI](https://openai.com/) - AI-powered features
- [Judge0](https://judge0.com/) - Code execution engine
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework



---

**Made with ❤️ by the Programming+ Team**
