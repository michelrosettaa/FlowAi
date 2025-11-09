import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent"
        }
      }
    }),
    // (You can add Azure later, see section 2)
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      // first time: persist access/refresh
      if (account?.provider === "google") {
        token.g_access_token = account.access_token;
        token.g_refresh_token = account.refresh_token ?? token.g_refresh_token;
        token.g_expires_at = Date.now() + (account.expires_in ?? 0) * 1000;
      }
      // refresh if expired
      if (token.g_access_token && Date.now() > (token.g_expires_at ?? 0)) {
        try {
          const params = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.g_refresh_token as string
          });
          const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
          });
          const data = await res.json();
          token.g_access_token = data.access_token;
          token.g_expires_at = Date.now() + data.expires_in * 1000;
        } catch (e) {
          // if refresh fails, user will need to re-consent
        }
      }
      return token;
    },
    async session({ session, token }) {
      // expose access token to server handlers via session
      (session as any).g_access_token = token.g_access_token;
      (session as any).userId = token.sub;
      return session;
    }
  }
};
