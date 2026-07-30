import React from 'react';
import { triggerIngestion } from './actions';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';

async function getEditorialNews() {
  try {
    const res = await fetch('http://localhost:3001/editorial/news', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('API Error', error);
    return [];
  }
}

export default async function EditorialDashboard() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const news = await getEditorialNews();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>NovaNews - Editorial Dashboard</h1>
      <form action={triggerIngestion} style={{ marginBottom: '2rem' }}>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Simular Ingesta (Trigger NIP)
        </button>
      </form>

      <h2>Bandeja de Entrada (News Intelligence Pipeline)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
            <th>Estado</th>
            <th>Título (Original -&gt; SEO)</th>
            <th>Fuente</th>
            <th>Resumen AI</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item: any) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>
                <span style={{ 
                  background: item.pipelineStatus === 'PUBLISHED' ? '#d4edda' : '#fff3cd', 
                  padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' 
                }}>
                  {item.pipelineStatus}
                </span>
              </td>
              <td style={{ padding: '0.5rem' }}>
                <small style={{ color: '#666' }}>{item.title}</small><br/>
                <strong>{item.seoTitle || 'N/A'}</strong>
              </td>
              <td style={{ padding: '0.5rem' }}>{item.source}</td>
              <td style={{ padding: '0.5rem', fontSize: '0.9rem', maxWidth: '300px' }}>{item.summary || 'Procesando...'}</td>
              <td style={{ padding: '0.5rem' }}>
                {item.pipelineStatus === 'REVIEW_PENDING' && (
                  <a href={`/editor/${item.id}`} style={{ padding: '0.3rem 0.5rem', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Auditar</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
