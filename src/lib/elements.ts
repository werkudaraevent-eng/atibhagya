/**
 * The five elements — Panca Mahabhuta — as the catalogue's second axis.
 *
 * Bali and Java know five, not four: earth (pertiwi), water (apah), fire
 * (teja), air (bayu) and space (akasa). Every experience carries one: a
 * fire ceremony, a river purification, a sound bath, a silent sit. It is
 * set per product in the CMS; the import guesses it from the catalogue
 * text, and a category stands in when nothing else does, so nothing is
 * ever without one.
 */

export const ELEMENTS = ['earth', 'water', 'fire', 'air', 'ether'] as const
export type Element = (typeof ELEMENTS)[number]

export const isElement = (value: unknown): value is Element =>
  typeof value === 'string' && (ELEMENTS as readonly string[]).includes(value)

/** What each category's experiences are, by default. */
export const CATEGORY_ELEMENT: Record<string, Element> = {
  'rituals-ceremony': 'fire',
  'healing-sound': 'air',
  'yoga-movement': 'air',
  'spa-retreats': 'water',
  'nature-nourishment': 'earth',
  'art-culture': 'earth',
}

/**
 * Words that place an experience with an element. English catalogue text
 * plus the Balinese and Sanskrit names the brochure uses. Word-bounded, so
 * "fire" does not match "firefly" and "air" is not read inside "hair".
 */
const CUES: Record<Element, string[]> = {
  fire: ['fire', 'agni', 'hotra', 'flame', 'candle', 'lantern', 'sun', 'sunrise', 'sunset', 'warmth', 'heat', 'sauna'],
  water: ['water', 'tirta', 'melukat', 'river', 'spring', 'waterfall', 'sea', 'ocean', 'lake', 'bath', 'bathing', 'spa', 'pool', 'float', 'floating', 'rain', 'hot spring', 'purification'],
  earth: ['earth', 'soil', 'forest', 'garden', 'rice', 'terrace', 'walk', 'walking', 'hike', 'trek', 'farm', 'herb', 'herbal', 'jamu', 'clay', 'craft', 'batik', 'weaving', 'cook', 'cooking', 'food', 'nourish', 'harvest', 'plant', 'tree', 'stone', 'cloth', 'pottery', 'grounding'],
  air: ['breath', 'breathing', 'pranayama', 'sound', 'gong', 'chant', 'chanting', 'mantra', 'singing', 'song', 'yoga', 'movement', 'dance', 'wind', 'voice', 'bell', 'bowl', 'flute', 'gamelan'],
  ether: ['meditation', 'meditate', 'silence', 'silent', 'stillness', 'mindful', 'mindfulness', 'sleep', 'yoga nidra', 'nidra', 'moon', 'moonlight', 'star', 'stargazing', 'dream', 'reflection', 'awareness', 'presence'],
}

/** The element the text points to; the category's when it points nowhere. */
export function guessElement(text: string, categorySlug?: string): Element {
  const haystack = ` ${text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ')} `
  const scores = ELEMENTS.map((element) => ({
    element,
    score: CUES[element].reduce(
      (n, cue) => n + (haystack.includes(` ${cue} `) ? (cue.includes(' ') ? 2 : 1) : 0),
      0,
    ),
  }))
  const best = scores.reduce((a, b) => (b.score > a.score ? b : a))
  if (best.score > 0) return best.element
  return (categorySlug && CATEGORY_ELEMENT[categorySlug]) || 'earth'
}

/**
 * The marks: single stroke, one family with the wordmark's wave. Fire is
 * three rising flames, water three waves, earth three peaks, air three
 * lines, and space a circle around a point.
 */
export const ELEMENT_PATHS: Record<Element, { viewBox: string; d: string[] }> = {
  fire: {
    viewBox: '0 0 24 24',
    d: [
      'M6 21c-2.5-3 0-6 0-9s-2.5-6 0-9',
      'M12 21c-2.5-3 0-6 0-9s-2.5-6 0-9',
      'M18 21c-2.5-3 0-6 0-9s-2.5-6 0-9',
    ],
  },
  water: {
    viewBox: '0 0 24 24',
    d: [
      'M3 6c3-2.5 6-2.5 9 0s6 2.5 9 0',
      'M3 12c3-2.5 6-2.5 9 0s6 2.5 9 0',
      'M3 18c3-2.5 6-2.5 9 0s6 2.5 9 0',
    ],
  },
  earth: {
    viewBox: '0 0 24 24',
    d: ['M3 8l4.5-4 4.5 4 4.5-4L21 8', 'M3 14l4.5-4 4.5 4 4.5-4 4.5 4', 'M3 20l4.5-4 4.5 4 4.5-4 4.5 4'],
  },
  air: {
    viewBox: '0 0 24 24',
    d: ['M3 6h18', 'M3 12h18', 'M3 18h18'],
  },
  ether: {
    viewBox: '0 0 24 24',
    d: ['M12 3a9 9 0 1 0 0.01 0', 'M12 11.2a0.8 0.8 0 1 0 0.01 0'],
  },
}
