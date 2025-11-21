'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraView from '@/components/CameraView';
import PolaroidFrame from '@/components/PolaroidFrame';
import Feed from '@/components/Feed';
import { useConfessions } from '@/context/ConfessionContext';

type View = 'camera' | 'polaroid' | 'feed';

export default function Home() {
  const [view, setView] = useState<View>('feed');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { addConfession } = useConfessions();

  const handleCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setView('polaroid');
  };

  const handleSave = (imageUrl: string, text: string) => {
    addConfession({ imageUrl, text });
    // Small delay for "drop" effect
    setTimeout(() => {
      setCapturedImage(null);
      setView('feed');
    }, 300);
  };

  const handleCancel = () => {
    setCapturedImage(null);
    setView('feed');
  };

  return (
    <div className="min-h-screen bg-[#111] text-zinc-100 selection:bg-red-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#111]/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 select-none">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            <h1 className="text-xl font-bold font-mono tracking-widest text-zinc-100">CONFESS.CAM</h1>
          </div>
          
          {view === 'feed' && (
            <button
              onClick={() => setView('camera')}
              className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 text-black rounded-full font-bold font-mono text-sm hover:bg-zinc-200 transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              NEW
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="py-8 px-4">
        <AnimatePresence mode="wait">
          {view === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Feed />
            </motion.div>
          )}

          {view === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            >
              <div className="w-full max-w-md">
                <div className="flex justify-end mb-4">
                   <button onClick={handleCancel} className="text-zinc-500 hover:text-white font-mono">CLOSE [X]</button>
                </div>
                <CameraView onCapture={handleCapture} />
              </div>
            </motion.div>
          )}

          {view === 'polaroid' && capturedImage && (
            <motion.div
              key="polaroid"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            >
              <div className="w-full max-w-sm">
                 <PolaroidFrame
                  imageUrl={capturedImage}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
