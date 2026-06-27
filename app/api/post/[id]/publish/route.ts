import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        const { userId } = await auth();
        if(!userId) {
            return NextResponse.json({error:"Unauthorized"}, {status:401});
        }

        const post = await prisma.scheduled_posts.findFirst({
            where: { id, user_id: userId },
            select: { id: true, status: true },
        });

        if(!post) {
            return NextResponse.json({error:"Post not found"}, {status:404});
        }
        if(post.status === "published") {
            return NextResponse.json({error:"Post already published"}, {status:400});
        }

        await prisma.scheduled_posts.updateMany({
            where: { id, user_id: userId },
            data: {
                status: "queue",
                scheduled_at: new Date(),
            },
        });

            await inngest.send({
                name: "post/publish.requested",
                data: {
                    postId: id
                }
            });
            return NextResponse.json({success:true});

    } catch (error) {
        console.error("Error publishing post:", error)
        return NextResponse.json({error:"Internal server error"}, {status:500});
    }
}
