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
```