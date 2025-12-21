import { auth } from "@/auth"; // Correct import from your config file
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // 🛑 CRITICAL FIX: Use auth()
    const session = await auth(); 

    // Guard Clause: Redirect unauthenticated users
    if (!session) {
        redirect("/login"); 
    }

    // Now, your database queries that rely on the user session can run correctly
    // ... rest of your dashboard component ...
}
