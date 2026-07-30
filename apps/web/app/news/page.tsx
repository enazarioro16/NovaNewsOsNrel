import React from 'react';

// Un mock simple del fetcher para el Vertical Slice Frontend
async function getNews() {
  try {
    const res = await fetch('http://localhost:3001/news', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('API Error', error);
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>NovaNews - Editorial Module (Vertical Slice)</h1>
      <form action="/api/news/create" method="POST" style={{ marginBottom: '2rem' }}>
        <input name="title" placeholder="News Title" required style={{ display: 'block', marginBottom: '1rem' }} />
        <textarea name="content" placeholder="Content..." required style={{ display: 'block', marginBottom: '1rem' }}></textarea>
        <button type="submit">Create News</button>
      </form>

      <h2>Recent News</h2>
      <ul>
        {news.map((item: any) => (
          <li key={item.id}>
            <strong>{item.title}</strong> - {item.status}
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
