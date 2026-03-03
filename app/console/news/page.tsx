"use client";

import { useState, useEffect, useCallback } from "react";
import { Rss, RefreshCw, ExternalLink, Clock, Loader2, Filter } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  image?: string;
  publishedAt: string;
  category: string;
  description?: string;
}

const CATEGORIES = ["All", "Music News", "Industry", "Touring", "Tech & Gear"];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function MusicWirePage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [ticker, setTicker] = useState(0);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const cat = category !== "All" ? `&category=${encodeURIComponent(category)}` : "";
      const res = await fetch(`/api/news?limit=40${cat}`);
      if (res.ok) { const d = await res.json(); setItems(d.items || d); }
    } catch { /* silent */ }
    setLoading(false);
  }, [category]);

  useEffect(() => { fetchNews(); }, [fetchNews]);
  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (ticker > 0) fetchNews(); }, [ticker, fetchNews]);

  // Ticker animation
  const tickerItems = items.slice(0, 10);

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "var(--ct-bg)" }}>
      {/* Header */}
      <div className="border-b px-8 py-6" style={{ borderColor: "var(--ct-border)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(103,232,249,0.1)", border: "1px solid rgba(103,232,249,0.2)" }}>
              <Rss size={16} style={{ color: "#67e8f9" }} />
            </div>
            <div>
              <h1 className="text-xl font-black" style={{ color: "var(--ct-text)" }}>Music Wire</h1>
              <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>Live music industry news · auto-refreshes every 5 min</p>
            </div>
          </div>
          <button onClick={fetchNews} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: "var(--ct-border)", color: "var(--ct-text-muted)" }}>
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Scrolling Ticker */}
        {tickerItems.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-lg px-4 py-2 flex items-center gap-3"
            style={{ backgroundColor: "rgba(103,232,249,0.04)", border: "1px solid rgba(103,232,249,0.1)" }}>
            <span className="text-[9px] font-black uppercase tracking-widest flex-shrink-0 px-2 py-1 rounded"
              style={{ backgroundColor: "#67e8f9", color: "#000" }}>LIVE</span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-[ticker_30s_linear_infinite] whitespace-nowrap">
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] hover:text-white transition-colors flex-shrink-0"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ color: "#67e8f9" }}>{item.source}</span>
                    {" — "}{item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="px-8 py-4 flex gap-2 flex-wrap border-b" style={{ borderColor: "var(--ct-border)" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={category === c
              ? { backgroundColor: "rgba(103,232,249,0.15)", color: "#67e8f9", border: "1px solid rgba(103,232,249,0.3)" }
              : { backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
            {c}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: "#67e8f9" }} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Rss size={32} className="mx-auto mb-3 opacity-20" />
            <p style={{ color: "var(--ct-text-muted)" }}>No news found. Try refreshing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map(item => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                className="group block rounded-xl border overflow-hidden transition-all hover:scale-[1.01]"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "var(--ct-border)" }}>
                {item.image && (
                  <div className="h-40 overflow-hidden bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={e => { (e.target as HTMLElement).style.display = "none"; }} />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(103,232,249,0.1)", color: "#67e8f9" }}>
                      {item.source}
                    </span>
                    <span className="text-[9px] flex items-center gap-1"
                      style={{ color: "var(--ct-text-muted)" }}>
                      <Clock size={9} />{timeAgo(item.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug mb-1 group-hover:text-white transition-colors"
                    style={{ color: "var(--ct-text)" }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "var(--ct-text-muted)" }}>
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-3 text-[10px] font-medium"
                    style={{ color: "#67e8f9" }}>
                    Read more <ExternalLink size={9} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
    </div>
  );
}
