import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        if(!id)return NextResponse.json({ error: "Missing idea ID" }, { status: 400 });

        await prisma.ideas.deleteMany({
            where: { id, user_id: userId },
        });

        return NextResponse.json({ success: true },{ status: 200 });
    } catch (error) {
        console.error("Error deleting idea:", error);
        return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 });
    }
}
