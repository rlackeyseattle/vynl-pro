"use client";

import { useState, useRef } from "react";
import {
    Package, Plus, QrCode, Check, AlertTriangle, Pencil,
    Trash2, Tag, Guitar, Mic2, Cable, Speaker, Zap,
    ChevronDown, ChevronUp, Search, Filter, MapPin,
    Clock, CheckCircle2, XCircle, Truck, Camera
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type GearCategory = "guitar" | "bass" | "drums" | "keys" | "vocals" | "amp" | "cab" | "effects" | "cables" | "pa" | "lighting" | "misc";
type GearStatus = "in" | "packed" | "loaded" | "on-stage" | "missing";

interface GearItem {
    id: string;
    name: string;
    brand?: string;
    serialNumber?: string;
    category: GearCategory;
    status: GearStatus;
    notes?: string;
    assignedTo?: string; // band member name
    color?: string;
    value?: number;
    tags?: string[];     // custom tags e.g. ["fragile", "backline"]
    checkedAt?: Date;
}

// ── Mock data — user would add their real gear ────────────────────────────────
const INITIAL_GEAR: GearItem[] = [
    { id: "g1", name: "Gibson Les Paul Custom", brand: "Gibson", serialNumber: "123456", category: "guitar", status: "in", color: "#8a2222", assignedTo: "Rob", value: 3200, tags: ["featured", "fragile"] },
    { id: "g2", name: "Fender Stratocaster", brand: "Fender", serialNumber: "654321", category: "guitar", status: "in", color: "#2a6090", assignedTo: "Rob", value: 1800 },
    { id: "g3", name: "Mesa Boogie Mark V", brand: "Mesa Boogie", category: "amp", status: "in", value: 2200, tags: ["head"] },
    { id: "g4", name: '4x12 Cabinet', brand: "Mesa Boogie", category: "cab", status: "in", value: 900 },
    { id: "g5", name: "Shure SM58 (x3)", brand: "Shure", category: "vocals", status: "in", value: 300 },
    { id: "g6", name: "Pedalboard", brand: "Custom", category: "effects", status: "in", assignedTo: "Rob", value: 1600, tags: ["fragile"] },
    { id: "g7", name: "XLR Cables (x8)", category: "cables", status: "in", value: 120 },
    { id: "g8", name: "Power Conditioner", brand: "Furman", category: "misc", status: "in", value: 280 },
    { id: "g9", name: "DI Boxes (x2)", brand: "Radial", category: "misc", status: "in", value: 200 },
];

const CATEGORY_ICONS: Record<GearCategory, React.ReactNode> = {
    guitar: <Guitar size={14} />,
    bass: <Guitar size={14} />,
    drums: <span className="text-xs">🥁</span>,
    keys: <span className="text-xs">🎹</span>,
    vocals: <Mic2 size={14} />,
    amp: <Speaker size={14} />,
    cab: <Speaker size={14} />,
    effects: <Zap size={14} />,
    cables: <Cable size={14} />,
    pa: <Speaker size={14} />,
    lighting: <span className="text-xs">💡</span>,
    misc: <Package size={14} />,
};

const STATUS_CONFIG: Record<GearStatus, { label: string; color: string; bg: string }> = {
    "in": { label: "In Storage", color: "#9ca3af", bg: "rgba(156,163,175,0.08)" },
    "packed": { label: "Packed", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
    "loaded": { label: "Loaded In", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    "on-stage": { label: "On Stage", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    "missing": { label: "⚠ Missing", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

const CATEGORIES: { value: GearCategory; label: string }[] = [
    { value: "guitar", label: "Guitar" },
    { value: "bass", label: "Bass" },
    { value: "drums", label: "Drums" },
    { value: "keys", label: "Keys" },
    { value: "vocals", label: "Vocals / Mics" },
    { value: "amp", label: "Amp Head" },
    { value: "cab", label: "Cabinet" },
    { value: "effects", label: "Effects / Pedalboard" },
    { value: "cables", label: "Cables" },
    { value: "pa", label: "PA System" },
    { value: "lighting", label: "Lighting" },
    { value: "misc", label: "Misc" },
];

// ── Show checklist presets ────────────────────────────────────────────────────
const SHOW_CHECKLISTS = [
    { id: "load-out", label: "Load Out", desc: "Mark each item as you load into the van" },
    { id: "load-in", label: "Load In / Venue", desc: "Verify everything arrived at the venue" },
    { id: "stage-check", label: "Stage Check", desc: "Confirm all gear is on stage before soundcheck" },
    { id: "load-back", label: "After Show", desc: "Account for all gear before leaving the venue" },
];

export default function GearPage() {
    const [gear, setGear] = useState<GearItem[]>(INITIAL_GEAR);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState<GearCategory | "all">("all");
    const [filterStatus, setFilterStatus] = useState<GearStatus | "all">("all");
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeChecklist, setActiveChecklist] = useState<string | null>(null);
    const [view, setView] = useState<"inventory" | "checklist">("inventory");

    // ── Add form state ──────────────────────────────────────────────────────
    const [newItem, setNewItem] = useState<Partial<GearItem>>({
        category: "guitar", status: "in", name: "", brand: ""
    });

    const addItem = () => {
        if (!newItem.name?.trim()) return;
        const item: GearItem = {
            id: `g${Date.now()}`,
            name: newItem.name!,
            brand: newItem.brand,
            serialNumber: newItem.serialNumber,
            category: newItem.category!,
            status: newItem.status || "in",
            notes: newItem.notes,
            assignedTo: newItem.assignedTo,
            value: newItem.value,
        };
        setGear(prev => [item, ...prev]);
        setShowAddForm(false);
        setNewItem({ category: "guitar", status: "in", name: "", brand: "" });
    };

    const cycleStatus = (id: string) => {
        const order: GearStatus[] = ["in", "packed", "loaded", "on-stage", "missing"];
        setGear(prev => prev.map(g => {
            if (g.id !== id) return g;
            const nextIdx = (order.indexOf(g.status) + 1) % order.length;
            return { ...g, status: order[nextIdx], checkedAt: new Date() };
        }));
    };

    const removeItem = (id: string) => setGear(prev => prev.filter(g => g.id !== id));

    // ── Filtered list ───────────────────────────────────────────────────────
    const filtered = gear.filter(g => {
        if (filterCat !== "all" && g.category !== filterCat) return false;
        if (filterStatus !== "all" && g.status !== filterStatus) return false;
        if (search && !g.name.toLowerCase().includes(search.toLowerCase()) &&
            !g.brand?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    // ── Stats ───────────────────────────────────────────────────────────────
    const missing = gear.filter(g => g.status === "missing").length;
    const onStage = gear.filter(g => g.status === "on-stage").length;
    const packed = gear.filter(g => g.status === "packed" || g.status === "loaded").length;
    const totalValue = gear.reduce((acc, g) => acc + (g.value || 0), 0);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-6 border-b" style={{ borderColor: "var(--ct-border)" }}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ct-text)" }}>Gear Manager</h1>
                        <p className="text-sm mt-0.5" style={{ color: "var(--ct-text-muted)" }}>
                            Track inventory, run show checklists, never lose gear again
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setView("inventory")}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                            style={view === "inventory"
                                ? { backgroundColor: "var(--ct-accent)", color: "#000" }
                                : { backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text-muted)" }}>
                            Inventory
                        </button>
                        <button onClick={() => setView("checklist")}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                            style={view === "checklist"
                                ? { backgroundColor: "var(--ct-accent)", color: "#000" }
                                : { backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text-muted)" }}>
                            {missing > 0 && <span className="text-red-400 mr-1">⚠</span>}
                            Show Checklist
                        </button>
                        <button onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                            <Plus size={14} /> Add Gear
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Total Items", value: gear.length, color: "var(--ct-accent)" },
                        { label: "On Stage", value: onStage, color: "#34d399" },
                        { label: "Packed/Loaded", value: packed, color: "#a78bfa" },
                        { label: "⚠ Missing", value: missing, color: missing > 0 ? "#f87171" : "var(--ct-text-muted)" },
                        { label: "Est. Value", value: `$${totalValue.toLocaleString()}`, color: "#f59e0b" },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)" }}>
                            <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ct-text-muted)" }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-8 py-6">
                {/* ── ADD FORM ─────────────────────────────────────────── */}
                {showAddForm && (
                    <div className="mb-6 p-5 rounded-2xl space-y-4"
                        style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                        <p className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>Add Gear Item</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormInput label="Item Name *" value={newItem.name || ""} onChange={v => setNewItem(p => ({ ...p, name: v }))} placeholder="Gibson Les Paul..." />
                            <FormInput label="Brand" value={newItem.brand || ""} onChange={v => setNewItem(p => ({ ...p, brand: v }))} placeholder="Gibson" />
                            <FormInput label="Serial Number" value={newItem.serialNumber || ""} onChange={v => setNewItem(p => ({ ...p, serialNumber: v }))} placeholder="Optional" />
                            <FormInput label="Assigned To" value={newItem.assignedTo || ""} onChange={v => setNewItem(p => ({ ...p, assignedTo: v }))} placeholder="Band member name" />
                            <div>
                                <label className="text-xs mb-1.5 block" style={{ color: "var(--ct-text-muted)" }}>Category</label>
                                <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value as GearCategory }))}
                                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <FormInput label="Est. Value ($)" value={newItem.value?.toString() || ""} onChange={v => setNewItem(p => ({ ...p, value: parseFloat(v) || undefined }))} placeholder="0" type="number" />
                        </div>
                        <FormInput label="Notes" value={newItem.notes || ""} onChange={v => setNewItem(p => ({ ...p, notes: v }))} placeholder="Any details, condition notes, etc." />
                        <div className="flex gap-2">
                            <button onClick={addItem}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium"
                                style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                                Add Item
                            </button>
                            <button onClick={() => setShowAddForm(false)}
                                className="px-5 py-2.5 rounded-xl text-sm"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text-muted)" }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* ── INVENTORY VIEW ───────────────────────────────────── */}
                {view === "inventory" && (
                    <div className="space-y-4">
                        {/* Search + filter */}
                        <div className="flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[180px]">
                                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ct-text-muted)" }} />
                                <input value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search gear…"
                                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                            </div>
                            <select value={filterCat} onChange={e => setFilterCat(e.target.value as any)}
                                className="px-3 py-2 rounded-xl text-sm focus:outline-none"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                <option value="all">All Categories</option>
                                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
                                className="px-3 py-2 rounded-xl text-sm focus:outline-none"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                <option value="all">All Statuses</option>
                                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                        </div>

                        <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{filtered.length} items</p>

                        {/* Gear list */}
                        <div className="space-y-2">
                            {filtered.map(g => {
                                const sc = STATUS_CONFIG[g.status];
                                return (
                                    <div key={g.id}
                                        className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all"
                                        style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                                        {/* Category icon */}
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "var(--ct-text-muted)" }}>
                                            {CATEGORY_ICONS[g.category]}
                                        </div>

                                        {/* Name + details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium truncate" style={{ color: "var(--ct-text)" }}>{g.name}</p>
                                                {g.tags?.includes("fragile") && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded-md"
                                                        style={{ backgroundColor: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                                                        FRAGILE
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                                                {[g.brand, g.serialNumber ? `SN: ${g.serialNumber}` : null, g.assignedTo ? `→ ${g.assignedTo}` : null].filter(Boolean).join(" · ")}
                                            </p>
                                        </div>

                                        {/* Value */}
                                        {g.value && (
                                            <span className="text-xs font-mono hidden sm:block" style={{ color: "var(--ct-text-muted)" }}>
                                                ${g.value.toLocaleString()}
                                            </span>
                                        )}

                                        {/* Status toggle */}
                                        <button onClick={() => cycleStatus(g.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                                            style={{ backgroundColor: sc.bg, color: sc.color }}>
                                            {sc.label}
                                        </button>

                                        {/* Delete */}
                                        <button onClick={() => removeItem(g.id)}
                                            className="p-1.5 rounded-lg transition-all hover:text-red-400"
                                            style={{ color: "var(--ct-text-muted)" }}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                );
                            })}

                            {filtered.length === 0 && (
                                <div className="py-12 text-center" style={{ color: "var(--ct-text-muted)" }}>
                                    <Package size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No gear found. Add your first item above.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── CHECKLIST VIEW ───────────────────────────────────── */}
                {view === "checklist" && (
                    <div className="space-y-6 max-w-2xl">
                        {!activeChecklist ? (
                            <>
                                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                                    Select a checklist phase to run through your gear for the show.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {SHOW_CHECKLISTS.map(cl => (
                                        <button key={cl.id} onClick={() => setActiveChecklist(cl.id)}
                                            className="text-left p-5 rounded-2xl transition-all hover:scale-[1.02]"
                                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--ct-border)" }}>
                                            <p className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>{cl.label}</p>
                                            <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{cl.desc}</p>
                                            <p className="text-xs mt-2" style={{ color: "var(--ct-accent)" }}>
                                                {gear.length} items to check →
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <ShowChecklist
                                gear={gear}
                                phase={activeChecklist}
                                onBack={() => setActiveChecklist(null)}
                                onStatusChange={cycleStatus}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Show Checklist Component ──────────────────────────────────────────────────
function ShowChecklist({ gear, phase, onBack, onStatusChange }: {
    gear: GearItem[];
    phase: string;
    onBack: () => void;
    onStatusChange: (id: string) => void;
}) {
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const phaseName = SHOW_CHECKLISTS.find(c => c.id === phase)?.label || phase;

    const toggle = (id: string) => {
        setChecked(prev => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id); else n.add(id);
            return n;
        });
    };

    const allDone = checked.size === gear.length;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)" }}>
                    ← Back
                </button>
                <h2 className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>{phaseName} Checklist</h2>
                <span className="text-xs ml-auto" style={{ color: "var(--ct-text-muted)" }}>
                    {checked.size} / {gear.length} checked
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(checked.size / gear.length) * 100}%`, backgroundColor: "var(--ct-accent)" }} />
            </div>

            <div className="space-y-2">
                {gear.map(g => {
                    const isChecked = checked.has(g.id);
                    const sc = STATUS_CONFIG[g.status];
                    return (
                        <button key={g.id} onClick={() => toggle(g.id)}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all"
                            style={{
                                backgroundColor: isChecked ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isChecked ? "rgba(52,211,153,0.2)" : "var(--ct-border)"}`,
                            }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: isChecked ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.05)" }}>
                                {isChecked ? <Check size={12} color="#34d399" /> : null}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium" style={{ color: isChecked ? "#9ca3af" : "var(--ct-text)", textDecoration: isChecked ? "line-through" : "none" }}>
                                    {g.name}
                                </p>
                                {g.assignedTo && (
                                    <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>→ {g.assignedTo}</p>
                                )}
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: sc.bg, color: sc.color }}>
                                {sc.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {allDone && (
                <div className="mt-6 p-5 rounded-2xl text-center"
                    style={{ backgroundColor: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <CheckCircle2 size={24} color="#34d399" className="mx-auto mb-2" />
                    <p className="text-sm font-semibold" style={{ color: "#34d399" }}>
                        {phaseName} Complete! All {gear.length} items accounted for.
                    </p>
                </div>
            )}
        </div>
    );
}

// ── Form helper ───────────────────────────────────────────────────────────────
function FormInput({ label, value, onChange, placeholder, type = "text" }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <div>
            <label className="text-xs mb-1.5 block" style={{ color: "var(--ct-text-muted)" }}>{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
        </div>
    );
}
