import { AI_MODEL, anthropic } from "@/lib/anthropic";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { has, userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const canUseAI = has({ plan: "pro" }) || has({ plan: "premium" })
        if (!canUseAI) {
            return NextResponse.json({ error: "AI Idea generation requires Pro or Premium plan" }, { status: 403 });
        }

        const { businessType, targetAudience } = await request.json()
        if (!businessType || !targetAudience) {
            return NextResponse.json({ error: "Missing businessType or targetAudience" }, { status: 400 });
        }

        const result = await anthropic.messages.create({
            model: AI_MODEL,
            max_tokens: 1024,
            system: `You are a social media content ideation assistant.
Return only valid JSON.
The response must be an object with an "ideas" array.
Each item must have: "title" and "description".
Generate 3 ideas.
Keep titles catchy.
Keep descriptions practical and specific.
Do not use markdown formatting like **, *, #, or backticks.
Return plain text only inside the JSON strings.`,
            messages: [
                {
                    role: "user",
                    content: `Business type: ${businessType}. Target audience: ${targetAudience}.`
                }
            ]
        })

        const text = result.content
            .filter((block) => block.type === "text")
            .map((block) => block.text)
            .join("")

        const parsed = JSON.parse(stripJsonFences(text)) as { ideas?: { title: string, description: string }[] }
        const ideas = Array.isArray(parsed.ideas) ? parsed.ideas.slice(0, 3) : []

        return NextResponse.json({ ideas })

    } catch (error) {
        console.error("Error generating ideas:", error)
        return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 })
    }
}

// Defensively strip ```json ... ``` fences in case the model wraps its output.
function stripJsonFences(text: string) {
    return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
}
