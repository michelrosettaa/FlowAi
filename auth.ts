// ./auth.ts (Root or wherever your config lives)
import NextAuth from "next-auth";
// Import your providers here (Google, etc.)
// ... import your Drizzle adapter/db setup

// Export the auth configuration object if you still need it for context (e.g., middleware)
// But for the main functions, you use the object destructuring below.

export const { auth, handlers, signIn, signOut } = NextAuth({
    // You should still include all your existing configuration here:
    // providers: [/* ... */],
    // adapter: DrizzleAdapter(db),
    // pages: { /* ... */ },
    // session: { strategy: "jwt" }, // or "database"
    // ...
});

// Note: If you have an 'authOptions' export, you might not need it anymore,
// but if other files are looking for it (as your warnings show), you'll need to
// ensure you export whatever they expect, or update those files too.
// For NextAuth v5, you usually don't export authOptions for session retrieval.
