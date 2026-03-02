"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Layout, ArrowRight } from "lucide-react";
import Link from "next/link";
import SocialLogin from "@/components/auth/SocialLogin";

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials or access key.");
            } else {
                router.push("/console");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-vynl-teal/30">
            <div className="w-full max-w-md space-y-12">
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-vynl-teal hover:text-white transition-colors mb-4">
                        <Layout size={24} />
                        <span className="font-black tracking-tighter text-2xl italic">VYNL.PRO</span>
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">COMMAND ACCESS</h1>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em]">Enter Identifier & Key</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="EMAIL OR ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            className="w-full bg-neutral-900 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-vynl-teal/50 transition-all font-mono text-xs tracking-widest placeholder:text-neutral-700 placeholder:uppercase"
                            required
                        />
                        <input
                            type="password"
                            placeholder="ACCESS KEY"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-vynl-teal/50 transition-all font-mono text-xs tracking-widest placeholder:text-neutral-700 placeholder:uppercase"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? "AUTHENTICATING..." : "EXECUTE"}
                        <ArrowRight size={14} />
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black"><span className="bg-black px-4 text-neutral-700">OR CONNECT</span></div>
                </div>

                <SocialLogin />

                <p className="text-center text-[10px] text-neutral-600 uppercase tracking-widest">
                    No account?{" "}
                    <Link href="/signup" className="text-vynl-teal hover:text-white transition-colors">
                        Create Access
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LoginContent />
        </Suspense>
    );
}
