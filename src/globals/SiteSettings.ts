import type { FieldAccess, GlobalConfig } from 'payload'

import { stampUpdatedByGlobal, updatedBy } from '../lib/audit'
import { defaults } from '../lib/content/defaults'
import { plain, prefillGlobal, text } from '../lib/prefill'
import { revalidateGlobal } from '../lib/revalidate'

/** Internal addresses stay out of the public API response. */
const staffOnly: FieldAccess = ({ req: { user } }) => Boolean(user)

/** Chrome shared by every page: contact details, social, footer lines. */
export const SiteSettings: GlobalConfig = {
  slug: 'site',
  label: 'Site settings',
  admin: { group: 'Pages' },
  access: { read: () => true },
  // Footer and contact details sit on every page.
  hooks: {
    // Every box shows what the site currently uses; see src/lib/prefill.ts.
    afterRead: [
      prefillGlobal({
        email: plain(() => defaults('en').site.email),
        phone: plain(() => defaults('en').site.phone),
        whatsapp: plain(() => defaults('en').site.whatsapp),
        whatsappLabel: text((l) => defaults(l).site.whatsappLabel),
        address: text((l) => defaults(l).site.address),
        social: plain(() =>
          defaults('en').site.social.map((s) => ({ label: s.label, url: s.href })),
        ),
        footerTagline: text((l) => defaults(l).site.footerTagline),
        footerLegal: text((l) => defaults(l).site.footerLegal),
        parentBrand: plain(() => defaults('en').site.parentBrand),
        responseTime: text((l) => defaults(l).site.responseTime),
      }),
    ],
    beforeChange: [stampUpdatedByGlobal],
    afterChange: [revalidateGlobal(['/', '/product', '/journey', '/about', '/inquiry'])],
  },
  versions: {
    // Save Draft / Publish, with history and revert. 50 versions per document
    // keeps the table from growing without bound.
    drafts: true,
    max: 50,
  },

  fields: [
    updatedBy,
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'whatsapp', type: 'text', admin: { description: 'Full wa.me link.' } },
    { name: 'whatsappLabel', type: 'text', localized: true },
    { name: 'address', type: 'textarea', localized: true },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'footerTagline',
      type: 'textarea',
      localized: true,
      label: 'Closing line',
      admin: {
        description:
          'The sentence the site ends on, set large in the footer. One thought, two lines at most; line breaks are kept.',
      },
    },
    { name: 'footerLegal', type: 'text', localized: true },
    {
      name: 'parentBrand',
      type: 'text',
      label: 'Parent brand',
      admin: {
        description: 'Shown after the copyright line, e.g. "Werkudara Group". Leave empty to omit.',
      },
    },
    {
      type: 'collapsible',
      label: 'Inquiry notifications',
      admin: {
        description:
          'Who is told when an inquiry arrives. The mail server itself is configured with environment variables — see the README.',
      },
      fields: [
        {
          name: 'inquiryRecipients',
          type: 'array',
          labels: { singular: 'Recipient', plural: 'Recipients' },
          admin: {
            components: { RowLabel: '@/admin/RowLabel#RowLabel' },
            description: 'Every address here receives a copy of each new inquiry.',
          },
          // Internal addresses would otherwise be readable at /api/globals/site.
          access: { read: staffOnly },
          fields: [
            { name: 'label', type: 'text', admin: { description: 'Who this is, e.g. Reservations.' } },
            { name: 'email', type: 'email', required: true },
          ],
        },
        {
          name: 'inquiryFromName',
          type: 'text',
          access: { read: staffOnly },
          admin: { description: 'The name the notification appears to come from.' },
        },
      ],
    },
    {
      name: 'responseTime',
      type: 'text',
      localized: true,
      admin: { description: 'Shown on the inquiry confirmation, e.g. "within two working days".' },
    },
  ],
}
