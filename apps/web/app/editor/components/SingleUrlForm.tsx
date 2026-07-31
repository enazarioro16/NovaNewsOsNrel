'use client';

import React, { useTransition, useState } from 'react';
import { ingestSingleUrl } from '../actions';
import { useRouter } from 'next/navigation';

export function SingleUrlForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;

    if (!url) return;

    setMessage(null);
    startTransition(async () => {
      const result = await ingestSingleUrl(url);
      
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
        setTimeout(() => router.push('/editor'), 1500);
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      
      <div>
        <label className="block text-xs text-[#7dcfff] mb-2 font-bold uppercase tracking-wider">
          Target_URL
        </label>
        <input 
          name="url" 
          type="url"
          required
          disabled={isPending}
          placeholder="https://techcrunch.com/article..." 
          className="w-full bg-[#0f111a] border border-[#292e42] rounded px-4 py-3 text-white focus:outline-none focus:border-[#7dcfff] transition-colors font-sans disabled:opacity-50" 
        />
      </div>

      <div className="bg-[#1f2335] p-4 rounded text-xs text-[#a9b1d6] border-l-4 border-[#e0af68]">
        <strong className="text-[#e0af68] block mb-1">WARNING:</strong>
        Al inyectar una URL manualmente, el sistema ignorará los filtros de deduplicación y el Quality Score. El motor multi-agente intentará extraer y curar la noticia independientemente de su fuente.
      </div>

      {message && (
        <div className={`p-3 rounded text-sm font-bold text-center border
          ${message.type === 'success' ? 'bg-[#c3e88d]/10 text-[#c3e88d] border-[#c3e88d]/30' : 'bg-[#f7768e]/10 text-[#f7768e] border-[#f7768e]/30'}
        `}>
          {message.text}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className={`w-full font-bold py-4 rounded tracking-wider uppercase transition-colors text-sm mt-2 flex justify-center items-center gap-2
          ${isPending 
            ? 'bg-[#292e42] text-[#565f89] cursor-not-allowed' 
            : 'bg-[#bb9af7] hover:bg-[#d5b4fd] text-[#1a1b26]'}`}
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-[#bb9af7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ejecutando IA...
          </>
        ) : (
          'Run_AI_Pipeline \u2192'
        )}
      </button>
    </form>
  );
}
