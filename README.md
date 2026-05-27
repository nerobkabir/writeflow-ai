# WriteFlow AI — AI-Powered SaaS Content Platform

## Live Demo
- URL: [https://writeflow-ai-chi.vercel.app](https://writeflow-ai-chi.vercel.app)
- User Login: `user@writeflow.com` / `123456`
- Admin Login: `admin@writeflow.com` / `123456`

## Project Description
WriteFlow AI is a multi-role SaaS platform where teams use agentic AI to plan, generate, review, and publish content including blog posts, social media captions, and email copy.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + Shadcn/UI
- Prisma + PostgreSQL (Supabase)
- NextAuth.js v4
- Google Gemini AI API
- Framer Motion
- Recharts
- Vercel (deployment)

## Features
- AI Content Generation (Gemini API)
- AI Rewrite & Tone Agent
- AI Chat Assistant
- User Dashboard (Documents, Profile, Usage History)
- Admin Dashboard (Analytics, Users, Templates, Reviews, Settings)
- Dark/Light Mode
- Fully Responsive

## Demo Credentials
| Role  | Email | Password |
|-------|-------|----------|
| User  | user@writeflow.com | 123456 |
| Admin | admin@writeflow.com | 123456 |

## Setup Instructions
1. Clone the repo
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`
4. Fill in environment variables
5. Run migrations
   ```bash
   npx prisma migrate dev
   ```
6. Seed database
   ```bash
   npx prisma db seed
   ```
7. Start development server
   ```bash
   npm run dev
   ```

## Environment Variables
```env
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GEMINI_API_KEY=
GEMINI_MODEL=
NEXT_PUBLIC_APP_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Screenshots
[Add screenshots here]
