import type { CollectionConfig, FieldAccess } from 'payload'

import { adminOnly, canHandleInquiries, inquiryHandlers } from '../lib/access'

const isHostField: FieldAccess = ({ req: { user } }) => canHandleInquiries(user)

/** Nothing a visitor types may reach an email header. */
const header = (value: unknown, max = 120) =>
  String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max)

/**
 * The single destination for every CTA on the site.
 *
 * Every operation is closed to the outside. The form writes through the
 * `submitInquiry` server action, which uses Payload's Local API and so is not
 * subject to this access control — that keeps `POST /api/inquiries` shut to
 * bots while the form itself keeps working.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Inquiries',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'audience', 'preferredDate', 'status', 'createdAt'],
    // Out of the sidebar for anyone who cannot open it anyway.
    hidden: ({ user }) => !canHandleInquiries(user),
    components: {
      // A Refresh control, and a quiet re-fetch every minute.
      beforeListTable: ['@/admin/RefreshList#RefreshList'],
    },
  },
  access: {
    create: () => false,
    // Visitors' personal data: admins and sales only, not content editors.
    read: inquiryHandlers,
    update: inquiryHandlers,
    // A guest enquiry is a business record — only an admin may remove one.
    delete: adminOnly,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc

        // Recipients come from the CMS so the team can change them without a
        // deploy; the env var stays as a fallback for a fresh install.
        let to: string[] = []
        try {
          const site = (await req.payload.findGlobal({ slug: 'site', depth: 0 })) as {
            inquiryRecipients?: { email?: string }[]
          }
          to = (site.inquiryRecipients ?? [])
            .map((r) => r.email?.trim())
            .filter((e): e is string => Boolean(e))
        } catch {
          // Fall through to the environment.
        }

        if (to.length === 0) {
          const fallback = process.env.INQUIRIES_NOTIFY_EMAIL
          if (fallback) to = [fallback]
        }

        if (to.length === 0) {
          req.payload.logger.warn(
            'An inquiry arrived but no recipient is configured — add one under Site settings.',
          )
          return doc
        }

        const interested = [
          ...(doc.products ?? []).map((p: unknown) =>
            typeof p === 'object' && p !== null ? (p as { title?: string }).title : String(p),
          ),
          ...(doc.journeys ?? []).map((j: unknown) =>
            typeof j === 'object' && j !== null ? (j as { title?: string }).title : String(j),
          ),
          ...(doc.customActivities ?? []).map((c: { label?: string }) => c.label),
        ].filter(Boolean)

        // Only what was asked and answered. A field the team has removed from
        // the form should not show up as a row of dashes.
        const lines = [
          `${doc.name} · ${doc.email}`,
          doc.phone ? `Phone / WhatsApp: ${doc.phone}` : null,
          doc.organisation ? `Company / community: ${doc.organisation}` : null,
          '',
          doc.audience ? `Type: ${doc.audience}` : null,
          doc.pax ? `Participants: ${doc.pax}` : null,
          doc.preferredLocation ? `Preferred location: ${doc.preferredLocation}` : null,
          doc.preferredDate ? `Preferred date: ${doc.preferredDate}` : null,
          interested.length ? `Interested in: ${interested.join(', ')}` : null,
          '',
          doc.goal ? `Goal: ${doc.goal}` : null,
          doc.notes ? `Notes: ${doc.notes}` : null,
          ...((doc.answers ?? []) as { name?: string; label?: string; value?: string }[])
            .filter((a) => a.value)
            .map((a) => `${a.label ?? a.name}: ${a.value}`),
          '',
          `Submitted in: ${doc.locale ?? 'en'}`,
        ].filter((line) => line !== null)

        try {
          await req.payload.sendEmail({
            to,
            subject: `New inquiry — ${header(doc.name)}`,
            text: lines.join('\n'),
          })
        } catch (err) {
          // A failed notification must never fail the visitor's submission.
          req.payload.logger.error({ err }, 'Could not send the inquiry notification email')
        }

        return doc
      },
    ],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 120 },
        {
          name: 'email',
          type: 'email',
          required: true,
          validate: (value: unknown) =>
            typeof value === 'string' && value.length > 200
              ? 'That address is too long to be real.'
              : true,
        },
        { name: 'phone', type: 'text', maxLength: 40 },
        {
          name: 'audience',
          type: 'text',
          maxLength: 40,
          admin: {
            description:
              'The choice made in the "Private / group" field. Its options are set on the inquiry form.',
          },
        },
        {
          name: 'organisation',
          type: 'text',
          maxLength: 160,
          admin: { description: 'Company or community.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'The occasion',
      fields: [
        { name: 'pax', type: 'text', maxLength: 40 },
        { name: 'preferredLocation', type: 'text', maxLength: 160 },
        { name: 'preferredDate', type: 'text', maxLength: 40 },
        { name: 'goal', type: 'textarea', maxLength: 2000 },
        { name: 'notes', type: 'textarea', maxLength: 5000 },
      ],
    },
    {
      type: 'collapsible',
      label: 'Interested activities',
      fields: [
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          admin: { description: 'Prefilled when the CTA came from a product page.' },
        },
        { name: 'journeys', type: 'relationship', relationTo: 'journeys', hasMany: true },
        {
          name: 'customActivities',
          type: 'array',
          maxRows: 10,
          fields: [{ name: 'label', type: 'text', required: true, maxLength: 200 }],
          admin: { description: 'Anything the visitor typed themselves.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Custom questions',
      admin: {
        description: 'Answers to the custom questions configured under Inquiries → Inquiry form.',
      },
      fields: [
        {
          name: 'answers',
          type: 'array',
          admin: {
            readOnly: true,
            components: { RowLabel: '@/admin/RowLabel#RowLabel' },
          },
          fields: [
            { name: 'name', type: 'text' },
            {
              name: 'label',
              type: 'text',
              admin: {
                description:
                  'The question as it was worded when this inquiry arrived, so rewording it later does not rewrite history.',
              },
            },
            { name: 'value', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
      // The public form must not be able to set or move the status.
      access: { create: isHostField, update: isHostField },
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Bahasa Indonesia', value: 'id' },
      ],
      admin: {
        position: 'sidebar',
        description: 'The language the visitor wrote in — reply in the same one.',
      },
    },
  ],
  timestamps: true,
}
