'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí podríamos conectar con un servicio de logging de errores como Sentry en el futuro
    console.error('Article Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4 font-mono text-center">
      <div className="bg-[#1a1b26] border border-[#f7768e] p-10 rounded-xl shadow-[0_0_30px_rgba(247,118,142,0.3)] max-w-lg w-full relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f7768e] to-[#ff9e64]"></div>
        
        <h2 className="text-3xl font-bold text-[#f7768e] mb-4 uppercase tracking-wider">
          System_Exception
        </h2>
        
        <p className="text-[#a9b1d6] mb-8 font-sans">
          No se pudo recuperar el artículo solicitado. Es posible que el enlace esté roto, el contenido haya sido movido, o que el identificador sea inválido.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-[#292e42] hover:bg-[#3b4261] text-white font-bold py-3 px-6 rounded transition-colors uppercase tracking-widest text-sm"
          >
            Retry_Connection
          </button>
          
          <Link 
            href="/"
            className="bg-[#7dcfff] hover:bg-[#2ac3de] text-[#1a1b26] font-bold py-3 px-6 rounded transition-colors uppercase tracking-widest text-sm"
          >
            Return_To_Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
