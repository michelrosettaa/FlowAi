# FlowAI - AI-Powered Productivity Platform

## Overview

FlowAI is a Next.js-based AI productivity platform designed to enhance user productivity by intelligently managing daily tasks, schedules, emails, and focus time. Leveraging OpenAI's API, it provides intelligent planning, email assistance, and motivational mentoring. The platform aims to automate routine work and safeguard deep focus periods, offering a comprehensive suite for personal and professional efficiency. It is deployed on Replit, utilizing a PostgreSQL database and integrated with Google services like Gmail and Calendar.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with Next.js 15.1.6 (App Router) and React 18.3.1, styled using Tailwind CSS v4 with custom design tokens and gradient-based theming. Framer Motion is used for animations, and TypeScript ensures type safety. The application features a landing page and protected `/app` routes for authenticated users, with a design system based on CSS custom properties for theming, glassmorphism effects, and custom fonts (Inter, DM Sans).

### Backend Architecture

A custom Express server runs alongside Next.js, handling protected API routes with NextAuth v5 JWT authentication. Key protected routes include `/api/ask-flowai` (AI chat with Google Calendar integration), `/api/email/generate`, `/api/email/send`, `/api/email/inbox`, `/api/email/reply`, `/api/mentor`, `/api/tasks`, and `/api/preferences`. A hybrid authentication system supports local calendar CRUD operations (`/api/app-calendar/events`) for both authenticated (via `userId`) and unauthenticated (via `sessionId` and Express sessions) users.

**Hybrid Email Support**: FlowAI implements a dual-mode email system combining OAuth and traditional protocols. Gmail users authenticate via OAuth (using Replit's Google Mail connection) for secure, password-free email access through Gmail API. Non-Gmail users (Outlook, Yahoo, iCloud, ProtonMail, corporate email) connect via IMAP/SMTP protocols with AES-256-CBC encrypted passwords (requires `ENCRYPTION_KEY` environment variable). The system automatically detects which method to use, providing seamless email integration regardless of provider. Auto-detection provides optimal IMAP/SMTP settings for popular providers, with TLS certificate validation enabled for security.

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
-   **Google Calendar API**: For calendar synchronization via per-user OAuth tokens.
-   **Universal Email Support (IMAP/SMTP)**: Direct protocol integration supporting Gmail, Outlook, Yahoo, iCloud, ProtonMail, and any custom provider.
-   **PostgreSQL (Neon)**: Database backend.
-   **Vercel Analytics**: For application analytics.
-   **Random User API**: For demo profile images.

### Integration Libraries

-   **googleapis**: Official client for Google Calendar API integration.
-   **nodemailer**: Universal SMTP email sending for any provider.
-   **imap**: IMAP protocol client for inbox fetching from any provider.
-   **mailparser**: Email parsing and HTML content extraction.
-   **Drizzle ORM**: Type-safe database queries.
-   **@neondatabase/serverless**: PostgreSQL connection pooling.
-   **next-auth**: Multi-provider OAuth authentication.
-   **@auth/drizzle-adapter**: NextAuth database adapter.
-   **date-fns** + **date-fns-tz**: Timezone-aware date handling.
-   **Lucide React**: Icon library.
-   **react-markdown**: For rendering AI-generated content.

### Deployment Configuration

-   **Target Platform**: Replit.
-   **Environment Variables**: Requires `OPENAI_API_KEY`, `DATABASE_URL`, `ENCRYPTION_KEY` (32-character random key for email password encryption), `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and optionally Microsoft/Apple OAuth credentials.

## Recent Changes

### November 14, 2025 - Hybrid Gmail OAuth + IMAP/SMTP Email System (Production-Ready)
- **Gmail OAuth Integration**: Implemented Gmail API service using existing Google Mail OAuth connection for seamless, password-free Gmail access
- **Hybrid Email Routing**: Created intelligent routing system that detects Gmail OAuth connection and automatically routes to Gmail API, falling back to IMAP/SMTP for other providers
- **Access Token Fix**: Fixed critical bug in OAuth token reading to correctly access `settings.oauth.credentials.access_token` from Replit connector
- **Enhanced Diagnostics**: Added clear logging to distinguish when Gmail OAuth is connected vs disconnected for better debugging
- **UI Updates**: Updated Email Helper page to recognize Gmail OAuth connection status and display appropriate messaging
- **API Endpoints**: Modified `/api/email/inbox`, `/api/email/send`, and `/api/email/accounts` to support hybrid Gmail OAuth + IMAP/SMTP routing
- **Production-Ready**: Architect confirmed Gmail OAuth routing works correctly and system is ready for production deployment
- **Architecture**: Gmail users get OAuth (secure, no passwords), while other providers use encrypted IMAP/SMTP credentials

### November 14, 2025 - Universal Email Support (Production-Ready)
- **Provider-Agnostic Email Integration**: Migrated from Gmail API to universal IMAP/SMTP protocols supporting ANY email provider
- **Supported Providers**: Gmail, Outlook, Yahoo, iCloud, ProtonMail, and any custom corporate email server
- **Email Settings Page**: Built comprehensive UI at `/app/settings/email` for users to add and manage email accounts
- **Auto-Detection System**: Created intelligent provider detection in `server/email-providers.ts` that automatically configures optimal IMAP/SMTP settings for popular providers
- **Secure Password Encryption**: Implemented AES-256-CBC encryption using `crypto-utils.ts` with required `ENCRYPTION_KEY` environment variable
- **Database Schema**: Added `email_accounts` table with encrypted credentials storage via Drizzle ORM
- **IMAP Service**: Built `server/imap-service.ts` for fetching inbox from any provider with proper TLS certificate validation
- **SMTP Service**: Created `server/smtp-service.ts` using nodemailer for universal email sending
- **Security Hardening**: Enabled TLS certificate validation, removed default encryption key fallback, enforced `ENCRYPTION_KEY` requirement at startup
- **Email Helper Integration**: Updated UI to detect when no email account is configured and prompt users to Settings
- **API Endpoints**: Updated `/api/email/inbox`, `/api/email/send`, and `/api/email/reply` to use universal IMAP/SMTP services
- **Production-Ready**: Architect confirmed all security gaps closed and implementation ready for production deployment
- **Libraries Added**: `nodemailer`, `imap`, `mailparser` for universal email protocol support

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