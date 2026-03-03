"use client";

import { Package, Truck, Tag, Star, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";

const PRODUCTS = [
  {
    id: "tracker-tag",
    name: "VYNL Gear Tag",
    desc: "Bluetooth tracker tag for every piece of gear. Scans into Loadout automatically.",
    price: "$19",
    emoji: "🏷️",
    color: "#f59e0b",
    badge: "Best Seller",
    href: "https://vynl.pro/store/gear-tag",
  },
  {
    id: "tracker-bundle",
    name: "Band Bundle (10 Tags)",
    desc: "Tag your whole rig. 10 VYNL Gear Tags with a carry case.",
    price: "$149",
    emoji: "📦",
    color: "#f97316",
    badge: "Save 20%",
    href: "https://vynl.pro/store/band-bundle",
  },
  {
    id: "mobile-stage",
    name: "Mobile Stage Package",
    desc: "Full fold-out stage system with road cases, in-stage power, and load-in wheels.",
    price: "From $2,400",
    emoji: "🎪",
    color: "#34d399",
    badge: "Custom Quote",
    href: "https://vynl.pro/store/mobile-stage",
  },
  {
    id: "pro-shirt",
    name: "VYNL Pro Tee",
    desc: "Premium heavyweight cotton. Minimal VYNL.PRO wordmark. Wears like a band shirt.",
    price: "$34",
    emoji: "👕",
    color: "#a78bfa",
    href: "https://vynl.pro/store/merch",
  },
  {
    id: "hat",
    name: "VYNL Snapback",
    desc: "Structured snapback with embroidered VYNL logo. Stage-ready.",
    price: "$38",
    emoji: "🧢",
    color: "#f472b6",
    href: "https://vynl.pro/store/merch",
  },
  {
    id: "tablet-case",
    name: "Tablet Stage Case",
    desc: "Heavy-duty road case designed for your VYNL console tablet. Locking clasps.",
    price: "$89",
    emoji: "📱",
    color: "#67e8f9",
    href: "https://vynl.pro/store/accessories",
  },
];

export default function StorePage() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "var(--ct-bg)" }}>
      {/* Header */}
      <div className="border-b px-8 py-6" style={{ borderColor: "var(--ct-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(233,121,249,0.1)", border: "1px solid rgba(233,121,249,0.2)" }}>
            <Package size={16} style={{ color: "#e879f9" }} />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ color: "var(--ct-text)" }}>Supply Co.</h1>
            <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>
              Pro gear, tracker tags, mobile staging & VYNL merch
            </p>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="mx-8 mt-6 rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))", border: "1px solid rgba(245,158,11,0.15)" }}>
        <div className="absolute top-0 right-0 w-40 h-40 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        <div className="text-4xl">🎸</div>
        <div>
          <p className="font-black text-sm mb-1" style={{ color: "var(--ct-text)" }}>
            Gear that knows where it is
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>
            VYNL Gear Tags connect to your Loadout app. Scan in, watch the board light up green.
            Never leave a cab at the venue again.
          </p>
        </div>
        <Link href="/console/loadout"
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#000" }}>
          <Zap size={12} /> Open Loadout
        </Link>
      </div>

      {/* Product Grid */}
      <div className="px-8 py-6">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: "var(--ct-text-muted)" }}>
          Products
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PRODUCTS.map(p => (
            <a key={p.id} href={p.href} target="_blank" rel="noopener noreferrer"
              className="group rounded-xl border p-5 flex flex-col transition-all hover:scale-[1.01]"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "var(--ct-border)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${p.color}10`, border: `1px solid ${p.color}20` }}>
                  {p.emoji}
                </div>
                {p.badge && (
                  <span className="text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1"
                    style={{ backgroundColor: `${p.color}15`, color: p.color, border: `1px solid ${p.color}25` }}>
                    <Star size={7} /> {p.badge}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "var(--ct-text)" }}>{p.name}</h3>
              <p className="text-[11px] leading-relaxed flex-1 mb-4" style={{ color: "var(--ct-text-muted)" }}>{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-black text-base" style={{ color: p.color }}>{p.price}</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: p.color }}>
                  View <ExternalLink size={9} />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl border p-6 text-center"
          style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "var(--ct-border)" }}>
          <Truck size={24} className="mx-auto mb-3" style={{ color: "var(--ct-text-muted)" }} />
          <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>Custom orders & wholesale</p>
          <p className="text-[12px] mb-4" style={{ color: "var(--ct-text-muted)" }}>
            Outfitting a full band or venue? Contact us for custom pricing on bulk tracker tags and mobile stage systems.
          </p>
          <a href="mailto:store@vynl.pro"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "rgba(233,121,249,0.1)", color: "#e879f9", border: "1px solid rgba(233,121,249,0.2)" }}>
            <Tag size={12} /> Contact Supply Co.
          </a>
        </div>
      </div>
    </div>
  );
}
