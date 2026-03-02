import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Calendar, Users, Clock, Instagram, Music2, Star, ExternalLink, ArrowLeft, Ticket } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tractor Tavern | VYNL.PRO",
    description: "Tractor Tavern — Seattle's legendary honky-tonk and indie rock venue in Ballard.",
};

// ── Demo venue data ───────────────────────────────────────────────────────────
const VENUE = {
    name: "Tractor Tavern",
    tagline: "Seattle's home of honky-tonk, alt-country & indie rock",
    city: "Seattle", state: "WA",
    address: "5213 Ballard Ave NW, Seattle, WA 98107",
    phone: "(206) 789-3599",
    email: "bookings@tractortavern.com",
    website: "https://tractortavern.com",
    instagram: "@tractortavern",
    capacity: 250,
    age: "21+",
    genres: ["Alt-Country", "Honky-Tonk", "Indie Rock", "Americana", "Folk"],
    payType: "Door Split / Guarantee",
    typicalFee: "$200–$800",
    description: "The Tractor Tavern has been one of Seattle's premier live music venues since 1993. Located in the heart of Ballard, it's a beloved neighborhood institution known for its intimate atmosphere, killer sound system, and commitment to live music every night of the week. The Tractor has hosted legends and launched careers — if you're playing the Pacific Northwest, this is on the list.",
    photos: ["🎸", "🥁", "🎤"],
    verified: true,
    openDates: ["April 8", "April 15", "April 22", "May 3", "May 10"],
};

// ── Upcoming shows (demo) ─────────────────────────────────────────────────────
const UPCOMING_SHOWS = [
    { date: "Fri Mar 7", artist: "Dirty Buttons", genre: "Alt-Country", time: "9pm", ticket: "$12" },
    { date: "Sat Mar 8", artist: "Copper & Coal", genre: "Americana", time: "9pm", ticket: "$10" },
    { date: "Thu Mar 13", artist: "The Midnight Drifters", genre: "Indie Rock", time: "8pm", ticket: "$15" },
    { date: "Fri Mar 14", artist: "Silver Creek", genre: "Honky-Tonk", time: "9pm", ticket: "$10" },
    { date: "Sat Mar 22", artist: "Phantom Route", genre: "Folk Rock", time: "8pm", ticket: "$18" },
    { date: "Fri Apr 4", artist: "Cold Shoulder Method", genre: "Indie Rock", time: "9pm", ticket: "$14" },
    { date: "Sat Apr 12", artist: "High Noon Drifters", genre: "Americana", time: "9pm", ticket: "$12" },
];

// ── Demo comments ─────────────────────────────────────────────────────────────
const COMMENTS = [
    { name: "Sarah M.", avatar: "S", color: "#f472b6", text: "Best sound in Seattle. The Tractor always takes care of local bands.", time: "2d ago" },
    { name: "mike_press", avatar: "M", color: "#60a5fa", text: "Saw Dirty Buttons here last month. Packed house, amazing show.", time: "5d ago" },
    { name: "JackWhiteNoise", avatar: "J", color: "#34d399", text: "Open dates in April — jumping on this for our spring run.", time: "1w ago" },
];

export default function VenueDemoPage() {
    return (
        <div className="min-h-screen bg-[#080810] text-white">
            {/* ── Top nav ──────────────────────────────────── */}
            <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-3 flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                        <span className="font-black text-black text-xs italic">V</span>
                    </div>
                    <span className="font-black text-sm tracking-tight">VYNL.PRO</span>
                </Link>
                <span className="text-neutral-700">/</span>
                <Link href="/console/wire" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors">
                    <ArrowLeft size={11} /> Venues
                </Link>
                <div className="ml-auto flex items-center gap-2">
                    <Link href="/console/wire" className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-all">
                        Request Booking
                    </Link>
                </div>
            </nav>

            {/* ── Hero ─────────────────────────────────────── */}
            <div className="relative h-56 bg-gradient-to-br from-amber-900/40 via-[#080810] to-violet-900/20 overflow-hidden">
                {/* Stage lights effect */}
                <div className="absolute top-0 left-1/4 w-48 h-56 opacity-20 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, #f59e0b, transparent)", clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
                <div className="absolute top-0 right-1/3 w-36 h-48 opacity-15"
                    style={{ background: "linear-gradient(to bottom, #a78bfa, transparent)", clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
                <div className="absolute top-0 right-1/5 w-24 h-44 opacity-10"
                    style={{ background: "linear-gradient(to bottom, #f472b6, transparent)", clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#080810] to-transparent">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {VENUE.verified && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                        ✓ VERIFIED
                                    </span>
                                )}
                                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">
                                    {VENUE.city}, {VENUE.state} · {VENUE.capacity} cap · {VENUE.age}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight">{VENUE.name}</h1>
                            <p className="text-sm text-neutral-400 mt-1">{VENUE.tagline}</p>
                        </div>
                        <div className="text-5xl hidden sm:block">🎵</div>
                    </div>
                </div>
            </div>

            {/* ── Main content ─────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left col */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">About</h2>
                        <p className="text-neutral-300 leading-relaxed text-sm">{VENUE.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {VENUE.genres.map(g => (
                                <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">{g}</span>
                            ))}
                        </div>
                    </section>

                    {/* Upcoming Shows */}
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                            Upcoming Shows
                        </h2>
                        <div className="space-y-2">
                            {UPCOMING_SHOWS.map((show, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.07] hover:bg-white/[0.04] transition-all group">
                                    <div className="text-[10px] font-mono text-amber-400 w-20 flex-shrink-0">{show.date}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{show.artist}</p>
                                        <p className="text-xs text-neutral-500">{show.genre} · {show.time}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-neutral-400">{show.ticket}</span>
                                        <button className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all flex items-center gap-1">
                                            <Ticket size={9} /> RSVP
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Open Dates */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Open Booking Dates</h2>
                            <span className="text-[9px] text-green-400 font-bold">● Accepting Requests</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {VENUE.openDates.map(d => (
                                <Link key={d} href="/console/wire"
                                    className="text-xs px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-all font-medium">
                                    📅 {d}
                                </Link>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-600 mt-3">
                            Submit a booking request through VYNL.PRO →{" "}
                            <Link href="/console/wire" className="text-cyan-400 hover:underline">Request a Date</Link>
                        </p>
                    </section>

                    {/* Comments — guest-friendly */}
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Community</h2>
                        <div className="space-y-3 mb-5">
                            {COMMENTS.map((c, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                                        style={{ backgroundColor: c.color + "22", color: c.color }}>
                                        {c.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-semibold text-white">{c.name}</span>
                                            <span className="text-[9px] text-neutral-600">{c.time}</span>
                                        </div>
                                        <p className="text-sm text-neutral-400 mt-0.5 leading-relaxed">{c.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Guest comment box */}
                        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3">
                            <p className="text-xs text-neutral-500">Leave a comment — no account required</p>
                            <input placeholder="Your name (optional)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-cyan-500/40 transition-all" />
                            <textarea placeholder="Say something about this venue..."
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-cyan-500/40 transition-all resize-none" />
                            <div className="flex items-center justify-between">
                                <Link href="/signup" className="text-xs text-cyan-400 hover:underline">Create a fan profile →</Link>
                                <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all">
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right col — sidebar */}
                <aside className="space-y-5">
                    {/* Contact */}
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Contact</h3>
                        {[
                            { icon: <MapPin size={13} />, label: VENUE.address },
                            { icon: <Phone size={13} />, label: VENUE.phone, href: `tel:${VENUE.phone}` },
                            { icon: <Mail size={13} />, label: VENUE.email, href: `mailto:${VENUE.email}` },
                            { icon: <Globe size={13} />, label: "tractortavern.com", href: VENUE.website },
                            { icon: <Instagram size={13} />, label: VENUE.instagram },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="text-neutral-600 mt-0.5 flex-shrink-0">{item.icon}</span>
                                {item.href ? (
                                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                                        className="text-xs text-neutral-300 hover:text-cyan-400 transition-colors break-all">
                                        {item.label}
                                    </a>
                                ) : (
                                    <span className="text-xs text-neutral-400 break-all">{item.label}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Booking info */}
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Booking</h3>
                        {[
                            { label: "Pay Type", value: VENUE.payType },
                            { label: "Typical Fee", value: VENUE.typicalFee },
                            { label: "Capacity", value: VENUE.capacity },
                            { label: "Age Policy", value: VENUE.age },
                        ].map(row => (
                            <div key={row.label} className="flex justify-between">
                                <span className="text-xs text-neutral-600">{row.label}</span>
                                <span className="text-xs text-neutral-300 font-medium">{row.value}</span>
                            </div>
                        ))}
                        <Link href="/console/wire"
                            className="w-full mt-2 block text-center text-xs font-bold py-2.5 px-4 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all">
                            Request Booking via VYNL.PRO
                        </Link>
                    </div>

                    {/* Fan actions */}
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07]">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Fan Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-xs font-semibold py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 hover:bg-pink-500/20 transition-all flex items-center justify-center gap-2">
                                <Star size={11} /> Follow This Venue
                            </button>
                            <button className="w-full text-xs font-semibold py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition-all">
                                🤘 Join Street Team
                            </button>
                            <Link href="/signup"
                                className="w-full block text-center text-[10px] text-neutral-600 hover:text-cyan-400 transition-colors mt-2">
                                Create a free fan account →
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
