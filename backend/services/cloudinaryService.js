const path = require('path');
// Guard: ensure .env is loaded no matter which file requires this service first
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const cloudinary = require('cloudinary').v2;

// Validate credentials before configuring
const CLOUD_NAME   = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY      = process.env.CLOUDINARY_API_KEY;
const API_SECRET   = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || CLOUD_NAME === 'Root') {
  console.error('[CLOUDINARY] ❌ Invalid CLOUDINARY_CLOUD_NAME. Check your .env file. Got:', CLOUD_NAME);
} else {
  console.log(`[CLOUDINARY] ✔ Configured with cloud: ${CLOUD_NAME}`);
}

// Configure Cloudinary from .env
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key:    API_KEY,
  api_secret: API_SECRET,
  secure:     true
});

/**
 * Sanitises headline text for Cloudinary overlay (escapes special chars)
 */
const sanitiseText = (text = '') =>
  text
    .slice(0, 80)                        // cap at 80 chars to avoid overflow
    .replace(/[^a-zA-Z0-9 ,.!?'-]/g, '') // strip unsupported chars
    .trim();

/**
 * Uploads a news image to Cloudinary and applies:
 *  – 1200×630 crop (Facebook OG ideal)
 *  – Semi-transparent black bar at the bottom
 *  – Headline in silver (rgb:D4D4D4) over the bar
 *  – BREAKING NEWS badge in red at the top
 *  – "THE NEURAL TIMES" branding watermark bottom-right
 *
 * @param {string} headline        – News headline text
 * @param {string|null} localPath  – Local file path (from multer) or null
 * @param {string|null} remoteUrl  – Remote image URL or null
 * @returns {Promise<string>}      – Final Cloudinary URL
 */
async function createNewsImage(headline, localPath = null, remoteUrl = null) {
  try {
    // ── 1. Determine upload source ──────────────────────────────────────────
    let source = localPath || remoteUrl;

    if (!source) {
      // Fallback: keyword-based Unsplash image
      const keywords = encodeURIComponent(
        headline.split(' ').slice(0, 4).join(',')
      );
      source = `https://source.unsplash.com/1200x800/?${keywords},news`;
    }

    console.log(`[CLOUDINARY] Uploading image for: "${headline}"`);

    // ── 2. Upload raw image ─────────────────────────────────────────────────
    const upload = await cloudinary.uploader.upload(source, {
      folder:     'neural_times',
      public_id:  `nt_${Date.now()}`,
      overwrite:  true,
      resource_type: 'image'
    });

    const publicId = upload.public_id;
    const safe      = sanitiseText(headline);

    // ── 3. Build transformation layers ─────────────────────────────────────
    const transformedUrl = cloudinary.url(publicId, {
      secure: true,
      transformation: [

        // Base crop – Facebook recommended 1200x630
        {
          width: 1200, height: 630,
          crop: 'fill', gravity: 'auto',
          quality: 'auto', fetch_format: 'auto'
        },

        // ── Layer 1: Dark gradient bar at the bottom (height ~180px) ──
        {
          overlay: {
            font_family: 'Arial', font_size: 1,
            text: '.'          // Cloudinary needs text for colour-fill layers
          },
          width: 1200, height: 180,
          background: 'rgb:000000',
          opacity: 75,
          gravity: 'south',
          y: 0,
          x: 0,
          crop: 'fill'
        },

        // ── Layer 2: BREAKING NEWS badge (top-left red chip) ──
        {
          overlay: {
            font_family: 'Arial',
            font_size: 28,
            font_weight: 'bold',
            text: '%E2%80%A2 BREAKING NEWS'  // bullet + text (URL-encoded)
          },
          color:      'white',
          background: 'rgb:CC0000',
          gravity:    'north_west',
          x: 40, y: 30,
          padding:    '10',
          radius:     8
        },

        // ── Layer 3: Silver headline text over the bottom bar ──
        {
          overlay: {
            font_family: 'Arial',
            font_size:   44,
            font_weight: 'bold',
            text:        encodeURIComponent(safe),
            text_align:  'left'
          },
          color:   'rgb:D4D4D4',   // Silver
          gravity: 'south_west',
          x: 40, y: 80,
          width:   1100,
          crop:    'fit'
        },

        // ── Layer 4: "THE NEURAL TIMES" branding (bottom-right) ──
        {
          overlay: {
            font_family: 'Arial',
            font_size:   22,
            font_weight: 'bold',
            text:        'THE NEURAL TIMES'
          },
          color:   'rgb:888888',
          gravity: 'south_east',
          x: 40, y: 20,
          opacity: 80
        }
      ]
    });

    console.log(`[CLOUDINARY] ✔ Transformed URL: ${transformedUrl}`);
    return transformedUrl;

  } catch (error) {
    console.error('[CLOUDINARY ERROR]', error.message || error);
    throw new Error(`Cloudinary processing failed: ${error.message}`);
  }
}

/**
 * Generates a Cloudinary URL from an already-uploaded publicId,
 * re-applying the Neural Times overlay stack.
 *
 * @param {string} publicId   – Cloudinary public_id
 * @param {string} headline   – Headline to overlay
 * @returns {string}          – Transformed URL
 */
function applyOverlayToExisting(publicId, headline) {
  const safe = sanitiseText(headline);
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
      { overlay: { font_family: 'Arial', font_size: 1, text: '.' },
        width: 1200, height: 180, background: 'rgb:000000', opacity: 75,
        gravity: 'south', y: 0, crop: 'fill' },
      { overlay: { font_family: 'Arial', font_size: 44, font_weight: 'bold',
          text: encodeURIComponent(safe) },
        color: 'rgb:D4D4D4', gravity: 'south_west', x: 40, y: 80,
        width: 1100, crop: 'fit' },
      { overlay: { font_family: 'Arial', font_size: 22, font_weight: 'bold',
          text: 'THE NEURAL TIMES' },
        color: 'rgb:888888', gravity: 'south_east', x: 40, y: 20, opacity: 80 }
    ]
  });
}

module.exports = { createNewsImage, applyOverlayToExisting };
