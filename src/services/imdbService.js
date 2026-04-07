const IMDB_TITLES_ENDPOINT = '/api/imdb/titles';
const TARGET_SIZE = 10000;
const PAGE_SIZE = 200;
const MAX_PAGES = 60;

function getCategory(type = '') {
  const value = type.toLowerCase();

  if (value.includes('game')) {
    return { category: 'game', categoryLabel: 'Video Game' };
  }

  if (value.includes('tv')) {
    return { category: 'tv', categoryLabel: 'TV Show' };
  }

  return { category: 'movie', categoryLabel: 'Movie' };
}

function formatTitle(rawTitle) {
  const { category, categoryLabel } = getCategory(rawTitle?.type);

  return {
    id: rawTitle?.id || '',
    title: rawTitle?.primaryTitle || rawTitle?.originalTitle || 'Untitled',
    year: rawTitle?.startYear || '',
    category,
    categoryLabel,
    image: rawTitle?.primaryImage?.url || '',
    plot: rawTitle?.plot || '',
    rating: rawTitle?.rating?.aggregateRating || null,
    votes: rawTitle?.rating?.voteCount || 0,
    genres: Array.isArray(rawTitle?.genres) ? rawTitle.genres : [],
  };
}

function readTitles(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.titles)) {
    return payload.titles;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

async function requestJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`IMDb API request failed with status ${response.status}.`);
  }

  return response.json();
}

async function fetchTitlesPage(page, signal) {
  const urlsToTry = [`${IMDB_TITLES_ENDPOINT}?page=${page}&limit=${PAGE_SIZE}`];

  if (page === 1) {
    urlsToTry.push(IMDB_TITLES_ENDPOINT);
  }

  let lastError = null;

  for (const url of urlsToTry) {
    try {
      const payload = await requestJson(url, signal);
      const titles = readTitles(payload);

      return {
        titles,
        totalCount: payload?.totalCount || payload?.total || payload?.count || null,
        hasMore: Boolean(payload?.hasNextPage || payload?.nextPage || payload?.next),
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to load titles from the IMDb API.');
}

export async function fetchCatalog({ signal, onProgress }) {
  const seenIds = new Set();
  const items = [];
  let previousFirstId = '';

  for (let page = 1; page <= MAX_PAGES && items.length < TARGET_SIZE; page += 1) {
    const result = await fetchTitlesPage(page, signal);
    const { titles, totalCount, hasMore } = result;

    if (!titles.length) {
      break;
    }

    const firstId = titles[0]?.id || '';
    let addedOnThisPage = 0;

    for (const rawTitle of titles) {
      const item = formatTitle(rawTitle);

      if (!item.id || seenIds.has(item.id)) {
        continue;
      }

      seenIds.add(item.id);
      items.push(item);
      addedOnThisPage += 1;

      if (items.length >= TARGET_SIZE) {
        break;
      }
    }

    onProgress?.({
      loadedCount: items.length,
      totalTarget: totalCount || TARGET_SIZE,
    });

    if (addedOnThisPage === 0 || firstId === previousFirstId) {
      break;
    }

    previousFirstId = firstId;

    if (!hasMore && titles.length < PAGE_SIZE) {
      break;
    }
  }

  return {
    items,
    totalTarget: Math.max(items.length, TARGET_SIZE),
  };
}
