import { auth } from "@/auth"; 
import { NextResponse } from "next/server";
// import OpenAI from "openai"; // ... and other necessary imports

export async function POST(request: Request) {
    // 🛑 CRITICAL FIX: Use auth()
    const session = await auth(); 

    // Stop unauthorized users
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // ... Your OpenAI logic goes here ...
}
