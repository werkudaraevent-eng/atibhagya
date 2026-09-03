'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'
import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin)

const EASE = 'power3.out'

/**
 * When an entrance plays: as the element's top clears the bottom edge of
 * the viewport, less a sliver. Earlier thresholds (88–95%) read well on a
 * long page but never fired for anything sitting in the last few percent
 * of a short one — the footer's last line stayed invisible with the page
 * scrolled to its end. At the very edge, everything that can be seen is.
 */
const ENTER = 'top 99%'

/** Marks an element whose entrance has been set up, so it is never done twice. */
const DONE = 'motionDone'

/**
 * Elements inside `scope` (or `scope` itself) matching `selector` that have
 * not been enhanced yet. Each is claimed as it is returned.
 */
function fresh(scope: ParentNode, selector: string): HTMLElement[] {
  const found = Array.from(scope.querySelectorAll<HTMLElement>(selector))
  if (scope instanceof HTMLElement && scope.matches(selector)) found.unshift(scope)
  return found.filter((el) => {
    if (el.dataset[DONE]) return false
    el.dataset[DONE] = '1'
    return true
  })
}

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
 *   data-draw        an SVG stroke (the ornaments) that draws itself in
 *   data-open        an image that opens from its top edge
 *   data-rowtext     catalogue text drifting slower than its photograph
 *   data-zoom        the slow hero zoom
 *   data-heroword    hero text parallax and fade
 *   data-para        image parallax inside a clipping parent
 *   data-clip        clip-path reveal tied to scroll position
 *   data-row-index   feeds the running N° in the margin
 *
 * The stylesheet holds every opted-in element at its start state, so nothing
 * flashes in before JavaScript runs — which also means an element that arrives
 * after load (a filtered catalogue, Load more) stays hidden until it is set up
 * here. A MutationObserver on <main> catches those and enhances them as they
 * land.
 *
 * `gsap.matchMedia` carries the reduced-motion branch: under it every element
 * is simply set to its finished state, so the page is complete and still.
 */
/** `/id/product/x` and `/product/x` are the same page in two languages. */
const sansLocale = (path: string) => path.replace(/^\/id(?=\/|$)/, '') || '/'

/** The last route this component set up, across navigations. */
let lastRoute: string | null = null

export function Motion() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    let observer: MutationObserver | undefined

    // Switching language re-renders the same page with other words. Playing
    // every entrance again — headlines rising, images opening — would make
    // the switch a flourish rather than a translation, so on that one kind
    // of navigation the page arrives already settled.
    const sameContent =
      lastRoute !== null && lastRoute !== pathname && sansLocale(lastRoute) === sansLocale(pathname)
    lastRoute = pathname

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
          const main = document.querySelector<HTMLElement>('[data-page] main')

          // The nav's progress hairline, and the point where it turns ivory.
          //
          // One trigger spanning the whole document drives both. A separate
          // trigger starting at 82vh would report itself inactive once the
          // scroll reached `max`, and the nav would fall back to transparent
          // at the very bottom of the page.
          const track = (self: ScrollTrigger) => {
            root.style.setProperty('--scroll-progress', `${(self.progress * 100).toFixed(2)}%`)
            if (self.scroll() > window.innerHeight * 0.82) root.dataset.navSolid = '1'
            else delete root.dataset.navSolid
          }
          ScrollTrigger.create({ start: 0, end: 'max', onUpdate: track, onRefresh: track })

          // 3. The catalogue's own N° travels down the margin, taking the
          // number of whichever experience is passing the middle of the screen.
          // Rebuilt whenever the set of rows changes.
          const marker = document.querySelector<HTMLElement>('[data-index-marker]')
          let indexTriggers: ScrollTrigger[] = []

          const buildIndex = () => {
            indexTriggers.forEach((t) => t.kill())
            indexTriggers = []
            const rows = gsap.utils.toArray<HTMLElement>('[data-row-index]')
            if (!marker || !rows.length) return

            // One trigger owns whether the marker is on screen; the row
            // triggers only change the number. Letting both drive autoAlpha
            // made them fight over it.
            const setMarker = (on: boolean) =>
              gsap.to(marker, { autoAlpha: on ? 1 : 0, duration: 0.5, ease: EASE })

            indexTriggers.push(
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
              }),
            )

            rows.forEach((row) => {
              indexTriggers.push(
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
                }),
              )
            })
          }

          /**
           * Sets up every not-yet-enhanced element within `scope`. With
           * `animate` off, elements are simply placed in their finished state.
           */
          const enhance = (scope: ParentNode, animate = full) => {
            const headlines = fresh(scope, '[data-headline]')
            const fades = fresh(scope, '[data-fade]')
            const rules = fresh(scope, '[data-rule]')
            const opens = fresh(scope, '[data-open]')
            const rowtexts = fresh(scope, '[data-rowtext]')
            const draws = fresh(scope, '[data-draw]')

            if (!animate) {
              // Nothing moves. Everything is simply present. (An empty list
              // is skipped: GSAP warns "target not found" for one.)
              const settle = (targets: HTMLElement[], vars: gsap.TweenVars) => {
                if (targets.length) gsap.set(targets, vars)
              }
              settle(headlines, { visibility: 'visible' })
              settle([...fades, ...fresh(scope, '[data-reveal]')], { opacity: 1, y: 0 })
              settle(rules, { scaleX: 1 })
              settle(opens, { clipPath: 'inset(0% 0% 0% 0%)' })
              settle(draws, { opacity: 1, drawSVG: '100%' })
              return
            }

            // 1. Headlines open a line at a time. SplitText measures the lines
            // as they actually render, so a title that wraps on a narrow
            // screen still animates line by line rather than as one block.
            headlines.forEach((el) => {
              SplitText.create(el, {
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
                    scrollTrigger: { trigger: el, start: ENTER, once: true },
                  })
                },
              })
              gsap.set(el, { visibility: 'visible' })
            })

            // Fade and rise.
            //
            // `fromTo`, not `from`: the stylesheet already holds these
            // elements at their start state to stop them flashing in before
            // JavaScript runs, so `from` would animate from that state back
            // to it — an animation that plays and changes nothing.
            fades.forEach((el) => {
              gsap.fromTo(
                el,
                { opacity: 0, y: 26 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 1,
                  ease: EASE,
                  scrollTrigger: { trigger: el, start: ENTER, once: true },
                },
              )
            })

            // 2. Hairlines draw themselves in.
            rules.forEach((el) => {
              gsap.fromTo(
                el,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                  scaleX: 1,
                  duration: 0.9,
                  ease: EASE,
                  scrollTrigger: { trigger: el, start: ENTER, once: true },
                },
              )
            })

            // 5. Images open from their own top edge.
            opens.forEach((el) => {
              gsap.fromTo(
                el,
                { clipPath: 'inset(0% 0% 100% 0%)' },
                {
                  clipPath: 'inset(0% 0% 0% 0%)',
                  duration: 1.15,
                  ease: EASE,
                  scrollTrigger: { trigger: el, start: ENTER, once: true },
                },
              )
            })

            // 7. Ornaments draw themselves in — once, then hold still. The
            // strokes of one mark start together and finish a beat apart.
            const byMark = new Map<Element, HTMLElement[]>()
            draws.forEach((el) => {
              const owner = el.closest('svg') ?? el
              byMark.set(owner, [...(byMark.get(owner) ?? []), el])
            })
            byMark.forEach((strokes, owner) => {
              gsap.set(strokes, { opacity: 1 })
              gsap.fromTo(
                strokes,
                { drawSVG: '0%' },
                {
                  drawSVG: '100%',
                  duration: 1.1,
                  ease: EASE,
                  stagger: 0.14,
                  scrollTrigger: { trigger: owner, start: ENTER, once: true },
                },
              )
            })

            // 6. In the catalogue, the text drifts slower than the photograph.
            rowtexts.forEach((el) => {
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
          }

          enhance(document, full && !sameContent)
          buildIndex()

          if (full && !sameContent) {
            // 4. The page arrives rather than cuts.
            //
            // The animation lands on <main>, never on the wrapper around it:
            // a transform on an ancestor becomes the containing block for any
            // `position: fixed` descendant, which would tear the fixed nav
            // off the viewport and scroll it away with the page.
            gsap.fromTo(
              '[data-page] main',
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.5, ease: EASE },
            )
          }

          // Scroll-driven effects belong to every visit, translation included.
          if (full) {
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
          }

          // React re-renders the catalogue when it is filtered or extended,
          // and those rows are brand new DOM: still at their stylesheet start
          // state, unknown to any trigger. Pick them up as they land, and let
          // go of triggers whose elements have been removed.
          //
          // SplitText also inserts nodes (its line wrappers), so only nodes
          // that carry, or contain, an opted-in element cause a pass.
          if (main) {
            let pending = 0
            observer = new MutationObserver((records) => {
              const touched = records.some((r) =>
                Array.from(r.addedNodes).some(
                  (n) =>
                    n instanceof HTMLElement &&
                    (n.matches('[data-headline],[data-fade],[data-rule],[data-open],[data-draw],[data-rowtext],[data-row-index]') ||
                      n.querySelector('[data-headline],[data-fade],[data-rule],[data-open],[data-draw],[data-rowtext],[data-row-index]')),
                ),
              )
              if (!touched) return

              window.cancelAnimationFrame(pending)
              pending = window.requestAnimationFrame(() => {
                ScrollTrigger.getAll().forEach((t) => {
                  const el = t.trigger
                  if (el instanceof Element && !el.isConnected) t.kill()
                })
                // Through `context.add`, so these tweens are reverted with
                // the rest when the route changes.
                context.add(() => {
                  enhance(main)
                  buildIndex()
                })
                ScrollTrigger.refresh()
              })
            })
            observer.observe(main, { childList: true, subtree: true })
          }
        },
      )
    })

    if (process.env.NODE_ENV === 'development') {
      // A handle for poking at animations from the console while developing.
      Object.assign(window as unknown as Record<string, unknown>, { gsap, ScrollTrigger })
    }

    // Fonts and images settle after first paint, so measure again once they have.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      window.clearTimeout(refresh)
      observer?.disconnect()
      context.revert()
      // Anything that survives the route change is back at its stylesheet
      // start state now, so it must be eligible for enhancement again.
      document
        .querySelectorAll<HTMLElement>(`[data-motion-done]`)
        .forEach((el) => delete el.dataset[DONE])
    }
  }, [pathname])

  return null
}
