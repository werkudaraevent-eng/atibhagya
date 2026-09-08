import type { CollectionConfig, Field } from 'payload'

import { stampUpdatedBy, updatedBy, versionsView } from '../lib/audit'
import { revalidateEverything } from '../lib/revalidate'
import { serverURL } from '../lib/server-url'
import { pdfFile, webImage } from '../lib/validate-media'
import { adminOnly, signedIn } from './Users'

type Opts = { required?: boolean; description?: string }

/** A localized text field — shorthand for the many that follow. */
const text = (name: string, { required, description }: Opts = {}): Field => ({
  name,
  type: 'text',
  localized: true,
  required,
  admin: description ? { description } : undefined,
})

const longText = (name: string, { required, description }: Opts = {}): Field => ({
  name,
  type: 'textarea',
  localized: true,
  required,
  admin: description ? { description } : undefined,
})

/**
 * An event is a dated occasion the brand takes part in — a festival, a
 * gathering — with the journeys that lead to it. One entry is one event
 * page; the Prambanan Shiva Festival is the first, not a special case.
 *
 * There is no status field beyond Payload's own draft/published. Where an
 * event sits in time is worked out from its dates: published and still to
 * come, it is live (menu link, home block); published and past, it moves
 * to the archive on the events page on its own. Unpublish to hide it.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Experiences',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedBy', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    description:
      'Dated occasions with their own page: a festival, a season. Published and still to come, an event appears in the menu and on the home page; once its last date has passed it moves to the archive by itself.',
    preview: (doc) => `${serverURL}/events/${doc.slug}`,
    components: versionsView,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: signedIn,
    update: signedIn,
    delete: adminOnly,
  },
  defaultSort: '-updatedAt',
  hooks: {
    beforeChange: [stampUpdatedBy],
    // The menu link sits on every page, so every page is rebuilt.
    afterChange: [revalidateEverything],
  },
  versions: { drafts: true, maxPerDoc: 50 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Opening',
          fields: [
            text('title', { required: true, description: 'The event’s name, e.g. "Prambanan Shiva Festival 2027".' }),
            text('eyebrow', { description: 'The small line above the headline, e.g. "Prambanan Shiva Festival 2027 · Yogyakarta".' }),
            longText('headline', { description: 'The page’s first sentence, set large over the photograph.' }),
            longText('statement', { description: 'Two or three lines under the headline.' }),
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              validate: webImage,
              label: 'Opening photograph',
              admin: {
                description:
                  'Full-screen behind the headline at the top of the event page. Also the fallback for the closing and home page photographs.',
              },
            },
            {
              name: 'dates',
              type: 'array',
              labels: { singular: 'Date', plural: 'Dates' },
              admin: {
                description:
                  'One row per day of the event. The last date decides when the event moves to the archive.',
                components: { RowLabel: '@/admin/RowLabel#RowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    text('label', { required: true, description: 'e.g. Mahashivaratri' }),
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'time', type: 'text', admin: { description: 'e.g. 14.00 – 08.00 WIB' } },
                    text('venue', { description: 'e.g. Wisnu Park, Prambanan Temple' }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Introduction',
          fields: [
            text('introLabel', { description: 'The chapter’s name, e.g. "Why we walk to Prambanan".' }),
            longText('introHeadline'),
            longText('introBody'),
          ],
        },
        {
          label: 'The days',
          description: 'The dark chapter: what happens on each day, side by side.',
          fields: [
            text('daysLabel', { description: 'e.g. "The sacred days · 6 – 7 March 2027"' }),
            longText('daysHeadline'),
            {
              name: 'days',
              type: 'array',
              maxRows: 2,
              labels: { singular: 'Day', plural: 'Days' },
              admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    text('kicker', { description: 'e.g. Saturday · 6 March' }),
                    text('meta', { description: 'e.g. 14.00 – 08.00 WIB · Wisnu Park' }),
                  ],
                },
                text('title', { required: true }),
                longText('body'),
                text('listLabel', { description: 'Above the list, e.g. "The sacred procession".' }),
                {
                  name: 'listStyle',
                  type: 'select',
                  defaultValue: 'thread',
                  options: [
                    { label: 'Thread — steps along a line that fills as you scroll', value: 'thread' },
                    { label: 'Rows — numbered rows under hairlines', value: 'rows' },
                  ],
                },
                {
                  name: 'list',
                  type: 'array',
                  labels: { singular: 'Step', plural: 'Steps' },
                  admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
                  fields: [text('title', { required: true }), longText('body')],
                },
                {
                  name: 'notes',
                  type: 'array',
                  maxRows: 2,
                  labels: { singular: 'Note', plural: 'Notes' },
                  admin: {
                    description: 'Two short asides under the list, e.g. "Chanting the 1,008 Names".',
                    components: { RowLabel: '@/admin/RowLabel#RowLabel' },
                  },
                  fields: [text('title', { required: true }), longText('body')],
                },
                text('quoteEyebrow', { description: 'e.g. Vasudhaiva Kutumbakam' }),
                longText('quote'),
              ],
            },
          ],
        },
        {
          label: 'The place',
          description: 'A photograph beside a large number and its story.',
          fields: [
            text('placeLabel', { description: 'e.g. "The spirit of Prambanan"' }),
            {
              type: 'row',
              fields: [
                { name: 'placeNumber', type: 'text', admin: { description: 'Set very large, e.g. 856' } },
                text('placeCaption', { description: 'Beside the number, e.g. "CE · Wantil Inscription"' }),
              ],
            },
            longText('placeHeadline'),
            longText('placeBody'),
            {
              name: 'placeImage',
              type: 'upload',
              relationTo: 'media',
              validate: webImage,
              label: 'Photograph',
              admin: { description: 'Tall (4:5) beside the number.' },
            },
          ],
        },
        {
          label: 'Journeys',
          fields: [
            text('journeysLabel', { description: 'e.g. "Three curated journeys"' }),
            longText('journeysHeadline'),
            {
              name: 'journeys',
              type: 'relationship',
              relationTo: 'journeys',
              hasMany: true,
              admin: {
                description:
                  'The journeys that lead to this event, in the order they are offered. Each day’s kicker and "festival day" mark are set on the journey itself.',
              },
            },
            {
              name: 'defaultJourney',
              type: 'relationship',
              relationTo: 'journeys',
              admin: { description: 'The one shown first. Leave empty for the first in the list.' },
            },
            {
              name: 'pdf',
              type: 'upload',
              relationTo: 'media',
              validate: pdfFile,
              admin: { description: 'The full programme as a PDF, offered beside each itinerary. Optional.' },
            },
          ],
        },
        {
          label: 'Closing',
          fields: [
            text('closingEyebrow', { description: 'e.g. "Reserve a place · March 2027"' }),
            longText('closingHeadline'),
            longText('closingBody'),
            text('closingCtaLabel', { description: 'On the button; leads to the inquiry form.' }),
            {
              name: 'downloads',
              type: 'array',
              labels: { singular: 'Download', plural: 'Downloads' },
              maxRows: 4,
              admin: {
                description:
                  'Brochures and other PDFs, offered as links beside the button — e.g. "Festival brochure (PDF)". The journey programme has its own field on the Journeys tab.',
                components: { RowLabel: '@/admin/RowLabel#RowLabel' },
              },
              fields: [
                text('label', { required: true, description: 'e.g. Festival brochure (PDF)' }),
                { name: 'file', type: 'upload', relationTo: 'media', required: true, validate: pdfFile },
              ],
            },
            {
              name: 'closingImage',
              type: 'upload',
              relationTo: 'media',
              validate: webImage,
              label: 'Closing photograph',
              admin: { description: 'Behind the invitation at the foot of the page. Empty uses the opening photograph.' },
            },
            {
              type: 'collapsible',
              label: 'Contact',
              admin: { description: 'Optional. Empty fields are simply not shown.' },
              fields: [
                { name: 'contactName', type: 'text' },
                {
                  name: 'contactLine',
                  type: 'text',
                  admin: { description: 'e.g. an Instagram handle. A phone number here appears on the public page.' },
                },
                longText('collaborationLine', { description: 'e.g. "In collaboration with Prambanan Shiva Festival · Atibhagya Wellness"' }),
              ],
            },
          ],
        },
        {
          label: 'Home & menu',
          fields: [
            text('navLabel', { description: 'The word in the main menu while the event is live, e.g. "Festival 2027". Empty uses the title.' }),
            longText('homeHeadline', { description: 'The home page block’s headline. Empty uses the page headline.' }),
            longText('homeBody', { description: 'Empty uses the opening statement.' }),
            {
              name: 'homeImage',
              type: 'upload',
              relationTo: 'media',
              validate: webImage,
              label: 'Home page photograph',
              admin: {
                description:
                  'Only on the home page block and the events list — not on the event page itself. Empty uses the opening photograph.',
              },
            },
          ],
        },
        {
          label: 'Meta',
          fields: [text('metaTitle'), longText('metaDescription')],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'The address: /events/<slug>' },
    },
    updatedBy,
  ],
}
