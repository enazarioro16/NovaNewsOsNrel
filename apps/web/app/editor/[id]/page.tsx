import React from 'react';
import { approveAndPublishNews, rejectNews } from '../actions';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';

const API_BASE = process.env.NODE_ENV === 'production' ? 'http://api:3001' : 'http://localhost:3001';

async function getNewsById(id: string) {
  const res = await fetch(`${API_BASE}/editorial/news/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function NewsDetailView({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const news = await getNewsById(params.id);

  if (!news) return (
    <div className="min-h-screen bg-[#0f111a] text-[#8f9bb3] flex items-center justify-center font-mono">
      <h1 className="text-[#f7768e] text-xl">ERR: CONTENT_NOT_FOUND</h1>
    </div>
  );

  const approveAction = approveAndPublishNews.bind(null, news.id);
  const rejectAction = rejectNews.bind(null, news.id);

  return (
    <div className="min-h-screen bg-[#0f111a] text-[#a9b1d6] font-mono p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <a href="/editor" className="text-[#7dcfff] hover:text-white transition-colors text-sm mb-2 inline-block">
              &larr; RETURN_TO_INBOX
            </a>
            <h1 className="text-2xl font-bold text-white tracking-tight">AUDIT_PROTOCOL // {news.id.substring(0,8)}</h1>
          </div>
          <div className="bg-[#1f2335] px-4 py-2 rounded border border-[#292e42] flex items-center gap-4 text-sm">
            <span>QUALITY_SCORE: <strong className="text-[#9ece6a]">{news.qualityScore}/100</strong></span>
            <span>STATUS: <strong className="text-[#e0af68]">{news.pipelineStatus}</strong></span>
          </div>
        </div>
        
        <div className="flex gap-6 mt-4 h-[calc(100vh-160px)]">
          {/* Lado Izquierdo: Original Crudo (Read Only) */}
          <div className="flex-1 bg-[#1a1b26] border border-[#292e42] rounded-lg p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#292e42]">
              <h3 className="text-[#bb9af7] font-bold text-sm tracking-wider uppercase">Raw_Source_Material</h3>
              <span className="bg-[#292e42] px-2 py-1 rounded text-xs text-[#7dcfff]">{news.source}</span>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-[#565f89] mb-1">ORIGINAL_URL</p>
              <a href={news.originalUrl} target="_blank" className="text-[#7dcfff] hover:underline text-sm break-all">
                {news.originalUrl}
              </a>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-[#565f89] mb-1">ORIGINAL_TITLE</p>
              <h2 className="text-lg text-white font-semibold">{news.title}</h2>
            </div>
            
            <div>
              <p className="text-xs text-[#565f89] mb-2">RAW_CONTENT_PAYLOAD</p>
              <div className="bg-[#0f111a] p-4 rounded border border-[#1f2335] text-sm text-[#c0caf5] whitespace-pre-wrap font-sans leading-relaxed">
                {news.content}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Inteligencia (Editable) */}
          <div className="flex-1 bg-[#1f2335] border border-[#3b4261] rounded-lg p-6 flex flex-col shadow-xl">
            <h3 className="text-[#9ece6a] font-bold text-sm tracking-wider uppercase mb-4 pb-2 border-b border-[#292e42]">
              AI_Generated_Output (Editable)
            </h3>
            
            <form action={approveAction} className="flex flex-col h-full">
              <div className="mb-4">
                <label className="block text-xs text-[#7dcfff] mb-2 font-bold uppercase">SEO_Title_Optimized</label>
                <input 
                  name="seoTitle" 
                  defaultValue={news.seoTitle} 
                  className="w-full bg-[#1a1b26] border border-[#292e42] rounded px-3 py-2 text-white focus:outline-none focus:border-[#7dcfff] transition-colors" 
                />
              </div>
              
              <div className="mb-4 flex-grow flex flex-col">
                <label className="block text-xs text-[#7dcfff] mb-2 font-bold uppercase">Curated_Summary (Bias-Free)</label>
                <textarea 
                  name="summary" 
                  defaultValue={news.summary} 
                  className="w-full flex-grow bg-[#1a1b26] border border-[#292e42] rounded px-3 py-2 text-white focus:outline-none focus:border-[#7dcfff] font-sans leading-relaxed transition-colors resize-none" 
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs text-[#7dcfff] mb-2 font-bold uppercase">Semantic_Tags (JSON Array)</label>
                <input 
                  name="tags" 
                  defaultValue={news.tags ? JSON.stringify(news.tags) : '[]'} 
                  className="w-full bg-[#1a1b26] border border-[#292e42] rounded px-3 py-2 text-[#e0af68] font-mono focus:outline-none focus:border-[#7dcfff] transition-colors" 
                />
              </div>

              <div className="flex gap-4 mt-auto pt-4 border-t border-[#292e42]">
                <button 
                  type="submit" 
                  className="flex-1 bg-[#9ece6a] hover:bg-[#73daca] text-[#1a1b26] font-bold py-3 rounded tracking-wider uppercase transition-colors"
                >
                  Approve_&_Publish
                </button>
                <button 
                  formAction={rejectAction} 
                  className="flex-1 bg-[#f7768e] hover:bg-[#db4b4b] text-white font-bold py-3 rounded tracking-wider uppercase transition-colors"
                >
                  Reject_Content
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
