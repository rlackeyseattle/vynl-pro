
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tighter">VYNL<span className="text-purple-500">.PRO</span></h1>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <Link href="/roblackey" className="hover:text-white transition-colors">ROB LACKEY</Link>
            <Link href="/codyjack" className="hover:text-white transition-colors">CODY JACK</Link>
            <Link href="/rockettreelabs" className="hover:text-white transition-colors">ROCKET TREE</Link>
            <Link href="/thegreatamericansoundtrack" className="hover:text-white transition-colors">PODCAST</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20">

          {/* Hero / Intro */}
          <div className="text-center space-y-6 py-20">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              The Creative Collective.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A central hub for music, art, software development, and storytelling.
              Exploring the intersection of creativity and technology.
            </p>
          </div>

          {/* Grid Navigation */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Rob Lackey */}
            <Link href="/roblackey" className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 aspect-[4/3] hover:border-blue-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Rob Lackey</h2>
                <p className="text-gray-500 group-hover:text-gray-300 transition-colors">Artist & Developer</p>
              </div>
            </Link>

            {/* Cody Jack */}
            <Link href="/codyjack" className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 aspect-[4/3] hover:border-purple-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Cody Jack</h2>
                <p className="text-gray-500 group-hover:text-gray-300 transition-colors">Artist & Musician</p>
              </div>
            </Link>

            {/* Rocket Tree Labs */}
            <Link href="/rockettreelabs" className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 aspect-[4/3] hover:border-green-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Rocket Tree Labs</h2>
                <p className="text-gray-500 group-hover:text-gray-300 transition-colors">Audio Software & Utilities</p>
              </div>
            </Link>

            {/* Podcast */}
            <Link href="/thegreatamericansoundtrack" className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 aspect-[4/3] hover:border-yellow-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2 group-hover:translate-x-2 transition-transform">The Great American Soundtrack</h2>
                <p className="text-gray-500 group-hover:text-gray-300 transition-colors">Podcast</p>
              </div>
            </Link>

          </div>

        </div>
      </main>

      <footer className="py-8 text-center text-sm text-gray-600 border-t border-white/5">
        <p>© 2026 VYNL.PRO</p>
      </footer>
    </div>
  );
}
