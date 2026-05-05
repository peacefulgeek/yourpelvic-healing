// HARDCODE per site. DO NOT move these to env vars.
const BUNNY_STORAGE_ZONE = 'pelvic-floor';
const BUNNY_API_KEY      = 'BUNNY_KEY_PLACEHOLDER';  // Paul will provide
const BUNNY_PULL_ZONE    = 'https://pelvic-floor.b-cdn.net';
const BUNNY_HOSTNAME     = 'ny.storage.bunnycdn.com';

/**
 * Pick a random library image, copy it to /images/{slug}.webp, return the public URL.
 * Falls back to the library URL itself if the copy upload fails.
 */
export async function assignHeroImage(slug) {
  const idx = String(Math.floor(Math.random() * 40) + 1).padStart(2, '0');
  const sourceFile = `lib-${idx}.webp`;
  const destFile   = `${slug}.webp`;

  try {
    const sourceUrl = `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
    const downloadRes = await fetch(sourceUrl);
    if (!downloadRes.ok) throw new Error(`download ${downloadRes.status}`);
    const imageBuffer = await downloadRes.arrayBuffer();

    const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/images/${destFile}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'image/webp' },
      body: imageBuffer,
    });
    if (!uploadRes.ok) throw new Error(`upload ${uploadRes.status}`);
    return `${BUNNY_PULL_ZONE}/images/${destFile}`;
  } catch (err) {
    console.warn(`[bunny.assignHeroImage] copy failed (${err.message}), falling back to library URL`);
    return `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
  }
}

/**
 * Upload an arbitrary WebP buffer to a target path under the storage zone.
 */
export async function uploadWebP(targetPath, buffer) {
  const url = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${targetPath.replace(/^\//, '')}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'image/webp' },
    body: buffer,
  });
  if (!res.ok) throw new Error(`bunny upload ${res.status} for ${targetPath}`);
  return `${BUNNY_PULL_ZONE}/${targetPath.replace(/^\//, '')}`;
}

export function getBunnyPullZone() {
  return BUNNY_PULL_ZONE;
}

export function getLibraryImageUrl(index) {
  const idx = String(index).padStart(2, '0');
  return `${BUNNY_PULL_ZONE}/library/lib-${idx}.webp`;
}

export function getArticleImageUrl(slug) {
  return `${BUNNY_PULL_ZONE}/images/${slug}.webp`;
}

// Font URLs on Bunny CDN
export const FONT_URLS = {
  crimsonProBold: `${BUNNY_PULL_ZONE}/fonts/CrimsonPro-Bold.woff2`,
  crimsonProSemiBold: `${BUNNY_PULL_ZONE}/fonts/CrimsonPro-SemiBold.woff2`,
  crimsonProRegular: `${BUNNY_PULL_ZONE}/fonts/CrimsonPro-Regular.woff2`,
  nunitoSans: `${BUNNY_PULL_ZONE}/fonts/NunitoSans-Regular.woff2`,
  nunitoSansMedium: `${BUNNY_PULL_ZONE}/fonts/NunitoSans-Medium.woff2`,
  dmSans: `${BUNNY_PULL_ZONE}/fonts/DMSans-Regular.woff2`,
  dmSansMedium: `${BUNNY_PULL_ZONE}/fonts/DMSans-Medium.woff2`,
};
