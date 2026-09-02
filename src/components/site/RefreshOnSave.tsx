'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Makes the admin's live preview follow the document.
 *
 * Payload's preview panel loads the real page in an iframe and posts a
 * message to it whenever the document is saved or published — but only once
 * the page has announced itself ready, which is the handshake below. Without
 * it the admin stays silent and the panel only changes when the editor
 * reloads it by hand. On the saved message this re-fetches the route. It does
 * nothing outside the admin: the page has to be inside a frame, and the
 * messages have to come from this site's own origin.
 */
export function RefreshOnSave() {
  const router = useRouter()

  useEffect(() => {
    if (window.parent === window) return

    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || window.location.origin
    let pending: ReturnType<typeof setTimeout> | null = null

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== serverURL && event.origin !== window.location.origin) return
      const type = (event.data as { type?: string } | null)?.type
      if (type !== 'payload-document-event') return

      // Saves can arrive in quick succession; one refresh is enough.
      if (pending) clearTimeout(pending)
      pending = setTimeout(() => router.refresh(), 150)
    }

    window.addEventListener('message', onMessage)

    // The handshake: the admin waits for this before it sends anything.
    window.parent.postMessage({ type: 'payload-live-preview', ready: true }, serverURL)

    return () => {
      window.removeEventListener('message', onMessage)
      if (pending) clearTimeout(pending)
    }
  }, [router])

  return null
}
