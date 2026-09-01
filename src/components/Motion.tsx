'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

gsap.registerPlugin(ScrollTrigger, SplitText)

const EASE = 'power3.out'

/**
 * The site's motion, in one place.
 *
 * Sections stay server components and opt in with data attributes, so nothing
 * about the markup has to know GSAP exists:
 *
 *   data-headline    split into real rendered lines, each rising from a mask
 *   data-fade        fade and rise on entry
 *   data-reveal      marks entry without moving, for blocks whose parts animate
 *   data-rule        a hairline that draws itself across
 *   data-open        an image that opens from its top edge
 *   data-rowtext     catalogue text drifting slower than its photograph
 *   data-zoom        the slow hero zoom
 *   data-heroword    hero text parallax and fade
 *   data-para        image parallax inside a clipping parent
 *   data-clip        clip-path reveal tied to scroll position
 *   data-row-index   feeds the running N° in the margin
 *
 * `gsap.matchMedia` carries the reduced-motion branch: under it every element
 * is simply set to its finished state, so the page is complete and still.
 */
export function Motion() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add(
        {
          full: '(prefers-reduced-motion: no-preference)',
          calm: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { full } = ctx.conditions as { full: boolean; calm: boolean }
          const root = document.documentElement

          const headlines = gsap.utils.toArray<HTMLElement>('[data-headline]')

          if (!full) {
            // Nothing moves. Everything is simply present — but the nav still
            // needs to know when it has left the hero, and the progress line
            // is information rather than decoration.
            gsap.set(headlines, { visibility: 'visible' })
            gsap.set('[data-fade], [data-reveal]', { opacity: 1, y: 0 })
            gsap.set('[data-rule]', { scaleX: 1 })
            gsap.set('[data-open]', { clipPath: 'inset(0% 0% 0% 0%)' })

            const track = (self: ScrollTrigger) => {
              root.style.setProperty('--scroll-progress', `${(self.progress * 100).toFixed(2)}%`)
              if (self.scroll() > window.innerHeight * 0.82) root.dataset.navSolid = '1'
              else delete root.dataset.navSolid
            }

            ScrollTrigger.create({ start: 0, end: 'max', onUpdate: track, onRefresh: track })
            return
          }

          // 4. The page arrives rather than cuts.
          //
          // The animation lands on <main>, never on the wrapper around it: a
          // transform on an ancestor becomes the containing block for any
          // `position: fixed` descendant, which would tear the fixed nav off
          // the viewport and scroll it away with the page.
          gsap.fromTo(
            '[data-page] main',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: EASE },
          )

          // 1. Headlines open a line at a time. SplitText measures the lines as
          // they actually render, so a title that wraps on a narrow screen
          // still animates line by line rather than as one block.
          headlines.forEach((el) => {
            const split = SplitText.create(el, {
              type: 'lines',
              linesClass: 'splitLine',
              mask: 'lines',
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 105,
                  opacity: 0,
                  duration: 0.95,
                  ease: EASE,
                  stagger: 0.09,
                  scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                })
              },
            })
            gsap.set(el, { visibility: 'visible' })
            return split
          })

          // Fade and rise.
          //
          // `fromTo`, not `from`: the stylesheet already holds these elements
          // at their start state to stop them flashing in before JavaScript
          // runs, so `from` would animate from that state back to it — an
          // animation that plays and changes nothing.
          gsap.utils.toArray<HTMLElement>('[data-fade]').forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: EASE,
                scrollTrigger: { trigger: el, start: 'top 92%', once: true },
              },
            )
          })

          // 2. Hairlines draw themselves in.
          gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((el) => {
            gsap.fromTo(
              el,
              { scaleX: 0, transformOrigin: 'left center' },
              {
                scaleX: 1,
                duration: 0.9,
                ease: EASE,
                scrollTrigger: { trigger: el, start: 'top 95%', once: true },
              },
            )
          })

          // 5. Images open from their own top edge.
          gsap.utils.toArray<HTMLElement>('[data-open]').forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: 'inset(0% 0% 100% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.15,
                ease: EASE,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              },
            )
          })

          // 6. In the catalogue, the text drifts slower than the photograph.
          gsap.utils.toArray<HTMLElement>('[data-rowtext]').forEach((el) => {
            gsap.fromTo(
              el,
              { y: 26 },
              {
                y: -26,
                ease: 'none',
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            )
          })

          // The slow hero zoom, and the hero text drifting up as you leave it.
          gsap.utils.toArray<HTMLElement>('[data-zoom]').forEach((el) => {
            gsap.fromTo(
              el,
              { scale: 1 },
              {
                scale: 1.12,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
              },
            )
          })

          gsap.utils.toArray<HTMLElement>('[data-heroword]').forEach((el) => {
            gsap.to(el, {
              y: () => window.innerHeight * 0.22,
              opacity: 0,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top top', end: '+=70%', scrub: true },
            })
          })

          // Full-bleed images drifting inside their frame.
          gsap.utils.toArray<HTMLElement>('[data-para]').forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: 'none',
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            )
          })

          // Clip-path reveals tied to scroll position.
          gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: 'inset(14% 9% 14% 9%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: true },
              },
            )
          })

          // The nav's progress hairline, and the point where it turns ivory.
          //
          // One trigger spanning the whole document drives both. A separate
          // trigger starting at 82vh would report itself inactive once the
          // scroll reached `max`, and the nav would fall back to transparent
          // at the very bottom of the page.
          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
              root.style.setProperty('--scroll-progress', `${(self.progress * 100).toFixed(2)}%`)
              if (self.scroll() > window.innerHeight * 0.82) root.dataset.navSolid = '1'
              else delete root.dataset.navSolid
            },
            onRefresh: (self) => {
              if (self.scroll() > window.innerHeight * 0.82) root.dataset.navSolid = '1'
              else delete root.dataset.navSolid
            },
          })

          // 3. The catalogue's own N° travels down the margin, taking the
          // number of whichever experience is passing the middle of the screen.
          const marker = document.querySelector<HTMLElement>('[data-index-marker]')
          const rows = gsap.utils.toArray<HTMLElement>('[data-row-index]')

          if (marker && rows.length) {
            // One trigger owns whether the marker is on screen; the row
            // triggers only change the number. Letting both drive autoAlpha
            // made them fight over it.
            const setMarker = (on: boolean) =>
              gsap.to(marker, { autoAlpha: on ? 1 : 0, duration: 0.5, ease: EASE })

            ScrollTrigger.create({
              trigger: rows[0],
              start: 'top 60%',
              endTrigger: rows[rows.length - 1],
              end: 'bottom 40%',
              onEnter: () => setMarker(true),
              onEnterBack: () => setMarker(true),
              onLeave: () => setMarker(false),
              onLeaveBack: () => setMarker(false),
              // A page restored mid-catalogue (browser back, a shared anchor)
              // has to start in the right state rather than wait for a scroll.
              onRefresh: (self) => gsap.set(marker, { autoAlpha: self.isActive ? 1 : 0 }),
            })

            rows.forEach((row) => {
              ScrollTrigger.create({
                trigger: row,
                start: 'top 50%',
                end: 'bottom 50%',
                onToggle: (self) => {
                  if (!self.isActive) return
                  const label = row.dataset.rowIndex ?? ''
                  if (marker.textContent === label) return
                  // Swap the text outright and nudge it, rather than fading
                  // out and back in: a fast scroll can cross several rows at
                  // once, and overlapping opacity tweens would race and leave
                  // the marker stuck invisible.
                  marker.textContent = label
                  // No `overwrite` here: it would kill the separate tween
                  // that fades the marker in, leaving it stuck invisible.
                  gsap.fromTo(marker, { y: 7 }, { y: 0, duration: 0.4, ease: EASE })
                },
              })
            })
          }
        },
      )
    })

    if (process.env.NODE_ENV === 'development') {
      // A handle for poking at animations from the console while developing.
      Object.assign(window as unknown as Record<string, unknown>, { gsap, ScrollTrigger })
    }

    // Load-more adds rows after mount, so measurements are refreshed once the
    // browser has settled.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      window.clearTimeout(refresh)
      context.revert()
    }
  }, [pathname])

  return null
}
