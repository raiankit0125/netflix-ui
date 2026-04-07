import { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import MediaGrid from '../components/MediaGrid';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { fetchCatalog } from '../services/imdbService';

const TAB_ITEMS = ['Home', 'TV Shows', 'Movies', 'Video Games'];

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function itemMatchesSearch(item, searchText) {
  if (!searchText) {
    return true;
  }

  const title = normalizeText(item.title);
  const id = normalizeText(item.id);
  const year = String(item.year || '');

  return title.includes(searchText) || id.includes(searchText) || year.includes(searchText);
}

function itemMatchesTab(item, activeTab) {
  if (activeTab === 'Home') return true;
  if (activeTab === 'TV Shows') return item.category === 'tv';
  if (activeTab === 'Movies') return item.category === 'movie';
  if (activeTab === 'Video Games') return item.category === 'game';
  return true;
}

function getSuggestions(items, searchText) {
  if (!searchText) {
    return [];
  }

  const list = [];

  for (const item of items) {
    if (itemMatchesSearch(item, searchText)) {
      list.push(item);
    }

    if (list.length === 8) {
      break;
    }
  }

  return list;
}

function getFilteredItems(items, activeTab, searchText) {
  return items.filter((item) => itemMatchesTab(item, activeTab) && itemMatchesSearch(item, searchText));
}

function getTopShow(items) {
  if (!items.length) {
    return null;
  }

  let topItem = items[0];

  for (const item of items) {
    const topRating = topItem.rating || 0;
    const currentRating = item.rating || 0;

    if (currentRating > topRating) {
      topItem = item;
      continue;
    }

    if (currentRating === topRating && (item.votes || 0) > (topItem.votes || 0)) {
      topItem = item;
    }
  }

  return topItem;
}

function HomePage({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setLoadingMore(false);
      setError('');

      try {
        const result = await fetchCatalog({
          signal: controller.signal,
          onProgress: ({ loadedCount: nextLoadedCount, totalTarget }) => {
            setLoadedCount(nextLoadedCount);
            setTotalCount(totalTarget);
            setLoadingMore(true);
          },
        });

        setCatalog(result.items);
        setLoadedCount(result.items.length);
        setTotalCount(result.totalTarget);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load data right now.');
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, []);

  const searchText = normalizeText(useDebounce(searchTerm, 300));
  const suggestions = getSuggestions(catalog, searchText);
  const filteredItems = getFilteredItems(catalog, activeTab, searchText);
  const topShow = getTopShow(filteredItems.length ? filteredItems : catalog);
  const isSearchView = Boolean(searchText);

  return (
    <main className="page-shell">
      <Navbar
        tabs={TAB_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userName={user.name}
        onSignOut={onSignOut}
      />

      <section className="page-content screen-panel">
        <div className="toolbar">
          <div>
            <p className="eyebrow">Short-form media storefront</p>
            <h1>Browse up to 10,000 TV shows, movies and video games</h1>
            <p className="toolbar-copy">
              Data is loaded from the IMDb REST API and rendered in small batches for smoother scrolling.
            </p>
          </div>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            suggestions={suggestions}
            onSuggestionSelect={setSearchTerm}
          />
        </div>

        {isSearchView ? (
          <section className="search-view screen-panel">
            <div className="section-heading">
              <div>
                <h2>Search results</h2>
                <p>Search is available on title name, IMDb ID and release year.</p>
              </div>
              <span className="status-pill">{filteredItems.length.toLocaleString()} matches</span>
            </div>
            <MediaGrid items={filteredItems} loading={loading} emptyMessage="No search results found." />
          </section>
        ) : (
          <>
            <HeroBanner item={topShow} loading={loading} />

            <section className="summary-strip screen-panel">
              <article className="summary-card">
                <span className="summary-label">Titles loaded</span>
                <strong>{loadedCount.toLocaleString()}</strong>
              </article>
              <article className="summary-card">
                <span className="summary-label">Target selection</span>
                <strong>{totalCount.toLocaleString()}</strong>
              </article>
              <article className="summary-card">
                <span className="summary-label">Active category</span>
                <strong>{activeTab}</strong>
              </article>
            </section>

            <section className="section-heading">
              <div>
                <h2>All titles</h2>
                <p>Complete list from the API filtered by the selected navigation tab.</p>
              </div>
              {loadingMore && !loading ? <span className="status-pill">Loading titles from API...</span> : null}
            </section>

            {error ? <div className="error-box">{error}</div> : null}

            <MediaGrid items={filteredItems} loading={loading} emptyMessage="No titles found for this category." />
          </>
        )}

        <section className="info-strip screen-panel">
          <h3>How this app avoids memory leaks and unnecessary re-renders</h3>
          <div className="info-grid">
            <p>API requests are cleaned up with AbortController when the screen unmounts.</p>
            <p>Search input is debounced, so filtering does not run on every keystroke.</p>
            <p>Images load only when cards come near the viewport using IntersectionObserver.</p>
            <p>The grid renders in batches, so thousands of cards are not mounted at once.</p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default HomePage;
