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

/** Chrome shared by every page. */
export type SiteContent = {
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
  venueName?: string
  facilitatorNames: string[]
}

export type JourneyDay = {
  title: string
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
  facilities: string[]
  inclusions: string[]
  exclusions: string[]
  suggestedPax?: string
  locationPreference?: string
  days: JourneyDay[]
  heroImage: Img
  gallery: Img[]
}

export type Pillar = {
  title: string
  body: string
}

export type HomeContent = {
  meta: { title: string; description: string }
  hero: {
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
  cta: {
    headline: string
    body: string
    label: string
    image: Img
  }
}

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
