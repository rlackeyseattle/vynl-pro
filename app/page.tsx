
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <main className="flex flex-col gap-12 row-start-2 items-center text-center">

        <header className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-bold tracking-tighter">VYNL.PRO</h1>
          <p className="text-2xl text-gray-400">The Future of Music & Performance</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-8">
          {/* Artist: Rob Lackey */}
          <div className="p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors group cursor-pointer">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400">Rob Lackey</h2>
            <p className="text-gray-500">Artist & Developer</p>
          </div>

          {/* Artist: Cody Jack */}
          <div className="p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors group cursor-pointer">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400">Cody Jack</h2>
            <p className="text-gray-500">Artist</p>
          </div>

          {/* Artist: Britni Church */}
          <div className="p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors group cursor-pointer">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-pink-400">Britni Church</h2>
            <p className="text-gray-500">Artist</p>
          </div>

          {/* Label: Evolv Records */}
          <div className="p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors group cursor-pointer col-span-1 lg:col-span-3">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-green-400">Evolv Records</h2>
            <p className="text-gray-500">Label & Production</p>
          </div>

          {/* App: VYNL Stage */}
          <div className="p-6 border border-gray-700 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer col-span-1 lg:col-span-3">
            <h2 className="text-3xl font-bold mb-4 group-hover:text-yellow-400">VYNL App Ecosystem</h2>
            <p className="text-gray-400 mb-4">The ultimate platform for live performance, setlist management, and artist tools.</p>
            <div className="flex gap-4 justify-center">
              <span className="px-3 py-1 bg-gray-700 rounded text-sm">VYNL Stage</span>
              <span className="px-3 py-1 bg-gray-700 rounded text-sm">VYNL Studio</span>
              <span className="px-3 py-1 bg-gray-700 rounded text-sm">Arcade Integration</span>
            </div>
          </div>
        </div>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm opacity-50">
        <p>© 2026 VYNL.PRO</p>
      </footer>
    </div>
  );
}
