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
 *   data-words       split into words, each settling from a blur — the new
 *                    design's text effect, for heroes and section openings
 *   data-fade        fade and rise on entry
 *   data-reveal      marks entry without moving, for blocks whose parts animate
 *   data-rule        a hairline that draws itself across
 *   data-draw        an SVG stroke (the ornaments) that draws itself in
 *   data-open        an image that opens from its top edge
 *   data-rowtext     catalogue text drifting slower than its photograph
 *   data-drift       a strip image: lerped lag, a stretch at speed, and a
 *                    sideways drift by its place in the row (-1 | 0 | 1)
 *   data-heroveil    the ivory veil the page pulls over the hero
 *   data-zoom        the slow hero zoom
 *   data-heroword    hero text parallax and fade
 *   data-para        image parallax inside a clipping parent
 *   data-clip        clip-path reveal tied to scroll position
 *   data-row-index   feeds the running N° in the margin
 *   data-stage       a section (with an id) that is a stop on the path
 *                    indicator; with data-chapter="01", also a chapter
 *   data-dark        a dark section: the fixed marks switch to ivory over it
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
    let chapterTimer = 0
    /** Torn down with the effect — for listeners GSAP does not own. */
    let stopDrift: (() => void) | undefined

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
          // The path indicator and the chapter mark, fed by the page's
          // stages. The thread fills between one stage's top and the next,
          // measured at 45% of the viewport; the knot and chapter are those
          // of the last stage whose top has passed that line. Constants are
          // the design's own.
          const stages = gsap.utils.toArray<HTMLElement>('[data-stage]').filter((el) => el.id)
          const path = document.querySelector<HTMLElement>('[data-role="path"]')
          const thread = path?.querySelector<SVGPathElement>('[data-role="thread"]') ?? null
          const knots = path ? gsap.utils.toArray<HTMLElement>('[data-knot]', path) : []
          const chapter = document.querySelector<HTMLElement>('[data-role="chapter"]')
          const darks = gsap.utils.toArray<HTMLElement>('[data-dark]')
          const unit = gsap.utils.clamp(0, 1)
          let tops: number[] = []
          let active = -1

          const measure = () => {
            const y = window.scrollY
            tops = stages.map((s) => s.getBoundingClientRect().top + y)
          }

          const overDark = (viewportY: number) =>
            darks.some((d) => {
              const r = d.getBoundingClientRect()
              return viewportY >= r.top && viewportY <= r.bottom
            })

          /** The vertical middle of a fixed mark, in viewport pixels. */
          const middleOf = (el: HTMLElement | null, fallback: number) => {
            if (!el) return fallback
            const r = el.getBoundingClientRect()
            return r.height ? r.top + r.height / 2 : fallback
          }

          const flag = (el: HTMLElement | null, name: string, on: boolean) => {
            if (!el) return
            if (on) el.setAttribute(name, '')
            else el.removeAttribute(name)
          }

          const followStages = (y: number, atEnd: boolean) => {
            if (!stages.length || !tops.length) return
            const vh = window.innerHeight
            const line = y + vh * 0.45
            const last = tops.length - 1

            let prog = 0
            for (let i = 0; i < last; i++) {
              const a = tops[i]!
              const b = tops[i + 1]!
              if (line >= b) prog = i + 1
              else if (line > a) {
                prog = i + unit((line - a) / Math.max(1, b - a))
                break
              } else break
            }
            // A short last stage — the footer on a short page — may never
            // climb to the 45% line. The bottom of the page is the end of
            // the path regardless.
            if (atEnd) prog = last
            if (thread) {
              thread.style.strokeDashoffset = (100 - (100 * prog) / Math.max(1, tops.length - 1)).toFixed(2)
            }
            knots.forEach((knot, i) => {
              const drawn = i === 0 ? 1 : unit(prog - (i - 1))
              const curl = knot.querySelector<SVGPathElement>('[data-role="curl"]')
              if (curl) curl.style.strokeDashoffset = (100 - 100 * drawn).toFixed(1)
            })

            let now = 0
            tops.forEach((t, i) => {
              if (t <= line) now = i
            })
            if (atEnd) now = last
            if (now !== active) {
              active = now
              knots.forEach((knot, i) => {
                knot.dataset.state = i === now ? 'active' : i < now ? 'passed' : 'idle'
              })
              flag(path, 'data-last', now === stages.length - 1)

              if (chapter) {
                const stage = stages[now]!
                const number = stage.dataset.chapter
                chapter.removeAttribute('data-on')
                window.clearTimeout(chapterTimer)
                if (number) {
                  // Out for 450ms, new words, back in — the design's own beat.
                  chapterTimer = window.setTimeout(() => {
                    const n = chapter.querySelector('[data-role="chapterN"]')
                    const t = chapter.querySelector('[data-role="chapterT"]')
                    if (n) n.textContent = number
                    if (t) t.textContent = stage.dataset.stage ?? ''
                    chapter.setAttribute('data-on', '')
                  }, 450)
                }
              }
            }

            // Each mark switches to its ivory set when its own middle sits
            // over a dark section — not a fixed point that may be in the
            // footer while the mark is still over the page.
            flag(path, 'data-on-dark', overDark(middleOf(path, vh - 100)))
            flag(chapter, 'data-on-dark', overDark(middleOf(chapter, vh / 2)))
          }

          // A page that opens on the page colour has a solid header from the
          // start, so its marks show from the start; over a hero they wait
          // for the header to turn solid.
          const opensLight = Boolean(document.querySelector('[data-role="nav"][data-tone="light"]'))

          const track = (self: ScrollTrigger) => {
            root.style.setProperty('--scroll-progress', `${(self.progress * 100).toFixed(2)}%`)
            const solid = self.scroll() > window.innerHeight * 0.82
            if (solid) root.dataset.navSolid = '1'
            else delete root.dataset.navSolid
            if (solid || opensLight) root.dataset.marks = '1'
            else delete root.dataset.marks
            followStages(self.scroll(), self.progress >= 0.995)
          }
          const remeasure = (self: ScrollTrigger) => {
            measure()
            track(self)
          }
          const pageTrigger = ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: track,
            onRefresh: remeasure,
          })
          // The first state now, not on the next refresh: a page that opens
          // with its marks showing should not wait for one.
          remeasure(pageTrigger)

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
            const words = fresh(scope, '[data-words]')
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
              settle(words, { visibility: 'visible' })
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

            // Word settle — the new design's text effect. Each word arrives
            // from a slight blur and settles sharp, 70ms apart, on the same
            // 1.3s breath as the reference. For the few opening lines, not
            // for body copy.
            words.forEach((el) => {
              SplitText.create(el, {
                type: 'words',
                wordsClass: 'settleWord',
                autoSplit: true,
                onSplit(self) {
                  return gsap.fromTo(
                    self.words,
                    { opacity: 0, y: 8, filter: 'blur(8px)' },
                    {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      duration: 1.3,
                      ease: EASE,
                      stagger: 0.07,
                      scrollTrigger: { trigger: el, start: ENTER, once: true },
                    },
                  )
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
            // The hero veil: the page colour drawn over the photograph
            // between a quarter and 0.85 of the first viewport.
            gsap.utils.toArray<HTMLElement>('[data-heroveil]').forEach((el) => {
              gsap.fromTo(
                el,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: 'none',
                  scrollTrigger: { start: () => window.innerHeight * 0.25, end: () => window.innerHeight * 0.85, scrub: true },
                },
              )
            })

            // Strip images: the design's lerped lag and pull. A smoothed
            // copy of the scroll (lerp 0.09) trails the real one; the gap
            // shifts the image, the smoothed velocity (lerp 0.12) stretches
            // it a touch at speed; each card also drifts sideways by its
            // place in the row. The reference's own constants throughout.
            const drifts = gsap.utils.toArray<HTMLElement>('[data-drift]')
            if (drifts.length) {
              const sm = { y: window.scrollY, v: 0, last: window.scrollY }
              let raf = 0
              const paint = () => {
                const vh = window.innerHeight
                const lag = sm.y - window.scrollY
                const pull = Math.min(1, Math.abs(sm.v) / 60)
                drifts.forEach((el) => {
                  const r = el.getBoundingClientRect()
                  if (r.bottom < -80 || r.top > vh + 80) return
                  const c = (r.top + r.height / 2 - vh / 2) / vh
                  const place = parseInt(el.dataset.drift ?? '0', 10) || 0
                  el.style.transform =
                    `translate(${(place * c * -16).toFixed(1)}px, ${(c * -18 - lag * 0.12).toFixed(1)}px)` +
                    ` scale(${(1 + pull * 0.03).toFixed(4)})`
                })
              }
              const step = () => {
                const y = window.scrollY
                sm.v += (y - sm.last - sm.v) * 0.12
                sm.last = y
                sm.y += (y - sm.y) * 0.09
                paint()
                if (Math.abs(y - sm.y) > 0.3 || Math.abs(sm.v) > 0.05) raf = requestAnimationFrame(step)
                else {
                  raf = 0
                  sm.v = 0
                  paint()
                }
              }
              const wake = () => {
                if (!raf) raf = requestAnimationFrame(step)
              }
              window.addEventListener('scroll', wake, { passive: true })
              paint()
              stopDrift = () => {
                window.removeEventListener('scroll', wake)
                cancelAnimationFrame(raf)
              }
            }
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
                    (n.matches('[data-headline],[data-words],[data-fade],[data-rule],[data-open],[data-draw],[data-rowtext],[data-row-index]') ||
                      n.querySelector('[data-headline],[data-words],[data-fade],[data-rule],[data-open],[data-draw],[data-rowtext],[data-row-index]')),
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
      window.clearTimeout(chapterTimer)
      stopDrift?.()
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
