import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/invites/verify?code=XXXX
export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.json({ valid: false, error: "No code provided" });

    const invite = await prisma.inviteCode.findUnique({ where: { code } });

    if (!invite) return NextResponse.json({ valid: false, error: "Invite not found" });
    if (invite.expiresAt && invite.expiresAt < new Date())
        return NextResponse.json({ valid: false, error: "Invite has expired" });
    if (invite.useCount >= invite.maxUses)
        return NextResponse.json({ valid: false, error: "Invite has already been used" });

    return NextResponse.json({ valid: true, invite: { code: invite.code, label: invite.label } });
}
