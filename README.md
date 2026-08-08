<p align="center">
  <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" width="100%" alt="MusafirX" />
</p>

<h1 align="center">🧳 MusafirX</h1>
<h3 align="center">AI-Powered Travel Platform for India</h3>

<p align="center">
  <b>Discover. Plan. Experience.</b> — Your complete travel companion for exploring India with the power of AI.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-environment-variables">Env</a>
</p>

---

## 🎯 What is MusafirX?

**Musafir = Traveler | X = Exploration, Experience**

MusafirX is a **complete, production-ready, full-stack travel platform** built for discovering India. Whether you're planning a weekend getaway or a month-long expedition — MusafirX handles everything from AI-powered itinerary creation to real-time budget tracking.

### 🔥 Works WITHOUT any API keys!
All AI features fall back to intelligent **Demo AI Mode** automatically. Add your Gemini API key whenever you're ready for real AI.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **MongoDB 7+** (local or Docker)
- **npm**

### One-Command Setup

```bash
# 1. Clone
git clone https://github.com/sharmaamardeep2907-prog/MusafirX.git
cd MusafirX

# 2. Set up environment (defaults work out-of-box!)
cp .env.example backend/.env

# 3. Start MongoDB
docker compose up -d

# 4. Install + Seed + Start Backend (Terminal 1)
cd backend
npm install
npm run db:seed    # Seeds 36 states + 40 destinations + 4 demo users
npm run dev        # http://localhost:5000

# 5. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Demo Login Credentials

| Role  | Email                  | Password     |
|-------|------------------------|--------------|
| 👤 User  | `demo@musafirx.com`   | `Demo@12345` |
| 🛡️ Admin | `admin@musafirx.com`  | `Admin@12345` |

---

## ✨ Features

### 🌍 Destination Discovery
- **36 Indian states** & union territories with detailed metadata
- **40+ handcrafted destinations** with descriptions, tags, ratings
- **Powerful search** with real-time autocomplete across destinations, hotels, restaurants
- **Filter by type**: Heritage, Beach, Hill Station, Spiritual, Nature, Adventure, Desert, Urban, Backwaters
- **Trending destinations** & **hidden gems** sections
- **Interactive 2D India map** with clickable region hotspots

### 🤖 AI Trip Planner (Demo + Gemini)
- **5-step progressive wizard**: Destination → Duration → Style → Budget → Results
- AI generates day-by-day itineraries with activities, timings, and costs
- **Budget breakdown**: Hotels, Transport, Food, Activities, Shopping, Emergency
- **Demo AI Mode**: works instantly without any API key
- **Google Gemini**: plug in `GEMINI_API_KEY` for real AI responses

### 📊 Personal Dashboard
- Track all your trips (Draft, Planned, Active, Completed)
- **Budget tracker** with visual progress bar (Total vs Spent vs Remaining)
- **Expense CRUD**: Add/delete expenses per trip with category tracking
- **Saved destinations** & **wishlist** management
- AI-powered travel recommendations based on your history

### 🧠 AI Tools Suite
| Tool | Endpoint | Description |
|------|----------|-------------|
| 💬 AI Chat | `POST /ai/chat` | Floating chat widget — ask anything about Indian travel |
| 🗺️ Itinerary | `POST /ai/generate-itinerary` | Day-by-day plan with budget |
| 🎒 Packing | `POST /ai/packing-list` | Smart checklist based on destination & weather |
| 💰 Budget | `POST /ai/optimize-budget` | Cost breakdown & optimization |
| ✍️ Journal | `POST /ai/enhance-journal` | AI transforms notes into travel stories |

### 📱 Additional Pages
- **Food Guide** — 10 iconic Indian dishes across regions
- **Weather** — 8 cities with temperature, humidity, wind, sunrise/sunset
- **Budget Calculator** — per-person, per-day breakdown
- **Packing Assistant** — generate + check/uncheck interactive checklist
- **Travel Journal** — write raw notes, AI transforms into beautiful stories
- **Blog/Guides** — category-filtered travel content
- **Community** — connect with fellow travelers
- **Admin Dashboard** — user management, analytics, activity feed

### 🎨 Premium UI/UX
- **Brand colors**: Navy `#0B2341` · Saffron `#FF8A00` · Emerald `#138A4B` · Ivory `#F8F8F5`
- **Neuromorphism** cards with soft shadows + **glassmorphism** overlays
- **Fully responsive** across mobile, tablet, and desktop
- **Framer Motion** animations: staggered cards, smooth transitions, micro-interactions
- **Floating AI chat** accessible from any page
- **Global search overlay** with keyboard shortcut and instant results
- **Loading skeletons**, **error boundaries**, **404 pages** — every state covered

### 🔐 Authentication & Security
- **JWT** access tokens (15min) + refresh tokens (7 days)
- **Automatic token refresh** on 401 responses
- **Role-based access**: USER, ADMIN
- **Input validation** with Zod schemas on all endpoints
- **Rate limiting**, **Helmet.js**, **CORS** configured
- **bcrypt** password hashing (12 rounds)

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | ❌ | Create account |
| `POST` | `/api/auth/login` | ❌ | Sign in → access + refresh tokens |
| `POST` | `/api/auth/refresh-token` | ❌ | Refresh access token |
| `POST` | `/api/auth/logout` | ✅ | Invalidate refresh token |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `PATCH` | `/api/auth/profile` | ✅ | Update name, bio, avatar, preferences |

### Destinations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/states` | ❌ | All 36 Indian states |
| `GET` | `/api/destinations` | ❌ | List destinations (search, filter, paginate) |
| `GET` | `/api/destinations/trending` | ❌ | Top 12 trending destinations |
| `GET` | `/api/destinations/hidden-gems` | ❌ | 15 hidden gems |
| `GET` | `/api/destinations/:slug` | ❌ | Full detail + attractions + hotels + restaurants |
| `GET` | `/api/hotels` | ❌ | Hotels list |
| `GET` | `/api/restaurants` | ❌ | Restaurants list |
| `GET` | `/api/activities` | ❌ | Activities list |
| `GET` | `/api/search?q=` | ❌ | Global search |

### Trips & Expenses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/trips` | ✅ | All my trips |
| `GET` | `/api/trips/:id` | ✅ | Trip detail + expenses + members |
| `POST` | `/api/trips` | ✅ | Create trip |
| `PATCH` | `/api/trips/:id` | ✅ | Update trip |
| `DELETE` | `/api/trips/:id` | ✅ | Delete trip + expenses |
| `POST` | `/api/expenses` | ✅ | Add expense (recalculates spentSoFar) |
| `DELETE` | `/api/expenses/:id` | ✅ | Remove expense |
| `GET` | `/api/saved` | ✅ | Saved destinations |
| `POST` | `/api/saved` | ✅ | Save destination |
| `DELETE` | `/api/saved/:id` | ✅ | Unsave |

### AI (all work without API keys)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ai/chat` | Optional | AI travel assistant chat |
| `POST` | `/api/ai/generate-itinerary` | Optional | Generate day-by-day plan |
| `POST` | `/api/ai/packing-list` | Optional | Smart packing checklist |
| `POST` | `/api/ai/optimize-budget` | Optional | Budget optimization |
| `POST` | `/api/ai/enhance-journal` | ✅ | AI-enhanced travel story |
| `GET` | `/api/ai/conversations` | ✅ | Chat history |

### Content
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/blogs` | ❌ | Blog posts with category filter |
| `GET` | `/api/blogs/:slug` | ❌ | Single blog post |
| `GET` | `/api/community` | Optional | Community posts feed |
| `GET` | `/api/itineraries` | Optional | Public itineraries |
| `POST` | `/api/reviews` | ✅ | Submit review |
| `GET` | `/api/wishlist` | ✅ | Wishlist |
| `POST` | `/api/wishlist` | ✅ | Add to wishlist |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/musafirx
JWT_SECRET=musafirx_super_secret_change_this
JWT_REFRESH_SECRET=musafirx_super_refresh_secret_change_this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
# Optional: GOOGLE_CLIENT_ID, GEMINI_API_KEY, SMTP_*, etc.
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MusafirX
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 · React 19 · TypeScript |
| **Styling** | Tailwind CSS · Framer Motion |
| **State** | Zustand · React Query (TanStack) |
| **Forms** | React Hook Form · Zod |
| **Backend** | Express.js · TypeScript |
| **Database** | MongoDB 7 · Mongoose ODM |
| **Auth** | JWT (access + refresh) · bcryptjs |
| **AI** | Google Gemini 1.5 Flash (with demo fallback) |
| **Infra** | Docker · Docker Compose |

---

## 🎨 Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#0B2341` | Navbar, headings, dark sections |
| Saffron | `#FF8A00` | CTAs, AI highlights, active nav |
| Emerald | `#138A4B` | Success, savings, veg indicators |
| Ivory | `#F8F8F5` | Background, cards |
| Charcoal | `#1F2937` | Body text |

---

<p align="center">
  <b>MusafirX — Discover. Plan. Experience.</b><br/>
  <sub>Built with ❤️ for India</sub>
</p>
