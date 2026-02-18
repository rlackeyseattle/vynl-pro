"use client";

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import SocialLogin from "@/components/auth/SocialLogin";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [inviteCode, setInviteCode] = useState(''); // Removed
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn("credentials", {
            email,
            password,
            // inviteCode,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            router.push('/roblackey');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <header className="bg-slate-800 text-white h-14 flex items-center justify-center text-lg font-bold tracking-wider">
                    VYNL.PRO // ACCESS
                </header>

                <div className="p-8">
                    <SocialLogin />

                    <div className="my-6 text-center text-xs text-gray-400 font-bold tracking-widest uppercase">
                        — OR USE CREDENTIALS —
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold mb-1 uppercase tracking-wide text-gray-500">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="email@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold mb-1 uppercase tracking-wide text-gray-500">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="YOUR PASSWORD"
                            />
                        </div>


                        {error && <p className="text-red-600 text-xs font-bold bg-red-50 p-2 rounded">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-slate-800 text-white font-bold py-3 text-sm rounded hover:bg-slate-700 transition-colors uppercase tracking-widest shadow-md"
                        >
                            Enter
                        </button>
                    </form>

                    <div className="mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-400 text-center">
                        INVITE-ONLY PLATFORM. AUTHORIZED ACCESS ONLY.
                    </div>
                </div>
            </div>
        </div>
    );
}
