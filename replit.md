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

**API Routes** (Next.js Route Handlers):
- `/api/plan` - Generates AI-powered daily schedules
- `/api/summarise` - Summarizes tasks into time-blocked plans
- `/api/email/generate` - Drafts emails using AI
- `/api/email/send` - ✅ **LIVE** - Sends real emails via Gmail API
- `/api/mentor` - Provides motivational feedback with voice synthesis
- `/api/summarise-call` - Summarizes meeting transcripts
- `/api/summarise-emails` - Processes and prioritizes email threads
- `/api/signup` - Handles user trial registration
- `/api/ask-flowai` - ✅ **NEW** - Real-time AI chat assistant powered by OpenAI
- `/api/calendar/events` - ✅ **NEW** - Fetch and create Google Calendar events

**Authentication**: Currently mocked with localStorage-based session simulation
- **Status**: Basic session handling in place, full Replit Auth integration pending

**Data Storage**:
- ✅ **PostgreSQL Database** (Neon-backed) - Configured with Drizzle ORM
- **Schema**: Users, tasks, user preferences, and sessions tables
- **Status**: Database infrastructure ready; migration from localStorage in progress
- LocalStorage still used for some client-side data (migration underway)

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

2. **Replit Connectors**: ✅ Using managed OAuth connectors for Gmail and Calendar eliminates manual token management and provides automatic refresh, making integrations more reliable and secure.

3. **Client-Heavy Routing**: Most interactivity happens client-side with "use client" directives, trading server component benefits for simpler state management during MVP phase.

4. **Real External Integrations**: Email sending and calendar sync now use production Gmail/Calendar APIs (no mocking). Authentication still uses lightweight session simulation pending full Replit Auth integration.

5. **Monolithic Structure**: All features live in a single Next.js app rather than microservices, appropriate for current scale but may need decomposition as features grow.

6. **Theme Management**: Custom context provider for dark/light mode rather than external library, giving full control but requiring manual implementation of theme switching logic.

### Database Schema

**Tables**:
- `users`: User accounts with profile information
- `tasks`: User tasks with completion status
- `user_preferences`: JSON preferences per user
- `sessions`: Session storage for authentication

**ORM**: Drizzle with Neon PostgreSQL
**Migrations**: `npm run db:push` for schema synchronization