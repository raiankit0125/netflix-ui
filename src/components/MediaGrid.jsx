import { useInfiniteItems } from '../hooks/useInfiniteItems';
import MediaCard from './MediaCard';

function MediaGrid({
  items,
  loading,
  emptyMessage = 'No titles found.',
  onOpenItem,
  onToggleWatchlist,
  watchlist = [],
}) {
  const { visibleItems, sentinelRef } = useInfiniteItems(items, {
    initialCount: 24,
    step: 24,
  });

  if (loading) {
    return (
      <section className="grid-layout">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="card-skeleton" />
        ))}
      </section>
    );
  }

  if (!items.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <>
      <section className="grid-layout">
        {visibleItems.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onOpen={onOpenItem}
            onToggleWatchlist={onToggleWatchlist}
            isInWatchlist={watchlist.some((entry) => entry.id === item.id)}
          />
        ))}
      </section>

      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
    </>
  );
}

export default MediaGrid;
