// @/app/dashboard/page.tsx

import { auth } from "@/auth"; // <-- Import the new universal auth() function
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // 1. Await the session using the new v5 helper
    const session = await auth();

    // 2. Redirect unauthenticated users
    if (!session) {
        redirect("/login"); 
    }

    // You now have the session object: session.user, session.expires, etc.
    return (
        <main>
            <h1>Welcome back, {session.user?.name}!</h1>
            {/* ... rest of your dashboard content */}
        </main>
    );
}
