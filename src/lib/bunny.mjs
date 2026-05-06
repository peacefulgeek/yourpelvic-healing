/**
 * Bunny CDN — The Pelvic Floor
 * Storage zone: pelvic-healing | Pull zone: pelvic-healing.b-cdn.net
 * Credentials hardcoded per §9 (safe per site scope)
 */
import https from 'https';

const BUNNY_STORAGE_ZONE = 'pelvic-healing';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || '703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c';
const BUNNY_STORAGE_ENDPOINT = 'ny.storage.bunnycdn.com';
export const BUNNY_PULL_ZONE = 'https://pelvic-healing.b-cdn.net';

export async function uploadToBunny(remotePath, buffer, contentType = 'image/webp') {
  return new Promise((resolve, reject) => {
    const cleanPath = remotePath.replace(/^\//, '');
    const options = {
      method: 'PUT',
      hostname: BUNNY_STORAGE_ENDPOINT,
      path: `/${BUNNY_STORAGE_ZONE}/${cleanPath}`,
      headers: {
        AccessKey: BUNNY_API_KEY,
        'Content-Type': contentType,
        'Content-Length': buffer.length,
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, path: cleanPath, url: `${BUNNY_PULL_ZONE}/${cleanPath}` });
        } else {
          reject(new Error(`Bunny upload failed: ${res.statusCode} ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

export async function deleteFromBunny(remotePath) {
  return new Promise((resolve, reject) => {
    const cleanPath = remotePath.replace(/^\//, '');
    const options = {
      method: 'DELETE',
      hostname: BUNNY_STORAGE_ENDPOINT,
      path: `/${BUNNY_STORAGE_ZONE}/${cleanPath}`,
      headers: { AccessKey: BUNNY_API_KEY },
    };
    const req = https.request(options, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 300);
    });
    req.on('error', reject);
    req.end();
  });
}

export function getArticleImageUrl(slug) {
  return `${BUNNY_PULL_ZONE}/images/${slug}.webp`;
}

export function getOgImageUrl(slug) {
  return `${BUNNY_PULL_ZONE}/images/og-${slug}.webp`;
}

export function getDefaultOgUrl() {
  return `${BUNNY_PULL_ZONE}/images/og-default.webp`;
}

export const FONT_URLS = {
  crimsonProBold: `${BUNNY_PULL_ZONE}/fonts/CrimsonPro-Bold.woff2`,
  crimsonProSemiBold: `${BUNNY_PULL_ZONE}/fonts/CrimsonPro-SemiBold.woff2`,
  crimsonProRegular: `${BUNNY_PULL_ZONE}/fonts/CrimsonPro-Regular.woff2`,
  nunitoSans: `${BUNNY_PULL_ZONE}/fonts/NunitoSans-Regular.woff2`,
  nunitoSansMedium: `${BUNNY_PULL_ZONE}/fonts/NunitoSans-Medium.woff2`,
  dmSans: `${BUNNY_PULL_ZONE}/fonts/DMSans-Regular.woff2`,
  dmSansMedium: `${BUNNY_PULL_ZONE}/fonts/DMSans-Medium.woff2`,
};
