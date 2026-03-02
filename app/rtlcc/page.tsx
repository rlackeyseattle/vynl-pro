import { prisma } from "@/lib/prisma";
import StageManager from "@/components/rtlcc/StageManager";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RTLCC // STAGE",
    description: "Live score and setlist teleprompter for modern musicians.",
};

export default async function RTLCCPage() {
    const session = await auth();

    // Auto-login for local development
    const userEmail = session?.user?.email || "rlackey.seattle@gmail.com";

    // Fetch all songs and setlists for the profile
    const profile = await prisma.profile.findFirst({
        where: { user: { email: userEmail } },
        include: {
            songs: {
                orderBy: { title: "asc" }
            },
            setlists: {
                include: {
                    songs: {
                        orderBy: { order: "asc" },
                        include: { song: true }
                    }
                }
            }
        }
    });

    if (!profile) {
        redirect("/dashboard");
    }

    return (
        <StageManager
            initialSongs={profile.songs}
            initialSetlists={profile.setlists}
        />
    );
}
