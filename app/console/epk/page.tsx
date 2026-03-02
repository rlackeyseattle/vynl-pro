"use client";

import { useState, useEffect } from "react";
import { FileText, Save, Eye, Copy, Check, Music2, Globe, Instagram, Twitter, Youtube, Mail, Phone, ExternalLink, Download, Loader2, Plus, X } from "lucide-react";

interface EPKData {
    artistName: string;
    tagline: string;
    bio: string;
    genre: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    instagram: string;
    twitter: string;
    youtube: string;
    spotify: string;
    pressQuotes: { quote: string; source: string }[];
    achievements: string[];
    techRiderNotes: string;
    bookingEmail: string;
    pressPhotoUrl: string;
}

const DEFAULT_EPK: EPKData = {
    artistName: "",
    tagline: "",
    bio: "",
    genre: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    twitter: "",
    youtube: "",
    spotify: "",
    pressQuotes: [{ quote: "", source: "" }],
    achievements: [""],
    techRiderNotes: "",
    bookingEmail: "",
    pressPhotoUrl: "",
};

type Tab = "edit" | "preview";

export default function EPKPage() {
    const [tab, setTab] = useState<Tab>("edit");
    const [epk, setEpk] = useState<EPKData>(DEFAULT_EPK);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load from profile
        fetch("/api/profile")
            .then((r) => r.json())
            .then((data) => {
                if (data.profile) {
                    const social = data.profile.socialLinks ? JSON.parse(data.profile.socialLinks) : {};
                    const epkData = data.profile.epkData ? JSON.parse(data.profile.epkData) : {};
                    setEpk((prev) => ({
                        ...prev,
                        artistName: data.name || "",
                        bio: data.profile.bio || "",
                        genre: data.profile.musicianType || "",
                        website: social.website || "",
                        instagram: social.instagram || "",
                        twitter: social.twitter || "",
                        youtube: social.youtube || "",
                        ...epkData,
                    }));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const update = (field: keyof EPKData, value: any) => {
        setEpk((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bio: epk.bio,
                    musicianType: epk.genre,
                    socialLinks: JSON.stringify({
                        website: epk.website,
                        instagram: epk.instagram,
                        twitter: epk.twitter,
                        youtube: epk.youtube,
                    }),
                    epkData: JSON.stringify(epk),
                }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
        } finally {
            setSaving(false);
        }
    };

    const copyEPKLink = () => {
        navigator.clipboard.writeText(window.location.origin + "/epk/" + epk.artistName.toLowerCase().replace(/\s+/g, "-"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-neutral-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07070e] text-white">
            {/* Top Bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-[#07070e]/80 backdrop-blur-xl border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                    <FileText size={18} className="text-cyan-400" />
                    <div>
                        <h1 className="text-sm font-semibold leading-none">EPK Builder</h1>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Electronic Press Kit</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Tabs */}
                    <div className="flex bg-white/[0.04] rounded-xl p-1 gap-1">
                        {(["edit", "preview"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t
                                    ? "bg-white text-black"
                                    : "text-neutral-400 hover:text-white"
                                    }`}
                            >
                                {t === "edit" ? "Edit" : "Preview"}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={copyEPKLink}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-neutral-300 hover:bg-white/[0.08] transition-all"
                    >
                        {copied ? <Check size={13} className="text-cyan-400" /> : <Copy size={13} />}
                        {copied ? "Copied!" : "Share Link"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold hover:bg-cyan-400 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : <Save size={13} />}
                        {saving ? "Saving..." : saved ? "Saved!" : "Save EPK"}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-8">
                {tab === "edit" ? (
                    <div className="space-y-8">
                        {/* Identity */}
                        <Section title="Artist Identity" description="The core of your EPK — who you are and what you sound like.">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Artist / Band Name" required>
                                    <input value={epk.artistName} onChange={(e) => update("artistName", e.target.value)}
                                        placeholder="Your stage name" className={inputClass} />
                                </Field>
                                <Field label="Genre / Style">
                                    <input value={epk.genre} onChange={(e) => update("genre", e.target.value)}
                                        placeholder="e.g. Indie Folk, Synth-Pop" className={inputClass} />
                                </Field>
                            </div>
                            <Field label="Tagline" description="One punchy line. What makes you different?">
                                <input value={epk.tagline} onChange={(e) => update("tagline", e.target.value)}
                                    placeholder="e.g. Pacific Northwest storytelling with teeth" className={inputClass} />
                            </Field>
                            <Field label="Location">
                                <input value={epk.location} onChange={(e) => update("location", e.target.value)}
                                    placeholder="City, State" className={inputClass} />
                            </Field>
                            <Field label="Bio" description="Write your story. 150–300 words is ideal for press kits." required>
                                <textarea value={epk.bio} onChange={(e) => update("bio", e.target.value)}
                                    rows={6} placeholder="Your artist bio — past projects, sound, touring history, story..."
                                    className={inputClass + " resize-none"} />
                            </Field>
                        </Section>

                        {/* Contact */}
                        <Section title="Contact & Booking" description="Make it easy for venues and press to reach you.">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Booking Email" required>
                                    <div className="relative"><Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.bookingEmail} onChange={(e) => update("bookingEmail", e.target.value)}
                                            placeholder="booking@youremail.com" className={inputClass + " pl-10"} /></div>
                                </Field>
                                <Field label="General Email">
                                    <div className="relative"><Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.email} onChange={(e) => update("email", e.target.value)}
                                            placeholder="press@youremail.com" className={inputClass + " pl-10"} /></div>
                                </Field>
                                <Field label="Phone">
                                    <div className="relative"><Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.phone} onChange={(e) => update("phone", e.target.value)}
                                            placeholder="(206) 555-0100" className={inputClass + " pl-10"} /></div>
                                </Field>
                                <Field label="Website">
                                    <div className="relative"><Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.website} onChange={(e) => update("website", e.target.value)}
                                            placeholder="https://yoursite.com" className={inputClass + " pl-10"} /></div>
                                </Field>
                            </div>
                        </Section>

                        {/* Social & Music */}
                        <Section title="Music & Social Links" description="Where people can find and listen to your music.">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Spotify">
                                    <div className="relative"><Music2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.spotify} onChange={(e) => update("spotify", e.target.value)}
                                            placeholder="Spotify artist URL" className={inputClass + " pl-10"} /></div>
                                </Field>
                                <Field label="Instagram">
                                    <div className="relative"><Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.instagram} onChange={(e) => update("instagram", e.target.value)}
                                            placeholder="@handle" className={inputClass + " pl-10"} /></div>
                                </Field>
                                <Field label="YouTube">
                                    <div className="relative"><Youtube size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.youtube} onChange={(e) => update("youtube", e.target.value)}
                                            placeholder="YouTube channel URL" className={inputClass + " pl-10"} /></div>
                                </Field>
                                <Field label="Twitter / X">
                                    <div className="relative"><Twitter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input value={epk.twitter} onChange={(e) => update("twitter", e.target.value)}
                                            placeholder="@handle" className={inputClass + " pl-10"} /></div>
                                </Field>
                            </div>
                        </Section>

                        {/* Press Quotes */}
                        <Section title="Press Quotes" description="What people are saying — critics, blogs, radio, other artists.">
                            <div className="space-y-3">
                                {epk.pressQuotes.map((q, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="flex-1 space-y-2">
                                            <textarea value={q.quote}
                                                onChange={(e) => {
                                                    const next = [...epk.pressQuotes];
                                                    next[i] = { ...next[i], quote: e.target.value };
                                                    update("pressQuotes", next);
                                                }}
                                                placeholder="Quote text..." rows={2}
                                                className={inputClass + " resize-none"} />
                                            <input value={q.source}
                                                onChange={(e) => {
                                                    const next = [...epk.pressQuotes];
                                                    next[i] = { ...next[i], source: e.target.value };
                                                    update("pressQuotes", next);
                                                }}
                                                placeholder="Source — e.g. The Stranger, KEXP, Pitchfork"
                                                className={inputClass} />
                                        </div>
                                        <button title="Remove quote" onClick={() => update("pressQuotes", epk.pressQuotes.filter((_, j) => j !== i))}
                                            className="mt-2 p-2 text-neutral-600 hover:text-red-400 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => update("pressQuotes", [...epk.pressQuotes, { quote: "", source: "" }])}
                                    className="flex items-center gap-2 text-xs text-neutral-500 hover:text-cyan-400 transition-colors">
                                    <Plus size={13} /> Add Quote
                                </button>
                            </div>
                        </Section>

                        {/* Achievements */}
                        <Section title="Highlights & Achievements" description="Notable gigs, placements, awards, milestones.">
                            <div className="space-y-2">
                                {epk.achievements.map((a, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input value={a}
                                            onChange={(e) => {
                                                const next = [...epk.achievements];
                                                next[i] = e.target.value;
                                                update("achievements", next);
                                            }}
                                            placeholder="e.g. Opened for X at Y Venue, 2024"
                                            className={inputClass + " flex-1"} />
                                        <button title="Remove item" onClick={() => update("achievements", epk.achievements.filter((_, j) => j !== i))}
                                            className="p-2 text-neutral-600 hover:text-red-400 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => update("achievements", [...epk.achievements, ""])}
                                    className="flex items-center gap-2 text-xs text-neutral-500 hover:text-cyan-400 transition-colors">
                                    <Plus size={13} /> Add Highlight
                                </button>
                            </div>
                        </Section>

                        {/* Tech Rider */}
                        <Section title="Technical Rider Notes" description="Basic stage requirements for venues. Full tech rider builder coming soon.">
                            <textarea value={epk.techRiderNotes} onChange={(e) => update("techRiderNotes", e.target.value)}
                                rows={4} placeholder="e.g. 3-piece band: drums, bass, guitar/vocals. Need 4 monitor mixes, DI for bass, SM58 for vocals..."
                                className={inputClass + " resize-none"} />
                        </Section>
                    </div>
                ) : (
                    <EPKPreview epk={epk} />
                )}
            </div>
        </div>
    );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div className="border-b border-white/[0.06] pb-3">
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function Field({ label, description, required, children }: { label: string; description?: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
                {label} {required && <span className="text-cyan-400">*</span>}
            </label>
            {description && <p className="text-[10px] text-neutral-600">{description}</p>}
            {children}
        </div>
    );
}

const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 transition-all";

function EPKPreview({ epk }: { epk: EPKData }) {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-neutral-900 to-black">
                {/* Hero */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-900/40 to-violet-900/40 flex items-end p-8">
                    <div>
                        {epk.artistName && <h1 className="text-4xl font-bold tracking-tight">{epk.artistName}</h1>}
                        {epk.tagline && <p className="text-neutral-300 mt-1 text-sm">{epk.tagline}</p>}
                        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                            {epk.genre && <span>{epk.genre}</span>}
                            {epk.location && <><span>·</span><span>{epk.location}</span></>}
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Bio */}
                    {epk.bio && (
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">About</h2>
                            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{epk.bio}</p>
                        </div>
                    )}

                    {/* Achievements */}
                    {epk.achievements.some(a => a.trim()) && (
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">Highlights</h2>
                            <ul className="space-y-1.5">
                                {epk.achievements.filter(a => a.trim()).map((a, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                                        <span className="text-cyan-400 mt-0.5">–</span> {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Press Quotes */}
                    {epk.pressQuotes.some(q => q.quote.trim()) && (
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">Press</h2>
                            <div className="space-y-4">
                                {epk.pressQuotes.filter(q => q.quote.trim()).map((q, i) => (
                                    <blockquote key={i} className="border-l-2 border-cyan-500/50 pl-4">
                                        <p className="text-sm text-neutral-300 italic">&ldquo;{q.quote}&rdquo;</p>
                                        {q.source && <cite className="text-xs text-neutral-600 not-italic mt-1 block">— {q.source}</cite>}
                                    </blockquote>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div>
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">Connect</h2>
                        <div className="flex flex-wrap gap-2">
                            {epk.website && <SocialChip href={epk.website} icon={<Globe size={12} />} label="Website" />}
                            {epk.spotify && <SocialChip href={epk.spotify} icon={<Music2 size={12} />} label="Spotify" />}
                            {epk.instagram && <SocialChip href={`https://instagram.com/${epk.instagram.replace("@", "")}`} icon={<Instagram size={12} />} label="Instagram" />}
                            {epk.youtube && <SocialChip href={epk.youtube} icon={<Youtube size={12} />} label="YouTube" />}
                            {epk.twitter && <SocialChip href={`https://twitter.com/${epk.twitter.replace("@", "")}`} icon={<Twitter size={12} />} label="Twitter" />}
                        </div>
                    </div>

                    {/* Booking */}
                    {epk.bookingEmail && (
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <p className="text-xs text-neutral-400 mb-1">Booking Inquiries</p>
                            <a href={`mailto:${epk.bookingEmail}`} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                                <Mail size={13} /> {epk.bookingEmail}
                            </a>
                        </div>
                    )}

                    {/* Tech Rider */}
                    {epk.techRiderNotes && (
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">Technical Notes</h2>
                            <p className="text-sm text-neutral-400 leading-relaxed">{epk.techRiderNotes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SocialChip({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-neutral-300 hover:text-white hover:border-white/20 transition-all">
            {icon} {label} <ExternalLink size={10} className="text-neutral-600" />
        </a>
    );
}
