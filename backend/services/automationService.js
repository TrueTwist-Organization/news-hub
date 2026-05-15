const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: [['ht:approx_traffic', 'traffic']]
  }
});
const AdminConfig = require('../models/AdminConfig');
const Creation = require('../models/Creation');
const { generateViralPost } = require('./geminiService');

// Correct Google Trends RSS for India
const GOOGLE_TRENDS_RSS = 'https://trends.google.com/trending/rss?geo=IN';

/**
 * Hybrid Core: Fetches from RSS or Internal DB, then uses AI to pick the most viral story.
 * Now prioritized by 'Trend Velocity' and 'Traffic'.
 */
const executeAutomationCycle = async (postType = 'afternoon') => {
  try {
    const config = await AdminConfig.findOne();
    if (!config) {
      console.error('[AUTOMATION] ❌ No AdminConfig found.');
      return { success: false, message: 'Database configuration missing' };
    }

    if (!config.isAutomationEnabled) {
      console.log('[AUTOMATION] ⏸ Master Switch is OFF. Skipping.');
      return { success: false, message: 'Automation is disabled' };
    }

    const pageId = config.facebookPageId;
    const token = config.facebookToken;

    if (!pageId || !token) {
      const errorMsg = 'Facebook credentials missing in Admin Panel.';
      console.error(`[AUTOMATION] ❌ ${errorMsg}`);
      config.lastRunStatus = { lastRunAt: new Date(), status: 'Failed', message: errorMsg };
      await config.save();
      return { success: false, message: errorMsg };
    }

    let newsPool = [];
    let sourceOrigin = 'RSS';
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    // 1. Step A: Try Active RSS Sources
    const activeSources = config.rssSources.filter(s => s.isActive);
    if (activeSources.length > 0) {
      console.log('[AUTOMATION] 🔄 Fetching from RSS (Engagement Sort)...');
      for (const source of activeSources) {
        try {
          const feed = await parser.parseURL(source.url);
          if (feed.items && feed.items.length > 0) {
            const items = feed.items.map(item => ({
              title: item.title,
              description: item.contentSnippet || item.content || item.description || '',
              link: item.link,
              thumbnail: item.enclosure?.url || '',
              pubDate: item.pubDate || item.isoDate || now.toISOString()
            }));
            newsPool = [...newsPool, ...items];
          }
        } catch (err) {
          console.error(`[AUTOMATION] ⚠️ Fetch Error (${source.name}): ${err.message}`);
        }
      }
    }

    // Filter by Frequency (Published in last 6 hours for high velocity)
    if (newsPool.length > 0) {
      const freshPool = newsPool.filter(item => new Date(item.pubDate) >= sixHoursAgo);
      if (freshPool.length > 0) {
        console.log(`[AUTOMATION] ⚡ Filtered ${freshPool.length} stories from the last 6 hours.`);
        newsPool = freshPool;
      }
    }

    // 2. Step B: Fallback to Internal DB
    if (newsPool.length === 0) {
      console.log('[AUTOMATION] 🏠 No fresh RSS news. Checking Database...');
      sourceOrigin = 'Database';
      const internalData = await Creation.find({ postedToFb: false }).sort({ createdAt: -1 }).limit(20);
      
      if (internalData.length === 0) {
        console.log('[AUTOMATION] ⚠️ Database is empty, skipping to Trends.');
      } else {
        newsPool = internalData.map(item => ({
          title: item.title,
          description: item.description || '',
          link: 'https://neural-newsroom.vercel.app',
          thumbnail: item.image || '',
          pubDate: item.createdAt
        }));
      }
    }

    // 3. Step C: Absolute Fallback (Google Trends - Prioritized by Traffic)
    if (newsPool.length === 0) {
      console.log('[AUTOMATION] 🔥 Final Fallback: Google Trends (IN)...');
      sourceOrigin = 'Google Trends';
      try {
        const feed = await parser.parseURL(GOOGLE_TRENDS_RSS);
        if (feed.items && feed.items.length > 0) {
          newsPool = feed.items.map(item => ({
            title: item.title,
            description: item.description || '',
            link: item.link,
            traffic: item.traffic || '0',
            pubDate: item.pubDate || item.isoDate || now.toISOString()
          }));

          // Sort by Traffic (Descending)
          newsPool.sort((a, b) => {
            const tA = parseInt(a.traffic.replace(/[,+]/g, '')) || 0;
            const tB = parseInt(b.traffic.replace(/[,+]/g, '')) || 0;
            return tB - tA;
          });
          
          console.log(`[AUTOMATION] 📊 Top Trend Search Volume: ${newsPool[0].traffic}`);
        }
      } catch (err) {
        console.error('[AUTOMATION] ❌ Google Trends failed:', err.message);
      }
    }

    if (newsPool.length === 0) {
       // Gemini will generate a general tip in this case
       console.log('[AUTOMATION] ⚠️ No news found. AI will generate a fallback Tech Tip.');
    }

    // 4. AI Viral Filter (High Engagement Selection)
    console.log(`[AUTOMATION] 🧠 Discovery Engine (${sourceOrigin}): Analyzing for High-Engagement stories...`);
    let result;
    try {
      result = await generateViralPost(newsPool, postType);
    } catch (err) {
      console.warn('[AUTOMATION] ⚠️ Selection failed, using first news as fallback.');
      const fallbackNews = newsPool[0] || { title: 'Trending News', link: 'https://neural-newsroom.vercel.app' };
      result = {
        title: fallbackNews.title,
        caption: `Everyone is talking about this! 😲\n\n${fallbackNews.title}\n\n#news #breaking #trending`
      };
    }
    
    const selectedStory = newsPool.find(n => n.title === result.title) || (newsPool.length > 0 ? newsPool[0] : { link: 'https://neural-newsroom.vercel.app' });
    console.log(`[AUTOMATION] ✔ Viral Topic Selected: ${result.title}`);

    // 5. Publish to Facebook (v20.0)
    try {
      const fbResponse = await axios.post(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
        message: result.caption,
        link: selectedStory.link,
        access_token: token
      }, { timeout: 15000 });

      const fbPostId = fbResponse.data.id;
      console.log(`[AUTOMATION] ✅ Successful ${postType} post! ID: ${fbPostId}`);

      // 6. ARCHIVE TO DATABASE
      try {
        await Creation.create({
          title: result.title,
          description: result.caption,
          image: selectedStory.thumbnail || '',
          type: 'automated_post',
          fbPostId: fbPostId,
          fbLink: `https://facebook.com/${fbPostId}`,
          isAiGenerated: true,
          postedToFb: true,
          category: postType.charAt(0).toUpperCase() + postType.slice(1)
        });
      } catch (dbErr) {
        console.error('[AUTOMATION] ❌ Archival failed:', dbErr.message);
      }

      config.lastRunStatus = {
        lastRunAt: new Date(),
        status: 'Success',
        message: `(${postType.toUpperCase()}) Viral Topic: ${result.title.substring(0, 40)}...`
      };
      await config.save();
      return { success: true, message: 'High-Engagement Automation cycle completed' };

    } catch (fbErr) {
      const fbErrMsg = fbErr.response?.data?.error?.message || fbErr.message;
      console.error(`[AUTOMATION] ❌ Facebook API Error: ${fbErrMsg}`);
      config.lastRunStatus = { lastRunAt: new Date(), status: 'Failed', message: fbErrMsg };
      await config.save();
      return { success: false, message: fbErrMsg };
    }

  } catch (error) {
    console.error(`[AUTOMATION] ❌ Critical Error: ${error.message}`);
    return { success: false, message: error.message };
  }
};

/**
 * Dynamic Scheduler
 */
const startAutomationScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const config = await AdminConfig.findOne();
      if (!config || !config.isAutomationEnabled) return;

      const now = new Date();
      const istTime = now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
      const istDate = new Date(istTime);
      const hhmm = String(istDate.getHours()).padStart(2, '0') + ':' + String(istDate.getMinutes()).padStart(2, '0');

      if (config.morningTime === hhmm) {
        console.log(`\n[SCHEDULER] 🌅 Morning Trigger (${hhmm} IST)`);
        await executeAutomationCycle('morning');
      } else if (config.afternoonTime === hhmm) {
        console.log(`\n[SCHEDULER] 🚀 Afternoon Trigger (${hhmm} IST)`);
        await executeAutomationCycle('afternoon');
      } else if (config.nightTime === hhmm) {
        console.log(`\n[SCHEDULER] 🌙 Night Trigger (${hhmm} IST)`);
        await executeAutomationCycle('night');
      }
    } catch (error) {
      console.error('[AUTOMATION CRON] Loop Error:', error.message);
    }
  });
  console.log('🤖 High-Engagement News Discovery Engine Active (IST)');
};

module.exports = { startAutomationScheduler, executeAutomationCycle };
