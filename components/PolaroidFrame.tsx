'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { processPolaroid } from '@/utils/imageProcessor';
import { playDropSound } from '@/utils/sounds';

interface PolaroidFrameProps {
  imageUrl: string;
  onSave: (imageUrl: string, text: string) => void;
  onCancel: () => void;
}

export default function PolaroidFrame({ imageUrl, onSave, onCancel }: PolaroidFrameProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFlip = async () => {
    if (!isFlipped && !processedImage) {
      setIsProcessing(true);
      const processed = await processPolaroid(imageUrl);
      setProcessedImage(processed);
      setIsProcessing(false);
    }
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  };

  const handleSave = () => {
    if (!text.trim() || !processedImage) return;
    
    playDropSound();
    // "Drop" animation - shake then fade out
    // The parent will handle the transition to feed
    onSave(processedImage, text);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] perspective-1000">
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ 
          rotateY: { duration: 0.6, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side - Photo */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-white shadow-2xl p-4"
          style={{ 
            transform: 'rotateY(0deg)',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.03) 3px)'
          }}
        >
          <div className="relative w-full h-[85%] bg-zinc-100 overflow-hidden filter contrast-[1.1] brightness-[0.9] border border-zinc-200/50">
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-10 mix-blend-overlay" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-grunge.png")' }} 
            />
            {isProcessing ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-zinc-400 font-mono text-xs animate-pulse">DEVELOPING...</div>
              </div>
            ) : (
              <img
                src={processedImage || imageUrl}
                alt="Confession"
                className="w-full h-full object-cover grayscale-[0.2] sepia-[0.3]"
              />
            )}
             {/* Date Stamp Preview */}
             <span className="font-mono text-sm tracking-[0.2em] text-orange-500 absolute bottom-4 right-4 opacity-90 mix-blend-hard-light font-bold" style={{ textShadow: '0 0 8px rgba(249, 115, 22, 0.8)' }}>
                 98 MM dd
             </span>
          </div>
          <div className="h-[15%] flex items-center justify-center">
            <button
              onClick={handleFlip}
              className="text-[10px] font-mono text-zinc-400 hover:text-zinc-800 uppercase tracking-[0.2em] transition-colors"
            >
              FLIP TO WRITE
            </button>
          </div>
        </div>

        {/* Back side - Confession */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-white shadow-2xl p-5 flex flex-col"
          style={{ 
            transform: 'rotateY(180deg)',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.03) 3px)'
          }}
        >
           {/* Lined Paper Pattern */}
          <div className="absolute top-4 left-4 right-4 bottom-[15%] border border-zinc-100 bg-white" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e7eb 28px)',
                 backgroundPosition: '0 10px'
               }} 
          >
            <div className="w-full h-full pt-6 px-4 relative z-10">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your confession here..."
                className="w-full h-full resize-none border-none outline-none bg-transparent text-zinc-900 text-2xl leading-[28px] font-handwriting -rotate-1 placeholder:text-zinc-200 uppercase font-bold"
                style={{
                  fontFamily: '"Kalam", "Comic Sans MS", cursive',
                }}
                maxLength={280}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[15%] px-5 flex items-center justify-between z-20">
              <button
                onClick={onCancel}
                className="text-[10px] font-mono text-zinc-300 hover:text-zinc-500 tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                className="text-[10px] font-mono text-orange-500 hover:text-orange-600 font-bold tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
              >
                <motion.span
                  animate={text.trim() ? {
                    rotate: [0, -5],
                    transition: { 
                      type: "tween",
                      duration: 0.3, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      repeatDelay: 2 
                    }
                  } : {}}
                >
                  DROP IT
                </motion.span>
              </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

