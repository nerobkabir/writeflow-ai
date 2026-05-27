# WriteFlow AI — Intelligence Pro

> A production-grade AI-powered SaaS content workspace where teams plan, generate, review, and publish content using agentic AI.

![WriteFlow AI](https://img.shields.io/badge/WriteFlow-AI-black?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## Live Demo

**[https://writeflow-ai-chi.vercel.app](https://writeflow-ai-chi.vercel.app)**

---

## Screenshots

| Landing Page | AI Editor | My Documents |
|---|---|---|
| ![Landing](./public/screenshots/landing.png) | ![Editor](./public/screenshots/editor.png) | ![Documents](./public/screenshots/documents.png) |

---

## Project Description

**WriteFlow AI** is a multi-role SaaS platform built for professional content teams. It uses agentic AI to autonomously plan, generate, rewrite, and publish content — including blog posts, social media captions, and email copy.

### Key Highlights

- **3 AI Agents** running real API calls — Content Draft, Rewrite & Tone, Chat Assistant
- **Role-based access** — separate User and Admin dashboards with middleware protection
- **Monochromatic precision UI** — inspired by Linear, Notion, and Vercel design systems
- **Streaming AI responses** — word-by-word output using ReadableStream
- **Full dark mode** — global toggle with CSS variable theming
- **Fully responsive** — tested at 375px, 768px, and 1280px

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + Shadcn/UI |
| Auth | NextAuth.js v4 |
| Database | Prisma + PostgreSQL (Supabase) |
| AI | Anthropic Claude API |
| Charts | Recharts |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Editor | TipTap |
| Deployment | Vercel |

---

## Features

### Landing Page
- Animated hero with typing effect and floating dashboard preview
- Features, How It Works, Popular Templates, Pricing, Statistics, Testimonials, FAQ, Newsletter, Footer
- Sticky responsive navbar — logged-out and logged-in states
- Mobile hamburger menu

### Authentication
- Login, Register, Forgot Password
- Google OAuth
- Demo login buttons (auto-fill credentials)
- Role-based redirect after login

### User Dashboard
- **My Documents** — create, filter, search, paginate drafts and published content
- **My Profile** — edit name, avatar, bio, view usage stats
- **AI Usage History** — log of all AI agent calls with token tracking

### Admin Dashboard
- **Analytics** — real-time charts (bar, line, pie) from database
- **Manage Users** — role change, ban/unban, search, pagination
- **Manage Templates** — full CRUD, published templates appear on Explore page
- **Manage Reviews** — approve/reject + AI review summariser
- **Site Settings** — maintenance mode, logo, AI agent toggles

### AI Agents (Real API — No Mocks)
| Agent | Trigger | Capability |
|---|---|---|
| Content Draft | Topic + Tone + Audience | Generates blog, social, email + title, meta, tags |
| Rewrite & Tone | Text selection | Formal, Casual, Friendly, Persuasive, Shorten, Expand, Grammar fix |
| Chat Assistant | Sidebar chatbot | Context-aware, streaming, conversation memory |
| Review Summariser | Admin trigger | 3-bullet summary + sentiment (Positive/Neutral/Negative) |

### Additional Pages
- About, Contact, Blog, Privacy Policy, Terms & Conditions
- Explore Templates (search, filter, sort, pagination)
- Template Details (overview, sample output, reviews, related templates)

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Anthropic API key (or OpenAI API key)
- Google OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/nerobkabir/writeflow-ai.git
cd writeflow-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` (see [Environment Variables](#-environment-variables) below).

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/writeflow_ai"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI API (choose one)
ANTHROPIC_API_KEY="your-anthropic-api-key"
# OPENAI_API_KEY="your-openai-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **For production**, replace `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your Vercel deployment URL.

---

## Demo Credentials

Two pre-seeded accounts are available for testing. Use the **Demo Login** buttons on the login page to auto-fill credentials.

### User Account
```
Email:    user@writeflow.com
Password: 123456
Role:     User (PRO Plan)
```

### Admin Account
```
Email:    admin@writeflow.com
Password: 123456
Role:     Admin (TEAM Plan)
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          → Login, Register, Forgot Password
│   ├── (marketing)/     → Landing, About, Contact, Blog, Privacy, Terms
│   ├── (dashboard)/     → User dashboard pages
│   ├── (admin)/         → Admin dashboard pages
│   └── api/             → API routes (auth, AI agents, CRUD)
├── components/
│   ├── ui/              → Shadcn components
│   ├── shared/          → Navbar, Footer, Sidebar
│   ├── landing/         → Hero, Features, Pricing, etc.
│   ├── editor/          → TipTap editor, AI panel, chat
│   ├── dashboard/       → Stat cards, tables, charts
│   └── animations/      → Reusable Framer Motion wrappers
├── lib/
│   ├── prisma.ts        → Prisma client
│   ├── auth.ts          → NextAuth config
│   ├── ai.ts            → AI API wrapper
│   └── animations.ts    → Shared animation variants
├── hooks/               → Custom React hooks
├── providers/           → Theme, Session, Toast providers
└── types/               → TypeScript interfaces
```

---

## Database

This project uses **Prisma ORM** with PostgreSQL.

```bash
# View database in browser
npx prisma studio

# Reset database and reseed
npx prisma migrate reset
npx prisma db seed

# Generate Prisma client after schema changes
npx prisma generate
```

---

## Deployment

This project is deployed on **Vercel**.

### Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/writeflow-ai)

1. Click the button above or import the GitHub repo into Vercel
2. Add all environment variables in the Vercel dashboard
3. After deploy, run database setup:

```bash
npx prisma db push
npx prisma db seed
```

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:seed  # Seed the database
npm run prisma:reset # Reset and reseed database
```

---

## Design System

- **Color palette:** Monochromatic (black, white, gray) — zero color gradients
- **Typography:** Geist Display + Inter body + Geist Mono for code
- **Animation:** Framer Motion — spring physics, 150–350ms duration only
- **Accessibility:** WCAG AA compliant, keyboard navigable, reduced-motion support
- **Dark mode:** Full CSS variable theming via next-themes

---

## License

This project is for educational purposes.

---

## Acknowledgements

- [Anthropic](https://anthropic.com) — Claude AI API
- [Shadcn/UI](https://ui.shadcn.com) — UI component library
- [Vercel](https://vercel.com) — Deployment platform
- [TipTap](https://tiptap.dev) — Rich text editor
- [Framer Motion](https://framer.motion.com) — Animation library

---

<p align="center">Built By MD. Kabir Hossain</p>