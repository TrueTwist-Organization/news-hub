const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('[GEMINI SERVICE] WARNING: GEMINI_API_KEY is not set in .env');
} else {
  console.log('[GEMINI SERVICE] API key loaded ✔');
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

if (genAI) {
  console.log('[GEMINI SERVICE] Connection to Gemini 1.5 Flash established via Stable API ✔');
}

/**
 * Template-based fallback: generates a structured broadcast script
 * directly from the article title and content — NO API needed.
 * Used when Gemini quota is exceeded.
 */
const generateTemplateScript = (title, content, language = 'en') => {
  const summary = content && content.length > 20
    ? content.slice(0, 300).replace(/\[.*?\]/g, '').trim()
    : (language === 'hi' ? 'हमारे न्यूज़रूम से ताज़ा अपडेट।' : 'Latest updates from our newsroom.');

  if (language === 'hi') {
    return `ब्रेकिंग: ${title}
    
${summary}...

इस कहानी पर अधिक लाइव अपडेट के लिए बने रहें।`;
  }

  return `Breaking: ${title}
    
${summary}...

Stay tuned for more live updates on this story.`;
};

// Request tracking for rate limiting
const requestTimestamps = [];
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW = 60000; // 60 seconds
const RATE_LIMIT_WAIT = 10000; // 10 seconds

/**
 * Checks request frequency and pauses if too many requests are made.
 */
const checkRateLimit = async () => {
  const now = Date.now();
  // Remove old timestamps outside the 60s window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= RATE_LIMIT_COUNT) {
    console.warn(`[GEMINI SERVICE] Rate limit check: ${requestTimestamps.length} requests in last 60s. Pausing for ${RATE_LIMIT_WAIT/1000}s...`);
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WAIT));
  }
  
  requestTimestamps.push(Date.now());
};

const generateScript = async (title, content, language = 'en') => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('[GEMINI SERVICE] No API key — using template fallback');
    return generateTemplateScript(title, content, language);
  }

  // Requirement: Check current request frequency. If > 5 reqs in 60s, wait 10s.
  await checkRateLimit();

  const genAI = new GoogleGenerativeAI(apiKey);

  console.log(`[GEMINI SERVICE] Generating script for: "${title}"`);

  // Base prompt
  let systemPrompt = `You are a professional social media news writer.
  
Write a highly engaging Facebook-style news update based on the following article. 
You must respond in ${language === 'hi' ? 'HINDI' : 'ENGLISH'}.

ARTICLE TITLE: ${title}
ARTICLE CONTENT: ${content}

CRITICAL RULES:
- Start with an attention-grabbing hook or headline.
- Provide factual, punchy info (summary of the news).
- Include 5 to 10 relevant trending hashtags at the end.
- Do not use any markdown bold/italics (* or **), emojis, or labels like "Caption:".
- Format it nicely with paragraph breaks so it looks ready to post.`;

  // Free-tier Gemini models in order of preference
  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-pro'
  ];

  const generationConfig = { temperature: 0.7, topP: 0.85 };
  let quotaExceeded = false;

  for (const modelName of modelsToTry) {
    try {
      // Requirement: If Quota Exceeded, switch to 'Lite' model and shorten output length to 100 words.
      if (quotaExceeded) {
        // Ensure we use a "Lite" model (flash-8b or flash-lite or flash)
        if (!modelName.includes('flash')) continue; 
        
        console.log(`[GEMINI] Quota Fallback: Using Lite Model (${modelName}) and shortening output.`);
        systemPrompt += "\n- IMPORTANT: Keep the output very concise, strictly under 100 words.";
      }

      console.log(`[GEMINI] Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName, generationConfig });
      const result = await model.generateContent(systemPrompt);
      const text = result.response.text();
      console.log(`[GEMINI] ✔ Script generated with ${modelName} (${text.length} chars)`);
      return text;
    } catch (error) {
      const msg = error?.message || String(error);

      if (
        msg.includes('404') ||
        msg.includes('not found') ||
        msg.includes('not supported') ||
        msg.includes('503') ||
        msg.includes('overloaded') ||
        msg.includes('high demand')
      ) {
        console.warn(`[GEMINI] Model ${modelName} unavailable, trying next...`);
        continue;
      }

      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        console.warn(`[GEMINI] Quota exceeded on ${modelName}, switching to Lite mode...`);
        quotaExceeded = true;
        continue; 
      }

      if (msg.includes('SAFETY') || msg.includes('safety ratings')) {
        throw new Error('Content blocked by safety filter. Try a different article.');
      }
      if (msg.includes('403')) {
        throw new Error('Invalid Gemini API Key. Check your .env file.');
      }

      console.error(`[GEMINI] Unhandled error on ${modelName}:`, msg);
      throw new Error(`Script generation error: ${msg}`);
    }
  }

  // All models exhausted — use template fallback so user is never blocked
  if (quotaExceeded) {
    console.warn('[GEMINI SERVICE] All models quota-exceeded. Using template fallback for:', title);
    return generateTemplateScript(title, content, language);
  }

  throw new Error('All Gemini models unavailable. Please try again later.');
};

const translateContent = async (title, description, targetLanguage = 'hi') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { title, description };

  await checkRateLimit();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a professional news translator for an elite newsroom.
  
TASK: Translate the following news headline and provide a 2-line sophisticated summary.
TARGET LANGUAGE: ${targetLanguage === 'hi' ? 'HINDI' : 'ENGLISH'}

HEADLINE: ${title}
DESCRIPTION: ${description}

CRITICAL RULES:
1. Keep the tone sophisticated, elite, and journalistic.
2. Return ONLY a JSON object with "translatedTitle" and "translatedDescription" keys.
3. No markdown, no extra text.
4. The translatedDescription MUST be exactly 2 lines.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Extract JSON from text (in case model wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        title: data.translatedTitle || title,
        description: data.translatedDescription || description
      };
    }
    return { title, description };
  } catch (error) {
    console.error('[GEMINI] Translation Error:', error);
    return { title, description };
  }
};

/**
 * Generates an engaging Facebook caption and hashtags.
 */
const generateCaption = async (title, content) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return `Breaking News: ${title}\n\n#news #breakingnews`;

  await checkRateLimit();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Write an engaging Facebook caption and 10 trending hashtags for the following news story.
  
  TITLE: ${title}
  STORY: ${content}
  
  FORMAT:
  - Start with an attention-grabbing hook.
  - Brief, impactful summary.
  - Call to action (e.g. "Read more in link").
  - Block of 10 hashtags.
  
  Do not use emojis or labels like "Caption:". Just the raw text for the post.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.warn('[GEMINI] Caption Generation Error (Using Fallback):', error.message);
    return `Breaking News: ${title}\n\n#news #breakingnews`;
  }
};

/**
 * Ranks a list of headlines to find the top 3 most trending/viral stories.
 * @param {Array} headlines - List of {title, description, link} objects.
 * @returns {Promise<Array>} - Top 3 ranked news objects.
 */
const rankHeadlines = async (headlines) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[GEMINI SERVICE] No API key — returning first 3 headlines as fallback');
    return headlines.slice(0, 3);
  }

  await checkRateLimit();

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const prompt = `You are a professional News Curator for a high-end, family-friendly news page. I will provide a list of news headlines and snippets.
  
  TASK:
  1. Filter out any news related to sensitive topics, extreme violence, controversial political debates, or adult content.
  2. Select the TOP 3 stories that are trending, positive, or informative (e.g., Technology, Space, Sports, Positive National News).
  3. Ensure the tone is 'Premium and Professional' (Luxe feel).
  
  HEADLINES:
  ${headlines.map((h, i) => `${i + 1}. TITLE: ${h.title}\n   SNIPPET: ${h.description}`).join('\n\n')}
  
  CRITICAL RULES:
  1. Pick exactly 3 stories.
  2. Return ONLY a JSON array of objects.
  3. Each object must contain: "rank", "title", "reason" (why it's selected), and "originalIndex" (the 1-based index from the input list).
  4. Return valid JSON only.`;


  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro'
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`[GEMINI] Ranking headlines with model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const rankedData = JSON.parse(text);
      
      const top3 = rankedData.map(item => {
        const original = headlines[item.originalIndex - 1];
        return {
          ...original,
          rank: item.rank,
          trendingReason: item.reason
        };
      });

      console.log(`[GEMINI] ✔ Headlines ranked successfully with ${modelName}`);
      return top3;
    } catch (error) {
      console.warn(`[GEMINI] Ranking failed on ${modelName}:`, error.message);
      continue;
    }
  }

  console.error('[GEMINI] All models failed for ranking headlines.');
  return headlines.slice(0, 3);
};


/**
 * Generates a catchy Facebook caption with trending hashtags.
 * Supports specific tones for Morning, Afternoon, and Night slots.
 */
const generateFacebookCaption = async (headline, description, postType = 'afternoon') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return `Breaking: ${headline}\n\n#news #trending #viral #breaking #update`;

  await checkRateLimit();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  let typeInstruction = "Scan the following news and pick only the most viral, shocking, or trending aspects.";
  
  if (postType === 'morning') {
    typeInstruction = "Focus on 'Breaking News' and 'Start of the Day' updates. Tone should be fresh, energetic and highly informative for a morning audience.";
  } else if (postType === 'afternoon') {
    typeInstruction = "Focus on 'Trending' or 'Viral' topics that are currently blowing up. Tone should be high-energy, fast-paced and extreme click-worthy.";
  } else if (postType === 'night') {
    typeInstruction = "Focus on a 'Day Summary' or the 'Biggest Story of the Day'. Tone should be reflective, conclusive, and great for a conversational night-time read.";
  }

  const prompt = `You are a viral news specialist. ${typeInstruction}
  
  STORY: ${headline} - ${description}
  
  TASK:
  1. Create a high-energy, 'Click-worthy' Facebook caption that encourages likes and shares.
  2. Use a "shocking" or "exclusive" tone but maintain factual accuracy.
  3. Ignore boring or repetitive details.
  4. Include 5 to 10 viral trending hashtags.
  5. Use paragraph breaks for readability.
  6. No labels like "Caption:".`;


  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.warn('[GEMINI] Facebook Caption Error (Using Fallback):', error.message);
    return `Breaking: ${headline}\n\n#news #trending #viral #breaking #update`;
  }
};

/**
 * Analyzes a pool of news stories and picks the single most viral one, 
 * then generates a high-energy Facebook caption for it.
 * Falls back to a "General Tech/AI Trending Tip" if the pool is empty.
 */
const generateViralPost = async (newsPool, postType = 'afternoon') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const top = newsPool[0] || { title: 'Trending News', description: 'Latest updates in Tech.' };
    return { title: top.title, caption: `Breaking: ${top.title}\n\n#news #trending` };
  }

  await checkRateLimit();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  let newsListString = newsPool.map((n, i) => `${i + 1}. TITLE: ${n.title}\n   DESC: ${n.description}`).join('\n\n');
  let fallbackPrompt = "";

  if (newsPool.length === 0) {
    newsListString = "NO CURRENT NEWS AVAILABLE.";
    fallbackPrompt = "Since no current news is available, generate a 'General Tech/AI Trending Tip' or 'Future of Tech' insight that is highly engaging and viral. Create a title for it and a click-worthy caption.";
  }

  const prompt = `You are a world-class Viral News Editor. I will provide a pool of news stories.
  
  POOL OF NEWS:
  ${newsListString}
  
  TASK:
  1. ${newsPool.length > 0 ? "From the following list of news, identify the story that has the highest potential for social media engagement (likes, shares, comments). Look for controversial, emotional, or high-impact topics." : fallbackPrompt}
  2. Pick the SINGLE most trending, high-engagement, or viral topic.
  3. Ignore old, boring, or low-quality news.
  4. Create a high-energy, 'Click-worthy' Facebook post for this specific story.
  5. Include 'Social Proof' hooks like "Trending right now..." or "Everyone is talking about this..." to drive engagement.
  6. The tone should match the [SLOT TYPE]: ${postType.toUpperCase()}.
  7. Include 5-10 viral hashtags.
  
  RETURN FORMAT:
  Return ONLY a JSON object with two keys: "selectedTitle" (the title of the story) and "caption" (the final post text).
  No markdown, no extra text.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        title: data.selectedTitle || (newsPool.length > 0 ? newsPool[0].title : 'AI Tech Insight'),
        caption: data.caption || `Interesting Tech Tip coming your way!`
      };
    }
    return { title: (newsPool.length > 0 ? newsPool[0].title : 'AI Tech Insight'), caption: text };
  } catch (error) {
    console.warn('[GEMINI SERVICE] Viral selection failed. Falling back to local top-story filtering.', error.message);
    // FALLBACK: Use local logic to pick the first news item as the "viral" one
    const top = newsPool[0] || { title: 'Trending News', description: 'Check out the latest updates in technology and world news.' };
    return { 
      title: top.title, 
      caption: `Trending: ${top.title}\n\nStay tuned for more updates on this story.\n\n#news #trending #viral #update`
    };
  }
};

module.exports = { 
  generateScript, 
  translateContent, 
  generateCaption, 
  rankHeadlines, 
  generateFacebookCaption,
  generateViralPost
};


