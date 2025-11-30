import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/client";
import { authAccounts, authSessions, authVerificationTokens, users } from "./db/schema";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

async function getOrCreateUserByEmail(email: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const normalizedEmail = email.toLowerCase().trim();
  
  const { isEmailAllowed } = await import("../server/allowlist");
  if (!isEmailAllowed(normalizedEmail)) {
    throw new Error("Email not allowed");
  }
  
  let user = await sql`
    SELECT id, email, name, image, onboarding_completed 
    FROM users 
    WHERE email = ${normalizedEmail} 
    LIMIT 1
  `;
  
  if (user.length === 0) {
    user = await sql`
      INSERT INTO users (email, name, email_verified)
      VALUES (${normalizedEmail}, ${normalizedEmail.split('@')[0]}, NOW())
      RETURNING id, email, name, image, onboarding_completed
    `;
    
    const freePlans = await sql`SELECT id FROM subscription_plans WHERE slug = 'free' LIMIT 1`;
    if (freePlans[0]) {
      await sql`
        INSERT INTO user_subscriptions (user_id, plan_id, status)
        VALUES (${user[0].id}, ${freePlans[0].id}, 'active')
      `;
    }
  }
  
  return {
    id: user[0].id as string,
    email: user[0].email as string,
    name: user[0].name as string | null,
    image: user[0].image as string | null,
    onboardingCompleted: user[0].onboarding_completed as boolean || false,
  };
}

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
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        try {
          return await getOrCreateUserByEmail(credentials.email as string);
        } catch (error) {
          console.error("Email auth error:", error);
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

      //Create subscription using direct SQL to avoid pool issues
      if (user.id) {
        try {
          const sql = neon(process.env.DATABASE_URL!);
          
          const existingSubscriptions = await sql`
            SELECT id FROM user_subscriptions WHERE user_id = ${user.id} LIMIT 1
          `;
          
          if (existingSubscriptions.length === 0) {
            const freePlans = await sql`
              SELECT id FROM subscription_plans WHERE slug = 'free' LIMIT 1
            `;
            
            if (freePlans.length > 0) {
              await sql`
                INSERT INTO user_subscriptions (user_id, plan_id, status)
                VALUES (${user.id}, ${freePlans[0].id}, 'active')
              `;
              console.log(`✅ Free subscription created for: ${user.email}`);
            }
          }
        } catch (error) {
          console.error("⚠️  Subscription error:", error);
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
      
      // Refresh user data on update trigger
      if (trigger === "update" && token.id) {
        try {
          const sql = neon(process.env.DATABASE_URL!);
          const rows = await sql`SELECT onboarding_completed FROM users WHERE id = ${token.id as string} LIMIT 1`;
          if (rows[0]) {
            token.onboardingCompleted = rows[0].onboarding_completed as boolean;
          }
        } catch (error) {
          console.error("JWT refresh error:", error);
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
  trustHost: true,
});
