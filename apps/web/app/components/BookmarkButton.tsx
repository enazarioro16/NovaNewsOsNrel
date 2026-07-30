'use client';

import { useOptimistic, startTransition } from 'react';
import { toggleBookmark } from '../actions/user.actions';

export default function BookmarkButton({ newsId, initialIsBookmarked }: { newsId: string, initialIsBookmarked: boolean }) {
  const [optimisticIsBookmarked, addOptimisticBookmark] = useOptimistic(
    initialIsBookmarked,
    (state, _newVal) => !state // Toggle optimista
  );

  return (
    <button
      onClick={() => {
        startTransition(() => {
          addOptimisticBookmark(null); // Actualiza UI instantáneamente
          toggleBookmark(newsId); // Server Action en background
        });
      }}
      style={{
        padding: '0.5rem 1rem',
        background: optimisticIsBookmarked ? '#fff' : '#0070f3',
        color: optimisticIsBookmarked ? '#0070f3' : '#fff',
        border: '1px solid #0070f3',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s ease'
      }}
    >
      {optimisticIsBookmarked ? '★ Guardado' : '☆ Guardar'}
    </button>
  );
}
