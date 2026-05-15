import { useState, useEffect, useCallback } from 'react';

// Safely access the key from .env using Vite syntax
const API_KEY = import.meta.env.VITE_RSS_KEY || 'vlmw4ck0j69ims9tv63s3ihiwdyynmmifqh2aeno'; 

const TRENDS_RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN';

const SOURCES = [
  { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', type: 'News' },
  { name: 'Yahoo News', url: 'https://news.yahoo.com/rss/', type: 'News' },
  { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', type: 'News' },
  // Google Trends RSS Real-time (more stable and frequent updates)
  { name: 'Google Trends', url: TRENDS_RSS_URL, type: 'Trending' }
];

let globalFetchPromise = null;

export const useNewsHub = (selectedCategory = 'All') => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractImage = (description) => {
    if (!description) return null;
    const match = description.match(/<img[^>]+src="([^">]+)"/) || 
                  description.match(/src="([^">]+.(?:jpg|jpeg|png|gif|webp))"/) ||
                  description.match(/http[^"']+(?:jpg|jpeg|png|gif|webp)/);
    return match ? match[1] : null;
  };

  const getFallbackImage = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('cricket') || t.includes('ipl') || t.includes('sports')) return 'https://images.unsplash.com/photo-1540747913346-19e3adbb17c3?auto=format&fit=crop&q=80&w=1000';
    if (t.includes('ai') || t.includes('tech') || t.includes('robot') || t.includes('quantum')) return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000';
    if (t.includes('bollywood') || t.includes('movie') || t.includes('actor')) return 'https://images.unsplash.com/photo-1598899139113-fb4321748d8a?auto=format&fit=crop&q=80&w=1000';
    if (t.includes('sensex') || t.includes('market') || t.includes('business') || t.includes('finance')) return 'https://images.unsplash.com/photo-1611974714851-48206138d73e?auto=format&fit=crop&q=80&w=1000';
    return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000';
  };

  const fetchNeuralHub = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const cachedData = sessionStorage.getItem('neural_news_cache');
      const cachedTime = sessionStorage.getItem('neural_news_timestamp');
      const now = Date.now();
      const isCacheFresh = cachedTime && (now - parseInt(cachedTime) < 10 * 60 * 1000); // 10 mins

      if (isCacheFresh && !forceRefresh && cachedData) {
        setNews(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      if (!forceRefresh && globalFetchPromise) {
        // console.log('[NEWS HUB] Reusing existing fetch promise...');
        const finalFeed = await globalFetchPromise;
        setNews(finalFeed);
        setLoading(false);
        return;
      }

      globalFetchPromise = (async () => {
        const fetchSource = async (source) => {
          let attempts = 0;
          const maxRetries = 2;

          while (attempts <= maxRetries) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for parallel fetches

              const proxyBase = '/api/news/proxy-rss';
              const apiUrl = `${proxyBase}?url=${encodeURIComponent(source.url)}&_ts=${Date.now()}`;
              
              // console.log(`[NEWS HUB] Parallel Fetching: ${source.name} (Attempt ${attempts + 1})`);
              const response = await fetch(apiUrl, { signal: controller.signal });
              clearTimeout(timeoutId);
              
              // 1. Check if the response is successful
              if (!response.ok) {
                 const errorText = await response.text().catch(() => 'Unknown error');
                 throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 50)}`);
              }

              // 2. Verify Content-Type is JSON before parsing
              const contentType = response.headers.get('content-type');
              let data;

              if (!contentType || !contentType.includes('application/json')) {
                 const text = await response.text().catch(() => 'No content');
                 
                 // SPECIAL CASE: Detect "Tree Chart" response and auto-wrap into JSON
                 if (text.trim().startsWith('Tree Chart')) {
                    console.info(`[NEWS HUB] ${source.name}: Detected 'Tree Chart' text. Auto-wrapping for JSON viewer compatibility.`);
                    data = { 
                      status: 'ok', 
                      type: 'tree_chart', 
                      data: text, 
                      items: [], // Return empty items to prevent map() errors in UI
                      message: 'Raw Tree Chart data encapsulated.'
                    };
                 } else {
                    console.warn(`[NEWS HUB] ${source.name} returned non-JSON: ${text.substring(0, 50)}`);
                    throw new Error('Expected JSON response but received plain text or HTML.');
                 }
              } else {
                try {
                  data = await response.json();
                } catch (jsonErr) {
                  console.error(`[NEWS HUB] JSON Parse Error for ${source.name}:`, jsonErr.message);
                  throw new Error('Malformed JSON received from server.');
                }
              }

              if (data.status !== 'ok') {
                const errorMsg = data.error || data.message || 'Operation failed';
                
                // REQUIREMENT: If 403 or 404 is detected, stop retrying immediately for this source
                if (errorMsg.includes('403') || errorMsg.includes('404')) {
                  console.error(`[NEWS HUB] ${source.name} permanent failure (${errorMsg}). Aborting retries.`);
                  return []; // Exit loop and return empty
                }
                
                throw new Error(errorMsg);
              }
              
              if (data.items && Array.isArray(data.items)) {
                return data.items
                  .filter(item => item && item.title)
                  .map(item => ({
                    ...item,
                    source: source.name,
                    type: source.type,
                    image: item.thumbnail || extractImage(item.description) || getFallbackImage(item.title),
                    description: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 250) + (item.description?.length > 250 ? '...' : '')
                  }));
              }
              return [];
            } catch (err) { 
              const errorMsg = err.message || '';
              // If we caught a 403/404 in the throw block above, it already returned.
              // But if fetch itself failed or some other error occurred:
              if (errorMsg.includes('403') || errorMsg.includes('404')) return [];

              attempts++;
              const isTimeout = err.name === 'AbortError';
              console.warn(`[NEWS HUB] ${source.name} attempt ${attempts} failed:`, isTimeout ? 'Timeout' : errorMsg);
              
              if (attempts > maxRetries) return [];
              
              const retryDelay = Math.floor(Math.random() * 2000) + 500;
              await new Promise(res => setTimeout(res, retryDelay));
            }
          }
          return [];
        };

        const results = await Promise.allSettled(SOURCES.map(s => fetchSource(s)));
        
        const finalFeed = results
          .filter(r => r.status === 'fulfilled')
          .map(r => r.value)
          .flat()
          .sort((a, b) => {
            const dateA = new Date(a.pubDate);
            const dateB = new Date(b.pubDate);
            if (isNaN(dateA) || isNaN(dateB)) return 0;
            return dateB - dateA;
          });
        
        if (finalFeed.length === 0) {
          throw new Error('Backend Unreachable: The global news feeds failed to load. Please ensure your backend is running on port 5000.');
        }

        sessionStorage.setItem('neural_news_cache', JSON.stringify(finalFeed));
        sessionStorage.setItem('neural_news_timestamp', Date.now().toString());
        return finalFeed;
      })();

      const finalFeed = await globalFetchPromise;
      if (finalFeed && finalFeed.length > 0) {
        setNews(prev => JSON.stringify(prev) === JSON.stringify(finalFeed) ? prev : finalFeed);
      }
    } catch (err) {
      setError(err.message || 'Global Intelligence Link Offline.');
    } finally {
      globalFetchPromise = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNeuralHub();
  }, [fetchNeuralHub]);

  const SECTORS = {
    'Tech': [
      'tech', 'technology', 'ai', 'artificial intelligence', 'machine learning',
      'google', 'apple', 'microsoft', 'amazon', 'meta', 'openai', 'samsung',
      'software', 'hardware', 'chip', 'semiconductor', 'digital', 'cyber',
      'phone', 'smartphone', 'iphone', 'android', 'robot', 'automation',
      'data', 'cloud', 'gadget', 'app', 'startup', 'innovation', 'coding',
      'internet', '5g', 'electric', 'ev', 'tesla', 'space', 'nasa', 'isro'
    ],
    'Business': [
      'business', 'market', 'stock', 'economy', 'economic', 'finance', 'financial',
      'company', 'corporate', 'ceo', 'deal', 'merger', 'acquisition',
      'billion', 'million', 'trade', 'investment', 'investor', 'bank', 'banking',
      'startup', 'ipo', 'profit', 'revenue', 'gdp', 'inflation', 'rupee',
      'dollar', 'sensex', 'nifty', 'nasdaq', 'tax', 'budget', 'rbi', 'sebi',
      'reliance', 'tata', 'adani', 'infosys', 'wipro'
    ],
    'Sports': [
      'cricket', 'football', 'ipl', 'match', 'score', 'player', 'won', 'win',
      'cup', 'fifa', 'sport', 'sports', 'tournament', 'tennis', 'game', 'team',
      'goal', 'league', 'athlete', 'champion', 'medal', 'olympic', 'bcci',
      'test match', 'odi', 't20', 'kohli', 'dhoni', 'rohit', 'stadium',
      'basketball', 'badminton', 'hockey', 'wrestling', 'kabaddi', 'race', 'gp'
    ],
    'Entertainment': [
      'movie', 'film', 'cinema', 'celebrity', 'bollywood', 'hollywood',
      'music', 'song', 'album', 'concert', 'culture', 'netflix', 'amazon prime',
      'star', 'actor', 'actress', 'director', 'producer', 'show', 'series',
      'drama', 'award', 'oscar', 'filmfare', 'trailer', 'release', 'box office',
      'tv', 'web series', 'ott', 'dance', 'reality show', 'entertainment'
    ],
    'India': [
      'india', 'indian', 'modi', 'delhi', 'mumbai', 'bangalore', 'bengaluru',
      'chennai', 'kolkata', 'hyderabad', 'pune', 'government', 'parliament',
      'bharat', 'state', 'bjp', 'congress', 'minister', 'pm', 'cm',
      'election', 'vote', 'supreme court', 'high court', 'rbi', 'sebi',
      'aadhar', 'upi', 'rupee', 'nation', 'national', 'lok sabha', 'rajya sabha'
    ],
    'World': [
      'us', 'usa', 'united states', 'china', 'russia', 'ukraine', 'israel',
      'global', 'world', 'international', 'un', 'united nations', 'europe',
      'asia', 'africa', 'middle east', 'pakistan', 'nato', 'war', 'conflict',
      'treaty', 'sanctions', 'white house', 'pentagon', 'president', 'biden',
      'trump', 'xi jinping', 'putin', 'climate', 'g20', 'g7', 'imf', 'world bank'
    ]
  };

  const filteredNews = selectedCategory === 'All'
    ? news
    : news.filter(item => {
        const searchStr = (
          (item.title || '') + ' ' +
          (item.description || '') + ' ' +
          (item.source || '')
        ).toLowerCase();
        const keys = SECTORS[selectedCategory] || [selectedCategory.toLowerCase()];
        return keys.some(k => searchStr.includes(k.toLowerCase()));
      });

  return { 
    news: filteredNews, 
    rawNews: news, 
    loading, 
    error, 
    fetchNews: () => fetchNeuralHub(true) 
  };
};
