// ./auth.ts

import NextAuth from "next-auth";
// 🛑 IMPORTANT: Import your providers (Google, GitHub, etc.)
import Google from "next-auth/providers/google"; 
// 🛑 IMPORTANT: Import your Drizzle Adapter
import { DrizzleAdapter } from "@auth/drizzle-adapter"; 
// 🛑 IMPORTANT: Import your Drizzle database instance
import { db } from "@/db"; // <--- Adjust this path to your Drizzle instance

// This is your NextAuth configuration object
const authConfig = {
    adapter: DrizzleAdapter(db), // Use your adapter instance here
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // ... include any other providers
    ],
    // If you use custom sign-in pages, add them here
    pages: {
        signIn: "/login",
    },
    // Include any other callbacks or configurations you had previously
};

// Export the destructured functions by passing the config object to NextAuth
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

// If other files absolutely *must* import a configuration object, you can export it too:
export const authOptions = authConfig; // This handles the 'authOptions' warning
