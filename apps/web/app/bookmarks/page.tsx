import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { db, newsTable, userBookmarks } from '@novanews/database';
import { eq, desc } from 'drizzle-orm';
import BookmarkButton from '../components/BookmarkButton';

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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Mis Noticias Guardadas</h1>
        <a href="/" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>&larr; Volver al Feed</a>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {myBookmarks.length === 0 ? (
          <p>Aún no has guardado ninguna noticia.</p>
        ) : (
          myBookmarks.map(({ news }) => (
            <article key={news.id} style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '12px', background: '#fafbfc' }}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>{news.seoTitle}</h2>
              <p style={{ color: '#444', lineHeight: '1.6' }}>{news.summary}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <a href={news.originalUrl || '#'} target="_blank" style={{ fontSize: '0.9rem', color: '#0366d6' }}>Leer Original</a>
                <BookmarkButton newsId={news.id} initialIsBookmarked={true} />
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
