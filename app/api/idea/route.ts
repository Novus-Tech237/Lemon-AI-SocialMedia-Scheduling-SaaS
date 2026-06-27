import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [ideas, groups] = await Promise.all([
         prisma.ideas.findMany({
            where: { user_id: userId },
            orderBy: [
                { sort_order: "asc" },
                { created_at: "desc" },
            ],
         }),
         prisma.idea_groups.findMany({
            orderBy: { created_at: "desc" },
         }),
    ])

    const groupsWithIdeas = groups.map((group) => ({
        id:group.id,
        title: group.name,
        ideas:ideas
            .filter((idea) => idea.group_id === group.id)
            .map((idea) => ({
                id: idea.id,
                title: idea.title,
                description: idea.description,
                images: idea.images ?? [],
                columnId: idea.group_id,
                sortOrder: idea.sort_order
            }))
    }))

    return NextResponse.json({ groups: groupsWithIdeas });
    } catch (error) {
        console.error("Error fetching ideas or groups:", error);
        return NextResponse.json({ error: "Failed to fetch ideas or groups" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        const {
            id,
            title,
            groupId,
            description,
            images,
            sortOrder
        } = await request.json();

        if (!title || !groupId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const payload = {
            user_id: userId,
            group_id: groupId,
            title: title,
            description,
            images: (images ?? []) as Prisma.InputJsonValue,
            sort_order: typeof sortOrder === 'number' ? sortOrder : 0
        };

        let data;

        if (id) {
            const result = await prisma.ideas.updateMany({
                where: { id, user_id: userId },
                data: payload,
            });

            if (result.count === 0) {
                return NextResponse.json({ error: "Idea not found" }, { status: 404 });
            }

            data = await prisma.ideas.findUnique({ where: { id } });
        } else {
            data = await prisma.ideas.create({ data: payload });
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.error("Error upserting idea:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
