'use client';

import { motion } from 'framer-motion';
import { Confession } from '@/types/confession';
import { useState } from 'react';
import { playBurnSound } from '@/utils/sounds';

interface ConfessionCardProps {
  confession: Confession;
  onBurn: () => void;
}

export default function ConfessionCard({ confession, onBurn }: ConfessionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const handleBurn = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent flip when clicking burn
    setIsBurning(true);
    playBurnSound();
    onBurn();
    setTimeout(() => setIsBurning(false), 1000);
  };

  return (
    <div className="relative w-full aspect-[3/4] perspective-1000 mb-12 group cursor-pointer select-none break-inside-avoid" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side - Photo */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-white p-4 shadow-2xl"
          style={{ 
            transform: 'rotateY(0deg)',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.03) 3px)'
          }}
        >
          <div className="relative w-full h-[85%] bg-zinc-100 overflow-hidden filter contrast-[1.1] brightness-[0.9] border border-zinc-200/50">
             {/* Texture overlay for realism */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-10 mix-blend-overlay" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-grunge.png")' }} 
            />
            <img
              src={confession.imageUrl}
              alt="Confession"
              className="w-full h-full object-cover grayscale-[0.2] sepia-[0.3]"
            />
            {/* Date Stamp - Bottom Right inside photo */}
            <span className="font-mono text-sm tracking-[0.2em] text-orange-500 absolute bottom-4 right-4 opacity-90 mix-blend-hard-light font-bold" 
                  style={{ textShadow: '0 0 8px rgba(249, 115, 22, 0.8)' }}>
               98 MM dd
            </span>
          </div>
          
          {/* Bottom Info - Minimal */}
          <div className="h-[15%] flex items-center justify-between px-1">
             <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-[0.2em]">FLIP</span>
             
             {/* Burn Count - Visible on Front too per design? Let's keep it clean or match screenshot. 
                 Screenshot shows flame on bottom right of WHITE area. */}
             <div className="flex items-center gap-1.5">
                <span className={`text-lg ${confession.burns > 0 ? 'text-orange-500' : 'text-zinc-300'}`}>🔥</span>
                <span className="text-xs font-mono text-zinc-400">{confession.burns}</span>
             </div>
          </div>
        </div>

        {/* Back side - Confession Text */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-white p-5 shadow-2xl flex flex-col"
          style={{ 
            transform: 'rotateY(180deg)',
             backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.03) 3px)'
          }}
        >
           {/* Lined Paper Pattern - Full Area inside padding */}
          <div className="absolute inset-4 border border-zinc-100 bg-white" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e7eb 28px)',
                 backgroundPosition: '0 10px'
               }} 
          >
            <div className="w-full h-full pt-6 px-4 overflow-hidden">
               <p className="text-2xl text-zinc-900 font-handwriting leading-[28px] uppercase font-bold transform -rotate-1"
                  style={{ textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)' }}>
                {confession.text}
              </p>
            </div>
          </div>

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-[15%] px-5 flex items-center justify-between">
             <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-[0.2em]">FLIP</span>
             
             <button
                onClick={handleBurn}
                className="flex items-center gap-2 group/burn"
              >
                <span className="text-[10px] font-mono text-zinc-400 group-hover/burn:text-orange-500 tracking-[0.2em] transition-colors">
                  BURN
                </span>
                <motion.div
                  animate={isBurning ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
                  className={`${confession.burns > 0 ? 'text-orange-500' : 'text-zinc-300'} group-hover/burn:text-orange-500 transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.38-1.12-2.5-2.5-2.5-1.38 0-2.5 1.12-2.5 2.5M12 2a1 1 0 0 0-1 1c0 2.5-2 4.5-4.5 4.5S2 5 2 2.5A1 1 0 0 0 1 3.5c0 4.5 4.5 8.5 4.5 12.5 0 3.31 2.69 6 6 6s6-2.69 6-6C17.5 9.5 12 8.5 12 2z" />
                  </svg>
                </motion.div>
              </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
