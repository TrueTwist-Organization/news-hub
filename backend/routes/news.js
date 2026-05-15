const express = require('express');
const router = express.Router();
const { fetchRss } = require('../services/rssService');

const { authMiddleware } = require('../middleware/auth');
const { checkTrialLimit } = require('../middleware/subscriptionCheck');

// Simple in-memory cache
const rssCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const { translateContent, generateScript } = require('../services/geminiService');
const { getTopTrendingNews } = require('../services/newsAggregator');
const { automateNewsPost } = require('../automation/newsToFacebook');

/**
 * @route   GET /api/news
 * @desc    Get top trending ranked news for the landing page
 */
router.get('/', async (req, res) => {
  try {
    const top3 = await getTopTrendingNews();
    res.json({
      success: true,
      count: top3.length,
      data: top3
    });
  } catch (error) {
    console.error('[NEWS ROUTE] Root Fetch Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});



/**
 * @route   GET /api/news/proxy-rss
 * @desc    Proxy RSS feeds with smart fallback: Google Trends → TOI → HT
 */
const FALLBACK_SOURCES = [
  { name: 'Google News India', url: 'https://news.google.com/rss/headlines/section/geo/IN?hl=en-IN&gl=IN&ceid=IN:en' },
  { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' },
  { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml' }
];

router.get('/proxy-rss', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: 'URL is required' });

  // Check Cache first
  const now = Date.now();
  if (rssCache.has(url)) {
    const cached = rssCache.get(url);
    if (now - cached.timestamp < CACHE_DURATION) {
      console.log(`[RSS PROXY] Cache Hit: ${url}`);
      return res.json(cached.data);
    }
  }

  // Helper: parse a feed into the standard response shape
  const buildResponse = (feed, sourceName = '') => ({
    status: 'ok',
    source: sourceName,
    feed: { title: feed.title, link: feed.link, description: feed.description },
    items: feed.items.map(item => {
      let imageUrl = '';
      if (item.mediaContent?.length > 0)   imageUrl = item.mediaContent[0].$.url;
      else if (item.mediaThumbnail)         imageUrl = item.mediaThumbnail.$.url || item.mediaThumbnail;
      else if (item.enclosure?.url)         imageUrl = item.enclosure.url;
      else if (item.image)                  imageUrl = item.image.url || item.image;
      if (typeof imageUrl === 'object' && imageUrl.$) imageUrl = imageUrl.$.url;

      return {
        title:       item.title,
        pubDate:     item.pubDate || item.isoDate,
        link:        item.link,
        guid:        item.guid || item.id,
        author:      item.creator || item.author,
        thumbnail:   imageUrl,
        description: item.contentSnippet || item.content || item.description || ''
      };
    })
  });

  // 1. Try the requested URL first
  try {
    console.log(`[RSS PROXY] Fetching: ${url}`);
    const feed = await fetchRss(url);
    const responseData = buildResponse(feed, 'Primary');
    rssCache.set(url, { timestamp: now, data: responseData });
    return res.json(responseData);
  } catch (primaryError) {
    const msg = primaryError.message || '';
    const isPermanent = msg.includes('404') || msg.includes('403') || msg.includes('ENOTFOUND');

    console.warn(`[RSS PROXY] Primary failed (${msg.substring(0, 60)}). Trying fallbacks...`);

    // 2. Auto-fallback chain (only on 404 / connection errors)
    if (isPermanent) {
      for (const fallback of FALLBACK_SOURCES) {
        // Skip if the requested URL is already this fallback
        if (url.includes(fallback.url)) continue;

        // Check fallback cache
        if (rssCache.has(fallback.url)) {
          const cached = rssCache.get(fallback.url);
          if (now - cached.timestamp < CACHE_DURATION) {
            console.log(`[RSS PROXY] Fallback Cache Hit: ${fallback.name}`);
            return res.json(cached.data);
          }
        }

        try {
          console.log(`[RSS PROXY] Trying fallback: ${fallback.name}`);
          const feed = await fetchRss(fallback.url);
          const responseData = buildResponse(feed, fallback.name);
          rssCache.set(fallback.url, { timestamp: now, data: responseData });
          console.log(`[RSS PROXY] ✔ Fallback success: ${fallback.name}`);
          return res.json(responseData);
        } catch (fbErr) {
          console.warn(`[RSS PROXY] Fallback "${fallback.name}" also failed: ${fbErr.message}`);
        }
      }
    }

    // 3. All sources failed — return structured error (never plain text)
    let friendlyMessage = 'The news source is currently unavailable.';
    if (msg.includes('404'))     friendlyMessage = 'Feed not found (404). Fallbacks also exhausted.';
    else if (msg.includes('403')) friendlyMessage = 'Access denied (403). Source blocked the request.';
    else if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) friendlyMessage = 'Request timed out (15s).';

    return res.status(200).json({
      status: 'error',
      success: false,
      message: friendlyMessage,
      items: [],
      debug: msg.substring(0, 100)
    });
  }
});


/**
 * @route   POST /api/news/translate-card
 * @desc    Translate news headlines and descriptions using Gemini AI
 * @access  Public
 */
router.post('/translate-card', async (req, res) => {
  try {
    const { title, description, language } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    console.log(`[API] Translating content to: ${language || 'hi'}`);
    
    const translated = await translateContent(title, description, language || 'hi');
    
    res.json({ 
      success: true, 
      title: translated.title, 
      description: translated.description 
    });
  } catch (error) {
    console.error('[BACKEND ERROR] /translate-card:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/news/generate-script
 * @desc    Generate an AI script for a specific news story
 */
router.post('/generate-script', async (req, res) => {
  try {
    const { title, description, language = 'en' } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const script = await generateScript(title, description, language);
    res.json({ success: true, script });
  } catch (error) {
    console.error('[NEWS ROUTE] Script Generation Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/news/generate-fb-caption
 * @desc    Generate an AI Facebook caption and hashtags for a specific news story
 */
router.post('/generate-fb-caption', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const { generateFacebookCaption } = require('../services/geminiService');
    const caption = await generateFacebookCaption(title, description);
    res.json({ success: true, caption });
  } catch (error) {
    console.error('[NEWS ROUTE] Caption Generation Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/news/verify-fb-token
 * @desc    Verify that the FB Page Access Token matches the configured FB_PAGE_ID
 */
router.get('/verify-fb-token', async (req, res) => {
  try {
    const { verifyToken } = require('../services/facebookService');
    const result = await verifyToken();
    if (result.valid) {
      res.json({ success: true, pageId: result.pageId, pageName: result.pageName });
    } else {
      res.status(400).json({ success: false, error: result.error || 'Token does not match FB_PAGE_ID' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/news/history
 * @desc    Get post history from creations_db.json
 */
router.get('/history', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const DB_PATH = path.resolve(__dirname, '../creations_db.json');
    
    if (!fs.existsSync(DB_PATH)) return res.json({ success: true, data: [] });
    
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    // Filter for automated posts if needed, or return all
    const history = data.filter(item => item.type === 'automated_post').reverse();
    
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    console.error('[NEWS ROUTE] History Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/news/trending
 * @desc    Fetch news from TOI/Yahoo, rank top 3, and avoid duplicates
 */
router.get('/trending', authMiddleware, checkTrialLimit, async (req, res) => {
  try {
    const top3 = await getTopTrendingNews();
    res.json({
      success: true,
      count: top3.length,
      data: top3
    });
  } catch (error) {
    console.error('[NEWS ROUTE] Trending Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/news/automate-fb
 * @desc    Full pipeline: Image -> Gemini Caption -> Facebook Post
 */
router.post('/automate-fb', async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const result = await automateNewsPost({ title, description, image: imageUrl || null });
    res.json(result);
  } catch (error) {
    console.error('[NEWS ROUTE] Automation Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/news/post-now
 * @desc    Manually post a custom title/story immediately
 */
router.post('/post-now', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    // If description is missing, use title as description
    const postData = {
      title,
      description: description || title,
      image: req.body.image // base64 image if provided
    };

    console.log(`[API] Manual Post Triggered: ${title}`);

    
    const result = await automateNewsPost(postData);
    res.json(result);
  } catch (error) {
    console.error('[NEWS ROUTE] Manual Post Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;



