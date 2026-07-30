import React from 'react';
import { approveAndPublishNews, rejectNews } from '../actions';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';

async function getNewsById(id: string) {
  const res = await fetch(`http://localhost:3001/editorial/news/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function NewsDetailView({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const news = await getNewsById(params.id);

  if (!news) return <h1>Noticia no encontrada</h1>;

  const approveAction = approveAndPublishNews.bind(null, news.id);
  const rejectAction = rejectNews.bind(null, news.id);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Auditoría Editorial: Split View</h1>
      <a href="/editor" style={{ textDecoration: 'none', color: '#0070f3', marginBottom: '1rem', display: 'inline-block' }}>&larr; Volver al Inbox</a>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        {/* Lado Izquierdo: Original Crudo (Read Only) */}
        <div style={{ flex: 1, padding: '1rem', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Contenido Original</h3>
          <p><strong>Fuente:</strong> {news.source}</p>
          <p><strong>URL Original:</strong> <a href={news.originalUrl} target="_blank">{news.originalUrl}</a></p>
          <p><strong>Título:</strong> {news.title}</p>
          <hr />
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#333' }}>
            {news.content}
          </div>
        </div>

        {/* Lado Derecho: Inteligencia (Editable) */}
        <div style={{ flex: 1, padding: '1rem', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px' }}>
          <h3>Generación AI (Editable)</h3>
          <p><strong>Calidad (Score):</strong> {news.qualityScore}/100</p>
          
          <form action={approveAction}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Título SEO:</label>
              <input name="seoTitle" defaultValue={news.seoTitle} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Resumen (Curado):</label>
              <textarea name="summary" defaultValue={news.summary} rows={5} style={{ width: '100%', padding: '0.5rem' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Tags (JSON Array):</label>
              <input name="tags" defaultValue={JSON.stringify(news.tags)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Aprobar y Publicar
              </button>
              <button formAction={rejectAction} style={{ flex: 1, padding: '0.75rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Rechazar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
