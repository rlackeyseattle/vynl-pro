"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Disc, Radio, Activity, Mic2, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  // const handleInviteSubmit = () => ... (Removed)

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col relative overflow-hidden font-sans selection:bg-white/20">

      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 blur-[150px] rounded-full opacity-40 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 blur-[150px] rounded-full opacity-40 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            VYNL.PRO
          </h1>
          <p className="text-sm md:text-base text-neutral-500 tracking-[0.3em] uppercase max-w-xl mx-auto leading-loose">
            Universal Musician Utility Tool <br className="hidden md:block" /> & Social Network
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link
            href="/join"
            className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-[0.2em] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all z-50 transform hover:scale-105"
          >
            <span className="relative z-10">GET STARTED</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            Member Login
          </Link>
        </div>

      </main>

      {/* Subtle Footer Nav */}
      <footer className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-neutral-600 font-mono gap-6 border-t border-white/5">
        <div className="flex items-center gap-6">
          <NavLink href="/rtlcc" icon={<Cpu size={12} />} label="RTLCC" />
          <NavLink href="/mastering" icon={<Disc size={12} />} label="THE PRESS" />
          <NavLink href="/stage" icon={<Mic2 size={12} />} label="STAGE" />
          <NavLink href="/thegreatamericansoundtrack" icon={<Radio size={12} />} label="PODCAST" />
          <NavLink href="/analyze" icon={<Activity size={12} />} label="ANALYZE" />
        </div>
        <p>© 2026 Rob Lackey • Built for the Music Community</p>
      </footer>
    </div >
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 hover:text-white transition-colors uppercase tracking-wider group">
      <span className="text-neutral-700 group-hover:text-white transition-colors">{icon}</span>
      {label}
    </Link>
  );
}
