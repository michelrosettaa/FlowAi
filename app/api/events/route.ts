// Example: ./app/api/events/route.ts

import { auth } from "@/auth"; // <-- NextAuth v5 check
import { NextResponse } from "next/server";
import { db } from "@/db"; // <-- Your Drizzle connection
import { eventsTable } from "@/db/schema"; // <-- Your Drizzle table schema
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation

export async function POST(request: Request) {
    // 1. AUTHORIZATION CHECK (Must be first!)
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 2. PARSE DATA
        const body = await request.json();
        const { title, date } = body; // Adjust based on what your component sends

        if (!title || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 3. INSERT INTO DRIZZLE DB
        const result = await db.insert(eventsTable).values({
            id: uuidv4(),
            userId: session.user.id, // <-- CRUCIAL: Link data to the logged-in user!
            title: title,
            eventDate: new Date(date), // Ensure date format is correct
            // ... include any other fields like category, description, etc.
        }).returning();

        // 4. SUCCESS RESPONSE
        return NextResponse.json({ event: result[0], message: "Event successfully saved to database." }, { status: 201 });

    } catch (error) {
        // 5. ERROR HANDLING (The source of your 500 error!)
        console.error("Drizzle Insert Error:", error);
        // You MUST return a proper response, even if the server code crashes
        return NextResponse.json({ 
            error: "Internal Server Error", 
            detail: "Failed to save data to the database."
        }, { status: 500 });
    }
}
// Example: ./app/api/events/route.ts

import { db } from "@/db"; 
import { eventsTable } from "@/db/schema";
import { eq } from "drizzle-orm"; // Import for comparison operations

export async function GET(request: Request) {
    // 1. AUTHORIZATION CHECK
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 2. FETCH DATA FROM DRIZZLE
        const events = await db.select()
            .from(eventsTable)
            .where(eq(eventsTable.userId, session.user.id)); // <-- Only get this user's data

        // 3. SUCCESS RESPONSE
        return NextResponse.json({ events: events }, { status: 200 });

    } catch (error) {
        console.error("Drizzle Select Error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            detail: "Failed to load data from the database."
        }, { status: 500 });
    }
}
