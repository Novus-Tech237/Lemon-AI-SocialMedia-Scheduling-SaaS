import { AI_MODEL, anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


const ACTIONS = ["generate", "rephrase", "shorten", "expand"] as const;
type ActionType = (typeof ACTIONS)[number];

export async function POST(request:NextRequest){
    try {
        const { has, userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const canUseAI = has({ plan: "pro" }) || has({ plan: "premium" })
        if (!canUseAI) {
            return NextResponse.json({ error: "AI Post generation requires Pro or Premium plan" }, { status: 403 });
        }

        const {
            action,
            content="",
            prompt="",
            channelId
        } =await request.json()

        if(!ACTIONS.includes(action as ActionType)){
            return NextResponse.json({ error: "Invalid action" }, { status: 400 })
        }
        if(action === "generate" && !prompt.trim()){
            return NextResponse.json({ error: "Prompt is required for generate action" }, { status: 400 })
        }

        let channelType:string | undefined;
        let characterLimit:number | undefined;

        if(channelId){
            const channelData = await prisma.channel_types.findUnique({
                where: { id: channelId },
                select: { type: true, character_limit: true },
            });

            if(!channelData){
                return NextResponse.json({ error: "Channel not found" }, { status: 404 });
            }
            channelType = channelData.type;
            characterLimit = channelData.character_limit;
        }

        const result = await anthropic.messages.create({
            model: AI_MODEL,
            max_tokens: 1024,
            system: buildSystemPrompt(channelType, characterLimit),
            messages: [
                {
                    role: "user",
                    content: buildPrompt(action, content, prompt),
                },
            ],
        });

        const text = result.content
            .filter((block) => block.type === "text")
            .map((block) => block.text)
            .join("")
            .trim();
        return NextResponse.json({ content: text})
    } catch (error) {
        console.error("Error generating post:", error)
        return NextResponse.json({ error: "Failed to generate post"},{ status:500})
    }
}

function buildSystemPrompt( channelType?: string, characterLimit?: number){
      const system_prompt = [
        "You are a social media writing assistant.",
        "Return only the final post text.",
        "Do not add quotes, labels, bullet points, or explanations.",
        "Do not use markdown formatting like **, *, #, or backticks.",
        "Return plain text only.",
    ]
    if(channelType){
        system_prompt.push(`Write for ${channelType}. Match the platform's tone, style, and expected length. and relevant hashtags. `);
    }
    if(characterLimit){
        system_prompt.push(`Must be less than the maximum character limit: ${characterLimit}. `);
    }
    return system_prompt.join("\n");
}

function buildPrompt(action:ActionType,content:string, prompt:string){
    if (action === "generate") {
        return `Write one clean social media post based on this request:\n${prompt}`
    }
    if (!content.trim()) {
        throw new Error("Content is required for this action")
    }
    if (action === "rephrase") {
        return `Rephrase this social media post while keeping the meaning:\n${content}`
    }
    if (action === "shorten") {
        return `Shorten this social media post while keeping the key message:\n${content}`
    }
    return `Expand this social media post with more helpful detail while keeping the same tone:\n${content}`
}
