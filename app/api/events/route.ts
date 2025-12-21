// @/app/api/events/route.ts
// This route handles saving (POST) and loading (GET) user-specific events/tasks

import { auth } from "@/auth"; // <-- NextAuth v5: Get the user session
import { NextResponse } from "next/server";
import { db } from "@/db"; // <-- Your Drizzle connection instance
import { eventsTable } from "@/db/schema"; // <-- Your Drizzle table schema
import { eq } from "drizzle-orm"; // <-- Drizzle utility for 'where' clauses
import { v4 as uuidv4 } from 'uuid'; // <-- Utility for generating unique IDs (Run npm install uuid if needed!)

// --- 1. POST Function (Handling Data Saving/Creation) ---
export async function POST(request: Request) {
    // 1. AUTHORIZATION CHECK
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        // Return 401 if user is not logged in
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 2. PARSE AND VALIDATE DATA
        const body = await request.json();
        // **IMPORTANT:** Adjust these field names to match what your client component sends
        const { title, date } = body; 

        if (!title || !date) {
            return NextResponse.json({ error: "Missing required fields (title, date)" }, { status: 400 });
        }

        // 3. INSERT INTO DRIZZLE DB
        const result = await db.insert(eventsTable).values({
            // Ensure your eventsTable schema has columns for id, userId, title, and eventDate
            id: uuidv4(),
            userId: session.user.id, // CRUCIAL: Links this event to the current user
            title: title,
            eventDate: new Date(date), 
            // Add any other fields from your schema here (e.g., description, category)
        }).returning(); // .returning() sends the newly created record back

        // 4. SUCCESS RESPONSE
        return NextResponse.json({ 
            event: result[0], 
            message: "Event successfully saved to database." 
        }, { status: 201 });

    } catch (error) {
        // 5. ERROR HANDLING (This is likely what caused your 500 error!)
        console.error("Database or Server Error during POST:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            detail: "Failed to save data to the database."
        }, { status: 500 });
    }
}


// --- 2. GET Function (Handling Data Loading/Fetching) ---
export async function GET(request: Request) {
    // 1. AUTHORIZATION CHECK
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        // Return 401 if user is not logged in
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 2. FETCH DATA FROM DRIZZLE, FILTERED BY USER ID
        const events = await db.select()
            .from(eventsTable)
            .where(eq(eventsTable.userId, session.user.id)); // <-- Filters data for *this* user only

        // 3. SUCCESS RESPONSE
        return NextResponse.json({ events: events }, { status: 200 });

    } catch (error) {
        console.error("Database or Server Error during GET:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            detail: "Failed to load data from the database."
        }, { status: 500 });
    }
}
