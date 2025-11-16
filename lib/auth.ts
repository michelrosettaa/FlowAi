import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Microsoft from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/client";
import { authAccounts, authSessions, authVerificationTokens, users } from "./db/schema";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboardingCompleted?: boolean;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: authAccounts,
    sessionsTable: authSessions,
    verificationTokensTable: authVerificationTokens,
  }),
  session: {
    strategy: "jwt", // Required for Credentials provider
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const email = credentials.email as string;
        
        try {
          // Use direct SQL connection for auth (avoids pool issues)
          const sql = neon(process.env.DATABASE_URL!);
          
          // Find existing user
          const existingUsers = await sql`
            SELECT id, email, name, image, email_verified, onboarding_completed 
            FROM users 
            WHERE email = ${email}
            LIMIT 1
          `;
          
          if (existingUsers.length > 0) {
            const user = existingUsers[0];
            return {
              id: user.id as string,
              email: user.email as string,
              name: user.name as string | null,
              image: user.image as string | null,
              onboardingCompleted: user.onboarding_completed as boolean,
            };
          }
          
          // Create new user
          const newUsers = await sql`
            INSERT INTO users (email, name, email_verified)
            VALUES (${email}, ${email.split('@')[0]}, NOW())
            RETURNING id, email, name, image, email_verified, onboarding_completed
          `;
          
          if (newUsers.length > 0) {
            const user = newUsers[0];
            return {
              id: user.id as string,
              email: user.email as string,
              name: user.name as string | null,
              image: user.image as string | null,
              onboardingCompleted: user.onboarding_completed as boolean,
            };
          }
          
          return null;
        } catch (error) {
          console.error("❌ Email auth error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    // Only enable Microsoft if credentials are provided
    ...(process.env.AUTH_MICROSOFT_ID && process.env.AUTH_MICROSOFT_SECRET
      ? [Microsoft({
          clientId: process.env.AUTH_MICROSOFT_ID,
          clientSecret: process.env.AUTH_MICROSOFT_SECRET,
          authorization: {
            params: {
              scope: "openid email profile offline_access Calendars.ReadWrite Mail.Send Mail.ReadWrite",
            },
          },
        })]
      : []),
    // Only enable Apple if credentials are provided
    ...(process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET
      ? [Apple({
          clientId: process.env.AUTH_APPLE_ID,
          clientSecret: process.env.AUTH_APPLE_SECRET,
        })]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      // Check if user's email is allowed to access the platform
      const { isEmailAllowed } = await import("../server/allowlist");
      if (!isEmailAllowed(user.email)) {
        console.log(`🚫 Access denied for ${user.email} - not on allowlist`);
        return false;
      }

      // Create subscription using direct SQL to avoid pool issues
      if (user.id) {
        try {
          const sql = neon(process.env.DATABASE_URL!);
          
          // Check if subscription exists
          const existingSubscriptions = await sql`
            SELECT id FROM user_subscriptions WHERE user_id = ${user.id} LIMIT 1
          `;
          
          if (existingSubscriptions.length === 0) {
            // Get free plan
            const freePlans = await sql`
              SELECT id FROM subscription_plans WHERE slug = 'free' LIMIT 1
            `;
            
            if (freePlans.length > 0) {
              await sql`
                INSERT INTO user_subscriptions (user_id, plan_id, status)
                VALUES (${user.id}, ${freePlans[0].id}, 'active')
              `;
              console.log(`✅ Created Free plan subscription for new user: ${user.email}`);
            }
          }
        } catch (error) {
          console.error("⚠️  Subscription creation error:", error);
          // Don't block sign-in if subscription creation fails
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean ?? false;
      }
      return session;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.onboardingCompleted = (user as any).onboardingCompleted;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      
      // Refresh user data on update trigger using direct SQL
      if (trigger === "update" && token.id) {
        try {
          const sql = neon(process.env.DATABASE_URL!);
          const updatedUsers = await sql`
            SELECT onboarding_completed FROM users WHERE id = ${token.id as string} LIMIT 1
          `;
          
          if (updatedUsers.length > 0) {
            token.onboardingCompleted = updatedUsers[0].onboarding_completed as boolean;
          }
        } catch (error) {
          console.error("⚠️  JWT refresh error:", error);
          // Keep existing token data if refresh fails
        }
      }
      
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl + "/app";
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/onboarding",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
