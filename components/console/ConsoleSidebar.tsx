"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    Wrench,
    Calendar,
    Megaphone,
    DollarSign,
    Users,
    Radio,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    LayoutDashboard,
    Music2,
    Package,
    Cpu,
    Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

const SECTIONS = [
    {
        group: "ARTIST",
        items: [
            {
                name: "Dashboard",
                href: "/console",
                icon: LayoutDashboard,
                description: "Overview",
                color: "from-slate-400 to-slate-600",
                accent: "text-slate-400",
                exact: true,
            },
            {
                name: "EPK",
                href: "/console/epk",
                icon: FileText,
                description: "Press Kit Builder",
                color: "from-cyan-400 to-cyan-600",
                accent: "text-cyan-400",
            },
            {
                name: "Promotion",
                href: "/console/press",
                icon: Megaphone,
                description: "Press & Social",
                color: "from-pink-400 to-pink-600",
                accent: "text-pink-400",
            },
            {
                name: "Finance",
                href: "/console/finance",
                icon: DollarSign,
                description: "Revenue & Merch",
                color: "from-emerald-400 to-emerald-600",
                accent: "text-emerald-400",
            },
        ],
    },
    {
        group: "TOOLS",
        items: [
            {
                name: "Stage",
                href: "/console/stage",
                icon: Music2,
                description: "Setlists & Performance",
                color: "from-orange-400 to-orange-600",
                accent: "text-orange-400",
            },
            {
                name: "Booking",
                href: "/console/wire",
                icon: Calendar,
                description: "Venues & Gigs",
                color: "from-violet-400 to-violet-600",
                accent: "text-violet-400",
            },
            {
                name: "Gear",
                href: "/console/toolkit/gear",
                icon: Package,
                description: "Inventory & Checklists",
                color: "from-amber-400 to-amber-600",
                accent: "text-amber-400",
            },
            {
                name: "AI Tools",
                href: "/console/lab",
                icon: Cpu,
                description: "Radio, AI & Discovery",
                color: "from-rose-400 to-rose-600",
                accent: "text-rose-400",
            },
            {
                name: "Toolkit",
                href: "/console/toolkit",
                icon: Wrench,
                description: "Rig, Rider & Tech",
                color: "from-amber-400 to-amber-600",
                accent: "text-amber-400",
            },
        ],
    },
    {
        group: "COMMUNITY",
        items: [
            {
                name: "Band Team",
                href: "/console/community",
                icon: Users,
                description: "Channels & Crew",
                color: "from-blue-400 to-blue-600",
                accent: "text-blue-400",
            },
            {
                name: "Scene",
                href: "/console/scene",
                icon: Globe,
                description: "PNW Directory",
                color: "from-teal-400 to-teal-600",
                accent: "text-teal-400",
            },
            {
                name: "Radio",
                href: "/console/radio",
                icon: Radio,
                description: "Local & Genre Stations",
                color: "from-pink-400 to-pink-600",
                accent: "text-pink-400",
            },
        ],
    },
];

interface ConsoleSidebarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function ConsoleSidebar({ user }: ConsoleSidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href) && href !== "/console";
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-out
                ${collapsed ? "w-[72px]" : "w-[220px]"}`}
            style={{ backgroundColor: "var(--ct-bg-2)", borderRight: "1px solid var(--ct-border)" }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid var(--ct-border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: `linear-gradient(135deg, var(--ct-accent), var(--ct-accent-2))`, boxShadow: `0 0 20px var(--ct-glow)` }}>
                    <span className="text-black font-black text-sm italic">V</span>
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.15 }}
                        >
                            <p className="font-black text-sm tracking-tight leading-none">VYNL.PRO</p>
                            <p className="text-[8px] text-neutral-500 uppercase tracking-[0.25em] mt-0.5">Artist Console</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-3 px-2.5 space-y-4 overflow-y-auto scrollbar-none">
                {SECTIONS.map((section) => (
                    <div key={section.group}>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="px-2 pb-1 text-[8px] font-black text-neutral-600 uppercase tracking-[0.3em]"
                                >
                                    {section.group}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const active = isActive(item.href, item.exact);
                                const Icon = item.icon;
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <div
                                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                                                ${active
                                                    ? "bg-white/[0.07] text-white"
                                                    : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            {/* Active bar */}
                                            {active && (
                                                <motion.div
                                                    layoutId="activeSidebarItem"
                                                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b ${item.color}`}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                                />
                                            )}

                                            <div className={`flex-shrink-0 transition-all ${active ? item.accent : ""}`}>
                                                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                                            </div>

                                            <AnimatePresence>
                                                {!collapsed && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.1 }}
                                                        className="min-w-0"
                                                    >
                                                        <p className={`text-[11px] font-semibold leading-none ${active ? "text-white" : "group-hover:text-white"}`}>
                                                            {item.name}
                                                        </p>
                                                        <p className="text-[9px] text-neutral-600 mt-0.5 truncate">
                                                            {item.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Collapsed tooltip */}
                                            {collapsed && (
                                                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-neutral-900 border border-white/10 rounded-lg
                                                    text-[10px] font-semibold whitespace-nowrap
                                                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-2.5 py-3 space-y-1" style={{ borderTop: "1px solid var(--ct-border)" }}>
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
                        style={{ background: `linear-gradient(135deg, var(--ct-accent), var(--ct-accent-2))`, color: "#000" }}>
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="min-w-0 flex-1"
                            >
                                <p className="text-[11px] font-semibold truncate leading-none text-white">
                                    {user?.name || "Artist"}
                                </p>
                                <p className="text-[9px] text-cyan-400 mt-0.5 truncate">{user?.email}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-1 px-1">
                    <Link href="/console/settings" className="flex-1">
                        <div className="flex items-center gap-2 p-2 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.04] transition-all">
                            <Settings size={15} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="text-[10px] font-medium">Settings</motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-white/[0.04] transition-all"
                        title="Sign Out"
                    >
                        <LogOut size={15} />
                    </button>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg text-neutral-600 hover:text-white hover:bg-white/[0.04] transition-all"
                    >
                        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                    </button>
                </div>
            </div>
        </aside>
    );
}
