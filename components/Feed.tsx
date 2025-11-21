'use client';

import { useConfessions } from '@/context/ConfessionContext';
import ConfessionCard from './ConfessionCard';
import { AnimatePresence } from 'framer-motion';

export default function Feed() {
  const { confessions, burnConfession } = useConfessions();

  // Sort by burns (hot) then by timestamp
  const sortedConfessions = [...confessions].sort((a, b) => {
    if (b.burns !== a.burns) return b.burns - a.burns;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {sortedConfessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-6 rounded-full border-4 border-zinc-800 flex items-center justify-center animate-pulse">
            <span className="text-4xl">📷</span>
          </div>
          <h3 className="text-xl font-mono text-zinc-400 mb-2">NO SIGNAL</h3>
          <p className="text-zinc-600 max-w-sm font-mono text-sm">
            The feed is empty. Be the first to drop a confession into the void.
          </p>
        </div>
      ) : (
        <>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            <AnimatePresence>
              {sortedConfessions.map((confession) => (
                <ConfessionCard
                  key={confession.id}
                  confession={confession}
                  onBurn={() => burnConfession(confession.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}

