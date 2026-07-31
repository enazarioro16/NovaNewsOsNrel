import { auth } from '../../auth';
import { db, users } from '@novanews/database';
import { eq } from 'drizzle-orm';
import { createCheckoutSession, createCustomerPortalSession } from './actions';
import Link from 'next/link';

export const metadata = {
  title: 'NovaNews // PRO Upgrades',
  description: 'Desbloquea el poder absoluto de la Inteligencia Artificial con NovaNews PRO.',
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string };
}) {
  const session = await auth();
  
  let isPro = false;
  if (session?.user?.id) {
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
    isPro = !!user?.isPro;
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-[#8f9bb3] font-mono p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        
        {/* Header Cibernético */}
        <header className="mb-12 text-center">
          <Link href="/" className="text-[#7dcfff] hover:text-white transition-colors text-sm mb-4 inline-block tracking-widest uppercase">
            &larr; BACK_TO_FEED
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight uppercase mb-4">
            NOVA_NEWS <span className="text-[#bb9af7]">//</span> UPGRADE_PROTOCOL
          </h1>
          <p className="text-[#565f89] text-lg">
            Adquiere acceso premium a la arquitectura cognitiva y desata el flujo total de datos.
          </p>
        </header>

        {searchParams.success && (
          <div className="bg-[#9ece6a]/10 border border-[#9ece6a] text-[#9ece6a] p-4 rounded mb-8 text-center font-bold tracking-widest uppercase">
            [+] TRANSACCIÓN EXITOSA. PROTOCOLOS PRO ACTIVADOS.
          </div>
        )}

        {searchParams.canceled && (
          <div className="bg-[#f7768e]/10 border border-[#f7768e] text-[#f7768e] p-4 rounded mb-8 text-center font-bold tracking-widest uppercase">
            [-] TRANSACCIÓN ABORTADA.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          
          {/* Plan Básico */}
          <div className="flex-1 bg-[#1a1b26] border border-[#292e42] rounded-lg p-8 opacity-75">
            <h2 className="text-2xl font-bold text-white mb-2 uppercase">NOVA_BASIC</h2>
            <div className="text-[#7dcfff] text-3xl font-bold mb-6">$0<span className="text-sm text-[#565f89]">/mo</span></div>
            <ul className="text-[#8f9bb3] space-y-4 mb-8 text-sm">
              <li className="flex items-center gap-2"><span>[+]</span> Feed Cronológico AI</li>
              <li className="flex items-center gap-2"><span>[+]</span> Bookmarks Ilimitados</li>
              <li className="flex items-center gap-2"><span>[+]</span> Búsqueda Semántica Básica</li>
              <li className="flex items-center gap-2 text-[#565f89]"><span>[-]</span> Audio Articles</li>
              <li className="flex items-center gap-2 text-[#565f89]"><span>[-]</span> Vectorial "For You" Feed</li>
            </ul>
            <button disabled className="w-full bg-[#292e42] text-[#565f89] font-bold py-3 rounded cursor-not-allowed uppercase tracking-wider">
              {session ? 'CURRENT_TIER' : 'FREE_TIER'}
            </button>
          </div>

          {/* Plan PRO */}
          <div className="flex-1 bg-[#1f2335] border-2 border-[#bb9af7] rounded-lg p-8 shadow-[0_0_30px_rgba(187,154,247,0.15)] relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-[#bb9af7] text-[#1a1b26] text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              RECOMMENDED
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase">NOVA_PRO</h2>
            <div className="text-[#bb9af7] text-3xl font-bold mb-6">$9.99<span className="text-sm text-[#565f89]">/mo</span></div>
            <ul className="text-white space-y-4 mb-8 text-sm font-semibold">
              <li className="flex items-center gap-2"><span className="text-[#9ece6a]">[+]</span> Vectorial Feed Personalizado (Pgvector)</li>
              <li className="flex items-center gap-2"><span className="text-[#9ece6a]">[+]</span> Daily AI Audio Briefings (Podcast)</li>
              <li className="flex items-center gap-2"><span className="text-[#9ece6a]">[+]</span> Cero Anuncios / Telemetría Privada</li>
              <li className="flex items-center gap-2"><span className="text-[#9ece6a]">[+]</span> Acceso Anticipado a Agentes 3.0</li>
              <li className="flex items-center gap-2"><span className="text-[#9ece6a]">[+]</span> Insignia PRO_HACKER</li>
            </ul>
            
            {isPro ? (
              <form action={createCustomerPortalSession}>
                <button type="submit" className="w-full bg-[#bb9af7] hover:bg-[#d5b4fd] text-[#1a1b26] font-bold py-3 rounded uppercase tracking-wider transition-colors shadow-lg">
                  MANAGE_SUBSCRIPTION
                </button>
              </form>
            ) : (
              <form action={createCheckoutSession}>
                <button type="submit" className="w-full bg-[#bb9af7] hover:bg-[#d5b4fd] text-[#1a1b26] font-bold py-3 rounded uppercase tracking-wider transition-colors shadow-lg">
                  INITIALIZE_UPGRADE
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
