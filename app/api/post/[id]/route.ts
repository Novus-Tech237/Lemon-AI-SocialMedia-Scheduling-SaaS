import { POST_STATUS } from "@/constants/post";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(request:NextRequest,
    {params}: {params:Promise<{id:string}>}
){
    try {
        const { id } = await params;
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const {
            content,
            images,
            scheduledAt,
            status
        } = await request.json();

        const updateData: Prisma.scheduled_postsUpdateInput = {};
        if (content) updateData.content = content;
        if (Array.isArray(images)) updateData.images = images as Prisma.InputJsonValue;
        if (scheduledAt) updateData.scheduled_at = new Date(scheduledAt);
        const postStatus = status === POST_STATUS.DRAFT ? POST_STATUS.DRAFT : POST_STATUS.QUEUE;
        updateData.status = postStatus;

        const result = await prisma.scheduled_posts.updateMany({
            where: { id, user_id: userId },
            data: updateData,
        })

        if (result.count === 0) {
            return NextResponse.json({ error: "Failed to update post" }, { status: 404 });
        }

        const post = await prisma.scheduled_posts.findUnique({ where: { id } })

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
