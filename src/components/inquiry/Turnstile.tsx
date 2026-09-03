'use client'

import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Public by design; empty means the widget is not drawn at all. */
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

type Props = {
  siteKey: string
  /** Called with a fresh token, or an empty string when one expires or fails. */
  onToken: (token: string) => void
}

/**
 * The bot check, drawn only when it has something to ask.
 *
 * `interaction-only` keeps the widget out of sight for the ordinary visitor;
 * it appears — as a small box above the submit button — only if Cloudflare
 * wants a click. The token it yields goes with the submission and is
 * checked again on the server.
 */
export function Turnstile({ siteKey, onToken }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // `onToken` is a state setter, so it is stable and the widget is rendered
  // once; a changing callback would re-render it, which is the right thing.
  useEffect(() => {
    const host = ref.current
    if (!host) return
    let id: string | undefined
    let cancelled = false

    const render = () => {
      if (cancelled || !window.turnstile) return
      id = window.turnstile.render(host, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        size: 'flexible',
        theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
        callback: (token: string) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      })
    }

    if (window.turnstile) {
      render()
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`)
      if (!script) {
        script = document.createElement('script')
        script.src = SCRIPT
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', render, { once: true })
    }

    return () => {
      cancelled = true
      if (id) window.turnstile?.remove(id)
    }
  }, [siteKey, onToken])

  return <div ref={ref} />
}
