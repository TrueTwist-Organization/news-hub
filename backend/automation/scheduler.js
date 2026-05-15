const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cron = require('node-cron');

const { getTopTrendingNews } = require('../services/newsAggregator');
const { automateNewsPost } = require('./newsToFacebook');

/**
 * Main automated task to fetch, rank, and post trending news.
 */
async function runDailyAutomation() {
  const timestamp = new Date().toLocaleString();
  console.log(`\n[${timestamp}] 🕒 Starting Scheduled News Automation...`);

  try {
    // 1. Fetch and rank top 3 trending stories
    const top3 = await getTopTrendingNews();

    if (!top3 || top3.length === 0) {
      console.log(`[${timestamp}] 😴 No fresh trending news found to post.`);
      return;
    }

    // Ensure we only process ONE story per run (so 3 total per day)
    const topStory = top3.slice(0, 1);
    console.log(`[${timestamp}] 📊 Processing the absolute top trending story: ${topStory[0].title}`);

    // 2. Process the single story through the Facebook pipeline
    for (const [index, news] of topStory.entries()) {
      console.log(`\n[${timestamp}] ✍️ Processing story: ${news.title}`);
      
      const result = await automateNewsPost(news);

      if (result.success) {
        console.log(`✅ [${timestamp}] Story ${index + 1} posted successfully! ID: ${result.postId}`);
      } else {
        console.log(`❌ [${timestamp}] Story ${index + 1} failed: ${result.error}`);
      }

      // Small delay between posts to stay within rate limits
      if (index < top3.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    console.log(`\n[${timestamp}] 🎉 Scheduled automation run complete.`);

  } catch (error) {
    console.error(`❌ [${timestamp}] CRITICAL ERROR in Scheduler:`, error.message);
  }
}

/**
 * Schedule the task 3 times a day:
 * 9 AM, 2 PM, and 8 PM
 * Cron format: minute hour day-of-month month day-of-week
 */

// 9:00 AM
cron.schedule('0 9 * * *', () => {
  console.log('[CRON] Triggering 9 AM News Update');
  runDailyAutomation();
});

// 2:00 PM
cron.schedule('0 14 * * *', () => {
  console.log('[CRON] Triggering 2 PM News Update');
  runDailyAutomation();
});

// 8:00 PM
cron.schedule('0 20 * * *', () => {
  console.log('[CRON] Triggering 8 PM News Update');
  runDailyAutomation();
});

console.log('🤖 News Scheduler Initialized (9 AM, 2 PM, 8 PM)');

module.exports = { runDailyAutomation };
