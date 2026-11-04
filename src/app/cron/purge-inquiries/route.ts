import { timingSafeEqual } from 'node:crypto'

import { NextResponse, type NextRequest } from 'next/server'

import { getPayloadSafe } from '@/lib/payload'
import { purgeExpiredInquiries } from '@/lib/retention'

/**
 * Nightly deletion of inquiries past their retention period, called by
 * Vercel Cron (vercel.json). Vercel sends `Authorization: Bearer
 * $CRON_SECRET`; without that secret configured the route refuses
 * everything rather than running open.
 */
export const dynamic = 'force-dynamic'

const authorised = (request: NextRequest) => {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const given = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret}`)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const payload = await getPayloadSafe()
  if (!payload) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  try {
    const result = await purgeExpiredInquiries(payload)
    payload.logger.info(result, 'Purged expired inquiries')
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    payload.logger.error({ err }, 'Could not purge expired inquiries')
    return NextResponse.json({ error: 'Purge failed' }, { status: 500 })
  }
}
