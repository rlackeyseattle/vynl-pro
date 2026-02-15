
import React from 'react';
import Link from 'next/link';

export default function RocketTreeLabsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-green-500/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-green-900/20">
                <Link href="/" className="text-xl font-bold tracking-tighter hover:text-green-500 transition-colors">VYNL.PRO</Link>
                <div className="text-sm tracking-widest uppercase text-green-500">Rocket Tree Labs</div>
            </nav>

            {/* Hero */}
            <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                <div className="border border-green-900/30 bg-green-900/5 rounded-lg p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />

                    <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-green-50">
                        ROCKET TREE LABS
                    </h1>
                    <p className="text-xl text-green-400/80 max-w-2xl mx-auto">
                        High-Performance Audio Software & Utilities
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
                        <div className="p-6 border border-green-900/30 bg-black/40 rounded hover:bg-green-900/10 transition-colors cursor-default">
                            <h3 className="text-green-400 text-lg mb-2">&gt; DSP_Core</h3>
                            <p className="text-sm text-gray-500">Real-time audio processing modules.</p>
                        </div>
                        <div className="p-6 border border-green-900/30 bg-black/40 rounded hover:bg-green-900/10 transition-colors cursor-default">
                            <h3 className="text-green-400 text-lg mb-2">&gt; Latency_Zero</h3>
                            <p className="text-sm text-gray-500">Optimized low-level drivers.</p>
                        </div>
                        <div className="p-6 border border-green-900/30 bg-black/40 rounded hover:bg-green-900/10 transition-colors cursor-default">
                            <h3 className="text-green-400 text-lg mb-2">&gt; Cloud_Sync</h3>
                            <p className="text-sm text-gray-500">Seamless setlist management.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 space-y-8">
                    <h2 className="text-2xl font-bold text-green-500 border-b border-green-900/30 pb-4">Current Initiatives</h2>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start gap-4">
                            <span className="text-green-500 mt-1">::</span>
                            <div>
                                <strong className="text-white block">VYNL Stage Integrations</strong>
                                <p className="text-sm mt-1">Developing custom plugins for live performance stability and feature expansion.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-green-500 mt-1">::</span>
                            <div>
                                <strong className="text-white block">Audio Analysis Tools</strong>
                                <p className="text-sm mt-1">Automated BPM detection and key analysis algorithms.</p>
                            </div>
                        </li>
                    </ul>
                </div>

            </main>

            <footer className="py-8 text-center text-xs text-green-900/50">
                <p>SYSTEM_READY // ROCKET_TREE_LABS v2.0.26</p>
            </footer>
        </div>
    );
}
