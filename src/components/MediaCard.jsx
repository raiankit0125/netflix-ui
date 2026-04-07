import { memo } from 'react';
import LazyImage from './LazyImage';

function MediaCard({ item }) {
  return (
    <article className="media-card">
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
    </article>
  );
}

export default memo(MediaCard);
