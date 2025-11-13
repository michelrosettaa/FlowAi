# FlowAI - AI-Powered Productivity Platform

## Overview

FlowAI is a Next.js-based AI productivity platform that helps users manage their daily tasks, schedule, emails, and focus time. The application uses OpenAI's API to provide intelligent planning, email assistance, and motivational mentoring. It's designed as a comprehensive productivity suite that automates routine work and protects deep focus time.

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
- `/api/email/send` - Sends/schedules emails (currently mocked)
- `/api/mentor` - Provides motivational feedback with voice synthesis
- `/api/summarise-call` - Summarizes meeting transcripts
- `/api/summarise-emails` - Processes and prioritizes email threads
- `/api/signup` - Handles user trial registration

**Authentication**: Currently mocked with localStorage-based session simulation
- **Future consideration**: Will need OAuth integration (Gmail, Outlook) for production

**Data Storage**:
- LocalStorage for client-side persistence (tasks, referral codes, user preferences)
- No database currently configured
- **Architecture decision**: Chose localStorage for MVP to avoid infrastructure complexity, but this limits multi-device sync and requires migration to a proper database (likely PostgreSQL with Drizzle ORM based on project patterns)

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

**Design Pattern**: Server-side API routes handle all OpenAI calls to protect API keys and enable server-side streaming if needed

### External Dependencies

**Third-Party Services**:
- **OpenAI API**: Core AI functionality (requires `OPENAI_API_KEY` environment variable)
- **Vercel Analytics**: Built-in analytics tracking (`@vercel/analytics`)
- **Random User API**: Demo profile images for testimonials (randomuser.me)

**Planned Integrations** (referenced but not implemented):
- Google Calendar API (for calendar sync)
- Outlook Calendar API (alternative calendar provider)
- Gmail API (for email automation)
- Push Notifications (service worker registered but not fully implemented)

**Icon Library**: Lucide React for consistent, modern iconography

**Content Rendering**: react-markdown for displaying AI-generated formatted content

### Deployment Configuration

**Target Platform**: Vercel (optimized Next.js deployment)
- Custom server configuration: Runs on port 5000, binds to 0.0.0.0
- Image optimization configured for randomuser.me domain
- Service worker registered at `/service-worker.js` for future PWA capabilities

**Environment Requirements**:
- Node.js 20+
- `OPENAI_API_KEY` environment variable (required for AI features)

### Key Architectural Decisions

1. **No Database Yet**: Chose to build UI-first with localStorage to validate product concept before infrastructure investment. This creates technical debt for multi-user/multi-device scenarios.

2. **Client-Heavy Routing**: Most interactivity happens client-side with "use client" directives, trading server component benefits for simpler state management during MVP phase.

3. **API Mocking**: Email sending, calendar sync, and authentication are partially mocked to demonstrate UI flows without full integration complexity.

4. **Monolithic Structure**: All features live in a single Next.js app rather than microservices, appropriate for current scale but may need decomposition as features grow.

5. **Theme Management**: Custom context provider for dark/light mode rather than external library, giving full control but requiring manual implementation of theme switching logic.