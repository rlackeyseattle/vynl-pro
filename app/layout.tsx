import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthContext from "@/components/auth/AuthContext";
import { AudioProvider } from "@/context/AudioContext";
import GlobalPlayer from "@/components/audio/GlobalPlayer";
import GlobalNav from "@/components/layout/GlobalNav";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "VYNL // UNIVERSAL MUSICIAN OS",
        template: "%s | VYNL"
    },
    description: "The all-in-one toolkit and social network for the modern musician by Rob Lackey.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
                <AuthContext>
                    <AudioProvider>
                        {children}
                        <GlobalPlayer />
                        <GlobalNav />
                    </AudioProvider>
                </AuthContext>
            </body>
        </html>
    );
}
