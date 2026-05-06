"use client";

import { motion } from "framer-motion";
import { SearchFilters } from "@/components/SearchFilters";
import { Play, Map, Users, MessageSquare, Zap, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-festival opacity-50" />
      </div>

      {/* Hero Section */}
      <header className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-500 text-sm font-black tracking-widest uppercase"
          >
            Universal Musician OS
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-none"
          >
            THE STAGE <br/>
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
              IS YOURS.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium"
          >
            Stop booking like it's 1999. VYNL.PRO is the high-energy ecosystem for 
            musicians, venues, and the crews that make it happen.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/onboarding" className="px-10 py-5 bg-pink-600 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-pink-600/30 flex items-center gap-3">
              START YOUR EPK <ArrowRight size={24} />
            </Link>
            <Link href="/venues" className="px-10 py-5 bg-zinc-900 border border-zinc-800 rounded-full font-black text-xl hover:bg-zinc-800 transition-all">
              EXPLORE VENUES
            </Link>
          </div>
        </div>
      </header>

      {/* Main Search Interface */}
      <section className="relative z-10 container mx-auto px-4 -mt-10">
        <div className="glass p-1 rounded-[40px] shadow-2xl">
          <SearchFilters />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 container mx-auto px-4 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card 
          icon={<Zap className="text-pink-500" />} 
          title="Fast Booking" 
          desc="Claim your venue or artist profile and start booking in seconds." 
        />
        <Card 
          icon={<Map className="text-indigo-500" />} 
          title="Tour Map" 
          desc="Find every gig within 10 hours and plan your route with lodging." 
        />
        <Card 
          icon={<Shield className="text-fuchsia-500" />} 
          title="Verified EPK" 
          desc="Professional band sites that look like high-end productions." 
        />
        <Card 
          icon={<MessageSquare className="text-pink-500" />} 
          title="Scene Chat" 
          desc="Real-time messaging between bands, venues, and promoters." 
        />
      </section>

      {/* Live Chat Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="glass rounded-[40px] p-12 border border-zinc-800/50 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-br from-zinc-900/50 to-transparent">
          <div className="flex-1 space-y-6">
            <h2 className="text-5xl font-black">GO LIVE WITH <br/> THE SCENE.</h2>
            <p className="text-xl text-zinc-400">
              Integrated real-time chat for every show. From "is load-in still at 5?" 
              to "the show is about to start!", stay connected in the hub.
            </p>
            <button className="px-8 py-4 bg-indigo-600 rounded-full font-black hover:bg-indigo-500 transition-colors">
              PRE-LOAD THE CHAT
            </button>
          </div>
          <div className="w-full md:w-96 aspect-[3/4] bg-zinc-950 rounded-3xl border border-zinc-800 p-6 flex flex-col shadow-2xl">
            <div className="flex-1 space-y-4">
              <ChatBubble name="Roadie" msg="Stage is set! Sound check in 10." side="left" color="text-pink-500" />
              <ChatBubble name="Vynl Bot" msg="SHOWTIME: 8:00 PM" side="right" color="text-indigo-500" />
              <ChatBubble name="Lead Guitar" msg="Anyone seen my tuner?" side="left" color="text-fuchsia-500" />
            </div>
            <div className="mt-4 flex gap-2">
              <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm" placeholder="Type a message..." />
              <button className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-12 text-center text-zinc-500">
        <p className="font-black tracking-widest text-xs">© {new Date().getFullYear()} VYNL.PRO / ROCKET TREE LABS</p>
      </footer>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass p-8 rounded-3xl border border-zinc-800/50 hover:border-pink-500/30 transition-all group">
      <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 border border-zinc-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ChatBubble({ name, msg, side, color }: { name: string, msg: string, side: "left" | "right", color: string }) {
  return (
    <div className={`flex flex-col ${side === "right" ? "items-end" : "items-start"}`}>
      <span className={`text-[10px] font-black uppercase mb-1 ${color}`}>{name}</span>
      <div className={`px-4 py-2 rounded-2xl text-sm ${side === "right" ? "bg-indigo-600 rounded-tr-none" : "bg-zinc-900 rounded-tl-none border border-zinc-800"}`}>
        {msg}
      </div>
    </div>
  );
}
