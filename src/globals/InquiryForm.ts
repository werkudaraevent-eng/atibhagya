import type { GlobalConfig } from 'payload'

const text = (name: string, description?: string) => ({
  name,
  type: 'text' as const,
  localized: true,
  ...(description ? { admin: { description } } : {}),
})

/**
 * The wording of the inquiry form.
 *
 * Only the words live here. The field names, their order and what is required
 * are structural — moving those into the CMS would let an editor break the
 * form or orphan stored data. Anything left empty falls back to the approved
 * copy in `src/lib/i18n/ui.ts`.
 */
export const InquiryFormCopy: GlobalConfig = {
  slug: 'inquiry-form',
  label: 'Inquiry form',
  admin: {
    group: 'Inquiries',
    description:
      'The words on the inquiry form. Leave a field empty to keep the approved wording.',
  },
  access: { read: () => true },
  versions: { drafts: true, max: 50 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Opening',
          fields: [
            text('eyebrow', 'The small label above the heading, e.g. "01 / Inquiry".'),
            text('headline'),
            {
              name: 'lede',
              type: 'textarea',
              localized: true,
              admin: { description: 'The line under the heading.' },
            },
          ],
        },
        {
          label: 'Field labels',
          fields: [
            {
              type: 'row',
              fields: [text('nameLabel', 'Name'), text('emailLabel', 'Email')],
            },
            {
              type: 'row',
              fields: [text('phoneLabel', 'Phone'), text('audienceLabel', 'Private / group')],
            },
            {
              type: 'row',
              fields: [text('organisationLabel', 'Company / community'), text('paxLabel', 'Participants')],
            },
            {
              type: 'row',
              fields: [text('locationLabel', 'Preferred location'), text('dateLabel', 'Date')],
            },
            {
              type: 'row',
              fields: [text('goalLabel', 'Goal of activity'), text('notesLabel', 'Notes')],
            },
            text('interestedLabel', 'Interested activities'),
            {
              name: 'interestedHint',
              type: 'textarea',
              localized: true,
              admin: { description: 'The small line under "Interested activities".' },
            },
            text('addCustomLabel', 'The "+ Custom activity" control.'),
            text('submitLabel', 'The submit button.'),
          ],
        },
        {
          label: 'Private / group options',
          fields: [
            {
              name: 'audienceOptions',
              type: 'array',
              maxRows: 3,
              admin: {
                components: { RowLabel: '@/admin/RowLabel#RowLabel' },
                description:
                  'Only the wording is editable. The stored value stays fixed so past inquiries keep their meaning.',
              },
              fields: [
                {
                  name: 'value',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'private', value: 'private' },
                    { label: 'group', value: 'group' },
                    { label: 'corporate', value: 'corporate' },
                  ],
                  admin: { description: 'Do not change once inquiries have been received.' },
                },
                { name: 'label', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },
        {
          label: 'Your own questions',
          description:
            'Questions added here appear after Notes and before Interested activities. The answers are stored on each inquiry and included in the notification email.',
          fields: [
            {
              name: 'questions',
              type: 'array',
              labels: { singular: 'Question', plural: 'Questions' },
              admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        description:
                          'The key the answer is stored under, e.g. dietary_needs. Letters, numbers and underscores. Changing it later orphans answers already collected.',
                      },
                      validate: (value: unknown) =>
                        typeof value === 'string' && /^[a-z][a-z0-9_]*$/.test(value)
                          ? true
                          : 'Lowercase letters, numbers and underscores, starting with a letter.',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      defaultValue: 'text',
                      options: [
                        { label: 'Short text', value: 'text' },
                        { label: 'Long text', value: 'textarea' },
                        { label: 'Email', value: 'email' },
                        { label: 'Phone', value: 'tel' },
                        { label: 'Number', value: 'number' },
                        { label: 'Date', value: 'date' },
                        { label: 'Choose one', value: 'select' },
                        { label: 'Yes / no', value: 'checkbox' },
                      ],
                    },
                    {
                      name: 'width',
                      type: 'select',
                      defaultValue: 'full',
                      options: [
                        { label: 'Full width', value: 'full' },
                        { label: 'Half width', value: 'half' },
                      ],
                      admin: { description: 'Two half-width questions sit side by side.' },
                    },
                    { name: 'required', type: 'checkbox', defaultValue: false },
                  ],
                },
                { name: 'placeholder', type: 'text', localized: true },
                {
                  name: 'help',
                  type: 'text',
                  localized: true,
                  admin: { description: 'A small line under the field.' },
                },
                {
                  name: 'options',
                  type: 'array',
                  labels: { singular: 'Option', plural: 'Options' },
                  admin: {
                    condition: (_data, sibling) => sibling?.type === 'select',
                    components: { RowLabel: '@/admin/RowLabel#RowLabel' },
                    description: 'The stored value stays fixed; only the label is safe to reword.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, localized: true },
                        { name: 'value', type: 'text', required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'After submitting',
          fields: [
            text('doneHeading'),
            {
              name: 'doneBody',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'Use {time} where the response time from Site settings should appear.',
              },
            },
            text('doneContact', 'The line above the fallback email address.'),
            text('doneBack', 'The link back to the site.'),
          ],
        },
      ],
    },
  ],
}
