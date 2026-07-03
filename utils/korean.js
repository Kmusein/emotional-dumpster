const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const JONGSEONG_COUNT = 28;

function hasFinalConsonant(word) {
  if (!word) return false;
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_BASE || code > HANGUL_LAST) return false;
  return (code - HANGUL_BASE) % JONGSEONG_COUNT !== 0;
}

export function getObjectParticle(word) {
  return hasFinalConsonant(word) ? '을' : '를';
}
