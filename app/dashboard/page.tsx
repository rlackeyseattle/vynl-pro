"use client";

import React from "react";
import {
    Layout, Disc, Mic2, Cpu, Activity,
    Settings, Zap, BarChart3, Music2,
    Plus, ArrowUpRight, Headphones, Play
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import MusicUpload from "@/components/dashboard/MusicUpload";
import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function DashboardPage() {
    const [view, setView] = React.useState<"OVERVIEW" | "UPLOAD" | "SETTINGS">("OVERVIEW");
    const [profile, setProfile] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch("/api/profile")
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans selection:bg-vynl-teal/30">
            {/* Header */}
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setView("OVERVIEW")}
                >
                    <div className="w-12 h-12 bg-vynl-teal rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,242,0.3)]">
                        <Cpu className="text-black" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">COMMAND CENTER</h1>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em]">Vynl Pro Artist Suite</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView("SETTINGS")}
                        className={`p-4 rounded-2xl border transition-all ${view === "SETTINGS" ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-400"}`}
                    >
                        <Settings size={20} />
                    </button>
                    <div className="flex items-center gap-4 bg-neutral-900 border border-white/5 rounded-2xl px-6 py-3">
                        <div className="w-8 h-8 rounded-full bg-vynl-orange animate-pulse shadow-[0_0_15px_rgba(255,77,0,0.3)]" />
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">{profile?.user?.name || "Rob Lackey"}</p>
                            <p className="text-[8px] text-vynl-teal uppercase tracking-widest mt-1">Status: Operational</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {view === "UPLOAD" ? (
                    <div className="max-w-2xl mx-auto py-10">
                        <MusicUpload onComplete={() => setView("OVERVIEW")} />
                    </div>
                ) : view === "SETTINGS" ? (
                    <div className="max-w-4xl mx-auto py-10">
                        {loading ? <div className="animate-pulse py-20 text-center text-neutral-500 uppercase tracking-widest">Recalling Identity...</div> : (
                            <ProfileSettings profile={profile} onComplete={() => setView("OVERVIEW")} />
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Primary Actions */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DashboardCard
                                    onClick={() => setView("UPLOAD")}
                                    icon={<Plus size={24} />}
                                    title="SIGNAL TRANSMIT"
                                    description="Upload & Distribute New Music"
                                    color="vynl-teal"
                                />
                                <DashboardCard
                                    href="/mastering"
                                    icon={<Disc size={24} />}
                                    title="THE PRESS"
                                    description="AI-Powered Audio Mastering Engine"
                                    color="white"
                                />
                                <DashboardCard
                                    href="/rtlcc"
                                    icon={<Mic2 size={24} />}
                                    title="STAGE MODE"
                                    description="Live Score & Setlist Teleprompter"
                                    color="vynl-orange"
                                />
                                <DashboardCard
                                    href="/epk"
                                    icon={<Layout size={24} />}
                                    title="EPK BUILDER"
                                    description="Global Press Kit & Social Identity"
                                    color="white"
                                />
                            </div>

                            {/* Quick Stats / Feed Concept */}
                            <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BarChart3 size={120} />
                                </div>
                                <h2 className="text-sm font-black tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                                    <Zap size={14} className="text-vynl-teal" /> Global Impact
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                                    <Stat label="Total Plays" value="12.4K" change="+12%" />
                                    <Stat label="EPK Views" value="842" change="+5%" />
                                    <Stat label="Setlists" value="16" />
                                    <Stat label="Masters" value="38" />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Secondary */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-vynl-teal/10 to-transparent border border-vynl-teal/20 rounded-[2.5rem] p-8">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center justify-between font-mono">
                                    Recent Songs
                                    <Plus size={16} className="cursor-pointer hover:text-vynl-teal" onClick={() => setView("UPLOAD")} />
                                </h3>
                                <div className="space-y-4">
                                    {profile?.songs?.slice(0, 3).map((song: any) => (
                                        <RecentItem key={song.id} title={song.title} artist={profile.user.name} />
                                    ))}
                                    {(!profile?.songs || profile.songs.length === 0) && (
                                        <p className="text-[10px] text-neutral-600 uppercase tracking-widest py-4 text-center">No transmissions found</p>
                                    )}
                                </div>
                                <button className="w-full mt-8 py-4 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                                    View All Library
                                </button>
                            </div>

                            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-6 font-mono">Pulse Network</h3>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                                        <Headphones size={20} className="text-neutral-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Community Update</p>
                                        <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-1">Stage Mode V2.4 is Live</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function DashboardCard({ href, onClick, icon, title, description, color }: any) {
    const colorClass = color === "vynl-teal" ? "text-vynl-teal" : color === "vynl-orange" ? "text-vynl-orange" : color === "white" ? "text-white" : "text-neutral-500";
    const bgClass = color === "vynl-teal" ? "bg-vynl-teal/5" : color === "vynl-orange" ? "bg-vynl-orange/5" : "bg-white/5";

    const content = (
        <div className={`h-full p-8 rounded-[2rem] border border-white/5 ${bgClass} hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}>
            <div className={`${colorClass} mb-6 transform group-hover:scale-110 transition-transform origin-left`}>
                {icon}
            </div>
            <h3 className="text-lg font-black tracking-tight mb-2 group-hover:text-vynl-teal transition-colors">{title}</h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed">{description}</p>
            <ArrowUpRight size={16} className="absolute top-8 right-8 text-neutral-800 group-hover:text-vynl-teal transition-all" />
        </div>
    );

    if (onClick) {
        return <div onClick={onClick} className="group relative">{content}</div>;
    }

    return (
        <Link href={href || "#"} className="group relative">
            {content}
        </Link>
    );
}


function Stat({ label, value, change }: any) {
    return (
        <div>
            <p className="text-[8px] text-neutral-600 font-mono uppercase tracking-[0.2em] mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tighter">{value}</span>
                {change && <span className="text-[8px] text-vynl-teal font-black">{change}</span>}
            </div>
        </div>
    );
}

function RecentItem({ title, artist }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-all">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black border border-white/5 flex items-center justify-center text-neutral-700 group-hover:text-vynl-teal transition-colors">
                    <Music2 size={14} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{title}</p>
                    <p className="text-[8px] text-neutral-600 uppercase tracking-widest">{artist}</p>
                </div>
            </div>
            <Play size={10} className="text-neutral-800 group-hover:text-vynl-teal opacity-0 group-hover:opacity-100 transition-all" />
        </div>
    );
}
