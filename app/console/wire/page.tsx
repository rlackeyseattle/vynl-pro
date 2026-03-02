"use client";

import { useState, useEffect, useCallback } from "react";
import {
    MapPin, Search, Filter, Phone, Globe, Mail, Users,
    Music2, DollarSign, Star, ChevronRight, Plus, Calendar,
    FileText, UserPlus, Building2, Clock, CheckCircle, AlertCircle,
    Send, Copy, Check, Trash2, LinkIcon, X
} from "lucide-react";

type Tab = "venues" | "bookings" | "invites" | "contracts";

interface Venue {
    id: string;
    name: string;
    city: string;
    state: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    facebook?: string;
    capacity?: number;
    venueType?: string;
    genres?: string;
    description?: string;
    typicalFee?: string;
    payType?: string;
    ageLimit?: string;
    verified?: boolean;
    lat?: number;
    lng?: number;
}

const STATE_OPTIONS = ["", "WA", "OR", "MT", "ID"];
const TYPE_OPTIONS = ["", "bar", "club", "theater", "brewery", "amphitheater", "restaurant", "festival", "arts-center"];
const TYPE_LABELS: Record<string, string> = {
    bar: "Bar", club: "Club / Nightclub", theater: "Theater", brewery: "Brewery",
    amphitheater: "Amphitheater", restaurant: "Restaurant", festival: "Festival Grounds", "arts-center": "Arts Center"
};

export default function BookingPage() {
    const [tab, setTab] = useState<Tab>("venues");

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-0 border-b" style={{ borderColor: "var(--ct-border)" }}>
                <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--ct-text)" }}>Booking</h1>
                <p className="text-sm mb-4" style={{ color: "var(--ct-text-muted)" }}>
                    Find venues, manage gigs, send invites, and handle contracts
                </p>
                {/* Tabs */}
                <div className="flex gap-1">
                    {([
                        { id: "venues", label: "Venue Finder", icon: Building2 },
                        { id: "bookings", label: "My Bookings", icon: Calendar },
                        { id: "invites", label: "Invite Members", icon: UserPlus },
                        { id: "contracts", label: "Contracts", icon: FileText },
                    ] as const).map(t => {
                        const Icon = t.icon;
                        const active = tab === t.id;
                        return (
                            <button key={t.id} onClick={() => setTab(t.id)}
                                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-all"
                                style={active ? {
                                    backgroundColor: "var(--ct-bg)",
                                    color: "var(--ct-accent)",
                                    borderTop: "1px solid var(--ct-border)",
                                    borderLeft: "1px solid var(--ct-border)",
                                    borderRight: "1px solid var(--ct-border)",
                                    marginBottom: "-1px",
                                } : { color: "var(--ct-text-muted)" }}>
                                <Icon size={14} /> {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-8 py-6">
                {tab === "venues" && <VenueFinder />}
                {tab === "bookings" && <MyBookings />}
                {tab === "invites" && <InviteManager />}
                {tab === "contracts" && <ContractTemplates />}
            </div>
        </div>
    );
}

// ── VENUE FINDER ─────────────────────────────────────────────────────────────
function VenueFinder() {
    const [query, setQuery] = useState("");
    const [state, setState] = useState("");
    const [type, setType] = useState("");
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Venue | null>(null);

    const search = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (state) params.set("state", state);
            if (type) params.set("type", type);
            params.set("limit", "60");
            const res = await fetch(`/api/venues?${params}`);
            const data = await res.json();
            setVenues(data.venues || []);
        } catch { } finally {
            setLoading(false);
        }
    }, [query, state, type]);

    useEffect(() => { search(); }, []);

    const parseGenres = (g?: string): string[] => {
        try { return g ? JSON.parse(g) : []; } catch { return []; }
    };

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ct-text-muted)" }} />
                    <input
                        value={query} onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && search()}
                        placeholder="Search venues, cities…"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}
                    />
                </div>
                <select value={state} onChange={e => setState(e.target.value)}
                    className="px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                    <option value="">All States</option>
                    {STATE_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={type} onChange={e => setType(e.target.value)}
                    className="px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                    <option value="">All Types</option>
                    {TYPE_OPTIONS.filter(Boolean).map(t => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
                </select>
                <button onClick={search}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                    Search
                </button>
            </div>

            <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                {loading ? "Searching…" : `${venues.length} venues in the Pacific Northwest database`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {venues.map(v => {
                    const genres = parseGenres(v.genres);
                    return (
                        <button key={v.id} onClick={() => setSelected(v)} className="text-left p-4 rounded-2xl transition-all hover:scale-[1.01]"
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <p className="text-sm font-semibold truncate" style={{ color: "var(--ct-text)" }}>{v.name}</p>
                                        {v.verified && <CheckCircle size={11} style={{ color: "var(--ct-accent)", flexShrink: 0 }} />}
                                    </div>
                                    <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                                        {v.city}, {v.state} · {TYPE_LABELS[v.venueType || ""] || v.venueType || "Venue"}
                                    </p>
                                </div>
                                {v.capacity && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                                        style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)" }}>
                                        {v.capacity.toLocaleString()} cap
                                    </span>
                                )}
                            </div>
                            {v.description && (
                                <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: "var(--ct-text-muted)" }}>
                                    {v.description}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-1.5">
                                {v.typicalFee && (
                                    <span className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: "rgba(0,200,100,0.08)", color: "#48bb78" }}>
                                        <DollarSign size={9} /> {v.typicalFee}
                                    </span>
                                )}
                                {v.ageLimit && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)" }}>
                                        {v.ageLimit}
                                    </span>
                                )}
                                {genres.slice(0, 2).map(g => (
                                    <span key={g} className="text-[10px] px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)" }}>
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Venue Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                    onClick={() => setSelected(null)}>
                    <div className="w-full max-w-lg rounded-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
                        style={{ backgroundColor: "var(--ct-bg-2)", border: "1px solid var(--ct-border)" }}
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold" style={{ color: "var(--ct-text)" }}>{selected.name}</h2>
                                    {selected.verified && <CheckCircle size={14} style={{ color: "var(--ct-accent)" }} />}
                                </div>
                                <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>
                                    {selected.city}, {selected.state} · {TYPE_LABELS[selected.venueType || ""] || selected.venueType}
                                    {selected.capacity ? ` · ${selected.capacity.toLocaleString()} cap` : ""}
                                </p>
                            </div>
                            <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-white/10 transition-all">
                                <X size={16} style={{ color: "var(--ct-text-muted)" }} />
                            </button>
                        </div>

                        {selected.description && (
                            <p className="text-sm leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{selected.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            {selected.typicalFee && <InfoChip icon={<DollarSign size={11} />} label={selected.typicalFee + (selected.payType ? ` (${selected.payType})` : "")} />}
                            {selected.ageLimit && <InfoChip icon={<Users size={11} />} label={selected.ageLimit} />}
                            {selected.address && <InfoChip icon={<MapPin size={11} />} label={selected.address} />}
                        </div>

                        {/* Genre tags */}
                        {selected.genres && (
                            <div className="flex flex-wrap gap-1.5">
                                {parseGenres(selected.genres).map(g => (
                                    <span key={g} className="text-[10px] px-2.5 py-1 rounded-full"
                                        style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                        {g}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Contact links */}
                        <div className="flex flex-wrap gap-2">
                            {selected.phone && (
                                <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                    <Phone size={12} /> {selected.phone}
                                </a>
                            )}
                            {selected.email && (
                                <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                    <Mail size={12} /> Email
                                </a>
                            )}
                            {selected.website && (
                                <a href={selected.website} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                    <Globe size={12} /> Website
                                </a>
                            )}
                            {selected.facebook && (
                                <a href={`https://facebook.com/${selected.facebook}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                    Facebook
                                </a>
                            )}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                                Request Booking
                            </button>
                            <button className="px-4 py-2.5 rounded-xl text-sm transition-all"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                Contract Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function parseGenres(g?: string): string[] {
    try { return g ? JSON.parse(g) : []; } catch { return []; }
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-1.5" style={{ color: "var(--ct-text-muted)" }}>
            {icon} <span>{label}</span>
        </div>
    );
}

// ── MY BOOKINGS ───────────────────────────────────────────────────────────────
function MyBookings() {
    const MOCK = [
        { id: "1", venueName: "The Top Hat Lounge", city: "Missoula, MT", date: "Mar 15, 2026", status: "confirmed", fee: "$600" },
        { id: "2", venueName: "The Tractor Tavern", city: "Seattle, WA", date: "Apr 2, 2026", status: "pending", fee: "$900" },
        { id: "3", venueName: "Volcanic Theatre Pub", city: "Bend, OR", date: "Apr 20, 2026", status: "inquiry", fee: "TBD" },
    ];

    return (
        <div className="space-y-4 max-w-2xl">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>Upcoming Gigs</h2>
                <button className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all"
                    style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                    <Plus size={13} /> Add Gig
                </button>
            </div>
            {MOCK.map(b => (
                <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${b.status === "confirmed" ? "bg-green-400" : b.status === "pending" ? "bg-amber-400" : "bg-neutral-600"}`} />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--ct-text)" }}>{b.venueName}</p>
                        <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{b.city} · {b.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold" style={{ color: "var(--ct-accent)" }}>{b.fee}</p>
                        <p className="text-[10px] capitalize" style={{ color: "var(--ct-text-muted)" }}>{b.status}</p>
                    </div>
                    <ChevronRight size={14} style={{ color: "var(--ct-text-muted)" }} />
                </div>
            ))}
        </div>
    );
}

// ── INVITE MANAGER ────────────────────────────────────────────────────────────
function InviteManager() {
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [label, setLabel] = useState("");
    const [expiryDays, setExpiryDays] = useState("7");
    const [copied, setCopied] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/invites");
            const data = await res.json();
            setInvites(data.invites || []);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const create = async () => {
        setCreating(true);
        try {
            const res = await fetch("/api/invites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label, expiresInDays: parseInt(expiryDays) || null }),
            });
            const data = await res.json();
            if (data.invite) {
                setInvites(prev => [data.invite, ...prev]);
                setLabel("");
            }
        } catch { } finally { setCreating(false); }
    };

    const copy = (code: string) => {
        const url = `${window.location.origin}/join/${code}`;
        navigator.clipboard.writeText(url);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    const remove = async (id: string) => {
        await fetch(`/api/invites?id=${id}`, { method: "DELETE" });
        setInvites(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>Invite People</h2>
                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                    Share invite links to bring band members, crew, or collaborators into your workspace.
                </p>
            </div>

            {/* Create invite */}
            <div className="p-4 rounded-2xl space-y-3" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                <p className="text-xs font-medium" style={{ color: "var(--ct-text)" }}>Create New Invite</p>
                <input value={label} onChange={e => setLabel(e.target.value)}
                    placeholder="Label (e.g. 'For John — drummer')"
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                <div className="flex gap-2">
                    <select value={expiryDays} onChange={e => setExpiryDays(e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                        <option value="1">Expires in 1 day</option>
                        <option value="7">Expires in 7 days</option>
                        <option value="30">Expires in 30 days</option>
                        <option value="">Never expires</option>
                    </select>
                    <button onClick={create} disabled={creating}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                        <Plus size={14} /> {creating ? "Creating…" : "Create"}
                    </button>
                </div>
            </div>

            {/* Invite list */}
            {loading ? (
                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>Loading…</p>
            ) : invites.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>No invites yet. Create one above.</p>
            ) : (
                <div className="space-y-2">
                    {invites.map(inv => (
                        <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-mono font-semibold" style={{ color: "var(--ct-accent)" }}>{inv.code}</p>
                                {inv.label && <p className="text-xs truncate" style={{ color: "var(--ct-text-muted)" }}>{inv.label}</p>}
                                {inv.expiresAt && (
                                    <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>
                                        Expires {new Date(inv.expiresAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <button onClick={() => copy(inv.code)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: copied === inv.code ? "#48bb78" : "var(--ct-text-muted)" }}>
                                {copied === inv.code ? <Check size={12} /> : <Copy size={12} />}
                                {copied === inv.code ? "Copied!" : "Copy Link"}
                            </button>
                            <button onClick={() => remove(inv.id)}
                                className="p-1.5 rounded-lg transition-all hover:text-red-400"
                                style={{ color: "var(--ct-text-muted)" }}>
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── CONTRACT TEMPLATES ────────────────────────────────────────────────────────
function ContractTemplates() {
    const templates = [
        {
            id: "performance-basic", name: "Basic Performance Contract",
            desc: "Standard gig contract — date, venue, fee, set length, payment terms.",
            tags: ["Bar Shows", "Clubs", "Local Gigs"],
        },
        {
            id: "performance-full", name: "Full Performance Contract",
            desc: "Comprehensive — adds tech rider, green room, hospitality, cancellation policy, and promo obligations.",
            tags: ["Theaters", "Festivals", "Touring"],
        },
        {
            id: "private-event", name: "Private Event Contract",
            desc: "Weddings, corporate, private parties. Includes deposit, hours, and exclusivity clause.",
            tags: ["Weddings", "Corporate", "Private"],
        },
        {
            id: "revenue-share", name: "Door Deal / Revenue Share",
            desc: "Percentage-based pay. Door split agreement with venue.",
            tags: ["Door Deal", "Bars", "Emerging Artists"],
        },
        {
            id: "recording-session", name: "Recording Session Agreement",
            desc: "Studio session, work-for-hire, and rights assignment.",
            tags: ["Studio", "Session Work"],
        },
    ];

    return (
        <div className="max-w-2xl space-y-4">
            <div>
                <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>Contract Templates</h2>
                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                    Pre-built performance contracts. Fill in the details and send for signature.
                </p>
            </div>
            {templates.map(t => (
                <div key={t.id} className="p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.005]"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium mb-1" style={{ color: "var(--ct-text)" }}>{t.name}</p>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--ct-text-muted)" }}>{t.desc}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {t.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)" }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button className="ml-4 flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl flex-shrink-0 transition-all"
                            style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                            Use <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
