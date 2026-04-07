import { useInfiniteItems } from '../hooks/useInfiniteItems';
import MediaCard from './MediaCard';

function MediaGrid({ items, loading, emptyMessage = 'No titles found.' }) {
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
          <MediaCard key={item.id} item={item} />
        ))}
      </section>

      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
    </>
  );
}

export default MediaGrid;
