'use client';

import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { playShutterSound } from '@/utils/sounds';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
}

export default function CameraView({ onCapture }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    
    setIsCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      playShutterSound();
      setTimeout(() => {
        onCapture(imageSrc);
        setIsCapturing(false);
      }, 200);
    }
  }, [onCapture]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Viewfinder overlay - retro 90s style */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/80" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/80" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/80" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/80" />
        
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-0.5 bg-white/60" />
          <div className="h-8 w-0.5 bg-white/60 -mt-4 ml-[15px]" />
        </div>

        {/* Top info bar */}
        <div className="absolute top-2 left-0 right-0 flex justify-between items-center px-4 text-white/80 text-xs font-mono">
          <span>CONFESS.CAM</span>
          <span>● REC</span>
        </div>
      </div>

      {/* Webcam feed */}
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white p-8">
          <div className="text-center">
            <p className="text-lg mb-2">Camera Access Required</p>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 px-4 py-2 bg-white text-black rounded font-mono text-sm"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: 'user',
          }}
          onUserMediaError={(err) => {
            setError('Please allow camera access to take a confession photo.');
          }}
        />
      )}

      {/* Flash effect */}
      {isCapturing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-white z-20"
        />
      )}

      {/* Capture button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={capture}
          disabled={isCapturing}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-800 shadow-lg flex items-center justify-center disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-800" />
        </motion.button>
      </div>
    </div>
  );
}

