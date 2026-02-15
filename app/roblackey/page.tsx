
import React from 'react';
import Link from 'next/link';

export default function RobLackeyPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <Link href="/" className="text-xl font-bold tracking-tighter hover:text-gray-300 transition-colors">VYNL.PRO</Link>
                <div className="text-sm tracking-widest uppercase text-blue-500">Rob Lackey</div>
            </nav>

            {/* Hero */}
            <header className="relative h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950" />
                <div className="z-10 text-center space-y-6 max-w-4xl">
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
                        ROB LACKEY
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide">
                        ARTIST • DEVELOPER • VISIONARY
                    </p>
                    <p className="max-w-xl mx-auto text-gray-500 leading-relaxed">
                        Blurring the lines between creative expression and technical innovation.
                        Building the future of music technology with VYNL while crafting sonic landscapes.
                    </p>
                </div>
            </header>

            {/* Content Grid */}
            <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12">

                {/* Project: VYNL */}
                <div className="group relative bg-neutral-900 rounded-3xl p-8 border border-white/5 hover:border-blue-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <h3 className="text-3xl font-bold mb-4">VYNL Ecosystem</h3>
                    <p className="text-gray-400 mb-6">
                        Architecting the next generation of live performance tools.
                        VYNL Stage, VYNL Studio, and the connected artist experience.
                    </p>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-blue-400 border border-blue-500/20">React</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-blue-400 border border-blue-500/20">Next.js</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-blue-400 border border-blue-500/20">Audio API</span>
                    </div>
                </div>

                {/* Project: Music */}
                <div className="group relative bg-neutral-900 rounded-3xl p-8 border border-white/5 hover:border-purple-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <h3 className="text-3xl font-bold mb-4">Music Production</h3>
                    <p className="text-gray-400 mb-6">
                        Writing, recording, and producing genre-bending tracks.
                        Exploring the intersection of organic instrumentation and digital synthesis.
                    </p>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-purple-400 border border-purple-500/20">Composition</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-purple-400 border border-purple-500/20">Production</span>
                    </div>
                </div>

            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-sm text-gray-700 border-t border-white/5">
                <p>&copy; {new Date().getFullYear()} Rob Lackey. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
