'use client';

import React, { useTransition, useState } from 'react';
import { triggerIngestion } from '../actions';

export function ManualBatchIngestButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleIngest = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await triggerIngestion();
      setMessage({
        text: result.message,
        type: result.success ? 'success' : 'error'
      });
      
      // Auto-hide message after 3s
      setTimeout(() => setMessage(null), 3000);
    });
  };

  return (
    <div className="relative flex items-center h-full">
      <button 
        onClick={handleIngest}
        disabled={isPending}
        className={`font-bold py-2 px-4 rounded text-sm transition-colors h-full flex items-center justify-center min-w-[200px]
          ${isPending 
            ? 'bg-[#1f2335] text-[#565f89] cursor-not-allowed border border-[#292e42]' 
            : 'bg-[#2ac3de] hover:bg-[#7dcfff] text-[#1a1b26]'}`}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-[#7dcfff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sincronizando...
          </span>
        ) : (
          '[+] MANUAL_BATCH_INGEST'
        )}
      </button>

      {message && (
        <div className={`absolute top-full right-0 mt-2 p-2 rounded text-xs font-bold whitespace-nowrap z-50
          ${message.type === 'success' ? 'bg-[#c3e88d]/20 text-[#c3e88d] border border-[#c3e88d]/30' : 'bg-[#f7768e]/20 text-[#f7768e] border border-[#f7768e]/30'}
        `}>
          {message.text}
        </div>
      )}
    </div>
  );
}
