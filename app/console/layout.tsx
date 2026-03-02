import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ConsoleSidebar from "@/components/console/ConsoleSidebar";
import MobileTabBar from "@/components/console/MobileTabBar";
import { ConsoleThemeProvider } from "@/components/console/ConsoleThemeProvider";
import { RadioProvider, RadioPlayerBar } from "@/components/console/RadioPlayer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "VYNL // CONSOLE",
    description: "Your artist studio. From the first chord to load-out.",
};

export default async function ConsoleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user && process.env.NODE_ENV !== "development") {
        redirect("/login");
    }

    const user = session?.user || { name: "Rob Lackey", email: "rlackey.seattle@gmail.com" };

    return (
        <ConsoleThemeProvider>
            <RadioProvider>
                <div className="min-h-screen text-white" style={{ backgroundColor: "var(--ct-bg)" }}>
                    {/* Desktop sidebar */}
                    <div className="hidden md:block">
                        <ConsoleSidebar user={user} />
                    </div>

                    {/* Main content area — extra bottom padding for radio bar */}
                    <main
                        className="md:ml-[220px] min-h-screen pb-16 transition-all duration-300"
                        style={{ backgroundColor: "var(--ct-bg)" }}
                    >
                        {children}
                    </main>

                    {/* Sitewide Radio Player — always visible at bottom */}
                    <RadioPlayerBar />

                    {/* Mobile bottom tab bar */}
                    <MobileTabBar />
                </div>
            </RadioProvider>
        </ConsoleThemeProvider>
    );
}
