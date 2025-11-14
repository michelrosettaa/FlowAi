# FlowAI - AI-Powered Productivity Platform

## Overview

FlowAI is a Next.js-based AI productivity platform that helps users manage their daily tasks, schedule, emails, and focus time. The application uses OpenAI's API to provide intelligent planning, email assistance, and motivational mentoring. It's designed as a comprehensive productivity suite that automates routine work and protects deep focus time.

**Deployment**: Running on Replit with PostgreSQL database and integrated Google services (Gmail, Calendar).

## Recent Changes (November 2025)

**Major Upgrades - All Features Now Live:**
1. ✅ **Ask FlowAI** - Upgraded from mock responses to real OpenAI-powered intelligent chat
2. ✅ **Gmail Integration** - Email sending now uses real Gmail API via Replit connector
3. ✅ **Google Calendar Integration** - Calendar sync now live with read/write access via Replit connector
4. ✅ **PostgreSQL Database** - Infrastructure set up with Drizzle ORM (schema ready for migration from localStorage)
5. ✅ **Replit Migration** - Fully migrated from Vercel to Replit environment
6. ✅ **Replit Auth System** - **NEW** Production-ready authentication with OpenID Connect, PostgreSQL session storage, and protected API routes
7. ✅ **Premium Design Upgrade** - Complete platform redesign with premium aesthetics:
   
   **Landing Page:**
   - Upgraded typography (6xl-7xl headlines with tighter tracking)
   - "Ask FlowAI" prominently featured as personal AI assistant
   - Enhanced shadows with layered depth effects
   - Shimmer button animations with smooth transitions
   - Generous spacing (32/40 margin spacing)
   - Fully responsive mobile navigation with hamburger menu
   
   **App Dashboard:**
   - Premium theme system with CSS variables for 4 modes (Dark, Light, Earth, Bloom)
   - Glassmorphism sidebar with backdrop blur and depth shadows
   - Sectioned navigation (HOME, AI ASSISTANTS, PRODUCTIVITY, INSIGHTS)
   - Enhanced navigation states with accent glows and smooth transitions
   - Premium theme selector grid with visual mode previews
   - CSS Grid-based calendar with perfect event alignment
   - All 7 pages upgraded with premium styling:
     * Dashboard: Calendar grid with CSS Grid layout
     * Mentor: Chat interface with gradient message bubbles
     * Email Helper: Premium input/output cards with gradient CTAs
     * Planner: Two-column layout with premium cards
     * Call Summaries: Premium upload interface
     * Calendar: Full calendar grid matching dashboard
     * Analytics: Premium stats cards with coming soon section
   - Upgraded typography, spacing, and interactive hover states
   - Consistent premium feel across all theme modes

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15.1.6 with App Router (React 18.3.1)
- **Rationale**: App Router provides server components, improved routing, and better performance for a modern web application
- **Styling**: Tailwind CSS v4 with custom design tokens and gradient-based theming
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **TypeScript**: Strict typing enabled for type safety across the codebase

**Component Structure**:
- Landing page with marketing sections (Hero, Features, Testimonials, Pricing)
- Protected `/app` routes for authenticated dashboard experience
- Reusable UI components for previews, cards, and interactive elements
- Client-side state management using React hooks (no external state library)

**Design System**:
- CSS custom properties for theming with light/dark mode support
- Gradient-based visual identity (blue-to-indigo spectrum)
- Glassmorphism effects (backdrop-blur, transparency layers)
- Custom fonts: Inter and DM Sans via @fontsource

### Backend Architecture

**Express Server** (server/index.ts):
- Custom Express server running on port 5000 alongside Next.js
- Handles authentication, sessions, and protected API routes
- Uses Passport.js with OpenID Connect for Replit Auth

**Protected API Routes** (server/routes.ts - All require authentication):
- `/api/ask-flowai` - ✅ **PROTECTED** - Real-time AI chat assistant powered by OpenAI
- `/api/email/generate` - ✅ **PROTECTED** - Drafts emails using AI
- `/api/email/send` - ✅ **PROTECTED** - Sends real emails via Gmail API
- `/api/mentor` - ✅ **PROTECTED** - Provides motivational feedback with voice synthesis
- `/api/tasks` - ✅ **PROTECTED** - CRUD operations for user tasks (database-backed)
- `/api/preferences` - ✅ **PROTECTED** - Get/update user preferences (database-backed)

**Legacy Next.js Routes** (Pending migration):
- `/api/plan` - Generates AI-powered daily schedules (to be migrated)
- `/api/summarise` - Summarizes tasks into time-blocked plans (to be migrated)
- `/api/summarise-call` - Summarizes meeting transcripts (to be migrated)
- `/api/summarise-emails` - Processes and prioritizes email threads (to be migrated)
- `/api/signup` - Handles user trial registration (to be migrated)
- `/api/calendar/events` - Fetch and create Google Calendar events (to be migrated)

**Authentication**: ✅ **PRODUCTION-READY** Replit Auth with OpenID Connect
- **Implementation**: Passport.js + openid-client for secure OAuth flow
- **Session Storage**: PostgreSQL-backed sessions (connect-pg-simple)
- **Security**: HttpOnly cookies, automatic token refresh, 401 handling
- **Client Integration**: useAuth hook provides authentication state across the app
- **Protected Routes**: isAuthenticated middleware guards all sensitive endpoints
- **User Experience**: Auto-redirect to login, user info display in sidebar, logout functionality

**Data Storage**:
- ✅ **PostgreSQL Database** (Neon-backed) - Fully operational with Drizzle ORM
- **Schema**: Users, tasks, user preferences, and sessions tables
- **Status**: ✅ **LIVE** - All critical features (tasks, preferences) now use database storage
- **User Isolation**: All data queries filtered by authenticated user ID for security
- **Migration**: localStorage completely replaced with PostgreSQL for all protected features

### AI Integration

**Provider**: OpenAI API (v6.7.0)
- **Models Used**:
  - `gpt-4o-mini` for text generation (planning, emails, summaries)
  - `gpt-4o-mini-tts` for voice synthesis in mentor feature
  
**Key Features**:
1. **Daily Planning**: Converts unstructured task lists into time-blocked schedules
2. **Email Automation**: Summarizes threads and drafts replies in user's tone
3. **Meeting Summarization**: Extracts action items and next steps from transcripts
4. **AI Mentor**: Provides motivational coaching with voice output (alloy, verse, sol, echo voices)
5. ✅ **Ask FlowAI**: Real-time conversational AI assistant for productivity questions

**Design Pattern**: Server-side API routes handle all OpenAI calls to protect API keys and enable server-side streaming if needed

### External Dependencies

**Third-Party Services**:
- **OpenAI API**: Core AI functionality (requires `OPENAI_API_KEY` environment variable)
- ✅ **Gmail API**: Email sending via Replit connector (google-mail integration)
- ✅ **Google Calendar API**: Calendar sync via Replit connector (google-calendar integration)
- ✅ **PostgreSQL (Neon)**: Database backend via Replit
- **Vercel Analytics**: Built-in analytics tracking (`@vercel/analytics`)
- **Random User API**: Demo profile images for testimonials (randomuser.me)

**Integration Libraries**:
- **googleapis** (v148+): Official Google API client for Gmail and Calendar
- **Drizzle ORM** (v0.44+): Type-safe database queries
- **@neondatabase/serverless**: PostgreSQL connection pooling
- **passport** + **openid-client**: OpenID Connect authentication
- **express-session** + **connect-pg-simple**: Session management with PostgreSQL storage

**Icon Library**: Lucide React for consistent, modern iconography

**Content Rendering**: react-markdown for displaying AI-generated formatted content

### Deployment Configuration

**Target Platform**: Replit (migrated from Vercel)
- Development server: Next.js dev on port 5000, binds to 0.0.0.0
- Production deployment: Configured for autoscale deployment
- Image optimization configured for randomuser.me domain
- Service worker registered at `/service-worker.js` for future PWA capabilities

**Environment Requirements**:
- Node.js 20+
- `OPENAI_API_KEY` - OpenAI API access
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)
- Replit connector tokens - Auto-managed for Gmail and Calendar access

### Key Architectural Decisions

1. **Database-First Migration**: ✅ Migrated from localStorage to PostgreSQL with Drizzle ORM for production-grade persistence. Schema supports users, tasks, and preferences with proper relations and cascading deletes.

2. **Replit Auth Integration**: ✅ Production-ready authentication using Replit's OpenID Connect provider. Sessions stored in PostgreSQL for scalability. All sensitive endpoints (OpenAI, Gmail, tasks) require authentication with automatic user isolation.

3. **Hybrid Express + Next.js Architecture**: Critical API routes run through Express with authentication middleware, while public routes remain on Next.js. This allows fine-grained security control while maintaining Next.js benefits for frontend.

4. **Replit Connectors**: ✅ Using managed OAuth connectors for Gmail and Calendar eliminates manual token management and provides automatic refresh, making integrations more reliable and secure.

5. **Client-Heavy Routing**: Most interactivity happens client-side with "use client" directives, trading server component benefits for simpler state management during MVP phase.

6. **Real External Integrations**: Email sending, calendar sync, and AI features all use production APIs (OpenAI, Gmail, Calendar) with proper authentication and error handling.

7. **Monolithic Structure**: All features live in a single Next.js app rather than microservices, appropriate for current scale but may need decomposition as features grow.

8. **Theme Management**: Custom context provider for dark/light mode rather than external library, giving full control but requiring manual implementation of theme switching logic.

### Database Schema

**Tables**:
- `users`: User accounts with profile information
- `tasks`: User tasks with completion status
- `user_preferences`: JSON preferences per user
- `sessions`: Session storage for authentication

**ORM**: Drizzle with Neon PostgreSQL
**Migrations**: `npm run db:push` for schema synchronization