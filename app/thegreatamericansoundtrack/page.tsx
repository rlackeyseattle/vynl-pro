
import React from 'react';
import Link from 'next/link';

export default function PodcastPage() {
    return (
        <div className="min-h-screen bg-[#1a1008] text-white font-serif selection:bg-orange-500/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-[#1a1008] to-transparent">
                <Link href="/" className="text-xl font-bold tracking-tighter font-sans hover:text-orange-500 transition-colors">VYNL.PRO</Link>
                <div className="text-sm tracking-widest uppercase text-orange-500 font-sans">The Podcast</div>
            </nav>

            {/* Hero */}
            <header className="relative py-32 px-6 flex flex-col items-center justify-center text-center space-y-8">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2694&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent" />

                <div className="z-10 relative">
                    <span className="uppercase tracking-[0.3em] text-orange-500 text-sm font-sans font-bold">Original Series</span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-[#f0e6d2] mt-4 mb-6 leading-tight">
                        The Great American<br />Soundtrack
                    </h1>
                    <p className="text-xl text-[#a89f91] max-w-2xl mx-auto leading-relaxed">
                        Exploring the stories, the songs, and the soul of the music that defined a nation.
                    </p>
                </div>
            </header>

            {/* Episodes List Placeholder */}
            <section className="max-w-4xl mx-auto px-6 py-20 space-y-12 relative z-10">

                <div className="flex items-center justify-between border-b border-orange-900/30 pb-4">
                    <h2 className="text-2xl font-bold text-[#f0e6d2]">Latest Episodes</h2>
                    <button className="text-orange-500 hover:text-orange-400 text-sm font-sans tracking-wide">VIEW ALL</button>
                </div>

                <div className="space-y-6">

                    {/* Ep 1 */}
                    <article className="group bg-[#241a12] p-8 rounded-xl border border-orange-900/10 hover:border-orange-500/30 transition-all cursor-pointer">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-32 aspect-square bg-black/40 rounded-lg flex-shrink-0 flex items-center justify-center text-orange-900">
                                <span className="font-sans font-bold text-2xl">01</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs font-sans tracking-wider text-orange-500/80">
                                    <span>FEBRUARY 14, 2026</span>
                                    <span>•</span>
                                    <span>45 MIN</span>
                                </div>
                                <h3 className="text-2xl font-bold text-[#f0e6d2] group-hover:text-orange-400 transition-colors">
                                    The Roots of Rhythm
                                </h3>
                                <p className="text-[#9c9488] leading-relaxed">
                                    We dive deep into the early days of American rhythm and blues, tracing the lineage from the delta to the city streets.
                                </p>
                                <button className="mt-4 flex items-center gap-2 text-sm font-sans font-bold text-orange-500 group-hover:translate-x-2 transition-transform">
                                    LISTEN NOW <span>→</span>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Ep 2 */}
                    <article className="group bg-[#241a12] p-8 rounded-xl border border-orange-900/10 hover:border-orange-500/30 transition-all cursor-pointer">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-32 aspect-square bg-black/40 rounded-lg flex-shrink-0 flex items-center justify-center text-orange-900">
                                <span className="font-sans font-bold text-2xl">02</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs font-sans tracking-wider text-orange-500/80">
                                    <span>FEBRUARY 07, 2026</span>
                                    <span>•</span>
                                    <span>52 MIN</span>
                                </div>
                                <h3 className="text-2xl font-bold text-[#f0e6d2] group-hover:text-orange-400 transition-colors">
                                    Neon Highways
                                </h3>
                                <p className="text-[#9c9488] leading-relaxed">
                                    Examining the synth-wave revolution and its unexpected origins in 80s film scores.
                                </p>
                                <button className="mt-4 flex items-center gap-2 text-sm font-sans font-bold text-orange-500 group-hover:translate-x-2 transition-transform">
                                    LISTEN NOW <span>→</span>
                                </button>
                            </div>
                        </div>
                    </article>

                </div>

            </section>
        </div>
    );
}
