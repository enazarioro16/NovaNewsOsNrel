'use server';

import { auth } from '../../auth';
import { db, users, userBookmarks } from '@novanews/database';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function savePreferences(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No session");

  const tags = formData.getAll('tags') as string[];
  
  await db.update(users)
    .set({ preferences: tags })
    .where(eq(users.id, session.user.id));
    
  revalidatePath('/');
  redirect('/');
}

export async function toggleBookmark(newsId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No session");

  const userId = session.user.id;
  
  const existing = await db.select()
    .from(userBookmarks)
    .where(and(eq(userBookmarks.userId, userId), eq(userBookmarks.newsId, newsId)));
    
  if (existing.length > 0) {
    // Eliminar bookmark
    await db.delete(userBookmarks)
      .where(and(eq(userBookmarks.userId, userId), eq(userBookmarks.newsId, newsId)));
  } else {
    // Crear bookmark
    await db.insert(userBookmarks).values({ userId, newsId });
  }

  revalidatePath('/');
  revalidatePath('/bookmarks');
}
