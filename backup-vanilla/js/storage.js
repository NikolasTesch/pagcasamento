const STORAGE_KEY = 'cadife_wedding_gifted';

function markGifted(giftId) {
  const gifted = getAllGifted();
  gifted[giftId] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gifted));
}

function isGifted(giftId) {
  return !!getAllGifted()[giftId];
}

function getAllGifted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
