"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Disc, Github } from "lucide-react";

export default function SocialLogin() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => signIn("google", { callbackUrl })}
                className="flex items-center justify-center gap-3 bg-neutral-900 border border-white/5 py-4 rounded-2xl hover:border-white/20 transition-all group"
            >
                <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <span className="text-[8px] font-black">G</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">GOOGLE</span>
            </button>

            <button
                onClick={() => signIn("discord", { callbackUrl })}
                className="flex items-center justify-center gap-3 bg-neutral-900 border border-white/5 py-4 rounded-2xl hover:border-white/20 transition-all group"
            >
                <Disc size={16} className="text-neutral-600 group-hover:text-vynl-teal transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">DISCORD</span>
            </button>
        </div>
    );
}
