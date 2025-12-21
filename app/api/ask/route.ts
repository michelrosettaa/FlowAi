// @/app/api/ask/route.ts

import { auth } from "@/auth"; // <-- CORRECT: Import the new universal auth() function
import { NextResponse } from "next/server";
import OpenAI from "openai";

// 1. Initialize OpenAI Client
// Assumes OPENAI_API_KEY is set in your environment variables
const openai = new OpenAI(); 

// 2. Define the POST Route Handler
export async function POST(request: Request) {
    // 🛑 CRITICAL FIX: Replace getServerSession with auth()
    const session = await auth(); 

    // 3. Authorization Check: Stop non-authenticated users immediately
    if (!session || !session.user || !session.user.id) {
        // Return a 401 Unauthorized response
        return NextResponse.json({ 
            error: "Unauthorized", 
            message: "You must be signed in to use the AI service." 
        }, { status: 401 });
    }

    // 4. Get the request body
    const body = await request.json();
    const { prompt } = body; 

    if (!prompt) {
        return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }
    
    try {
        // 5. Call OpenAI, passing the user ID for usage tracking
        // This is a best practice for monitoring and abuse prevention
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Example model
            messages: [{ role: "user", content: prompt }],
            user: session.user.id, // <-- Use the authenticated user's ID here
        });

        const responseText = completion.choices[0].message.content;

        // 6. Return the AI response
        return NextResponse.json({ response: responseText });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error",
            message: "Failed to process the AI request."
        }, { status: 500 });
    }
}
