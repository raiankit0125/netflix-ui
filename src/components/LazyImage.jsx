import { useEffect, useRef, useState } from 'react';

const FALLBACK_POSTER = 'https://placehold.co/320x480/232323/f5f5f5?text=No+Poster';

function LazyImage({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '120px',
      },
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    setImageSource(src || FALLBACK_POSTER);
  }, [isVisible, src]);

  return (
    <div className="media-card__image" ref={imageRef}>
      <img
        src={imageSource || FALLBACK_POSTER}
        alt={alt}
        loading="lazy"
        onError={() => setImageSource(FALLBACK_POSTER)}
      />
    </div>
  );
}

export default LazyImage;
