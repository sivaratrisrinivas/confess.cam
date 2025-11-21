'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Confession } from '@/types/confession';

interface ConfessionContextType {
  confessions: Confession[];
  addConfession: (confession: Omit<Confession, 'id' | 'timestamp' | 'burns'>) => void;
  burnConfession: (id: string) => void;
}

const ConfessionContext = createContext<ConfessionContextType | undefined>(undefined);

// Mock data for initial feed
const mockConfessions: Confession[] = [];

export function ConfessionProvider({ children }: { children: ReactNode }) {
  const [confessions, setConfessions] = useState<Confession[]>([]);

  useEffect(() => {
    // ONE-TIME CLEANUP: Clear legacy mock data
    const hasCleaned = localStorage.getItem('confess-cam-v1-cleanup');
    if (!hasCleaned) {
      localStorage.removeItem('confessions');
      localStorage.setItem('confess-cam-v1-cleanup', 'true');
      setConfessions([]);
      return;
    }

    // Load from localStorage
    const stored = localStorage.getItem('confessions');
    const storedConfessions = stored ? JSON.parse(stored) : [];
    
    setConfessions(storedConfessions.sort((a: Confession, b: Confession) => b.timestamp - a.timestamp));
  }, []);

  const addConfession = (confession: Omit<Confession, 'id' | 'timestamp' | 'burns'>) => {
    setConfessions((prev) => {
      // Prevent duplicates: Check if a confession with same text exists within last 2 seconds
      const isDuplicate = prev.some(c => 
        c.text === confession.text && 
        Date.now() - c.timestamp < 2000
      );

      if (isDuplicate) return prev;

      const newConfession: Confession = {
        ...confession,
        id: `confession-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        burns: 0,
      };

      const updated = [newConfession, ...prev];
      localStorage.setItem('confessions', JSON.stringify(updated));
      return updated;
    });
  };

  const burnConfession = (id: string) => {
    setConfessions((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, burns: c.burns + 1 } : c));
      localStorage.setItem('confessions', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ConfessionContext.Provider value={{ confessions, addConfession, burnConfession }}>
      {children}
    </ConfessionContext.Provider>
  );
}

export function useConfessions() {
  const context = useContext(ConfessionContext);
  if (context === undefined) {
    throw new Error('useConfessions must be used within a ConfessionProvider');
  }
  return context;
}

