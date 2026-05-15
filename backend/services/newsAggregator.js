const fs = require('fs');
const path = require('path');
const { fetchRss } = require('./rssService');
const { rankHeadlines } = require('./geminiService');

const POSTED_LINKS_FILE = path.join(__dirname, '..', 'posted_news_links.json');

/**
 * Ensures the posted links file exists.
 */
function initStorage() {
  if (!fs.existsSync(POSTED_LINKS_FILE)) {
    fs.writeFileSync(POSTED_LINKS_FILE, JSON.stringify([]));
  }
}

/**
 * Gets the list of already posted links.
 */
function getPostedLinks() {
  initStorage();
  try {
    const data = fs.readFileSync(POSTED_LINKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[AGGREGATOR] Error reading posted links:', error);
    return [];
  }
}

/**
 * Saves a new list of posted links.
 */
function savePostedLinks(links) {
  try {
    const existing = getPostedLinks();
    const updated = [...new Set([...existing, ...links])];
    // Keep only last 500 links to avoid file bloating
    const trimmed = updated.slice(-500);
    fs.writeFileSync(POSTED_LINKS_FILE, JSON.stringify(trimmed, null, 2));
  } catch (error) {
    console.error('[AGGREGATOR] Error saving posted links:', error);
  }
}

/**
 * Fetches news from TOI, Google News, and Yahoo, ranks them, and returns the top 3.
 */
async function getTopTrendingNews() {
  const sources = [
    'https://news.google.com/rss/headlines/section/geo/IN?hl=en-IN&gl=IN&ceid=IN:en', // STABLE TRENDING
    'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    'https://news.yahoo.com/rss/'
  ];

  let allItems = [];

  for (const url of sources) {
    try {
      const feed = await fetchRss(url);
      const items = feed.items.map(item => ({
        title: item.title,
        description: item.contentSnippet || item.description || '',
        link: item.link,
        source: url.includes('timesofindia') ? 'Times of India' : 'Yahoo News',
        pubDate: item.pubDate || item.isoDate
      }));
      allItems = [...allItems, ...items];
    } catch (error) {
      console.error(`[AGGREGATOR] Failed to fetch from ${url}:`, error.message);
    }
  }

  // Filter out duplicates (already posted)
  const postedLinks = getPostedLinks();
  const freshNews = allItems.filter(item => !postedLinks.includes(item.link));

  console.log(`[AGGREGATOR] Found ${freshNews.length} fresh stories out of ${allItems.length} total.`);

  if (freshNews.length === 0) {
    return [];
  }

  // Take up to 15 headlines for Gemini to rank
  const candidates = freshNews.slice(0, 15);
  
  console.log(`[AGGREGATOR] Ranking top 3 from ${candidates.length} candidates...`);
  const top3 = await rankHeadlines(candidates);

  // Save these links so we don't post them again
  savePostedLinks(top3.map(item => item.link));

  return top3;
}

module.exports = { getTopTrendingNews };
