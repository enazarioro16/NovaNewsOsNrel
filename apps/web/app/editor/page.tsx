import React from 'react';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { ManualBatchIngestButton } from './components/ManualBatchIngestButton';

import { db, newsTable } from '@novanews/database';
import { desc, eq } from 'drizzle-orm';

async function getEditorialNews() {
  try {
    return await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
  } catch (error) {
    console.error('Database Error', error);
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
    <div className="min-h-screen bg-[#0f111a] text-[#8f9bb3] font-mono p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-[#1f2335] pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">NOVA_NEWS // EDITORIAL_HUB</h1>
            <p className="text-sm mt-1 text-[#565f89]">Sistema de Revisión y Curación (Multi-Agent AI Pipeline)</p>
          </div>
          <div className="flex gap-4">
            <a href="/editor/new" className="bg-[#bb9af7] hover:bg-[#d5b4fd] text-[#1a1b26] font-bold py-2 px-4 rounded text-sm transition-colors flex items-center h-full">
              [+] SINGLE_URL_OVERRIDE
            </a>
            <ManualBatchIngestButton />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#1a1b26] rounded-lg border border-[#292e42] overflow-hidden shadow-2xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#1f2335] text-[#a9b1d6] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">STATUS</th>
                <th className="px-6 py-4 font-semibold tracking-wider w-1/3">CONTENT_TITLE</th>
                <th className="px-6 py-4 font-semibold tracking-wider">SOURCE</th>
                <th className="px-6 py-4 font-semibold tracking-wider">QUALITY_SCORE</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292e42]">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#565f89]">No pending articles in queue.</td>
                </tr>
              ) : (
                news.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1f2335] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.pipelineStatus === 'PUBLISHED' ? 'bg-[#c3e88d]/20 text-[#c3e88d]' : 
                          item.pipelineStatus === 'REJECTED' ? 'bg-[#f7768e]/20 text-[#f7768e]' : 
                          'bg-[#e0af68]/20 text-[#e0af68]'}`}>
                        {item.pipelineStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium mb-1 line-clamp-1" title={item.seoTitle || item.title}>
                        {item.seoTitle || item.title}
                      </div>
                      <div className="text-[#565f89] text-xs line-clamp-1">{item.originalUrl}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#7dcfff]">
                      {item.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-[#292e42] rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div className="bg-[#9ece6a] h-2.5 rounded-full" style={{ width: `${item.qualityScore || 0}%` }}></div>
                        </div>
                        <span className="text-xs text-[#9ece6a]">{item.qualityScore || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.pipelineStatus === 'REVIEW_PENDING' ? (
                        <a href={`/editor/${item.id}`} className="text-[#bb9af7] hover:text-[#d5b4fd] uppercase tracking-wider font-bold">
                          AUDIT_NOW &rarr;
                        </a>
                      ) : (
                        <a href={`/editor/${item.id}`} className="text-[#565f89] hover:text-white uppercase tracking-wider">
                          VIEW
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
