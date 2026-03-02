"use client";

import { useState } from "react";
import {
    DollarSign, TrendingUp, Package, ShoppingBag, Truck, Plus,
    ArrowUpRight, ArrowDownRight, Users, Bell, Mail, BarChart2,
    ChevronRight, AlertTriangle, Check, Receipt
} from "lucide-react";

// ── Mock financial data ───────────────────────────────────────────────────────
const INCOME = [
    { id: "i1", date: "Feb 22", desc: "Top Hat Billiards — guarantee", amount: 600, type: "show", split: true },
    { id: "i2", date: "Feb 20", desc: "Merch sales — Tractor Tavern show", amount: 187, type: "merch", split: false },
    { id: "i3", date: "Feb 15", desc: "Private event — Billings", amount: 800, type: "show", split: true },
    { id: "i4", date: "Feb 10", desc: "Bandcamp — digital sales", amount: 42, type: "digital", split: false },
    { id: "i5", date: "Feb 5", desc: "Sean Kelly's — door split (65%)", amount: 340, type: "show", split: true },
];

const EXPENSES = [
    { id: "e1", date: "Feb 22", desc: "Fuel — Missoula to Hamilton round trip", amount: 68, type: "travel" },
    { id: "e2", date: "Feb 21", desc: "Hotel — 2 nights Billings", amount: 189, type: "lodging" },
    { id: "e3", date: "Feb 18", desc: "Merch restock — 48 t-shirts", amount: 312, type: "merch" },
    { id: "e4", date: "Feb 16", desc: "Guitar strings — 10 sets D'Addario XL", amount: 54, type: "equipment" },
    { id: "e5", date: "Feb 12", desc: "Gas — van tour run", amount: 140, type: "travel" },
    { id: "e6", date: "Feb 8", desc: "Sound system rental — PA 4hr", amount: 200, type: "equipment" },
];

const MERCH = [
    { name: "Band Tee — Black M", qty: 4, low: true, reorder: 24, vendor: "Artcraft Printers", vendorEmail: "info@artcraftprinters.com", price: 6.50, retail: 20 },
    { name: "Band Tee — Black L", qty: 11, low: false, reorder: 24, vendor: "Artcraft Printers", vendorEmail: "info@artcraftprinters.com", price: 6.50, retail: 20 },
    { name: "Band Tee — Black XL", qty: 3, low: true, reorder: 24, vendor: "Artcraft Printers", vendorEmail: "info@artcraftprinters.com", price: 6.50, retail: 20 },
    { name: "Sticker Pack", qty: 42, low: false, reorder: 100, vendor: "Big Sky Printing", vendorEmail: "orders@bigskyprinting.com", price: 0.80, retail: 5 },
    { name: "Hat — Black Structured", qty: 2, low: true, reorder: 12, vendor: "Artcraft Printers", vendorEmail: "info@artcraftprinters.com", price: 12, retail: 30 },
    { name: "Vinyl LP — Self-Titled", qty: 8, low: false, reorder: 20, vendor: "Nationwide Disc", vendorEmail: "orders@nationwidedisc.com", price: 8, retail: 25 },
];

const MEMBERS = [
    { name: "Rob Lackey", role: "Lead Guitar / Vocals", split: 35 },
    { name: "John Torres", role: "Rhythm Guitar", split: 25 },
    { name: "Dave R.", role: "Bass", split: 20 },
    { name: "Kim Lee", role: "Drums", split: 20 },
];

const TYPE_COLORS: Record<string, string> = {
    show: "#34d399", merch: "#f59e0b", digital: "#a78bfa",
    travel: "#60a5fa", lodging: "#f472b6", equipment: "#f97316",
};

type FinTab = "overview" | "income" | "expenses" | "merch" | "gear" | "splits";

export default function FinancePage() {
    const [tab, setTab] = useState<FinTab>("overview");
    const [reorderModal, setReorderModal] = useState<typeof MERCH[0] | null>(null);
    const [reordering, setReordering] = useState(false);
    const [reordered, setReordered] = useState<string[]>([]);

    const totalIncome = INCOME.reduce((s, i) => s + i.amount, 0);
    const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
    const net = totalIncome - totalExpenses;
    const splitableIncome = INCOME.filter(i => i.split).reduce((s, i) => s + i.amount, 0);

    const handleReorder = () => {
        if (!reorderModal) return;
        setReordering(true);
        setTimeout(() => {
            setReordered(prev => [...prev, reorderModal.name]);
            setReordering(false);
            setReorderModal(null);
        }, 1500);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-0">
                <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={18} style={{ color: "#34d399" }} />
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>Finance</h1>
                </div>
                <p className="text-xs mb-5" style={{ color: "var(--ct-text-muted)" }}>
                    Income, expenses, merch inventory, vendor ordering & member splits — your band's quickbooks.
                </p>

                {/* Summary pills */}
                <div className="flex flex-wrap gap-3 mb-5">
                    {[
                        { label: "Total Income", value: `$${totalIncome.toLocaleString()}`, color: "#34d399", icon: <ArrowUpRight size={12} /> },
                        { label: "Total Expenses", value: `$${totalExpenses.toLocaleString()}`, color: "#f87171", icon: <ArrowDownRight size={12} /> },
                        { label: "Net This Month", value: `$${net.toLocaleString()}`, color: net > 0 ? "#34d399" : "#f87171", icon: <BarChart2 size={12} /> },
                        { label: "Low Inventory", value: `${MERCH.filter(m => m.low).length} items`, color: "#f59e0b", icon: <AlertTriangle size={12} /> },
                    ].map(pill => (
                        <div key={pill.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                            style={{ backgroundColor: pill.color + "10", border: `1px solid ${pill.color}30` }}>
                            <span style={{ color: pill.color }}>{pill.icon}</span>
                            <div>
                                <p className="text-sm font-black leading-none" style={{ color: pill.color }}>{pill.value}</p>
                                <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--ct-text-muted)" }}>{pill.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-1 border-b" style={{ borderColor: "var(--ct-border)" }}>
                    {([
                        { key: "overview", label: "📊 Overview" },
                        { key: "income", label: "💵 Income" },
                        { key: "expenses", label: "📤 Expenses" },
                        { key: "merch", label: "👕 Merch" },
                        { key: "gear", label: "🎸 Gear" },
                        { key: "splits", label: "🤝 Splits" },
                    ] as { key: FinTab; label: string }[]).map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all"
                            style={tab === t.key ? { color: "#34d399", borderBottom: "2px solid #34d399" } : { color: "var(--ct-text-muted)" }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-8 py-6">
                {/* ── OVERVIEW ─────────────────────────────────────── */}
                {tab === "overview" && (
                    <div className="space-y-6 max-w-3xl">
                        {/* Mini chart bars */}
                        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ct-text-muted)" }}>February Income vs Expenses</p>
                            <div className="flex items-end gap-4 h-24">
                                {[
                                    { label: "Shows", income: 1740, expense: 0 },
                                    { label: "Merch", income: 187, expense: 312 },
                                    { label: "Digital", income: 42, expense: 0 },
                                    { label: "Travel", income: 0, expense: 208 },
                                    { label: "Lodging", income: 0, expense: 189 },
                                    { label: "Equipment", income: 0, expense: 254 },
                                ].map(bar => {
                                    const maxVal = 1800;
                                    return (
                                        <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-full flex gap-0.5 items-end h-16">
                                                {bar.income > 0 && (
                                                    <div className="flex-1 rounded-t-sm" style={{ height: `${(bar.income / maxVal) * 100}%`, backgroundColor: "#34d399" }} />
                                                )}
                                                {bar.expense > 0 && (
                                                    <div className="flex-1 rounded-t-sm" style={{ height: `${(bar.expense / maxVal) * 100}%`, backgroundColor: "#f87171" }} />
                                                )}
                                            </div>
                                            <p className="text-[8px] text-center" style={{ color: "var(--ct-text-muted)" }}>{bar.label}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Low inventory alerts */}
                        {MERCH.filter(m => m.low && !reordered.includes(m.name)).length > 0 && (
                            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle size={14} style={{ color: "#f59e0b" }} />
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f59e0b" }}>Low Inventory Alerts</p>
                                </div>
                                {MERCH.filter(m => m.low && !reordered.includes(m.name)).map(item => (
                                    <div key={item.name} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: "var(--ct-text)" }}>{item.name}</p>
                                            <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>Only {item.qty} remaining · Vendor: {item.vendor}</p>
                                        </div>
                                        <button onClick={() => setReorderModal(item)}
                                            className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                                            style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                                            <Mail size={10} /> Reorder
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── INCOME ───────────────────────────────────────── */}
                {tab === "income" && (
                    <div className="max-w-2xl space-y-2">
                        <div className="flex justify-end mb-2">
                            <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                                style={{ backgroundColor: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                                <Plus size={11} /> Add Income
                            </button>
                        </div>
                        {INCOME.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[item.type] }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium" style={{ color: "var(--ct-text)" }}>{item.desc}</p>
                                    <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>{item.date} · {item.type}{item.split ? " · split applicable" : ""}</p>
                                </div>
                                <p className="text-sm font-black flex-shrink-0" style={{ color: "#34d399" }}>+${item.amount}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── EXPENSES ─────────────────────────────────────── */}
                {tab === "expenses" && (
                    <div className="max-w-2xl space-y-2">
                        <div className="flex justify-end mb-2">
                            <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                                style={{ backgroundColor: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                                <Plus size={11} /> Log Expense
                            </button>
                        </div>
                        {EXPENSES.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[item.type] }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium" style={{ color: "var(--ct-text)" }}>{item.desc}</p>
                                    <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>{item.date} · {item.type}</p>
                                </div>
                                <p className="text-sm font-black flex-shrink-0" style={{ color: "#f87171" }}>-${item.amount}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── MERCH ────────────────────────────────────────── */}
                {tab === "merch" && (
                    <div className="max-w-3xl space-y-2">
                        <div className="flex justify-end mb-2">
                            <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                                style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                                <Plus size={11} /> Add Merch Item
                            </button>
                        </div>
                        {MERCH.map(item => (
                            <div key={item.name} className="flex items-center gap-4 p-4 rounded-2xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: `1px solid ${item.low && !reordered.includes(item.name) ? "rgba(245,158,11,0.3)" : "var(--ct-border)"}` }}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-medium" style={{ color: "var(--ct-text)" }}>{item.name}</p>
                                        {item.low && !reordered.includes(item.name) && (
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">LOW STOCK</span>
                                        )}
                                        {reordered.includes(item.name) && (
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">✓ REORDERED</span>
                                        )}
                                    </div>
                                    <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>
                                        Vendor: {item.vendor} · Cost: ${item.price} · Retail: ${item.retail} · Reorder qty: {item.reorder}
                                    </p>
                                </div>
                                <div className="text-center flex-shrink-0">
                                    <p className="text-lg font-black" style={{ color: item.low && !reordered.includes(item.name) ? "#f59e0b" : "var(--ct-text)" }}>{item.qty}</p>
                                    <p className="text-[8px]" style={{ color: "var(--ct-text-muted)" }}>in stock</p>
                                </div>
                                <button onClick={() => !reordered.includes(item.name) && setReorderModal(item)}
                                    disabled={reordered.includes(item.name)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 flex-shrink-0 transition-all disabled:opacity-40"
                                    style={{ backgroundColor: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                                    <Mail size={10} /> Order
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── SPLITS ───────────────────────────────────────── */}
                {tab === "splits" && (
                    <div className="max-w-2xl space-y-5">
                        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ct-text-muted)" }}>
                                Band Member Splits — February Splittable Income: <span style={{ color: "#34d399" }}>${splitableIncome}</span>
                            </p>
                            {MEMBERS.map(member => (
                                <div key={member.name} className="flex items-center gap-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--ct-border)" }}>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                        style={{ background: "linear-gradient(135deg, var(--ct-accent), var(--ct-accent-2))", color: "#000" }}>
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>{member.name}</p>
                                        <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{member.role}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-black" style={{ color: "#34d399" }}>
                                            ${Math.round(splitableIncome * (member.split / 100))}
                                        </p>
                                        <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>{member.split}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 rounded-2xl border border-dashed text-center" style={{ borderColor: "var(--ct-border)" }}>
                            <p className="text-xs font-bold mb-1" style={{ color: "var(--ct-text)" }}>Customize Split Rules</p>
                            <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>Set per-member percentages, expense deductions, and payment reminders</p>
                        </div>
                    </div>
                )}

                {/* ── GEAR tab (just link to dedicated gear page) ── */}
                {tab === "gear" && (
                    <div className="max-w-xl">
                        <div className="p-8 rounded-2xl border text-center" style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                            <p className="text-3xl mb-3">🎸</p>
                            <p className="text-base font-bold mb-2" style={{ color: "var(--ct-text)" }}>Gear Inventory</p>
                            <p className="text-sm mb-5" style={{ color: "var(--ct-text-muted)" }}>
                                Track your equipment, values, status, and show checklists in the dedicated Gear Manager.
                            </p>
                            <a href="/console/toolkit/gear"
                                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all hover:scale-105"
                                style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)", color: "#000" }}>
                                Open Gear Manager <ChevronRight size={14} />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Reorder modal */}
            {reorderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setReorderModal(null)}>
                    <div className="w-full max-w-sm mx-4 p-6 rounded-2xl space-y-4" onClick={e => e.stopPropagation()}
                        style={{ backgroundColor: "var(--ct-bg-2)", border: "1px solid var(--ct-border)" }}>
                        <p className="text-sm font-bold" style={{ color: "var(--ct-text)" }}>📧 Reorder: {reorderModal.name}</p>
                        <div className="text-xs space-y-1" style={{ color: "var(--ct-text-muted)" }}>
                            <p>Vendor: <span style={{ color: "var(--ct-text)" }}>{reorderModal.vendor}</span></p>
                            <p>Email: <span style={{ color: "var(--ct-accent)" }}>{reorderModal.vendorEmail}</span></p>
                            <p>Reorder Qty: <span style={{ color: "var(--ct-text)" }}>{reorderModal.reorder} units</span></p>
                            <p>Unit Cost: <span style={{ color: "var(--ct-text)" }}>${reorderModal.price}</span></p>
                            <p className="font-bold" style={{ color: "#34d399" }}>
                                Total: ${(reorderModal.reorder * reorderModal.price).toFixed(2)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)" }}>
                            Hi {reorderModal.vendor},{"\n\n"}
                            We'd like to reorder {reorderModal.reorder}x {reorderModal.name} for our merch table. Please confirm availability and send invoice.{"\n\n"}
                            Thanks, Rob Lackey Band
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setReorderModal(null)}
                                className="flex-1 py-2 rounded-xl text-xs font-medium"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)" }}>
                                Cancel
                            </button>
                            <button onClick={handleReorder} disabled={reordering}
                                className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                                style={{ background: "linear-gradient(135deg, #34d399, #06b6d4)", color: "#000" }}>
                                {reordering ? "Sending..." : <><Mail size={11} /> Send Email</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
