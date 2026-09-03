import type {
  AboutContent,
  HomeContent,
  Journey,
  Product,
  ProductCategory,
  SiteContent,
  Venue,
} from './types'

/**
 * The approved copy, in English.
 *
 * Wording comes from the internal content master in `refference/`; structure
 * comes from the wireframe and ERD. This file is both the seed source and the
 * fallback the site renders from when a CMS field is empty — so the site is
 * never blank, and editors always start from approved language.
 *
 * Two rules the content master sets, kept here deliberately:
 *   - No prices, package durations or group minimums. Those are on its
 *     "confirm before publishing" list.
 *   - No medical, therapeutic or health-outcome claims.
 *
 * Photography is Creative Commons placeholder work from Wikimedia Commons, and
 * deliberately shows no people. The content master asks that living traditions
 * are not treated as decorative props, and a documentary photograph of named
 * strangers at worship is exactly that when it is used as brand furniture.
 *
 * Products carry no default photograph at all. Repeating one product's picture
 * across seventy others misrepresents the catalogue; an empty panel says
 * plainly that the photography is still to come.
 */
const wm = (file: string, width: number) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`

const img = (file: string, width: number, alt: string, credit = 'Wikimedia Commons') => ({
  src: wm(file, width),
  alt,
  credit,
  creditUrl: commons(file),
})

export const siteEn: SiteContent = {
  email: 'hello@atibhagya.com',
  phone: '+62 811 0000 000',
  whatsapp: 'https://wa.me/628110000000',
  whatsappLabel: 'WhatsApp',
  address: 'Yogyakarta, Indonesia',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/atibhagya' },
    { label: 'YouTube', href: 'https://youtube.com/@atibhagya' },
  ],
  footerTagline: 'Wellbeing, rooted\nin place and presence.',
  footerLegal: '© 2026 Atibhagya. All rights reserved.',
  parentBrand: 'Werkudara Group',
  responseTime: 'within two working days',
}

export const homeEn: HomeContent = {
  meta: {
    title: 'Atibhagya — Wellbeing, rooted in Indonesia',
    description:
      'Atibhagya curates wellness experiences rooted in Indonesian wisdom, bringing together nature, mindful practices, cultural traditions, and contemporary hospitality.',
  },
  hero: {
    eyebrow: 'Atibhagya · Indonesia',
    headline: 'Wellness, rooted\nin place and presence.',
    statement:
      'Discover a more meaningful way to experience wellbeing through the living wisdom of Indonesia.',
    ctaLabel: 'Explore our experiences',
    image: img('Pura%20Ulun%20Danu%20Bratan%2C%202022.jpg', 1920, 'A temple at the water’s edge at dawn', 'Wikimedia Commons · CC BY-SA'),
    darken: 0.35,
  },
  why: {
    eyebrow: 'Why Atibhagya',
    headline: 'A quieter way to design wellness.',
    body: 'Calm, grounded, cultured, and flexible across private, group, and corporate needs. We believe wellbeing is not found in one treatment or one moment — it is shaped through a series of intentional experiences.',
    pillars: [
      {
        title: 'Nature',
        body: 'Nature is not a backdrop. It changes the pace of an experience, invites movement and presence, and creates the conditions for reflection and renewal.',
      },
      {
        title: 'Stillness',
        body: 'Mindfulness, reflection, and intentional practice create room to listen inward, find clarity, and return to a more balanced state.',
      },
      {
        title: 'Cultural wisdom',
        body: 'Indonesian traditions and local wisdom are treated as living knowledge — experienced with context, respect, and relevance for life today.',
      },
    ],
  },
  featured: {
    eyebrow: 'Selected experiences',
    headline: 'Featured experiences',
  },
  cta: {
    headline: 'Design a wellness journey.',
    body: 'Tell us the purpose of the journey and we will shape the rest around it — for one guest, a private group, or a whole organisation.',
    label: 'Start a conversation',
    image: img('Tegallalang_Rice_Terraces_Bali_1.jpg', 1920, 'Terraces stretching into the mist', 'Wikimedia Commons · CC BY 4.0'),
  },
}

export const aboutEn: AboutContent = {
  meta: {
    title: 'About · Atibhagya',
    description:
      'Atibhagya is a wellness experience brand inspired by the living wisdom of Indonesia.',
  },
  eyebrow: 'About Atibhagya',
  headline: 'A thoughtful way\nto experience wellness.',
  lede: 'Rooted in culture and nature, designed with contemporary restraint.',
  body: [
    'Atibhagya is a wellness experience brand inspired by the living wisdom of Indonesia. We design journeys that help people slow down, restore balance, and reconnect — with themselves, with others, and with the places they visit.',
    'Our experiences bring together traditional wellness practices, mindfulness, movement, nature, cultural encounters, creative expression, nourishing experiences, and contemporary hospitality. Each element is selected with purpose, then shaped into a journey that feels coherent rather than a collection of activities.',
    'Whether the occasion is personal renewal, a private group retreat, a corporate gathering, or an incentive journey, Atibhagya creates space for wellbeing to become something experienced, shared, and remembered.',
  ],
  image: img('Le_Meridien_Nirwana_Bali_Villa_private_pavilion_(2926076811).jpg', 1600, 'A garden pavilion open to the trees', 'Wikimedia Commons · CC BY-SA 2.0'),
  statement:
    'Not simply time away, but a thoughtful return to balance.',
  values: [
    { title: 'Calm', caption: 'space before decoration' },
    { title: 'Clarity', caption: 'simple hierarchy' },
    { title: 'Care', caption: 'human and grounded' },
  ],
  ctaHeadline: 'Tell us what you need.',
  ctaLabel: 'Talk to our team',
}

/** Mirrors the six categories the catalogue import creates. */
export const categoriesEn: ProductCategory[] = [
  { id: 'rituals-ceremony', slug: 'rituals-ceremony', name: 'Rituals & Ceremony' },
  { id: 'healing-sound', slug: 'healing-sound', name: 'Healing & Sound' },
  { id: 'yoga-movement', slug: 'yoga-movement', name: 'Yoga & Movement' },
  { id: 'spa-retreats', slug: 'spa-retreats', name: 'Spa & Retreats' },
  { id: 'nature-nourishment', slug: 'nature-nourishment', name: 'Nature & Nourishment' },
  { id: 'art-culture', slug: 'art-culture', name: 'Art & Culture' },
]

export const venuesEn: Venue[] = [
  { id: 'om-ham', name: 'Om Ham Resort' },
  { id: 'anand-ashram', name: 'Anand Ashram' },
  { id: 'five-element', name: 'Five Element Wellness' },
  { id: 'pyramid-of-chi', name: 'Pyramid of Chi Wellness' },
  { id: 'bali-silent-retreat', name: 'Bali Silent Retreat' },
]

const cat = (slug: string) => categoriesEn.find((c) => c.slug === slug)

export const productsEn: Product[] = [
  {
    id: 'agni-hotra',
    slug: 'agni-hotra',
    title: 'Agni Hotra',
    subtitle: 'Fire Blessing Ritual',
    description:
      'Ceremonial fire ritual where unwanted energy or intentions are offered into sacred fire for transformation. Guests meditate in the ceremonial fire space while the priest chants mantras and rings the bell, offering grain and food into the flames to release mental blockages.',
    highlightText:
      'Releases unwanted energy and aspects, and helps manifest new intentions. Balances energy, voice and mind.',
    durationText: '60 minutes',
    facilities: ['Offering ritual', 'Traditional cloth', 'Eye pillow'],
    suitableFor: ['solo', 'group', 'corporate'],
    element: 'fire',
    whatToExpect:
      'The ritual is prepared and led in its own cultural context. Guests are guided through the offering, the fire, and a period of quiet afterwards.',
    category: cat('rituals-ceremony'),
    venues: venuesEn,
    facilitators: [],
    heroImage: { alt: 'Photography to come' },
    gallery: [],
    featured: true,
  },
  {
    id: 'javanese-ritual-spa',
    slug: 'javanese-ritual-spa',
    title: 'Javanese Ritual Spa',
    subtitle: 'Ancient spa tradition',
    description:
      'An authentic Javanese ritual spa sequence, drawn from court traditions and delivered with the care of a practice rather than a treatment menu.',
    highlightText: 'Care as a tradition, not a service.',
    facilities: ['Herbal preparations', 'Traditional cloth'],
    suitableFor: ['solo', 'couple', 'group'],
    element: 'water',
    category: cat('spa-retreats'),
    venues: [],
    facilitators: [],
    heroImage: { alt: 'Photography to come' },
    gallery: [],
    featured: true,
  },
  {
    id: 'javanese-meditation',
    slug: 'javanese-meditation',
    title: 'Javanese Meditation',
    subtitle: 'Guided stillness',
    description:
      'A guided meditation practice held in the Javanese tradition, making room to listen inward and return to a more balanced state.',
    highlightText: 'Room to listen inward.',
    facilities: ['Guided session'],
    suitableFor: ['solo', 'group', 'corporate'],
    element: 'ether',
    category: cat('rituals-ceremony'),
    venues: [],
    facilitators: [],
    heroImage: { alt: 'Photography to come' },
    gallery: [],
    featured: true,
  },
  {
    id: 'traditional-cleansing-ritual',
    slug: 'traditional-cleansing-ritual',
    title: 'Traditional Cleansing Ritual',
    subtitle: 'Water and intention',
    description:
      'A cleansing rite held as it has been held for generations, with its cultural context explained rather than decorated.',
    highlightText: 'Held, not performed.',
    facilities: ['Offering ritual', 'Traditional cloth'],
    suitableFor: ['solo', 'group'],
    element: 'water',
    category: cat('rituals-ceremony'),
    venues: [],
    facilitators: [],
    heroImage: { alt: 'Photography to come' },
    gallery: [],
    featured: false,
  },
  {
    id: 'jemparingan',
    slug: 'jemparingan',
    title: 'Jemparingan',
    subtitle: 'Mindful traditional archery',
    description:
      'Javanese traditional archery practised seated and drawn at the heart — a study in composure, breath, and attention rather than marksmanship.',
    highlightText: 'Aim with the heart, not the eye.',
    facilities: ['Equipment provided', 'Traditional cloth'],
    suitableFor: ['group', 'corporate', 'community'],
    element: 'air',
    category: cat('spa-retreats'),
    venues: [],
    facilitators: [],
    heroImage: { alt: 'Photography to come' },
    gallery: [],
    featured: false,
  },
  {
    id: 'mindful-meetings',
    slug: 'mindful-meetings',
    title: 'Mindful Meetings',
    subtitle: 'For teams and organisations',
    description:
      'Wellbeing built into the way a team gathers: quieter sessions, considered pacing, and space for clarity between the working hours.',
    highlightText: 'Gather with more attention.',
    facilities: ['Meeting setting', 'Guided sessions'],
    suitableFor: ['corporate', 'group'],
    element: 'ether',
    category: cat('healing-sound'),
    venues: [],
    facilitators: [],
    heroImage: { alt: 'Photography to come' },
    gallery: [],
    featured: false,
  },
]

/**
 * Illustrative until the operational Experience Inventory exists — the content
 * master asks for one before durations, group sizes and inclusions are
 * published. Structure is real; specifics are placeholders for the client.
 */
export const journeysEn: Journey[] = [
  {
    id: 'return-to-balance',
    slug: 'return-to-balance',
    title: 'A Journey Back to Balance',
    positioning:
      'A short arc through movement, stillness and living tradition, sequenced so each day has a reason to follow the last.',
    description:
      'Designed for guests who want a complete experience rather than a set of activities — beginning with arrival and settling, opening into practice and place, and closing with time to carry something home.',
    summary: 'Multi-day · Indonesia',
    durationText: 'Three days',
    facilities: ['Accommodation', 'Meals', 'Local transfers'],
    inclusions: ['Guided practices', 'Cultural experiences', 'Facilitator support'],
    exclusions: ['International flights', 'Personal expenses'],
    suggestedPax: 'Individuals and small groups',
    locationPreference: 'Java or Bali',
    days: [
      {
        title: 'Arrival and settling',
        note: 'A gentle opening. Nothing is asked beyond arriving.',
        items: [
          { time: '15:00', title: 'Arrival and welcome', facilitatorNames: [] },
          { time: '17:00', title: 'Agni Hotra', productSlug: 'agni-hotra', venueName: 'Om Ham Resort', facilitatorNames: [] },
        ],
      },
      {
        title: 'Practice and place',
        note: 'The fullest day, balanced between movement and rest.',
        items: [
          { time: '07:00', title: 'Javanese Meditation', productSlug: 'javanese-meditation', facilitatorNames: [] },
          { time: '10:00', title: 'Jemparingan', productSlug: 'jemparingan', facilitatorNames: [] },
          { time: '16:00', title: 'Javanese Ritual Spa', productSlug: 'javanese-ritual-spa', facilitatorNames: [] },
        ],
      },
      {
        title: 'Carrying it home',
        note: 'Closing quietly, with something to take back.',
        items: [
          { time: '07:00', title: 'Traditional Cleansing Ritual', productSlug: 'traditional-cleansing-ritual', facilitatorNames: [] },
          { time: '11:00', title: 'Closing conversation and departure', facilitatorNames: [] },
        ],
      },
    ],
    heroImage: img('Tegallalang_Rice_Terraces_Bali_1.jpg', 1920, 'Terraces stretching into the mist', 'Wikimedia Commons · CC BY 4.0'),
    gallery: [],
  },
  {
    id: 'group-retreat',
    slug: 'group-retreat',
    title: 'A Group Retreat',
    positioning:
      'Time together shaped around wellbeing, for communities and teams that want more than a change of setting.',
    description:
      'Built around the group rather than a template: the balance of activity, privacy, guidance and cultural depth is set by who is travelling.',
    summary: 'Multi-day · By arrangement',
    facilities: ['Meeting setting', 'Accommodation', 'Meals'],
    inclusions: ['Guided practices', 'Facilitator support'],
    exclusions: ['Flights', 'Personal expenses'],
    suggestedPax: 'Private groups and teams',
    locationPreference: 'By arrangement',
    days: [
      {
        title: 'Gathering',
        items: [
          { time: '16:00', title: 'Arrival and orientation', facilitatorNames: [] },
          { time: '19:00', title: 'Shared meal', facilitatorNames: [] },
        ],
      },
      {
        title: 'Together, differently',
        items: [
          { time: '09:00', title: 'Mindful Meetings', productSlug: 'mindful-meetings', facilitatorNames: [] },
          { time: '15:00', title: 'Jemparingan', productSlug: 'jemparingan', facilitatorNames: [] },
        ],
      },
    ],
    heroImage: img('Le_Meridien_Nirwana_Bali_Villa_private_pavilion_(2926076811).jpg', 1920, 'A pavilion set for a group', 'Wikimedia Commons · CC BY-SA 2.0'),
    gallery: [],
  },
]
