
import React from 'react';
import Link from 'next/link';

export default function CodyJackPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <Link href="/" className="text-xl font-bold tracking-tighter hover:text-gray-300 transition-colors">VYNL.PRO</Link>
                <div className="text-sm tracking-widest uppercase text-purple-500">Cody Jack</div>
            </nav>

            {/* Hero */}
            <header className="relative h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-neutral-950 to-neutral-950" />
                <div className="z-10 text-center space-y-6 max-w-5xl">
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
                        CODY JACK
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-300 font-serif italic tracking-wide">
                        "Visuals. Sound. Soul."
                    </p>
                </div>
            </header>

            {/* Gallery / Works Placeholder */}
            <section className="max-w-7xl mx-auto px-6 py-20 space-y-32">

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold">The Artist</h2>
                        <div className="h-1 w-20 bg-purple-500"></div>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            Cody Jack brings a unique perspective to the collective, blending raw artistic intuition with refined musical capability.
                            Whether on canvas or on stage, the expression is always authentic, always moving.
                        </p>
                    </div>
                    <div className="aspect-square bg-neutral-900 rounded-2xl border border-white/5 flex items-center justify-center">
                        <span className="text-gray-600 font-light">Art Piece Placeholder</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                    <div className="aspect-video bg-neutral-900 rounded-2xl border border-white/5 flex items-center justify-center md:order-2">
                        <span className="text-gray-600 font-light">Performance Shot Placeholder</span>
                    </div>
                    <div className="space-y-6 md:order-1">
                        <h2 className="text-4xl font-bold">The Musician</h2>
                        <div className="h-1 w-20 bg-purple-500"></div>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            A multi-instrumentalist with a ear for melody and a heart for rhythm.
                            Cody's contributions to the VYNL ecosystem provide the organic touch that grounds the digital experience.
                        </p>
                    </div>
                </div>

            </section>

            <footer className="py-12 text-center text-sm text-gray-700 border-t border-white/5">
                <p>&copy; {new Date().getFullYear()} Cody Jack.</p>
            </footer>
        </div>
    );
}
