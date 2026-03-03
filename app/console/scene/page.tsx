"use client";

import { useState, useEffect } from "react";
import { Globe, MapPin, Phone, Mail, Calendar, Search, Loader2, Music2, ChevronRight } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  genres?: string[];
  description?: string;
  website?: string;
  bookingContact?: string;
  tags?: string;
}

const STATES = ["All", "WA", "OR", "MT", "ID"];

export default function ScenePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");

  useEffect(() => {
    fetch("/api/venues?limit=200")
      .then(r => r.json())
      .then(d => { setVenues(d.venues || d || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = venues.filter(v => {
    const matchState = stateFilter === "All" || v.state === stateFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || v.name.toLowerCase().includes(q) || v.city?.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q);
    return matchState && matchSearch;
  });

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "var(--ct-bg)" }}>
      {/* Header */}
      <div className="border-b px-8 py-6" style={{ borderColor: "var(--ct-border)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <Globe size={16} style={{ color: "#34d399" }} />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ color: "var(--ct-text)" }}>Scene</h1>
            <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>
              PNW venue directory · WA · OR · MT · ID
            </p>
          </div>
          <div className="ml-auto px-3 py-1 rounded-lg text-[11px] font-bold"
            style={{ backgroundColor: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
            {venues.length} venues
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "var(--ct-border)" }}>
            <Search size={13} style={{ color: "var(--ct-text-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search venues, cities..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--ct-text)" }} />
          </div>
          <div className="flex gap-2">
            {STATES.map(s => (
              <button key={s} onClick={() => setStateFilter(s)}
                className="px-3 py-2 rounded-xl text-[11px] font-semibold transition-all"
                style={stateFilter === s
                  ? { backgroundColor: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }
                  : { backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Venue Grid */}
      <div className="px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: "#34d399" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Globe size={32} className="mx-auto mb-3 opacity-20" />
            <p style={{ color: "var(--ct-text-muted)" }}>No venues found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(venue => (
              <div key={venue.id} className="group rounded-xl border p-5 transition-all hover:border-green-500/20 hover:scale-[1.01]"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "var(--ct-border)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
                    🎸
                  </div>
                  {venue.capacity && (
                    <span className="text-[9px] font-bold px-2 py-1 rounded-lg"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)" }}>
                      {venue.capacity} cap
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--ct-text)" }}>{venue.name}</h3>
                <div className="flex items-center gap-1 mb-3 text-[11px]" style={{ color: "var(--ct-text-muted)" }}>
                  <MapPin size={10} />
                  {venue.city}{venue.state ? `, ${venue.state}` : ""}
                </div>

                {venue.description && (
                  <p className="text-[11px] leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--ct-text-muted)" }}>
                    {venue.description}
                  </p>
                )}

                <div className="flex flex-col gap-1.5">
                  {venue.email && (
                    <a href={`mailto:${venue.email}`}
                      className="flex items-center gap-2 text-[10px] hover:opacity-80 transition-opacity"
                      style={{ color: "#34d399" }}>
                      <Mail size={10} /> {venue.email}
                    </a>
                  )}
                  {venue.phone && (
                    <a href={`tel:${venue.phone}`}
                      className="flex items-center gap-2 text-[10px]"
                      style={{ color: "var(--ct-text-muted)" }}>
                      <Phone size={10} /> {venue.phone}
                    </a>
                  )}
                  {venue.website && (
                    <a href={venue.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] group-hover:text-white transition-colors"
                      style={{ color: "var(--ct-text-muted)" }}>
                      <Globe size={10} /> Website <ChevronRight size={9} />
                    </a>
                  )}
                </div>

                {venue.bookingContact && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--ct-border)" }}>
                    <a href={`mailto:${venue.bookingContact}`}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                      <Calendar size={11} /> Book this venue
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
