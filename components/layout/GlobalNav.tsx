"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function GlobalNav() {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Don't show on the dashboard itself, landing page, or login
    const isExcluded = pathname === "/dashboard" || pathname === "/" || pathname === "/login";

    if (!session || isExcluded) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="fixed bottom-10 right-10 z-[100]"
            >
                <Link href="/dashboard">
                    <button className="group relative flex items-center gap-3 bg-white text-black px-6 py-4 rounded-3xl font-black tracking-[0.2em] uppercase text-[10px] shadow-[0_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0_20px_60px_rgba(0,242,242,0.4)] transition-all hover:scale-105 active:scale-95 border border-white/20">
                        <div className="absolute inset-0 bg-[#00f2f2] opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl" />
                        <Layout size={16} className="text-black group-hover:text-vynl-teal transition-colors" />
                        <span>Command Center</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f2f2] animate-pulse" />
                    </button>
                </Link>
            </motion.div>
        </AnimatePresence>
    );
}
