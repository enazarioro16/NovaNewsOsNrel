'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface AudioPlayerProps {
  audioUrl: string;
  isPro: boolean;
}

export default function AudioPlayer({ audioUrl, isPro }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      // Si no es PRO y pasó los 10 segundos
      if (!isPro && audio.currentTime >= 10) {
        audio.pause();
        // audio.currentTime = 10; // Bloquea avance
        setIsLocked(true);
      }
    };

    const handleSeeked = () => {
        if (!isPro && audio.currentTime >= 10) {
            audio.currentTime = 10;
        }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('seeked', handleSeeked);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('seeked', handleSeeked);
    };
  }, [isPro]);

  if (isLocked) {
    return (
      <div className="bg-[#1a1b26] p-4 rounded flex flex-col md:flex-row items-center justify-between border border-[#f7768e]/30 animate-pulse">
        <span className="text-[#f7768e] text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2 md:mb-0">
          <span className="text-xl">🔒</span> TEASER TERMINADO. ACCESO AUDIO BLOQUEADO.
        </span>
        <Link href="/pricing" className="bg-[#bb9af7] hover:bg-[#d5b4fd] text-[#1a1b26] text-xs font-bold px-4 py-2 rounded uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(187,154,247,0.4)]">
          UPGRADE_PRO TO UNLOCK
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {!isPro && (
        <div className="text-xs text-[#e0af68] font-bold uppercase tracking-widest flex items-center gap-1">
          <span>🎧</span> TEASER MODE: 10 SECONDS LEFT
        </div>
      )}
      <audio 
        ref={audioRef}
        controls 
        src={audioUrl}
        className="w-full h-10 rounded outline-none"
      >
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
}
