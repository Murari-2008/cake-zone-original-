import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Cherry, ChevronDown, Compass, Crown } from 'lucide-react';

interface HeroSectionProps {
  onScrollToMenu: () => void;
  onScrollToCustomizer: () => void;
}

export default function HeroSection({ onScrollToMenu, onScrollToCustomizer }: HeroSectionProps) {
  return (
    <div className="relative bg-stone-900 text-stone-50 overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-2xl min-h-[85vh] flex items-center">
      
      {/* Decorative background gradients */}
      <div className="absolute inset-0 bg-radial-at-t from-amber-900/30 via-stone-950/90 to-stone-950 pointer-events-none" />
      
      {/* Subtle vector circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-800/10 rounded-full blur-[80px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-700/15 rounded-full blur-[100px]" />

      {/* Elegant "Since 2014" stamp in the top-right corner with a gorgeous luxury look */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute top-5 right-5 md:top-8 md:right-10 z-20"
      >
        <div className="relative group p-3.5 bg-neutral-900/95 backdrop-blur-md rounded-2xl border-2 border-double border-amber-400/60 shadow-[0_12px_45px_rgba(245,158,11,0.25)] overflow-hidden transition-all duration-500 hover:border-amber-300/80 hover:scale-105 select-none">
          {/* Subtle gold ornamental corner glow and highlights */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-14 h-14 bg-amber-400/25 rounded-full blur-md" />
          
          <div className="flex items-center gap-3 relative z-10">
            {/* Wax Seal Gold Medallion */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.4)] shrink-0 group-hover:rotate-12 transition-transform duration-700">
              <div className="flex items-center justify-center w-full h-full bg-stone-950 rounded-full border border-amber-400/40">
                <Crown className="w-4.5 h-4.5 text-amber-300 animate-pulse" />
              </div>
            </div>
            
            <div className="text-left flex flex-col justify-center">
              <span className="font-handwritten text-xl leading-none tracking-wide text-amber-300 group-hover:text-amber-200 transition-colors drop-shadow">
                Since 2014
              </span>
              <span className="text-[9px] text-amber-200/60 font-mono tracking-widest uppercase block mt-1 font-extrabold">
                ★ KADAPA'S FINEST ★
              </span>
            </div>
          </div>
          
          {/* Ornamental traditional corner brackets */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-amber-400/50" />
          <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-amber-400/50" />
          <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-amber-400/50" />
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-amber-400/50" />
          
          {/* Bottom subtle golden underline border ornament */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left main text block */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs px-3.5 py-1.5 rounded-full font-mono uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>#1 in customised cake designers in kadapa</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-white"
            >
              <span className="font-display italic font-light text-stone-100 block">You Dream,</span>
              <span className="font-handwritten text-amber-400 text-6xl sm:text-7xl md:text-8xl block -mt-2 drop-shadow-md">We Design</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-stone-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Indulge in premium bespoke cake tier crafts, chilled chocolate pastries, and crunchy bakery ghee cookies baked native in Kadapa. Designed precisely for your golden milestones.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
          >
            <button
              onClick={onScrollToMenu}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-550 hover:bg-amber-300 text-amber-950 font-bold px-8 py-3.5 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95"
            >
              Order Online Menu
            </button>
            <button
              onClick={onScrollToCustomizer}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-7 py-3.5 rounded-2xl text-xs tracking-wider uppercase transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Cherry className="w-4 h-4 text-amber-450 text-amber-400" />
              Design Custom Cake
            </button>
          </motion.div>
        </div>

        {/* Right high-fidelity visual block */}
        <div className="lg:col-span-5 flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
          >
            {/* Spinning decorative orbit ring */}
            <div className="absolute inset-0 border-2 border-dashed border-amber-500/20 rounded-full animate-spin [animation-duration:40s]" />
            <div className="absolute inset-4 border border-white/5 rounded-full" />

            {/* Glowing active node */}
            <div className="absolute top-8 right-8 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />

            {/* Cake artwork layered */}
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
              alt="Premium Kadapa Celebration Cake"
              className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-amber-900/40 relative z-10 hover:rotate-3 transition-transform duration-700"
            />

            <div className="absolute -bottom-4 left-1/2 -ml-28 bg-white/95 border border-amber-100 shadow-xl px-4.5 py-2.5 rounded-2xl text-stone-900 z-20 flex items-center gap-2.5 text-left max-w-[240px]">
              <div className="bg-amber-900 p-1.5 rounded-lg text-amber-100 font-bold text-xs uppercase font-mono tracking-tight shrink-0">
                ⭐ 4.9
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">
                Highly recommended in co-operative Colony, Kadapa.
              </p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Bounce-down banner trigger */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none hidden md:block">
        <button className="animate-bounce p-2 bg-stone-800 border border-stone-700/60 text-stone-200 rounded-full inline-flex tracking-wider text-[10px] pointer-events-auto shadow-md" onClick={onScrollToMenu}>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
