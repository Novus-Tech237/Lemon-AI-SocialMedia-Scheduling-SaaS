import { getInsforgeServerClient } from "@/lib/insforge-server";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){
    try {
        const {insforge, userId} = await getInsforgeServerClient()
        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const searchParams = request.nextUrl.searchParams
        const channelIds = searchParams.getAll("channelIds")
        .flatMap((channel) => channel.split(",")).filter(Boolean)

        let query = insforge.database.from("scheduled_posts")
            .select("id, status")
            .eq("user_id", userId)

        if(channelIds.length > 0){
            query.in("user_channel_id", channelIds)
        }

        const {data,error} = await query;
        if(error) throw error;

        const totalDaft = data.filter((post) => post.status === "draft").length;
        const totalQueue = data.filter((post) => post.status === "queue").length;
        const totalPublished = data.filter((post) => post.status === "published").length;
        const totalFailed = data.filter((post) => post.status === "failed").length;

        return NextResponse.json({
            totalDaft,
            totalQueue,
            totalPublished,
            totalFailed
        });
        
    } catch (error) {
        console.error("Error fetching post totals:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
