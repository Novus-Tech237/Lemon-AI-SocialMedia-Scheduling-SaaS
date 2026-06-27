import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        const { userChannelId } = await request.json();

        if (!userChannelId) {
            return NextResponse.json({ error: "User channel ID is required" }, { status: 400 });
        }

        const userChannelData = await prisma.user_channels.findFirst({
            where: { id: userChannelId, user_id: userId },
            select: { id: true, user_id: true },
        });

        if (!userChannelData) {
            return NextResponse.json({ error: "User channel not found" }, { status: 404 });
        }

        await prisma.user_channels.updateMany({
            where: { id: userChannelId, user_id: userId },
            data: {
                access_token: null,
                refresh_token: null,
                token_expires_at: null,
                is_connected: false,
                is_active: false,
            },
        });

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Error disconnecting channel:", error);
        return NextResponse.json({ error: "Failed to disconnect channel" }, { status: 500 });
    }
}
