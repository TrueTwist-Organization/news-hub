const Parser = require('rss-parser');
const axios = require('axios');

/**
 * RSS FETCHING SERVICE (Proxy logic)
 * Implements browser/mobile User-Agent switching and smart fallbacks.
 */

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';

const parser = new Parser({
  timeout: 15000,
  customFields: {
    item: [
      ['ht:approx_traffic', 'approxTraffic'],
      ['ht:news_item_title', 'newsItemTitle'],
      ['ht:news_item_snippet', 'newsItemSnippet'],
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
      ['image', 'image'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

/**
 * Fetches and parses an RSS feed with retry/fallback logic.
 * 
 * @param {string} url - Target RSS URL
 * @returns {Promise<Object>} - Parsed RSS feed
 */
/**
 * Fetches and parses an RSS feed with retry/fallback logic.
 * 
 * @param {string} url - Target RSS URL
 * @returns {Promise<Object>} - Parsed RSS feed
 */
async function fetchRss(url) {
  // --- CONFIGURATION ---
  const GOOGLE_TRENDS_FALLBACK = 'https://news.google.com/rss/headlines/section/geo/IN?hl=en-IN&gl=IN&ceid=IN:en';
  
  const tryFetch = async (targetUrl, ua) => {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': ua,
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 15000
    });
    return parser.parseString(response.data);
  };

  try {
    console.log(`[RSS SERVICE] Attempting primary fetch: ${url}`);
    return await tryFetch(url, BROWSER_UA);
  } catch (error) {
    const status = error.response ? error.response.status : null;
    const isTrends = url.includes('google.com/trends');

    // 1. Handle 403 (Forbidden) - Common for TOI/HT
    if (status === 403) {
      const delay = Math.floor(Math.random() * 2000) + 1000;
      console.warn(`[RSS SERVICE] 403 Forbidden for ${url}. Retrying with Mobile UA in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      try {
        return await tryFetch(url, MOBILE_UA);
      } catch (retryError) {
        throw new Error(`Access Denied (403) after Mobile UA retry: ${retryError.message}`);
      }
    }

    // 2. Handle 404 (Not Found) - Specifically for flaky Google Trends
    if ((status === 404 || status === 500) && isTrends) {
      console.warn(`[RSS SERVICE] Google Trends RSS is unstable/deprecated (${status}). Falling back to STABLE Google News India...`);
      try {
        return await tryFetch(GOOGLE_TRENDS_FALLBACK, BROWSER_UA);
      } catch (fallbackError) {
        console.error(`[RSS SERVICE] Critical Fallback Failure: ${fallbackError.message}`);
        throw new Error(`Trending sources exhausted. Trends 404 and Fallback failed.`);
      }
    }

    // 3. Special case for Hindustan Times blocking
    if (url.includes('hindustantimes.com') && status) {
       console.warn(`[RSS SERVICE] HT Error (${status}). Final attempt with Mobile UA...`);
       try {
         return await tryFetch(url, MOBILE_UA);
       } catch (e) { /* ignore and throw original */ }
    }

    // 4. Final throw with context
    const errMsg = error.response ? `Server responded with ${status}` : error.message;
    console.error(`[RSS SERVICE] Failed to fetch ${url}: ${errMsg}`);
    throw error;
  }
}

module.exports = { fetchRss };
