import React from 'react';
import { ingestSingleUrl } from '../actions';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';

export default async function NewIngestionPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-[#8f9bb3] font-mono p-6 flex flex-col items-center pt-20">
      <div className="w-full max-w-2xl bg-[#1a1b26] border border-[#292e42] rounded-lg p-8 shadow-2xl">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#1f2335]">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Manual_Extraction_Override</h1>
            <p className="text-sm mt-1 text-[#565f89]">Fuerza la ingesta de un artículo específico en el pipeline de IA.</p>
          </div>
          <a href="/editor" className="text-[#7dcfff] hover:text-white transition-colors text-sm uppercase font-bold">
            &larr; Cancelar
          </a>
        </div>

        <form action={ingestSingleUrl} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-xs text-[#7dcfff] mb-2 font-bold uppercase tracking-wider">
              Target_URL
            </label>
            <input 
              name="url" 
              type="url"
              required
              placeholder="https://techcrunch.com/article..." 
              className="w-full bg-[#0f111a] border border-[#292e42] rounded px-4 py-3 text-white focus:outline-none focus:border-[#7dcfff] transition-colors font-sans" 
            />
          </div>

          <div className="bg-[#1f2335] p-4 rounded text-xs text-[#a9b1d6] border-l-4 border-[#e0af68]">
            <strong className="text-[#e0af68] block mb-1">WARNING:</strong>
            Al inyectar una URL manualmente, el sistema ignorará los filtros de deduplicación y el Quality Score. El motor multi-agente intentará extraer y curar la noticia independientemente de su fuente.
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#bb9af7] hover:bg-[#d5b4fd] text-[#1a1b26] font-bold py-4 rounded tracking-wider uppercase transition-colors text-sm mt-2"
          >
            Run_AI_Pipeline &rarr;
          </button>
        </form>
      </div>
    </div>
  );
}
