import type { Element } from '../elements'

export const locales = ['en', 'id'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export type Img = {
  /** Absent while the client's own photography is still to come. */
  src?: string
  alt: string
  credit?: string
  creditUrl?: string
}

export type NavLink = {
  label: string
  href: string
}

/** The words on the main menu — header, mobile curtain, footer, path marks. */
export type NavLabels = {
  products: string
  journeys: string
  about: string
  inquiry: string
  /** The events page, when no event is live to link to directly. */
  events: string
}

/**
 * The menu's fourth destination, when there is one: a live event's own
 * page, or the events archive. `href` is locale-free; the menu adds `/id`.
 */
export type EventLink = {
  label: string
  href: string
  /** True while it points at an event still to come — the menu marks it. */
  live: boolean
}

/** Chrome shared by every page. */
export type SiteContent = {
  nav: NavLabels
  eventLink?: EventLink
  email: string
  phone?: string
  whatsapp: string
  whatsappLabel: string
  address?: string
  social: NavLink[]
  footerTagline: string
  footerLegal: string
  /** The group the brand belongs to, named in the footer's last line. */
  parentBrand?: string
  responseTime: string
}

export type ProductCategory = {
  id: string
  slug: string
  name: string
}

export type Venue = {
  id: string
  name: string
  location?: string
  description?: string
}

export type Facilitator = {
  id: string
  name: string
  role?: string
  bio?: string
  photo?: Img
}

export type Product = {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  highlightText?: string
  durationText?: string
  facilities: string[]
  suitableFor: string[]
  /** One of the five elements; always resolved, never absent on the site. */
  element: Element
  whatToExpect?: string
  category?: ProductCategory
  venues: Venue[]
  facilitators: Facilitator[]
  heroImage: Img
  gallery: Img[]
  featured: boolean
  /** When the document last changed in the CMS; absent for built-in content. */
  updatedAt?: string
}

/**
 * What a listing card needs, and nothing more. The catalogue runs to dozens of
 * products; shipping every gallery and venue to the browser just to draw a
 * grid would bloat the payload for no gain.
 */
export type ProductCard = {
  id: string
  slug: string
  title: string
  subtitle?: string
  highlightText?: string
  categoryName?: string
  categorySlug?: string
  suitableFor: string[]
  element: Element
  image: Img
}

export const toCard = (product: Product): ProductCard => ({
  id: product.id,
  slug: product.slug,
  title: product.title,
  subtitle: product.subtitle,
  highlightText: product.highlightText,
  categoryName: product.category?.name,
  categorySlug: product.category?.slug,
  suitableFor: product.suitableFor,
  element: product.element,
  image: product.heroImage,
})

export type JourneyItem = {
  time?: string
  title: string
  productSlug?: string
  /** The product's one-line subtitle, for an event page's day detail. */
  productLine?: string
  venueName?: string
  facilitatorNames: string[]
}

export type JourneyDay = {
  title: string
  /** A few words under the title on an event page. */
  kicker?: string
  /** The day of the event itself. */
  highlight?: boolean
  note?: string
  items: JourneyItem[]
}

export type Journey = {
  id: string
  slug: string
  title: string
  positioning?: string
  description?: string
  summary?: string
  durationText?: string
  /** e.g. 4D3N, on an event page's journey chips. */
  durationShort?: string
  facilities: string[]
  inclusions: string[]
  exclusions: string[]
  suggestedPax?: string
  locationPreference?: string
  days: JourneyDay[]
  heroImage: Img
  gallery: Img[]
  /** When the document last changed in the CMS; absent for built-in content. */
  updatedAt?: string
}

export type Pillar = {
  title: string
  body: string
}

export type HomeContent = {
  meta: { title: string; description: string }
  hero: {
    /** Empty when the team has chosen to show no small line. */
    eyebrow: string
    headline: string
    statement: string
    ctaLabel: string
    image: Img
    video?: string
    /** 0–1: how far the photograph is toned down behind the type. */
    darken: number
  }
  why: {
    eyebrow: string
    headline: string
    body: string
    pillars: Pillar[]
  }
  featured: {
    eyebrow: string
    headline: string
  }
  event: {
    /** The chapter's name, e.g. "A season at Prambanan". */
    label: string
    ctaLabel: string
    /** The chosen event's id; empty means the nearest one still to come. */
    featuredId?: string
  }
  cta: {
    headline: string
    body: string
    label: string
    image: Img
  }
}

export type EventDate = {
  label: string
  /** ISO date, day precision. */
  date: string
  time?: string
  venue?: string
}

export type EventStep = { title: string; body?: string }

/** One column of the dark chapter: a day of the event. */
export type EventDay = {
  kicker?: string
  meta?: string
  title: string
  body?: string
  listLabel?: string
  listStyle: 'thread' | 'rows'
  list: EventStep[]
  notes: EventStep[]
  quoteEyebrow?: string
  quote?: string
}

export type EventContent = {
  id: string
  slug: string
  title: string
  eyebrow?: string
  headline: string
  statement?: string
  heroImage: Img
  /** 0–1: how far the opening photograph is toned down behind the type. */
  heroDarken: number
  dates: EventDate[]
  /** Worked out from the dates: still to come (or on), or already past. */
  live: boolean
  intro: { label?: string; headline?: string; body?: string }
  days: { label?: string; headline?: string; columns: EventDay[] }
  place: {
    label?: string
    number?: string
    caption?: string
    headline?: string
    body?: string
    image: Img
  }
  journeys: { label?: string; headline?: string; list: Journey[]; defaultSlug?: string }
  pdfUrl?: string
  closing: {
    eyebrow?: string
    headline?: string
    body?: string
    ctaLabel?: string
    /** Brochures and the like, as links beside the button. */
    downloads: { label: string; href: string }[]
    image: Img
    contactName?: string
    contactLine?: string
    collaborationLine?: string
  }
  home: { headline: string; body?: string; image: Img }
  navLabel: string
  meta: { title: string; description?: string }
  updatedAt?: string
}

/** What the events page and the home block need of an event. */
export type EventCard = Pick<
  EventContent,
  'id' | 'slug' | 'title' | 'eyebrow' | 'dates' | 'live' | 'home' | 'navLabel'
> & { journeys: Pick<Journey, 'slug' | 'title' | 'durationShort' | 'summary'>[] }

export type AboutContent = {
  meta: { title: string; description: string }
  eyebrow: string
  headline: string
  lede: string
  body: string[]
  image: Img
  statement: string
  values: { title: string; caption: string }[]
  ctaHeadline: string
  ctaLabel: string
}
