import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const { userId } = await auth()
        if(!userId) return new NextResponse('Unauthorized', { status: 401 })

        const filter = request.nextUrl.searchParams.get('filter')

        const [types, userChannels] = await Promise.all([
            prisma.channel_types.findMany({
                orderBy: { created_at: "asc" },
            }),
            prisma.user_channels.findMany({
                where: { user_id: userId },
            }),
        ]);

        const userChannelMap = new Map(
            userChannels.map(channel =>
                [
                    channel.channel_type_id,
                    channel
                ]
            )
        )

        let channels = types.map(channel_type => {
            const userChannel = userChannelMap.get(channel_type.id)
            return {
              id: channel_type.id,
              type: channel_type.type,
              name: channel_type.name,
              color: channel_type.color,
              character_limit: channel_type.character_limit,
              user_channel_id: userChannel?.id ?? null,
              handle: userChannel?.handle ?? null,
              profile_image: userChannel?.profile_image ?? null,
              profile_url: userChannel?.profile_url ?? null,
              connected: userChannel?.is_connected ?? false
            }
        })

        const totalChannels = types.length;
        const connectedCount = channels.filter(channel => channel.connected).length;

        if(filter === 'connected') {
            channels = channels.filter(channel => channel.connected);
        } else if(filter === 'unconnected') {
            channels = channels.filter(channel => !channel.connected);
        }

        return NextResponse.json({
            channels,
            totalChannels,
            connectedCount
        })

    } catch (error) {
        console.error('Error fetching channels:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
