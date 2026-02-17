"use client";

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import '../styles/myspace.css';

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
        <div className="bg-[#e5e5e5] min-h-screen flex items-center justify-center font-sans">
            <div className="myspace-container w-[400px] border border-[#6699cc]">
                <header className="myspace-header !h-12 !text-lg">
                    VYNL.PRO // Login
                </header>

                <div className="p-6 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border border-gray-300 p-2 text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="email@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="w-full border border-gray-300 p-2 text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Your password"
                            />
                        </div>
                        <div className="bg-orange-50 p-3 border border-orange-200">
                            <label className="block text-xs font-bold mb-1 text-orange-800">Invite Code (Required)</label>
                            <input
                                type="text"
                                className="w-full border border-orange-300 p-2 text-sm"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                required
                                placeholder="Enter your invitation code"
                            />
                        </div>

                        {error && <p className="text-red-600 text-[11px] font-bold">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-[#6699cc] text-white font-bold py-2 text-sm hover:bg-[#5588bb]"
                        >
                            Sign In / Create Profile
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400 text-center">
                        This is an invite-only platform. If you don't have a code, contact a VYNL member.
                    </div>
                </div>
            </div>
        </div>
    );
}
