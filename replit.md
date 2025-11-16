# Refraim AI - AI-Powered Productivity Platform

## Overview
Refraim AI is an AI-powered productivity platform built with Next.js, designed to help users manage tasks, schedules, and emails efficiently. It leverages OpenAI's API for intelligent planning, email assistance, and motivational mentoring, aiming to automate routine work and protect deep focus time. The platform integrates with Google services (Gmail, Calendar) and uses a PostgreSQL database, deployed on Replit. Its core purpose is to enhance personal and professional efficiency by providing a comprehensive suite of AI-driven tools.

## Recent Work (Nov 16, 2025)
**Production Ready - All Features Functional**: 
- ✅ Removed demo/fake email page, now using real Gmail API integration
- ✅ Created full Profile page with user data display and settings
- ✅ All data persists in PostgreSQL database (users, tasks, calendar events, preferences)
- ✅ Gmail OAuth integration fully functional for inbox viewing and sending
- ✅ Email composing with AI-generated drafts
- ✅ Email summarization and AI replies
- ✅ Profile section with onboarding preferences display
- ✅ Navigation updated with Profile and Email Settings links

**Authentication**: Email + Google OAuth working perfectly. Session management with JWT.

**Current State**: 100% production-ready. All features fully functional, not demo data. Real Gmail integration, database persistence, profile management. Ready for launch with 15 testers today.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend uses Next.js 15.1.6 (App Router), React 18.3.1, and Tailwind CSS v4 for styling with a gradient-based theme and glassmorphism effects. Framer Motion handles animations, and TypeScript ensures type safety. It features a landing page and protected `/app` routes. A custom design system utilizes CSS custom properties for theming and custom fonts (Inter, DM Sans).

### Backend
A custom Express server co-exists with Next.js, managing protected API routes with NextAuth v5 JWT authentication. Key routes include AI chat (`/api/ask-refraim`), email management (`/api/email/*`), AI mentor (`/api/mentor`), tasks (`/api/tasks`), user preferences (`/api/preferences`), and analytics (`/api/analytics`). The analytics endpoint calculates real-time user metrics from the database, including completed tasks, focus hours from calendar events, productivity scores, and activity streaks over a 30-day lookback period. It supports hybrid authentication for local calendar CRUD operations. The platform offers dual-mode email support: Gmail users via OAuth (using Replit's Google Mail connection and Gmail API) and non-Gmail users via IMAP/SMTP protocols with AES-256-CBC encrypted passwords. OAuth redirect flows preserve callback URLs to ensure users return to their intended destination after authentication.

### AI Integration
Refraim AI uses OpenAI API (v6.7.0), specifically `gpt-4o-mini` for text generation and `gpt-4o-mini-tts` for voice synthesis. AI features include daily planning, email automation, meeting summarization, and an AI mentor. The "Ask Refraim" feature integrates with Google Calendar for context-aware responses, handling timezones with `date-fns-tz`. All OpenAI interactions are server-side for security.

### Authentication
NextAuth v5 provides production-ready multi-provider OAuth (Google, Microsoft, Apple) with JWT-based sessions. Per-user OAuth tokens for Google and Microsoft are stored in the database and automatically refreshed, secured with `HttpOnly` cookies and JWT signing. Access control is configurable via the `REFRAIM_ACCESS_MODE` environment variable ('open' or 'allowlist'), with allowlist enforcement implemented in the NextAuth signIn callback.

### Data Storage
PostgreSQL (Neon-backed) is the primary database, managed with Drizzle ORM. The schema includes tables for users, tasks, user preferences, and `calendar_events` (supporting both authenticated users via `userId` and unauthenticated via `sessionId`). NextAuth tables are also integrated. All data queries are filtered by `userId` or `sessionId` for security. All update/delete operations use compound WHERE clauses (e.g., `WHERE id = ? AND userId = ?`) to prevent unauthorized cross-user data access.

### Key Architectural Decisions
1.  **Database-First Migration**: Transitioned from `localStorage` to PostgreSQL with Drizzle ORM for robust data persistence.
2.  **NextAuth Multi-Provider OAuth**: Implemented production-ready authentication with various providers and JWT sessions, securing all sensitive endpoints.
3.  **Hybrid Express + Next.js Architecture**: Combines an Express server for secure API routes with Next.js for the frontend.
4.  **Per-User OAuth Tokens**: Utilizes individual OAuth tokens for Gmail and Calendar access, stored securely and refreshed automatically.
5.  **Monolithic Structure**: All features reside within a single Next.js application.
6.  **Real-Time Analytics**: Moved from mock data to database-driven analytics with live metrics calculation for production readiness.
7.  **Security-First Data Isolation**: All CRUD operations enforce compound WHERE clauses to prevent cross-user data access.

### UI/UX Decisions
-   **Command Palette (⌘K)**: Global keyboard shortcut for quick access to actions and navigation.
-   **Toast Notification System**: Integrated Sonner for real-time user feedback.
-   **Professional Weekly Calendar**: Features a 24-hour format, 7-day view, GMT timezone indicator, all-day events row, real-time event creation, and week navigation.
-   **Click-to-Create Events**: Calendar time slots are clickable to instantly create events with pre-filled details.
-   **Email Helper Redesign**: Professional glassmorphism UI for Inbox/Compose, with comprehensive error handling and proper OAuth callback flow.
-   **British Localisation**: All text converted to British spelling.
-   **Performance Optimization**: Animations are kept under 400ms, and infinite animation loops have been removed.
-   **Real Analytics Dashboard**: Stats page displays live user data including task completion rates, focus hours, productivity scores, and activity streaks calculated from actual database records.

## External Dependencies

### Third-Party Services
-   **OpenAI API**: Core AI functionalities.
-   **Google Calendar API**: Calendar synchronization via per-user OAuth tokens.
-   **Universal Email Support (IMAP/SMTP)**: Direct protocol integration for various email providers.
-   **PostgreSQL (Neon)**: Database backend.
-   **Vercel Analytics**: Application analytics.
-   **Random User API**: Demo profile images.

### Integration Libraries
-   **googleapis**: Official client for Google Calendar API.
-   **nodemailer**: Universal SMTP email sending.
-   **imap**: IMAP protocol client for inbox fetching.
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
-   **Environment Variables**: Requires `OPENAI_API_KEY`, `DATABASE_URL`, `ENCRYPTION_KEY`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and optionally Microsoft/Apple OAuth credentials.