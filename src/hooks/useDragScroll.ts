'use client'

import { useCallback, useEffect, useRef } from 'react'

interface UseDragScrollOptions {
  /** Speed multiplier for dragging. Defaults to 1. */
  speed?: number
  /** Movement threshold in pixels before considered a drag rather than a click. Defaults to 5. */
  threshold?: number
  /** Whether to apply inertia / momentum glide after releasing mouse drag. Defaults to true. */
  momentum?: boolean
}

/**
 * Hook to enable smooth mouse click-and-drag side scrolling on any horizontal scroll container,
 * while preserving native trackpad swipe and preventing accidental click on links/buttons when dragging.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseDragScrollOptions = {},
) {
  const { speed = 1.2, threshold = 5, momentum = true } = options
  const ref = useRef<T | null>(null)

  const isDown = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const startScrollLeft = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const velocity = useRef(0)
  const animId = useRef<number | null>(null)
  const prevScrollBehavior = useRef('')
  const prevScrollSnapType = useRef('')

  const stopMomentum = useCallback(() => {
    if (animId.current !== null) {
      cancelAnimationFrame(animId.current)
      animId.current = null
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onPointerDown = (e: PointerEvent) => {
      // Only drag with primary mouse button (left click)
      if (e.pointerType === 'mouse' && e.button !== 0) return
      // Touch devices already have optimal native gesture scrolling
      if (e.pointerType === 'touch') return

      stopMomentum()
      isDown.current = true
      isDragging.current = false
      startX.current = e.clientX
      startY.current = e.clientY
      startScrollLeft.current = el.scrollLeft
      lastX.current = e.clientX
      lastTime.current = performance.now()
      velocity.current = 0

      // Store previous styles
      prevScrollBehavior.current = el.style.scrollBehavior
      prevScrollSnapType.current = el.style.scrollSnapType
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown.current) return
      if (e.pointerType === 'touch') return

      const deltaX = e.clientX - startX.current
      const deltaY = e.clientY - startY.current

      // Check if distance exceeds threshold
      if (!isDragging.current) {
        if (Math.hypot(deltaX, deltaY) > threshold) {
          isDragging.current = true
          try {
            el.setPointerCapture(e.pointerId)
          } catch {
            // pointer capture not available or already captured
          }
          // Disable smooth scroll and snap during active mouse drag for 1:1 tactile response
          el.style.scrollBehavior = 'auto'
          el.style.scrollSnapType = 'none'
          el.style.cursor = 'grabbing'
          el.style.userSelect = 'none'
          document.body.style.userSelect = 'none'
        }
      }

      if (isDragging.current) {
        el.scrollLeft = startScrollLeft.current - deltaX * speed

        const now = performance.now()
        const dt = now - lastTime.current
        if (dt > 0) {
          const dx = e.clientX - lastX.current
          // Filtered velocity in px/ms
          velocity.current = 0.7 * (dx / dt) + 0.3 * velocity.current
          lastX.current = e.clientX
          lastTime.current = now
        }
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDown.current) return
      if (e.pointerType === 'touch') return

      isDown.current = false

      if (isDragging.current) {
        try {
          if (el.hasPointerCapture(e.pointerId)) {
            el.releasePointerCapture(e.pointerId)
          }
        } catch {
          // ignore
        }

        el.style.cursor = ''
        el.style.userSelect = ''
        document.body.style.userSelect = ''

        const finish = () => {
          if (el) {
            el.style.scrollBehavior = prevScrollBehavior.current
            el.style.scrollSnapType = prevScrollSnapType.current
          }
          // Keep isDragging true for a tick so click handler can intercept and prevent navigation
          setTimeout(() => {
            isDragging.current = false
          }, 50)
        }

        if (momentum && Math.abs(velocity.current) > 0.15) {
          let currentVel = velocity.current * 14 * speed
          const friction = 0.93

          const step = () => {
            if (!el || Math.abs(currentVel) < 0.5) {
              finish()
              return
            }
            el.scrollLeft -= currentVel
            currentVel *= friction
            animId.current = requestAnimationFrame(step)
          }

          animId.current = requestAnimationFrame(step)
        } else {
          finish()
        }
      } else {
        isDragging.current = false
      }
    }

    const onPointerCancel = (e: PointerEvent) => {
      if (!isDown.current) return
      isDown.current = false
      isDragging.current = false
      try {
        if (el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId)
        }
      } catch {
        // ignore
      }
      el.style.cursor = ''
      el.style.userSelect = ''
      document.body.style.userSelect = ''
      el.style.scrollBehavior = prevScrollBehavior.current
      el.style.scrollSnapType = prevScrollSnapType.current
    }

    const onClickCapture = (e: MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Prevent browser native drag-ghost on <img> and <a> inside the container
    const onDragStart = (e: DragEvent) => {
      e.preventDefault()
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
    el.addEventListener('click', onClickCapture, true)
    el.addEventListener('dragstart', onDragStart)

    return () => {
      stopMomentum()
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      el.removeEventListener('click', onClickCapture, true)
      el.removeEventListener('dragstart', onDragStart)
      document.body.style.userSelect = ''
    }
  }, [speed, threshold, momentum, stopMomentum])

  return ref
}
