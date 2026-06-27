import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const channelIds = searchParams.getAll("channelIds")
      .flatMap((value) => value.split(",")).filter(Boolean)

    const countByStatus = (status: string) => {
        const where: Prisma.scheduled_postsWhereInput = {
            user_id: userId,
            status,
        }
        if (channelIds.length > 0) where.user_channel_id = { in: channelIds }

        return prisma.scheduled_posts.count({ where })
    }

    const [totalDrafts, totalQueue, totalPublished, totalFailed] = await Promise.all([
      countByStatus("draft"),
      countByStatus("queue"),
      countByStatus("published"),
      countByStatus("failed"),
    ])

    return NextResponse.json({
      totalDrafts,
      totalQueue,
      totalPublished,
      totalFailed,
    })
  } catch (error: unknown) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
