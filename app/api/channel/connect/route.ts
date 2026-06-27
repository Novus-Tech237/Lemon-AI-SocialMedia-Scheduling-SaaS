import { ChannelTypeEnum } from "@/constants/channels";
import { prisma } from "@/lib/prisma";
import { getOAuthProvider } from "@/lib/social-oauth";
import { createPkcePair, getPkceCookieName } from "@/lib/social-oauth/pkce";
import { createOAuthState } from "@/lib/social-oauth/state";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export async function POST(request: NextRequest) {
    try {

        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 401 });

        const {channelTypeId} = await request.json();
        if(!channelTypeId) return NextResponse.json({ error: 'Channel type ID is required' }, { status: 400 });

        const channelType = await prisma.channel_types.findUnique({
            where: { id: channelTypeId },
            select: { id: true, type: true },
        });

            if(!channelType) {
                return NextResponse.json({ error: 'Channel type not found' }, { status: 404 });
            }

            const redirectTo = `${APP_URL}/settings`;

            const provider = getOAuthProvider(channelType.type as ChannelTypeEnum);
            const state = createOAuthState({
                userId,
                channelTypeId: channelType.id,
                channelType: channelType.type as ChannelTypeEnum,
                redirectTo,
            })

           const callbackUrl = `${APP_URL}/api/channel/callback`

           const pkce = channelType.type === ChannelTypeEnum.TWITTER ?
            createPkcePair()
           : null

           const url = provider.getAuthorizationUrl({
            state,
            redirectUri: callbackUrl,
            codeChallenge: pkce?.codeChallenge,
            codeChallengeMethod: pkce?.codeChallengeMethod,
           })

           const response = NextResponse.json({ url})

           if(pkce) {
            response.cookies.set(getPkceCookieName(state), pkce.codeVerifier, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 10, // 10 minutes
            })
           }

           return response;

    } catch (error) {
        console.error('Error connecting channel:', error);
        return NextResponse.json({ error: 'Failed to connect channel' }, { status: 500 });
    }
}
