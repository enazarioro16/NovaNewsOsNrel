import { db, newsTable } from '@novanews/database';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const feed = await db.select().from(newsTable)
    .where(eq(newsTable.pipelineStatus, 'PUBLISHED'))
    .orderBy(desc(newsTable.publishedAt))
    .limit(50);

  const DOMAIN = process.env.NEXTAUTH_URL || 'https://novanewsosnrel.com';

  const rssItems = feed.map(article => `
    <item>
      <title><![CDATA[${article.seoTitle || article.title}]]></title>
      <link>${DOMAIN}/article/${article.id}</link>
      <guid isPermaLink="true">${DOMAIN}/article/${article.id}</guid>
      <pubDate>${article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${article.summary}]]></description>
      ${article.tags ? article.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') : ''}
    </item>
  `).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>NovaNews Premium Feed</title>
        <link>${DOMAIN}</link>
        <description>Inteligencia Artificial curando el ruido tecnológico mundial.</description>
        <language>es</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>
  `;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
    }
  });
}
