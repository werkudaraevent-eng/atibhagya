'use client'

import { Button, useSelection, useTranslation } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/** How often the list quietly re-fetches while it is on screen. */
const EVERY_MS = 60_000

/**
 * The bar above the inquiries table.
 *
 * The list does not know when a visitor has sent an inquiry; it shows what
 * it loaded and waits to be reloaded. So: a Refresh control, a quiet
 * re-fetch once a minute while the tab is visible, and — since the team
 * lives in spreadsheets — Export to Excel, of the ticked rows or of all.
 */
export const RefreshList = () => {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { selectedIDs } = useSelection()
  const [at, setAt] = useState<Date | null>(null)

  const refresh = () => {
    router.refresh()
    setAt(new Date())
  }

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    const timer = window.setInterval(tick, EVERY_MS)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
    }
    // `router` is stable; the effect should attach once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const id = i18n.language === 'id'
  const picked = selectedIDs.length

  const exportExcel = () => {
    const query = picked ? `?ids=${encodeURIComponent(selectedIDs.join(','))}` : ''
    window.location.assign(`/export/inquiries${query}`)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}
    >
      <Button buttonStyle="secondary" size="small" onClick={refresh}>
        {id ? 'Muat ulang' : 'Refresh'}
      </Button>
      <Button buttonStyle="primary" size="small" onClick={exportExcel}>
        {picked
          ? id
            ? `Ekspor ${picked} terpilih ke Excel`
            : `Export ${picked} selected to Excel`
          : id
            ? 'Ekspor semua ke Excel'
            : 'Export all to Excel'}
      </Button>
      <span style={{ opacity: 0.6, fontSize: 12 }}>
        {id
          ? `Diperbarui otomatis tiap menit${at ? ` · terakhir ${at.toLocaleTimeString()}` : ''}`
          : `Updates every minute${at ? ` · last ${at.toLocaleTimeString()}` : ''}`}
      </span>
    </div>
  )
}
