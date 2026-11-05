import type { GlobalConfig } from 'payload'

import { contentEditors } from '../lib/access'
import { stampUpdatedByGlobal, updatedBy, versionsView } from '../lib/audit'
import { DEFAULT_RETENTION_MONTHS, privacyDefaults } from '../lib/content/privacy-defaults'
import { plain, prefillGlobal, rows, text } from '../lib/prefill'
import { revalidateGlobal } from '../lib/revalidate'

/**
 * The privacy policy (UU PDP No. 27/2022): what the inquiry form keeps, why,
 * who processes it, for how long, and how to have it removed.
 *
 * The retention period lives here, beside the sentence that promises it:
 * the nightly purge reads this field, and `{months}` in the text prints it,
 * so the policy and the behaviour cannot disagree.
 */
export const PrivacyPage: GlobalConfig = {
  slug: 'privacy',
  label: 'Privacy policy',
  admin: { group: 'Pages', components: versionsView },
  // Sales can sign in but not change the site.
  access: { read: () => true, update: contentEditors },
  hooks: {
    // Every box shows what the site currently uses; see src/lib/prefill.ts.
    afterRead: [
      prefillGlobal({
        metaTitle: text((l) => privacyDefaults(l).meta.title),
        metaDescription: text((l) => privacyDefaults(l).meta.description),
        eyebrow: text((l) => privacyDefaults(l).eyebrow),
        headline: text((l) => privacyDefaults(l).headline),
        lede: text((l) => privacyDefaults(l).lede),
        updated: plain(() => privacyDefaults('en').updated),
        sections: rows((l) => privacyDefaults(l).sections),
      }),
    ],
    beforeChange: [stampUpdatedByGlobal],
    afterChange: [revalidateGlobal(['/privacy'])],
  },
  versions: { drafts: true, max: 50 },
  fields: [
    updatedBy,
    {
      name: 'retentionMonths',
      type: 'number',
      required: true,
      defaultValue: DEFAULT_RETENTION_MONTHS,
      min: 1,
      max: 120,
      admin: {
        position: 'sidebar',
        description:
          'Inquiries older than this are deleted automatically every night. "{months}" in the text below shows this number.',
      },
    },
    {
      name: 'updated',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'Shown as "Last updated". Change it whenever the policy changes.',
      },
    },
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'headline', type: 'text', localized: true },
    { name: 'lede', type: 'textarea', localized: true },
    {
      name: 'sections',
      type: 'array',
      labels: { singular: 'Section', plural: 'Sections' },
      admin: {
        description: '"{email}" shows the contact address from Site settings; "{months}" the retention period.',
      },
      fields: [
        { name: 'heading', type: 'text', required: true, localized: true },
        { name: 'body', type: 'textarea', required: true, localized: true },
      ],
    },
    { name: 'metaTitle', type: 'text', localized: true },
    { name: 'metaDescription', type: 'textarea', localized: true },
  ],
}
