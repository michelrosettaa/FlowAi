# FlowAI - AI-Powered Productivity Platform

## Overview

FlowAI is a Next.js-based AI productivity platform designed to enhance user productivity by intelligently managing daily tasks, schedules, emails, and focus time. Leveraging OpenAI's API, it provides intelligent planning, email assistance, and motivational mentoring. The platform aims to automate routine work and safeguard deep focus periods, offering a comprehensive suite for personal and professional efficiency. It is deployed on Replit, utilizing a PostgreSQL database and integrated with Google services like Gmail and Calendar.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with Next.js 15.1.6 (App Router) and React 18.3.1, styled using Tailwind CSS v4 with custom design tokens and gradient-based theming. Framer Motion is used for animations, and TypeScript ensures type safety. The application features a landing page and protected `/app` routes for authenticated users, with a design system based on CSS custom properties for theming, glassmorphism effects, and custom fonts (Inter, DM Sans).

### Backend Architecture

A custom Express server runs alongside Next.js, handling protected API routes with NextAuth v5 JWT authentication. Key protected routes include `/api/ask-flowai` (AI chat with Google Calendar integration), `/api/email/generate` and `/api/email/send`, `/api/mentor`, `/api/tasks`, and `/api/preferences`. A hybrid authentication system supports local calendar CRUD operations (`/api/app-calendar/events`) for both authenticated (via `userId`) and unauthenticated (via `sessionId` and Express sessions) users.

### AI Integration

OpenAI API (v6.7.0) is central to FlowAI's intelligence, utilizing `gpt-4o-mini` for text generation and `gpt-4o-mini-tts` for voice synthesis. AI features include daily planning, email automation, meeting summarization, and an AI mentor. The "Ask FlowAI" feature integrates with Google Calendar to provide real-time, context-aware responses about user schedules, handling timezones with `date-fns-tz`. All OpenAI calls are handled server-side for security.

### Authentication

NextAuth v5 provides production-ready multi-provider OAuth authentication (Google, Microsoft, Apple) with JWT-based sessions. Per-user OAuth tokens for Google and Microsoft are stored in the `auth_accounts` table and automatically refreshed. `HttpOnly` cookies and JWT signing ensure security.

### Data Storage

PostgreSQL (Neon-backed) is the primary database, managed with Drizzle ORM. The schema includes tables for users, tasks, user preferences, and `calendar_events` supporting hybrid authentication (via `userId` or `sessionId`). NextAuth tables (`auth_accounts`, `auth_sessions`, `auth_verification_tokens`) are also integrated. All data queries are filtered by authenticated `userId` or `sessionId` for security and user isolation.

### Key Architectural Decisions

1.  **Database-First Migration**: Transitioned from `localStorage` to PostgreSQL with Drizzle ORM for robust data persistence.
2.  **NextAuth Multi-Provider OAuth**: Implemented production-ready authentication with various providers and JWT sessions, securing all sensitive endpoints.
3.  **Hybrid Express + Next.js Architecture**: Combines an Express server for secure API routes with Next.js for the frontend, allowing granular security control.
4.  **Per-User OAuth Tokens**: Utilizes individual OAuth tokens for Gmail and Calendar access, stored securely and refreshed automatically.
5.  **Monolithic Structure**: All features reside within a single Next.js application, suitable for the current scale.

## External Dependencies

### Third-Party Services

-   **OpenAI API**: For core AI functionalities.
-   **Gmail API**: For sending emails via per-user OAuth tokens.
-   **Google Calendar API**: For calendar synchronization via per-user OAuth tokens.
-   **PostgreSQL (Neon)**: Database backend.
-   **Vercel Analytics**: For application analytics.
-   **Random User API**: For demo profile images.

### Integration Libraries

-   **googleapis**: Official client for Gmail and Calendar API integration.
-   **Drizzle ORM**: Type-safe database queries.
-   **@neondatabase/serverless**: PostgreSQL connection pooling.
-   **next-auth**: Multi-provider OAuth authentication.
-   **@auth/drizzle-adapter**: NextAuth database adapter.
-   **date-fns** + **date-fns-tz**: Timezone-aware date handling.
-   **Lucide React**: Icon library.
-   **react-markdown**: For rendering AI-generated content.

### Deployment Configuration

-   **Target Platform**: Replit.
-   **Environment Variables**: Requires `OPENAI_API_KEY`, `DATABASE_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and optionally Microsoft/Apple OAuth credentials.

## Recent Changes

### November 14, 2025 - Interactive Features, Professional Calendar & Email Intelligence
- **Toast Notification System**: Integrated Sonner library for real-time user feedback on actions throughout the app
- **Command Palette (⌘K)**: Global keyboard shortcut providing quick access to create tasks, schedule events, ask AI, and navigate between features
- **Interactive Dashboard**: Animated statistics cards with loading states, smooth <400ms transitions, removed infinite animations per UX guidelines
- **Floating Quick Action Button**: Added keyboard shortcut hint button without distracting infinite animations
- **Quick Actions Banner**: Dismissible educational banner to teach users about ⌘K functionality
- **British Localisation**: Completed conversion of all text to British spelling (personalise, organise, prioritise, cancelled, analyse, optimise, summarise) throughout entire codebase
- **Performance Optimisation**: All animations kept under 400ms, infinite loops removed from primary surfaces, dynamic imports for client-side components
- **UX Improvements**: Reserved toast notifications for actionable confirmations/errors to prevent alert fatigue
- **Professional Weekly Calendar**: Replaced AI planner with Reclaim.ai-style calendar featuring 24-hour time format (00:00-23:00), 7-day week view, GMT timezone indicator, all-day events row, and real-time event creation with immediate refetch
- **Real-Time Event Updates**: Implemented `useCalendarEventsWithRefetch` hook that watches refetch triggers and immediately displays newly created events from `/api/app-calendar/events`
- **Week Navigation**: Fully functional Previous/Next/Today buttons to navigate across weeks and months, with weekOffset state propagating through event fetching and transformation logic
- **Day/Week View Toggle**: Reclaim.ai-style view switcher allowing users to toggle between single-day and 7-day week views
- **Calendar Height Constraint**: Added maxHeight to prevent calendar grid from extending to page bottom, with proper scroll behavior
- **Click-to-Create Events**: Calendar time slots are now clickable - click any hour to instantly create events with pre-filled date and time
- **Ask FlowAI Universal Access**: Made AI assistant accessible to all users (authenticated and unauthenticated), with authenticated users getting calendar-aware responses
- **Email Inbox Integration**: Added Gmail inbox view with real-time email fetching via `/api/email/inbox` endpoint
- **AI-Powered Email Replies**: Implemented context-aware reply generation via `/api/email/reply` with HTML email parsing and 2000-character body extraction
- **Email Helper Redesign**: Professional glassmorphism UI with Inbox/Compose tabs, full error handling, and retry affordances
- **Comprehensive Error States**: All API failures (inbox fetch, reply generation, email send) surface in UI with clear error messages and retry buttons

### Calendar Components Added/Updated
- `app/components/CalendarWeekView.tsx` - Professional weekly calendar with 24-hour format, 7-day grid, all-day events row, week navigation, view toggle, height constraint
- `app/components/AddEventModal.tsx` - Event creation modal with refetch integration
- `app/app/planner/page.tsx` - Replaced AI text generation with interactive calendar view
- `transformAppEventsToCalendarEvents()` - Event transformation function accounting for weekOffset to correctly filter and position events for any week
```