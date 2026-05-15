const { createNewsImage } = require('../services/cloudinaryService');
const { generateFacebookCaption } = require('../services/geminiService');
const { publishToFacebook } = require('../services/facebookService');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../creations_db.json');


/**
 * Orchestrates the full pipeline: News -> Cloudinary -> Gemini -> Facebook.
 * @param {Object} newsItem - { title, description, image }
 */
async function automateNewsPost(newsItem) {
  try {
    console.log(`\n--- 🚀 AUTOMATING POST: "${newsItem.title}" ---`);

    // 1. Create transformed image in Cloudinary
    // Pass null for localPath (no file upload), use remoteUrl from the news item
    const cloudinaryUrl = await createNewsImage(newsItem.title, null, newsItem.image || null);


    // 2. Generate viral caption with Gemini
    const caption = await generateFacebookCaption(newsItem.title, newsItem.description);

    // 3. Post to Facebook
    const fbResult = await publishToFacebook(cloudinaryUrl, caption);

    // Save to History (creations_db.json)
    try {
      const dbData = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) : [];
      dbData.push({
        id: fbResult.id,
        title: newsItem.title,
        description: newsItem.description,
        image: cloudinaryUrl,
        type: 'automated_post',
        createdAt: new Date().toISOString(),
        fbId: fbResult.id
      });
      fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));
    } catch (dbError) {
      console.warn('[AUTOMATION] Failed to save to history DB:', dbError.message);
    }

    console.log(`✅ SUCCESS: News posted to Facebook. ID: ${fbResult.id}`);
    return { success: true, postId: fbResult.id, url: cloudinaryUrl };


  } catch (error) {
    console.error('❌ AUTOMATION FAILED:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { automateNewsPost };

// Optional: Test execution if run directly
if (require.main === module) {
    const testNews = {
        title: "Scientists Discover Water on Distant Exoplanet",
        description: "A groundbreaking discovery by NASA's latest telescope reveals potential habitability in a solar system 100 light years away."
    };
    automateNewsPost(testNews).then(() => console.log('Done.'));
}
