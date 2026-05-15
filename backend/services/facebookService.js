const axios = require('axios');
const AdminConfig = require('../models/AdminConfig');

const FB_GRAPH_V = 'v20.0';

/**
 * Gets credentials from DB or fallback to ENV
 */
const getCredentials = async () => {
  try {
    const config = await AdminConfig.findOne();
    const token = config?.facebookToken || process.env.FB_ACCESS_TOKEN;
    const pageId = config?.facebookPageId || process.env.FB_PAGE_ID;
    return { token, pageId };
  } catch (error) {
    return { token: process.env.FB_ACCESS_TOKEN, pageId: process.env.FB_PAGE_ID };
  }
};

/**
 * Verifies that the Page Access Token belongs to the configured Page ID.
 */
async function verifyToken() {
  const { token, pageId } = await getCredentials();

  if (!token || !pageId) {
    console.error('[FACEBOOK] ❌ FB Credentials missing in DB or ENV');
    return { valid: false };
  }

  try {
    const { data } = await axios.get(`https://graph.facebook.com/${FB_GRAPH_V}/me`, {
      params: { access_token: token, fields: 'id,name' }
    });

    const valid = data.id === pageId;
    if (valid) {
      console.log(`[FACEBOOK] ✔ Token valid for page: "${data.name}" (ID: ${data.id})`);
    } else {
      console.error(`[FACEBOOK] ⚠️ Mismatch! Token is for ${data.id} but configured ID is ${pageId}`);
    }
    return { pageId: data.id, pageName: data.name, valid };
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    console.error('[FACEBOOK] ❌ Verification failed:', msg);
    return { valid: false, error: msg };
  }
}

/**
 * Posts Image + Caption
 */
async function publishToFacebook(imageUrl, caption) {
  const { token, pageId } = await getCredentials();

  if (!token || !pageId) throw new Error('Facebook credentials missing.');

  console.log(`[FACEBOOK] Posting to Page ID: ${pageId}`);

  try {
    const endpoint = `https://graph.facebook.com/${FB_GRAPH_V}/${pageId}/photos`;
    const response = await axios.post(endpoint, {
      url: imageUrl,
      message: caption,
      access_token: token
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    throw new Error(`[FACEBOOK] Photo post failed: ${msg}`);
  }
}

/**
 * Posts Text + Link
 */
async function publishTextPost(message, link = null) {
  const { token, pageId } = await getCredentials();

  if (!token || !pageId) throw new Error('Facebook credentials missing.');

  const payload = { message, access_token: token };
  if (link) payload.link = link;

  try {
    const endpoint = `https://graph.facebook.com/${FB_GRAPH_V}/${pageId}/feed`;
    const response = await axios.post(endpoint, payload);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    throw new Error(`[FACEBOOK] Text post failed: ${msg}`);
  }
}

module.exports = { publishToFacebook, publishTextPost, verifyToken };
