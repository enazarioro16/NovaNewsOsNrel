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

  await fetch(`http://localhost:3001/editorial/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  revalidatePath('/editor');
  redirect('/editor');
}

export async function rejectNews(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await fetch(`http://localhost:3001/editorial/news/${id}/reject`, {
    method: 'PUT',
  });

  revalidatePath('/editor');
  redirect('/editor');
}

export async function triggerIngestion() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await fetch('http://localhost:3001/editorial/trigger-ingestion', {
    method: 'POST',
  });
  revalidatePath('/editor');
}
