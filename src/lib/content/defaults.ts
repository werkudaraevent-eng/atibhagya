import {
  aboutEn,
  categoriesEn,
  homeEn,
  journeysEn,
  productsEn,
  siteEn,
} from './defaults.en'
import {
  aboutId,
  categoriesId,
  homeId,
  journeysId,
  productsId,
  siteId,
} from './defaults.id'
import type { Locale } from './types'

/**
 * The approved copy, per language. It is the seed, the fallback when a CMS
 * field is empty, and what the admin shows in that field. Kept free of any
 * Payload import so the CMS config can use it without a circular load.
 */
export const defaults = (locale: Locale) => ({
  site: locale === 'id' ? siteId : siteEn,
  home: locale === 'id' ? homeId : homeEn,
  about: locale === 'id' ? aboutId : aboutEn,
  categories: locale === 'id' ? categoriesId : categoriesEn,
  products: locale === 'id' ? productsId : productsEn,
  journeys: locale === 'id' ? journeysId : journeysEn,
})
