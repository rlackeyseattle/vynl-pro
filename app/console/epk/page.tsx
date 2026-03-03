"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Share2, Globe, Music2, Instagram, Youtube, Twitter, Link2, Image, Save, CheckCircle } from "lucide-react";

interface EPKData {
    name: string;
    handle: string;
    bio: string;
    genre: string;
    location: string;
    website: string;
    instagram: string;
    twitter: string;
    youtube: string;
    spotify: string;
    pressQuote: string;
    pressQuoteSource: string;
    bookingEmail: string;
    managementEmail: string;
}

const EMPTY: EPKData = {
    name: "", handle: "", bio: "", genre: "", location: "",
    website: "", instagram: "", twitter: "", youtube: "", spotify: "",
    pressQuote: "", pressQuoteSource: "", bookingEmail: "", managementEmail: "",
};

export default function EPKPage() {
    const [data, setData] = useState<EPKData>(EMPTY);
    const [saved, setSaved] = useState(false);
    const [tab, setTab] = useState<"edit" | "preview">("edit");

    useEffect(() => {
        fetch("/api/profile")
            .then(r => r.json())
            .then(d => {
                if (d?.profile) setData(prev => ({ ...prev, ...d.profile }));
            }).catch(() => { });
    }, []);

    const set = (k: keyof EPKData, v: string) => setData(d => ({ ...d, [k]: v }));

    const save = async () => {
        await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const shareUrl = data.handle ? `https://vynl.pro/${data.handle}` : "";

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: "var(--ct-border)" }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
                        <FileText size={16} style={{ color: "#06b6d4" }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black" style={{ color: "var(--ct-text)" }}>EPK Builder</h1>
                        <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>Electronic Press Kit — your artist calling card</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Tab toggle */}
                    <div className="flex rounded-xl p-1" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                        {(["edit", "preview"] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className="px-4 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
                                style={tab === t ? { backgroundColor: "rgba(6,182,212,0.15)", color: "#06b6d4" } : { color: "var(--ct-text-muted)" }}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <button onClick={save}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", color: "#000" }}>
                        {saved ? <CheckCircle size={12} /> : <Save size={12} />}
                        {saved ? "Saved!" : "Save EPK"}
                    </button>
                    {shareUrl && (
                        <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                            style={{ borderColor: "var(--ct-border)", color: "var(--ct-text-muted)" }}>
                            <Share2 size={12} /> Share
                        </a>
                    )}
                </div>
            </div>

            {tab === "edit" ? (
                <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">
                    {/* Identity */}
                    <section>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: "var(--ct-text-muted)" }}>
                            Identity
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Artist / Band Name" value={data.name} onChange={v => set("name", v)} placeholder="The Midnight Runners" />
                            <Field label="Handle (your URL)" value={data.handle} onChange={v => set("handle", v.toLowerCase().replace(/\s/g, ""))} placeholder="midnightrunners" prefix="vynl.pro/" />
                            <Field label="Genre" value={data.genre} onChange={v => set("genre", v)} placeholder="Indie Rock / Alt Country" />
                            <Field label="Based In" value={data.location} onChange={v => set("location", v)} placeholder="Missoula, MT" />
                        </div>
                    </section>

                    {/* Bio */}
                    <section>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: "var(--ct-text-muted)" }}>Bio</p>
                        <textarea value={data.bio} onChange={e => set("bio", e.target.value)}
                            placeholder="Write your artist bio here — tell your story, your sound, your why..."
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none leading-relaxed"
                            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                        <p className="text-[10px] mt-1" style={{ color: "var(--ct-text-muted)" }}>{data.bio.length} / 1000 characters</p>
                    </section>

                    {/* Press Quote */}
                    <section>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: "var(--ct-text-muted)" }}>Press Quote</p>
                        <div className="space-y-3">
                            <textarea value={data.pressQuote} onChange={e => set("pressQuote", e.target.value)}
                                placeholder='"A powerhouse live act that demands your attention."'
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                            <Field label="Source" value={data.pressQuoteSource} onChange={v => set("pressQuoteSource", v)} placeholder="The Missoulian, 2024" />
                        </div>
                    </section>

                    {/* Links */}
                    <section>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: "var(--ct-text-muted)" }}>Links & Socials</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Website" icon={<Globe size={12} />} value={data.website} onChange={v => set("website", v)} placeholder="https://yourband.com" />
                            <Field label="Spotify" icon={<Music2 size={12} />} value={data.spotify} onChange={v => set("spotify", v)} placeholder="Spotify artist URL" />
                            <Field label="Instagram" icon={<Instagram size={12} />} value={data.instagram} onChange={v => set("instagram", v)} placeholder="@yourband" />
                            <Field label="YouTube" icon={<Youtube size={12} />} value={data.youtube} onChange={v => set("youtube", v)} placeholder="YouTube channel URL" />
                            <Field label="X / Twitter" icon={<Twitter size={12} />} value={data.twitter} onChange={v => set("twitter", v)} placeholder="@yourband" />
                            <Field label="EPK Share Link" icon={<Link2 size={12} />} value={shareUrl} onChange={() => { }} placeholder="Set your handle above" readOnly />
                        </div>
                    </section>

                    {/* Booking */}
                    <section>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: "var(--ct-text-muted)" }}>Booking & Management</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Booking Email" value={data.bookingEmail} onChange={v => set("bookingEmail", v)} placeholder="booking@yourband.com" />
                            <Field label="Management Email" value={data.managementEmail} onChange={v => set("managementEmail", v)} placeholder="management@yourband.com" />
                        </div>
                    </section>

                    {/* Photo upload placeholder */}
                    <section>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: "var(--ct-text-muted)" }}>Press Photos</p>
                        <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all hover:border-cyan-500/30"
                            style={{ borderColor: "var(--ct-border)" }}>
                            <Image size={28} className="mx-auto mb-3 opacity-25" />
                            <p className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>Drop press photos here</p>
                            <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>PNG, JPG up to 10MB · Hi-res recommended</p>
                            <button className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                                style={{ borderColor: "var(--ct-border)", color: "var(--ct-text-muted)" }}>
                                Choose Files
                            </button>
                        </div>
                    </section>
                </div>
            ) : (
                /* Preview tab */
                <div className="max-w-2xl mx-auto px-8 py-8">
                    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--ct-border)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <div className="h-32 relative" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.2))" }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4"
                                    style={{ borderColor: "var(--ct-bg)", backgroundColor: "rgba(0,0,0,0.5)" }}>🎸</div>
                            </div>
                        </div>
                        <div className="p-8">
                            <h2 className="text-2xl font-black mb-1" style={{ color: "var(--ct-text)" }}>{data.name || "Your Band Name"}</h2>
                            <p className="text-sm mb-1" style={{ color: "#06b6d4" }}>{data.genre || "Genre"}</p>
                            <p className="text-xs mb-4" style={{ color: "var(--ct-text-muted)" }}>{data.location}</p>
                            {data.pressQuote && (
                                <blockquote className="border-l-2 pl-4 mb-4 italic" style={{ borderColor: "#06b6d4", color: "var(--ct-text-muted)" }}>
                                    &ldquo;{data.pressQuote}&rdquo;
                                    {data.pressQuoteSource && <cite className="block text-[11px] mt-1 not-italic">— {data.pressQuoteSource}</cite>}
                                </blockquote>
                            )}
                            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--ct-text-muted)" }}>{data.bio || "Your bio will appear here..."}</p>
                            <div className="flex flex-wrap gap-3">
                                {data.bookingEmail && (
                                    <a href={`mailto:${data.bookingEmail}`}
                                        className="px-4 py-2 rounded-xl text-xs font-bold"
                                        style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", color: "#000" }}>
                                        Book Us
                                    </a>
                                )}
                                {data.website && <a href={data.website} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-xs font-semibold border" style={{ borderColor: "var(--ct-border)", color: "var(--ct-text-muted)" }}>Website</a>}
                                {data.spotify && <a href={data.spotify} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-xs font-semibold border" style={{ borderColor: "var(--ct-border)", color: "#1db954" }}>Spotify</a>}
                            </div>
                        </div>
                    </div>
                    {shareUrl && (
                        <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: "var(--ct-border)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                            <Link2 size={12} style={{ color: "#06b6d4" }} />
                            <span className="text-xs flex-1 font-mono" style={{ color: "var(--ct-text-muted)" }}>{shareUrl}</span>
                            <button onClick={() => navigator.clipboard.writeText(shareUrl)}
                                className="text-[10px] px-3 py-1 rounded-lg" style={{ color: "#06b6d4", backgroundColor: "rgba(6,182,212,0.1)" }}>
                                Copy
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Field({ label, value, onChange, placeholder, prefix, readOnly, icon }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; prefix?: string; readOnly?: boolean;
    icon?: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--ct-text-muted)" }}>{label}</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "var(--ct-border)" }}>
                {(prefix || icon) && <span className="text-xs flex-shrink-0" style={{ color: "var(--ct-text-muted)" }}>{icon || prefix}</span>}
                <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: readOnly ? "var(--ct-text-muted)" : "var(--ct-text)" }} />
            </div>
        </div>
    );
}
