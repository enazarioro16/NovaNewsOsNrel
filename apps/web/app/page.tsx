import { auth } from '../auth';
import { redirect } from 'next/navigation';
import { db, newsTable, users, userBookmarks } from '@novanews/database';
import { eq, desc, arrayContains, sql, and } from 'drizzle-orm';
import BookmarkButton from './components/BookmarkButton';

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Obtener preferencias del usuario
  const [currentUser] = await db.select().from(users).where(eq(users.id, session.user.id));
  
  if (!currentUser.preferences || (currentUser.preferences as string[]).length === 0) {
    redirect('/onboarding');
  }

  const prefs = currentUser.preferences as string[];

  // Obtener feed B2C filtrando por Tags mediante SQL dinámico (relacional MVP) y ordenando por QualityScore
  const feed = await db.select().from(newsTable)
    .where(
      and(
        eq(newsTable.pipelineStatus, 'PUBLISHED'),
        sql`${newsTable.tags} ?| array[${sql.join(prefs, sql`, `)}]`
      )
    )
    .orderBy(desc(newsTable.qualityScore), desc(newsTable.publishedAt));

  // Obtener bookmarks del usuario actual para inicializar el Optimistic UI
  const myBookmarks = await db.select().from(userBookmarks).where(eq(userBookmarks.userId, session.user.id));
  const bookmarkedNewsIds = new Set(myBookmarks.map(b => b.newsId));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Tu Feed Inteligente</h1>
          <p style={{ color: '#666' }}>Basado en: {prefs.join(', ')}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/bookmarks" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Mis Guardados</a>
          <a href="/api/auth/signout" style={{ textDecoration: 'none', color: '#dc3545', fontWeight: 'bold' }}>Salir</a>
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {feed.length === 0 ? (
          <p>No hay noticias publicadas para tus intereses. ¡El bot está trabajando!</p>
        ) : (
          feed.map(news => (
            <article key={news.id} style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>{news.seoTitle}</h2>
                <span style={{ background: '#f1f3f5', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Score: {news.qualityScore}
                </span>
              </div>
              <p style={{ color: '#444', lineHeight: '1.6' }}>{news.summary}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {news.tags?.map(tag => (
                    <span key={tag} style={{ fontSize: '0.8rem', color: '#888', border: '1px solid #ddd', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>#{tag}</span>
                  ))}
                </div>
                <BookmarkButton newsId={news.id} initialIsBookmarked={bookmarkedNewsIds.has(news.id)} />
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
