import React from 'react';
import { SingleUrlForm } from '../components/SingleUrlForm';
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

        <SingleUrlForm />
      </div>
    </div>
  );
}
