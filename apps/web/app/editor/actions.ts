'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '../../auth';

export async function approveAndPublishNews(id: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = {
    seoTitle: formData.get('seoTitle'),
    summary: formData.get('summary'),
    tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [],
  };

  const API_BASE = process.env.NODE_ENV === 'production' ? 'http://api:3001' : 'http://localhost:3001';
  await fetch(`${API_BASE}/editorial/news/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer internal-server-rsc-token-12345'
    },
    body: JSON.stringify(data),
  });

  revalidatePath('/editor');
  redirect('/editor');
}

export async function rejectNews(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const API_BASE = process.env.NODE_ENV === 'production' ? 'http://api:3001' : 'http://localhost:3001';
  await fetch(`${API_BASE}/editorial/news/${id}/reject`, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer internal-server-rsc-token-12345' },
  });

  revalidatePath('/editor');
  redirect('/editor');
}

export async function triggerIngestion() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const API_BASE = process.env.NODE_ENV === 'production' ? 'http://api:3001' : 'http://localhost:3001';
  await fetch(`${API_BASE}/editorial/trigger-ingestion`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer internal-server-rsc-token-12345' },
  });
  revalidatePath('/editor');
}

export async function ingestSingleUrl(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const url = formData.get('url');
  
  // NOTE: This assumes the NestJS API has an endpoint for single URL ingestion.
  // We will call the standard webhook ingest with a mock payload for this single URL.
  const API_BASE = process.env.NODE_ENV === 'production' ? 'http://api:3001' : 'http://localhost:3001';
  await fetch(`${API_BASE}/content/webhook/ingest`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer webhook-secret-token-2026' 
    },
    body: JSON.stringify([{
      title: 'Manual Extraction Override',
      content: 'Fetching content dynamically...',
      originalUrl: url
    }])
  });
  
  revalidatePath('/editor');
  redirect('/editor');
}
