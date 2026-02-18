"use client";

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn("credentials", {
            email,
            password,
            inviteCode,
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
                        <div className="bg-orange-50 p-4 rounded border border-orange-100">
                            <label className="block text-xs font-bold mb-2 text-orange-800 uppercase tracking-wide">Invite Code (Required)</label>
                            <input
                                type="text"
                                className="w-full border border-orange-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                required
                                placeholder="ENTER CODE"
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
