"use client";

import dynamic from "next/dynamic";
import { Info, Map as MapIcon, Route, Bed } from "lucide-react";

const TouringMap = dynamic(() => import("@/components/TouringMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-900 animate-pulse rounded-3xl" />
});

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-full md:w-96 border-r border-zinc-800 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <h2 className="text-3xl font-black mb-2 flex items-center gap-2">
            <MapIcon className="text-pink-500" /> TOURING ENGINE
          </h2>
          <p className="text-zinc-500 text-sm">Map your next route and find hospitality hotspots.</p>
        </div>

        <div className="space-y-4">
          <div className="glass p-4 rounded-2xl border border-zinc-800">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <Route className="w-3 h-3" /> ACTIVE ROUTE
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-sm font-bold text-zinc-300">Seattle, WA</span>
              </div>
              <div className="w-0.5 h-4 bg-zinc-800 ml-[3px]" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-sm font-bold text-zinc-300">Portland, OR</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
              <div className="text-[10px] text-zinc-500 font-bold uppercase">Drive Time</div>
              <div className="text-sm font-black">2h 45m</div>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border border-zinc-800">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <Bed className="w-3 h-3" /> NEARBY LODGING ($$-$$$)
            </h4>
            <div className="space-y-3">
              <LodgingItem name="The Ace Hotel" price="$$" type="Hotel" />
              <LodgingItem name="Industrial Loft" price="$$$" type="AirBnB" />
              <LodgingItem name="City Center Inn" price="$" type="Motel" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-pink-600/10 rounded-2xl border border-pink-500/20 text-xs text-pink-500 font-medium">
          <Info className="w-4 h-4 mb-2" />
          Hotspots indicate venue density. Routes are calculated within a 10-hour driving limit.
        </div>
      </aside>

      {/* Map Main */}
      <main className="flex-1 p-6 relative">
        <TouringMap />
      </main>
    </div>
  );
}

function LodgingItem({ name, price, type }: { name: string, price: string, type: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div>
        <div className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{name}</div>
        <div className="text-[10px] text-zinc-500 font-bold uppercase">{type}</div>
      </div>
      <div className="text-zinc-300 font-black text-sm">{price}</div>
    </div>
  );
}
