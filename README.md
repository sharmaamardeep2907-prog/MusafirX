# 🧳 MusafirX — AI-Powered Travel Platform for India

**MusafirX** is a complete, full-stack, AI-powered travel platform for discovering India, planning personalized trips, managing budgets, and sharing travel experiences.

> **Musafir = Traveler | X = Exploration, Experience**

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **MongoDB 7+** (local or Docker)
- npm

### Setup

```bash
# 1. Clone and install
cd musafirx

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Start MongoDB (Docker)
docker compose up -d

# 4. Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..

# 5. Seed the database
cd backend && npm run db:seed
cd ..

# 6. Start the app
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/api/health

### Demo Accounts

| Role  | Email              | Password     |
|-------|--------------------|--------------|
| User  | demo@musafirx.com  | Demo@12345   |
| Admin | admin@musafirx.com | Admin@12345  |

---

## ✨ Features

### 🔍 Destination Discovery
- 35+ Indian states & union territories
- 40+ destinations with rich metadata
- Search, filter by type, trending & hidden gems
- Detailed destination pages with attractions, hotels, restaurants

### 🤖 AI Trip Planner
- Progressive step-by-step trip builder
- Generate personalized itineraries
- Budget breakdown and optimization
- **Demo AI mode** works without API keys
- **Google Gemini integration** for real AI responses

### 📊 Personal Dashboard
- Track all your trips
- Save favorite destinations
- View travel statistics
- AI-powered recommendations

### 🎨 Premium UI
- **MusafirX brand colors**: Navy #0B2341, Saffron #FF8A00, Emerald #138A4B
- Soft neumorphism + controlled glassmorphism
- Responsive design (mobile, tablet, desktop)
- Cinematic travel photography
- Framer Motion animations

### 🔐 Authentication
- JWT-based auth with refresh tokens
- Sign up, login, profile management
- Role-based: USER & ADMIN

### 🧠 AI Integration
- AI travel assistant (floating chat)
- Itinerary generation
- Packing list generation
- Budget optimization
- **Graceful fallback** when API key is unavailable

---

## 🏗️ Architecture

```
musafirx/
├── frontend/          # Next.js 15 + React 19 + Tailwind CSS
│   ├── app/           # Pages (App Router)
│   ├── components/    # Reusable UI components
│   ├── store/         # Zustand state management
│   └── lib/           # Utilities & API client
├── backend/           # Express.js + TypeScript + Mongoose
│   └── src/
│       ├── config/        # App configuration
│       ├── models/        # Mongoose schemas (30+ models)
│       ├── controllers/   # Request handlers
│       ├── routes/        # API routes
│       ├── middleware/     # Auth, validation, error
│       ├── integrations/  # AI service
│       └── seed/          # Database seeding
└── .env.example
```

---

## 📡 API Endpoints

| Method | Endpoint                      | Description         |
|--------|-------------------------------|---------------------|
| POST   | /api/auth/signup              | Create account      |
| POST   | /api/auth/login               | Sign in             |
| GET    | /api/auth/me                  | Get profile         |
| GET    | /api/states                   | All states          |
| GET    | /api/destinations             | List destinations   |
| GET    | /api/destinations/trending    | Trending            |
| GET    | /api/destinations/hidden-gems | Hidden gems         |
| GET    | /api/destinations/:slug       | Destination detail  |
| GET    | /api/hotels                   | Hotels              |
| GET    | /api/restaurants              | Restaurants         |
| GET    | /api/trips                    | My trips            |
| POST   | /api/trips                    | Create trip         |
| POST   | /api/ai/chat                  | Chat with AI        |
| POST   | /api/ai/generate-itinerary    | Generate itinerary  |
| POST   | /api/ai/packing-list          | Generate packing list |

---

## 🎨 Brand Colors

| Color    | Hex       | Usage                          |
|----------|-----------|--------------------------------|
| Navy     | `#0B2341` | Navbar, headings, dark sections|
| Saffron  | `#FF8A00` | CTAs, AI highlights, active nav|
| Emerald  | `#138A4B` | Success, savings, eco, nature  |
| Ivory    | `#F8F8F5` | Main background, cards         |
| Charcoal | `#1F2937` | Paragraphs, secondary text     |

---

## 🔧 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/musafirx
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
GEMINI_API_KEY=          # Optional - falls back to Demo AI
FRONTEND_URL=http://localhost:3000
PORT=4000
```

**The application works without any external API keys** — it uses built-in demo AI responses.

---

## 🛠️ Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Next.js 15, React 19, TypeScript  |
| Styling  | Tailwind CSS, Framer Motion       |
| Backend  | Express.js, TypeScript            |
| Database | MongoDB, Mongoose ODM             |
| Auth     | JWT + Refresh Tokens              |
| AI       | Google Gemini (with demo fallback)|

---

**MusafirX — Discover. Plan. Experience.**