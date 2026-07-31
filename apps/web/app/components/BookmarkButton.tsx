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
      className={`text-xs font-bold uppercase py-2 px-4 rounded transition-all duration-200 border flex items-center gap-2 ${
        optimisticIsBookmarked 
          ? 'bg-[#bb9af7]/20 text-[#bb9af7] border-[#bb9af7] shadow-[0_0_10px_rgba(187,154,247,0.3)]' 
          : 'bg-[#1f2335] text-[#565f89] border-[#292e42] hover:border-[#bb9af7] hover:text-[#bb9af7]'
      }`}
    >
      {optimisticIsBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  );
}
