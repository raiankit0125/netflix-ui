import { memo } from 'react';
import LazyImage from './LazyImage';

function MediaCard({ item, onOpen, onToggleWatchlist, isInWatchlist }) {
  return (
    <article className="media-card">
      <button type="button" className="media-card__click" onClick={() => onOpen(item)}>
        <LazyImage src={item.image} alt={item.title} />

        <div className="media-card__body">
          <div className="media-card__header">
            <h3 title={item.title}>{item.title}</h3>
            <span>{item.year || 'N/A'}</span>
          </div>

          <p className="media-card__type">{item.categoryLabel}</p>
          <p className="media-card__plot">{item.plot || 'No plot available.'}</p>

          <div className="media-card__footer">
            <span>{item.rating ? `${item.rating}/10` : 'Unrated'}</span>
            <span>{item.id}</span>
          </div>
        </div>
      </button>

      <div className="media-card__actions">
        <button type="button" className="secondary-button compact-button" onClick={() => onToggleWatchlist(item)}>
          {isInWatchlist ? 'Remove' : 'Watchlist'}
        </button>
      </div>
    </article>
  );
}

export default memo(MediaCard);
