import { db, newsTable, users } from '@novanews/database';
import { auth } from '../../../auth';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AudioPlayer from './components/AudioPlayer';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: { params: { id: string } }) {
  if (!uuidRegex.test(params.id)) return { title: 'Not Found' };

  const [article] = await db.select().from(newsTable).where(eq(newsTable.id, params.id));
  if (!article) return { title: 'Not Found' };
  
  return {
    title: `${article.seoTitle || article.title} | NovaNews`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  if (!uuidRegex.test(params.id)) {
    notFound();
  }

  // Solo permitir lectura si el pipelineStatus es PUBLISHED
  const [article] = await db.select().from(newsTable).where(
    and(
      eq(newsTable.id, params.id),
      eq(newsTable.pipelineStatus, 'PUBLISHED')
    )
  );

  if (!article) {
    notFound();
  }

  const session = await auth();
  let isPro = false;
  if (session?.user?.id) {
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
    isPro = !!user?.isPro;
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-[#8f9bb3] font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        <nav className="mb-8">
          <Link href="/" className="text-[#7dcfff] hover:text-white transition-colors text-sm font-mono font-bold tracking-wider uppercase">
            &larr; Return_To_Feed
          </Link>
        </nav>

        <article className="bg-[#1a1b26] border border-[#292e42] rounded-xl p-8 sm:p-12 shadow-2xl">
          <header className="mb-10 border-b border-[#292e42] pb-8">
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <span className="bg-[#bb9af7]/10 text-[#bb9af7] border border-[#bb9af7]/30 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold">
                {article.source}
              </span>
              <span className="text-[#565f89] text-sm font-mono">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              {article.seoTitle || article.title}
            </h1>

            <div className="relative">
              <div className={`flex gap-2 flex-wrap ${!session ? 'blur-sm select-none' : ''}`}>
                {article.factCheckScore !== null && (
                  <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${article.factCheckScore >= 80 ? 'text-[#9ece6a] bg-[#9ece6a]/10' : 'text-[#f7768e] bg-[#f7768e]/10'}`}>
                    FACT_SCORE: {article.factCheckScore}/100
                  </span>
                )}
                {article.tags?.map(tag => (
                  <span key={tag} className="text-xs text-[#7dcfff] bg-[#7dcfff]/10 px-2 py-1 rounded font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {!session && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1b26]/50 rounded z-10 backdrop-blur-[2px]">
                  <Link href="/api/auth/signin" className="bg-[#bb9af7] hover:bg-[#d5b4fd] text-[#1a1b26] text-xs font-bold px-4 py-2 rounded uppercase tracking-wider transition-colors shadow-lg">
                    [ LOGIN TO DECRYPT ANALYSIS ]
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Audio Player (TTS) */}
          {article.audioUrl && (
            <div className="mb-10 bg-[#1f2335] p-6 rounded-lg border border-[#3b4261] shadow-inner flex items-center justify-between">
              <div className="flex-1 mr-6">
                <h3 className="text-[#9ece6a] font-bold text-sm tracking-widest uppercase mb-2 flex items-center gap-2">
                  <span>▶</span> AI_AUDIO_BRIEFING
                </h3>
                <p className="text-xs text-[#565f89]">Escucha la síntesis vocal curada de este artículo.</p>
              </div>
              
              <div className="flex-1">
                <AudioPlayer 
                  audioUrl={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${article.audioUrl}`} 
                  isPro={isPro} 
                />
              </div>
            </div>
          )}

          {article.featuredImage && (
            <div className="relative w-full h-64 sm:h-96 mb-10 rounded-lg overflow-hidden border border-[#292e42] shadow-lg">
              <Image 
                src={article.featuredImage} 
                alt={article.seoTitle || article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <div className="prose prose-invert prose-p:text-[#a9b1d6] prose-p:leading-relaxed prose-p:text-lg max-w-none mb-12">
            <p className="font-medium text-[#c0caf5] text-xl border-l-4 border-[#7dcfff] pl-6 italic mb-8">
              {article.summary}
            </p>
            
            <div className="text-[#8f9bb3] whitespace-pre-wrap font-sans leading-relaxed">
              {/* En una app real, el 'content' renderizaría markdown curado por IA. */}
              {article.content}
            </div>
          </div>

          <footer className="border-t border-[#292e42] pt-8 mt-12">
            <a 
              href={article.originalUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2ac3de] hover:bg-[#7dcfff] text-[#1a1b26] font-bold py-3 px-6 rounded transition-colors font-mono uppercase tracking-wider text-sm"
            >
              Access_Source_Origin &rarr;
            </a>
          </footer>
        </article>

      </div>
    </div>
  );
}
