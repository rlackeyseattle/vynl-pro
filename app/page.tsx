"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Disc, Radio, Activity, Mic2, Cpu, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { validateInviteCode } from "@/actions/invite";

export default function Home() {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInviteSubmit = () => {
    if (!inviteCode.trim()) return;
    setError("");

    startTransition(async () => {
      const result = await validateInviteCode(inviteCode);
      if (result.valid) {
        router.push(`/join?code=${encodeURIComponent(inviteCode)}`);
      } else {
        setError(result.message || "Invalid code");
        // Shake animation could go here
      }
    });
  };

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

        {/* Gatekeeper Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-sm relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full pointer-events-none" />

          <form
            onSubmit={(e) => { e.preventDefault(); handleInviteSubmit(); }}
            className={`relative z-50 flex items-center bg-[#0a0a0a] border rounded-full p-1 pl-6 shadow-2xl transition-colors ${error ? 'border-red-500/50' : 'border-white/10'}`}
          >
            <Lock size={14} className="text-neutral-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="ENTER INVITE CODE"
              value={inviteCode}
              onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setError(""); }}
              disabled={isPending}
              className="bg-transparent border-none text-sm tracking-widest flex-1 min-w-0 focus:ring-0 text-white placeholder-neutral-700 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-white text-black p-3 rounded-full hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 relative z-20 cursor-pointer"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 min-h-[20px]">
            {error ? (
              <p className="text-[10px] text-red-500 font-mono tracking-widest uppercase animate-pulse">
                {error}
              </p>
            ) : (
              <p className="text-[10px] text-neutral-700 font-mono">
                EXCLUSIVE ACCESS • BY INVITE ONLY
              </p>
            )}
          </div>
        </motion.div>

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
    </div>
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
