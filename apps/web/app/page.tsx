import { auth } from '../auth';
import { db, newsTable, userBookmarks } from '@novanews/database';
import { eq, desc, and, sql } from 'drizzle-orm';
import BookmarkButton from './components/BookmarkButton';
import Link from 'next/link';
import Image from 'next/image';

function calculateCentroid(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dim = vectors[0].length;
  const centroid = new Array(dim).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      centroid[i] += v[i];
    }
  }
  return centroid.map(val => val / vectors.length);
}

export const metadata = {
  title: 'NovaNews // Premium Tech Feed',
  description: 'Noticias tecnológicas curadas por Inteligencia Artificial. Libre de sesgos, optimizadas para el lector moderno.',
};

export default async function PublicFrontpage() {
  const session = await auth();

  let bookmarkedNewsIds = new Set<string>();
  let isPersonalized = false;
  let feed = [];

  if (session?.user?.id) {
    const myBookmarks = await db.select({
      newsId: userBookmarks.newsId,
      embedding: newsTable.semanticEmbedding
    })
    .from(userBookmarks)
    .innerJoin(newsTable, eq(userBookmarks.newsId, newsTable.id))
    .where(eq(userBookmarks.userId, session.user.id));

    bookmarkedNewsIds = new Set(myBookmarks.map(b => b.newsId));

    const validEmbeddings = myBookmarks
      .map(b => b.embedding)
      .filter((e): e is number[] => Array.isArray(e) && e.length > 0);

    if (validEmbeddings.length > 0) {
      const centroid = calculateCentroid(validEmbeddings);
      const vectorString = `[${centroid.join(',')}]`;
      
      feed = await db.select().from(newsTable)
        .where(eq(newsTable.pipelineStatus, 'PUBLISHED'))
        .orderBy(sql`${newsTable.semanticEmbedding} <=> ${vectorString}::vector`)
        .limit(21);
      
      isPersonalized = true;
    }
  }

  // Fallback a cronológico si no hay sesión o no hay bookmarks suficientes
  if (!isPersonalized) {
    feed = await db.select().from(newsTable)
      .where(eq(newsTable.pipelineStatus, 'PUBLISHED'))
      .orderBy(desc(newsTable.publishedAt))
      .limit(21);
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-[#8f9bb3] font-mono p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Público Cibernético */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1f2335] pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
              NOVA_NEWS <span className="text-[#7dcfff]">//</span> PUBLIC_FEED
            </h1>
            <p className="text-sm mt-2 text-[#565f89]">
              {isPersonalized ? (
                <span className="text-[#9ece6a] font-bold">● Vectorial_Algorithm_Active: For_You</span>
              ) : (
                "Inteligencia Artificial curando el ruido tecnológico mundial."
              )}
            </p>
          </div>
          <div className="flex gap-4 text-sm font-bold">
            {session ? (
              <>
                <Link href="/bookmarks" className="text-[#9ece6a] hover:text-white transition-colors uppercase tracking-wider">
                  [ My_Archive ]
                </Link>
                <Link href="/editor" className="text-[#bb9af7] hover:text-white transition-colors uppercase tracking-wider">
                  [ Editor_Hub ]
                </Link>
                <Link href="/pricing" className="text-[#e0af68] hover:text-white transition-colors uppercase tracking-wider">
                  [ Upgrade_PRO ]
                </Link>
                <a href="/api/auth/signout" className="text-[#f7768e] hover:text-white transition-colors uppercase tracking-wider">
                  [ Disconnect ]
                </a>
              </>
            ) : (
              <a href="/login" className="bg-[#2ac3de] hover:bg-[#7dcfff] text-[#1a1b26] py-2 px-4 rounded transition-colors uppercase">
                Initialize_Session
              </a>
            )}
          </div>
        </header>

        {/* Grilla Inmersiva de Tarjetas (Cards) */}
        <main>
          {feed.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#292e42] rounded-lg">
              <p className="text-[#f7768e] text-lg font-bold tracking-widest uppercase">ERR: NO_DATA_STREAM</p>
              <p className="text-[#565f89] mt-2">El motor de IA está procesando la web. Vuelve pronto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feed.map(news => (
                <article 
                  key={news.id} 
                  className="bg-[#1a1b26] border border-[#292e42] rounded-lg overflow-hidden flex flex-col hover:border-[#7dcfff] transition-all hover:shadow-[0_0_15px_rgba(125,207,255,0.1)] group relative"
                >
                  {news.featuredImage && (
                    <div className="relative w-full h-48 border-b border-[#292e42] overflow-hidden">
                      <Image 
                        src={news.featuredImage} 
                        alt={news.seoTitle || news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-xs text-[#565f89] font-bold">
                        {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <span className="bg-[#292e42] text-[#9ece6a] px-2 py-0.5 rounded text-xs font-bold border border-[#3b4261]">
                        Q-Score: {news.qualityScore || 0}
                      </span>
                    </div>
                    
                    <Link href={`/article/${news.id}`} className="group-hover:text-white transition-colors">
                      <h2 className="text-lg font-bold text-[#c0caf5] mb-3 leading-tight line-clamp-3">
                        {news.seoTitle || news.title}
                      </h2>
                    </Link>

                    <p className="text-[#737aa2] text-sm line-clamp-4 leading-relaxed flex-grow">
                      {news.summary}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {news.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-[#bb9af7] bg-[#bb9af7]/10 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-[#1f2335] px-6 py-3 border-t border-[#292e42] flex justify-between items-center">
                    <Link href={`/article/${news.id}`} className="text-xs font-bold text-[#7dcfff] uppercase hover:underline">
                      Read_Payload &rarr;
                    </Link>
                    {session && (
                      <BookmarkButton newsId={news.id} initialIsBookmarked={bookmarkedNewsIds.has(news.id)} />
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
