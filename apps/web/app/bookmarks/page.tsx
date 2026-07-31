import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { db, newsTable, userBookmarks } from '@novanews/database';
import { eq, desc } from 'drizzle-orm';
import BookmarkButton from '../components/BookmarkButton';
import Link from 'next/link';
import Image from 'next/image';

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Obtener bookmarks
  const myBookmarks = await db.select({
    news: newsTable,
    bookmark: userBookmarks
  })
  .from(userBookmarks)
  .innerJoin(newsTable, eq(userBookmarks.newsId, newsTable.id))
  .where(eq(userBookmarks.userId, session.user.id))
  .orderBy(desc(userBookmarks.createdAt));

  return (
    <div className="min-h-screen bg-[#0f111a] text-[#8f9bb3] font-mono p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1f2335] pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
              NOVA_NEWS <span className="text-[#9ece6a]">//</span> MY_ARCHIVE
            </h1>
            <p className="text-sm mt-2 text-[#565f89]">Espacio personal de lectura offline y referencias guardadas.</p>
          </div>
          <div className="flex gap-4 text-sm font-bold">
            <Link href="/" className="text-[#7dcfff] hover:text-white transition-colors uppercase tracking-wider">
              &larr; Return_To_Feed
            </Link>
          </div>
        </header>

        <main>
          {myBookmarks.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#292e42] rounded-lg">
              <p className="text-[#e0af68] text-lg font-bold tracking-widest uppercase">SYS: ARCHIVE_EMPTY</p>
              <p className="text-[#565f89] mt-2">No has guardado ninguna noticia en tu módulo de memoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBookmarks.map(({ news }) => (
                <article 
                  key={news.id} 
                  className="bg-[#1a1b26] border border-[#292e42] rounded-lg overflow-hidden flex flex-col hover:border-[#9ece6a] transition-all hover:shadow-[0_0_15px_rgba(158,206,106,0.1)] group relative"
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
                      <span className="bg-[#292e42] text-[#e0af68] px-2 py-0.5 rounded text-xs font-bold border border-[#3b4261]">
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
                    <BookmarkButton newsId={news.id} initialIsBookmarked={true} />
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
