import ExcelJS from 'exceljs'
import { NextResponse, type NextRequest } from 'next/server'

import { canHandleInquiries } from '@/lib/access'
import { getPayloadSafe } from '@/lib/payload'
import { staffUser } from '@/lib/preview'

/**
 * The inquiries as a real Excel workbook, for the team that lives in
 * spreadsheets: one row per inquiry, one column per question — including
 * the custom ones — with products and journeys by title.
 *
 * Admins and sales only, like the collection itself; the admin's session
 * cookie is the credential. `?ids=a,b,c`
 * limits the export to the rows ticked in the list.
 */
export const dynamic = 'force-dynamic'

const MAX = 5000

type Any = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const titleOf = (v: unknown) =>
  typeof v === 'object' && v !== null ? String((v as Any).title ?? (v as Any).name ?? '') : ''

export async function GET(request: NextRequest) {
  // Same answer for signed-out and not-allowed: the route does not say it exists.
  if (!canHandleInquiries(await staffUser())) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const payload = await getPayloadSafe()
  if (!payload) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const ids = (request.nextUrl.searchParams.get('ids') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX)

  const { docs } = await payload.find({
    collection: 'inquiries',
    depth: 1,
    limit: MAX,
    sort: '-createdAt',
    ...(ids.length ? { where: { id: { in: ids } } } : {}),
  })
  const rows = docs as Any[]

  // Every custom question that was ever answered gets its own column, named
  // as the visitor saw it. Later questions come later.
  const questions: { name: string; label: string }[] = []
  for (const row of rows) {
    for (const a of (row.answers ?? []) as Any[]) {
      if (a?.name && !questions.some((q) => q.name === a.name)) {
        questions.push({ name: a.name, label: a.label || a.name })
      }
    }
  }

  const columns = [
    { header: 'Received', key: 'createdAt', width: 18 },
    { header: 'Status', key: 'status', width: 11 },
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Phone', key: 'phone', width: 16 },
    { header: 'Private / group', key: 'audience', width: 14 },
    { header: 'Company / community', key: 'organisation', width: 24 },
    { header: 'Participants', key: 'pax', width: 12 },
    { header: 'Preferred location', key: 'preferredLocation', width: 20 },
    { header: 'Preferred date', key: 'preferredDate', width: 14 },
    { header: 'Event', key: 'event', width: 24 },
    { header: 'Products', key: 'products', width: 36 },
    { header: 'Journeys', key: 'journeys', width: 30 },
    { header: 'Own ideas', key: 'ideas', width: 30 },
    { header: 'Goal of activity', key: 'goal', width: 48 },
    { header: 'Notes', key: 'notes', width: 48 },
    ...questions.map((q) => ({ header: q.label, key: `q:${q.name}`, width: 28 })),
    { header: 'Language', key: 'locale', width: 10 },
  ]

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Atibhagya'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Inquiries', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })
  sheet.columns = columns

  for (const row of rows) {
    const answers = Object.fromEntries(
      ((row.answers ?? []) as Any[]).map((a) => [`q:${a.name}`, a.value ?? '']),
    )
    sheet.addRow({
      createdAt: row.createdAt ? new Date(row.createdAt) : '',
      status: row.status ?? '',
      name: row.name ?? '',
      email: row.email ?? '',
      phone: row.phone ?? '',
      audience: row.audience ?? '',
      organisation: row.organisation ?? '',
      pax: row.pax ?? '',
      preferredLocation: row.preferredLocation ?? '',
      preferredDate: row.preferredDate ?? '',
      event: titleOf(row.event),
      products: ((row.products ?? []) as unknown[]).map(titleOf).filter(Boolean).join(', '),
      journeys: ((row.journeys ?? []) as unknown[]).map(titleOf).filter(Boolean).join(', '),
      ideas: ((row.customActivities ?? []) as Any[]).map((c) => c.label).filter(Boolean).join(', '),
      goal: row.goal ?? '',
      notes: row.notes ?? '',
      locale: row.locale ?? '',
      ...answers,
    })
  }

  // The header row: bold on a quiet band, with filters ready.
  const header = sheet.getRow(1)
  header.font = { bold: true, color: { argb: 'FF10222F' } }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F3E7' } }
  header.alignment = { vertical: 'middle' }
  header.height = 22
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } }
  sheet.getColumn('createdAt').numFmt = 'yyyy-mm-dd hh:mm'
  for (const key of ['goal', 'notes']) {
    sheet.getColumn(key).alignment = { wrapText: true, vertical: 'top' }
  }

  const stamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-')
  const buffer = await workbook.xlsx.writeBuffer()

  return new Response(new Uint8Array(buffer as ArrayBuffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="atibhagya-inquiries-${stamp}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
