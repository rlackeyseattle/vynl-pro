
import Image from "next/image";
import Link from "next/link";
import SocialFeed from "@/components/social/SocialFeed";
import AudioPlayer from "@/components/audio/AudioPlayer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 pb-24">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            VYNL<span className="text-purple-500">.PRO</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <Link href="/roblackey" className="hover:text-white transition-colors">ROB LACKEY</Link>
            <Link href="/codyjack" className="hover:text-white transition-colors">CODY JACK</Link>
            <Link href="/rockettreelabs" className="hover:text-white transition-colors">ROCKET TREE</Link>
            <Link href="/thegreatamericansoundtrack" className="hover:text-white transition-colors">PODCAST</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">SIGN IN</button>
            <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">JOIN</button>
          </div>
        </div>
      </header>

      <main className="pt-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_350px] gap-12">

          {/* Left Column: Social Feed */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Musician Hub.</h1>
              <p className="text-neutral-500 max-w-lg">A decentralized stage for artists to connect, share, and build together.</p>
            </div>

            <SocialFeed
              initialPosts={posts as any}
              currentUser={session?.user}
            />
          </div>

          {/* Right Column: Trending / Artist Discovery */}
          <div className="hidden lg:block space-y-10 py-10">
            <section className="space-y-6">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Featured Artists</h3>
              <div className="space-y-4">
                <Link href="/roblackey" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-neutral-800 rounded-full group-hover:ring-2 ring-purple-500 transition-all flex items-center justify-center font-bold text-xs">RL</div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-purple-400 transition-colors">Rob Lackey</p>
                    <p className="text-xs text-neutral-500">3 tracks this week</p>
                  </div>
                </Link>
                <Link href="/codyjack" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-neutral-800 rounded-full group-hover:ring-2 ring-purple-500 transition-all flex items-center justify-center font-bold text-xs">CJ</div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-purple-400 transition-colors">Cody Jack</p>
                    <p className="text-xs text-neutral-500">New collection</p>
                  </div>
                </Link>
              </div>
            </section>

            <section className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold">VYNL Stage Beta</h3>
              <p className="text-xs text-neutral-400 leading-relaxed italic text-gray-400">"The best live performance tool for multi-instrumentalists."</p>
              <Link href="/rockettreelabs" className="text-xs font-bold text-purple-400 hover:text-white transition-colors uppercase tracking-widest block">Learn More →</Link>
            </section>
          </div>

        </div>
      </main>

      <footer className="py-20 text-center text-xs text-gray-700">
        <p>© 2026 VYNL.PRO • Built for the Music Community</p>
      </footer>
    </div>
  );
}
