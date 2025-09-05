// src/createEmotionCache.js
import createCache from '@emotion/cache';

export default function createEmotionCache() {
  let insertionPoint;

  if (typeof document !== 'undefined') {
    const el = document.querySelector('meta[name="emotion-insertion-point"]');
    insertionPoint = el ?? undefined;
  }

  // key 'mui' o 'css' funciona; prepend asegura orden predecible
  return createCache({ key: 'mui', insertionPoint, prepend: true });
}