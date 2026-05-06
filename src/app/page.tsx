"use client";

import { motion } from "framer-motion";
import { SearchFilters } from "@/components/SearchFilters";
import { Sparkles, Map, Music2, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-festival pb-20">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
              THE UNIVERSAL <br />
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
                MUSICIAN OS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium">
              Eliminate the friction. Build your EPK, find your tour routes, 
              and claim your space in the scene.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <SearchFilters />
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Music2 className="w-8 h-8 text-pink-500" />}
            title="Stylized EPK"
            description="Professional band websites with parallax backgrounds and integrated music players. No generic profiles."
          />
          <FeatureCard 
            icon={<Map className="w-8 h-8 text-fuchsia-500" />}
            title="Touring Engine"
            description="Intelligent route mapping within 10 hours. Find venues, hotels, and AirBnBs in one click."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-indigo-500" />}
            title="Venue Database"
            description="Comprehensive 'White-Pages' for every music venue. Pre-populated data for instant booking."
          />
        </div>
      </section>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full -z-10" />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass p-8 rounded-3xl border border-zinc-800/50 hover:border-pink-500/30 transition-all group"
    >
      <div className="mb-4 bg-zinc-950 w-16 h-16 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-pink-500/50 transition-colors shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
