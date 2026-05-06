"use client";

import { motion } from "framer-motion";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Play, Camera, Send, Globe, Calendar, ShoppingBag, Radio } from "lucide-react";

export default function ProfilePage() {
  // Mock data for the stylized EPK
  const artist = {
    name: "THE MIDNIGHT ECHO",
    genre: "SYNTHWAVE / INDIE ROCK",
    bio: "Hailing from the neon-drenched streets of the Pacific Northwest, The Midnight Echo blends 80s nostalgia with modern rock energy. Their sound is a journey through space, time, and the human heart.",
    parallaxImages: [
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253361-bee8a1874a1e?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop"
    ],
    tracks: [
      { id: "1", title: "NEON HORIZON", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: "2", title: "STARDUST", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { id: "3", title: "GHOST IN THE MACHINE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ],
    upcomingShows: [
      { id: "1", date: "MAY 24", venue: "The Electric Lounge", city: "Seattle, WA" },
      { id: "2", date: "JUN 02", venue: "Vibration Hall", city: "Austin, TX" }
    ]
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Header Parallax */}
      <ParallaxBackground imageUrl={artist.parallaxImages[0]} speed={0.2}>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-pink-500 font-black tracking-[0.3em] text-sm uppercase mb-4">Official EPK</h2>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-glow">{artist.name}</h1>
            <p className="text-xl md:text-2xl font-medium tracking-widest mt-4 text-zinc-300">{artist.genre}</p>
          </motion.div>
          
          <div className="flex items-center justify-center gap-6 pt-12">
            <SocialIcon platform="youtube" />
            <SocialIcon platform="instagram" />
            <SocialIcon platform="twitter" />
            <SocialIcon platform="website" />
          </div>
        </div>
      </ParallaxBackground>

      <section className="container mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Player & Bio */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-4xl font-black flex items-center gap-3">
              <Radio className="text-pink-500" /> THE SOUND
            </h3>
            <MusicPlayer tracks={artist.tracks} />
          </div>

          <div className="space-y-6">
            <h3 className="text-4xl font-black">BIOGRAPHY</h3>
            <p className="text-xl text-zinc-400 leading-relaxed font-medium">
              {artist.bio}
            </p>
          </div>
        </div>

        {/* Right Side: Calendar & Store Preview */}
        <div className="space-y-12">
          <div className="glass rounded-3xl p-8 border border-zinc-800/50">
            <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
              <Calendar className="text-indigo-500" /> UPCOMING SHOWS
            </h3>
            <div className="space-y-4">
              {artist.upcomingShows.map((show) => (
                <div key={show.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-pink-500 font-black text-xl leading-none">{show.date.split(' ')[1]}</div>
                      <div className="text-xs font-black text-zinc-500 uppercase">{show.date.split(' ')[0]}</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg group-hover:text-white transition-colors">{show.venue}</div>
                      <div className="text-sm text-zinc-500">{show.city}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-zinc-800 rounded-full text-xs font-black hover:bg-zinc-700 transition-colors">TICKETS</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-8 border border-zinc-800/50 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
                <ShoppingBag className="text-fuchsia-500" /> MERCH STORE
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col justify-end overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10">
                    <div className="font-black text-sm">NEON TEE</div>
                    <div className="text-pink-500 font-bold text-xs">$25.00</div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col justify-end overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8be?q=80&w=1964&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10">
                    <div className="font-black text-sm">HORIZON LP</div>
                    <div className="text-pink-500 font-bold text-xs">$35.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Break */}
      <ParallaxBackground imageUrl={artist.parallaxImages[1]} speed={0.3}>
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">NEVER STOP <br/> THE NOISE.</h2>
          <button className="px-12 py-5 bg-pink-600 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-pink-600/30">BOOK THE ECHO</button>
        </div>
      </ParallaxBackground>
    </div>
  );
}

function SocialIcon({ platform }: { platform: "youtube" | "instagram" | "twitter" | "website" }) {
  return (
    <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-all hover:scale-110 border border-white/5">
      {platform === "youtube" && <Play size={20} />}
      {platform === "instagram" && <Camera size={20} />}
      {platform === "twitter" && <Send size={20} />}
      {platform === "website" && <Globe size={20} />}
    </a>
  );
}
