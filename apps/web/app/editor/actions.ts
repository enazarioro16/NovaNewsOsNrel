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
  if (!session) return { success: false, message: "Unauthorized" };

  const API_BASE = process.env.NODE_ENV === 'production' ? 'http://api:3001' : 'http://localhost:3001';
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET || 'n8n_nova_secret_2026';

  try {
    const res = await fetch(`${API_BASE}/editorial/trigger-ingestion`, {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer internal-server-rsc-token-12345',
        'x-webhook-secret': webhookSecret 
      },
    });

    if (!res.ok) {
      return { success: false, message: `Error ${res.status}` };
    }
    revalidatePath('/editor');
    return { success: true, message: "Ingestión disparada exitosamente" };
  } catch (error) {
    return { success: false, message: "Fallo de conexión con el motor IA" };
  }
}

export async function ingestSingleUrl(url: string) {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  const API_BASE = process.env.NODE_ENV === 'production' ? 'http://api:3001' : 'http://localhost:3001';
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET || 'n8n_nova_secret_2026';

  const payload = {
    source: { name: "Manual Override", credibilityScore: 100 },
    articles: [{
      title: "Target URL Override",
      content: "Auto-extraction pending...",
      originalUrl: url
    }]
  };

  try {
    const res = await fetch(`${API_BASE}/content/webhook/ingest`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret 
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { success: false, message: `Error de seguridad: ${res.status}` };
    }
    
    revalidatePath('/editor');
    return { success: true, message: "URL inyectada exitosamente en el pipeline" };
  } catch (error) {
    return { success: false, message: "Fallo crítico de conexión con el API" };
  }
}
