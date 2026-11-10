import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { WaterSurface } from './water'
import { lakeContours, type ShorePoint } from './lakes'

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

const revealSelector = '.home-hero__content > *, .section-heading, .weekend-overview__heading, .race-card, .partner-group, .page-intro > .shell, .event-hero__inner > div, .info-block > h2, .program-day > h2, .distance-grid > div, .distance-option, .party-note, .resource-grid > section, .rules-list > section'

function usePageReveal(pageKey: string, reduced: boolean) {
  useLayoutEffect(() => {
    const main = document.getElementById('main')
    if (!main || reduced || !('IntersectionObserver' in window) || !Element.prototype.animate) return
    const seen = new WeakSet<Element>()
    const animations = new Set<Animation>()
    function reveal(element: Element) {
      const siblings = Array.from(element.parentElement?.children || [])
      const delay = Math.max(0, siblings.indexOf(element) % 4) * 30
      const animation = element.animate([
        { opacity: 0 },
        { opacity: 1 },
      ], { duration: 650, delay, easing: 'ease-out', fill: 'backwards' })
      animations.add(animation)
      animation.addEventListener('finish', () => animations.delete(animation), { once: true })
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target) }
      })
    }, { threshold: .08, rootMargin: '0px 0px -20px 0px' })
    function register(element: Element) {
      if (seen.has(element)) return
      seen.add(element)
      const box = element.getBoundingClientRect()
      if (box.bottom > 0 && box.top < innerHeight - 20) reveal(element)
      else observer.observe(element)
    }
    function scan(root: Element) {
      if (root.matches(revealSelector)) register(root)
      root.querySelectorAll(revealSelector).forEach(register)
    }
    scan(main)
    // Historical content can arrive after the route has rendered.
    const mutations = new MutationObserver(records => records.forEach(record => {
      record.addedNodes.forEach(node => { if (node instanceof Element) scan(node) })
    }))
    mutations.observe(main, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
      animations.forEach(animation => animation.cancel())
    }
  }, [pageKey, reduced])
}

const interactive = 'a, button, input, textarea, select, summary, label, dialog, [role="button"]'

function LakeBackground({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    const wash = document.createElement('canvas')
    const washContext = wash.getContext('2d')
    let width = 0, height = 0, frame = 0, lastPaint = 0, accumulator = 0
    let water = new WaterSurface(1, 1)
    let contours: { points: ShorePoint[]; color: string }[] = []
    let tap: { x: number; y: number; scroll: number } | null = null

    function resize() {
      // The large viewport stays the same when mobile browser controls collapse.
      const bounds = canvas!.getBoundingClientRect()
      if (width === bounds.width && height === bounds.height) return
      width = bounds.width
      height = bounds.height
      cancelAnimationFrame(frame)
      frame = lastPaint = accumulator = 0
      water = new WaterSurface(width, height)
      const ratio = Math.min(devicePixelRatio || 1, 1.5)
      canvas!.width = wash.width = Math.round(width * ratio)
      canvas!.height = wash.height = Math.round(height * ratio)
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (washContext) {
        washContext.setTransform(ratio, 0, 0, ratio, 0, 0)
        washContext.fillStyle = '#f5f8f7'
        washContext.fillRect(0, 0, width, height)
        for (const [x, y, color] of [[.15, .7, '17,111,182'], [.95, .22, '132,196,65']] as const) {
          const glow = washContext.createRadialGradient(width * x, height * y, 0, width * x, height * y, Math.max(width, height) * .65)
          glow.addColorStop(0, `rgba(${color},.085)`)
          glow.addColorStop(1, `rgba(${color},0)`)
          washContext.fillStyle = glow
          washContext.fillRect(0, 0, width, height)
        }
      }
      contours = []
      const layout = [
        { x: .13, y: .57, size: Math.min(690, Math.max(370, width * .48)), rotation: -.24, color: '17,111,182' },
        { x: .88, y: .23, size: Math.min(570, Math.max(320, width * .4)) * 1.12, rotation: .46, color: '103,156,54' },
        { x: .73, y: .96, size: Math.min(540, Math.max(270, width * .36)) * 1.12, rotation: -.12, color: '17,111,182' },
      ]
      lakeContours.forEach((rings, index) => {
        const { x, y, size, rotation, color } = layout[index]
        const cosine = Math.cos(rotation), sine = Math.sin(rotation)
        for (const [ring, outline] of rings.entries()) {
          const scale = size
          contours.push({
            color: `rgba(${color},${.14 - ring * .009})`,
            points: outline.map(([px, py]) => [
              width * x + (px * cosine - py * sine) * scale,
              height * y + (px * sine + py * cosine) * scale,
            ]),
          })
        }
      })
      paint()
    }

    function paint() {
      const ctx = context!
      water.updateNormals()
      ctx.clearRect(0, 0, width, height)
      if (washContext) ctx.drawImage(wash, 0, 0, width, height)
      else { ctx.fillStyle = '#f5f8f7'; ctx.fillRect(0, 0, width, height) }
      ctx.lineWidth = 1
      for (const { points, color } of contours) {
        ctx.beginPath()
        points.forEach(([x, y], index) => {
          water.project(x, y)
          if (index === 0) ctx.moveTo(water.x, water.y)
          else ctx.lineTo(water.x, water.y)
        })
        ctx.closePath()
        ctx.strokeStyle = color
        ctx.stroke()
      }
    }

    function tick(now: number) {
      frame = 0
      if (document.hidden) return
      if (!lastPaint) lastPaint = now
      const elapsed = now - lastPaint
      if (elapsed >= 1000 / 30) {
        accumulator += Math.min(elapsed / 1000, .05)
        lastPaint = now
        while (accumulator >= 1 / 60) { water.step(); accumulator -= 1 / 60 }
        if (water.settled) water.reset()
        paint()
      }
      // No animation loop, drift or parallax while the water is at rest.
      if (!water.settled) frame = requestAnimationFrame(tick)
    }

    function down(event: PointerEvent) {
      tap = event.isPrimary && event.button === 0
        ? { x: event.clientX, y: event.clientY, scroll: scrollY } : null
    }

    function move(event: PointerEvent) {
      if (tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 8) tap = null
    }

    function cancelTap() { tap = null }

    function click(event: MouseEvent) {
      const origin = tap
      tap = null
      if (!origin || Math.abs(scrollY - origin.scroll) > 2 || event.button !== 0 || !window.getSelection()?.isCollapsed) return
      if (event.target instanceof Element && event.target.closest(interactive)) return
      // Only a completed tap excites the water; scrolls and drags leave it still.
      water.disturb(event.clientX, event.clientY, 28, -2.8)
      if (!frame && !document.hidden) {
        lastPaint = 0
        frame = requestAnimationFrame(tick)
      }
    }

    function visibility() {
      cancelAnimationFrame(frame)
      frame = lastPaint = accumulator = 0
      if (!document.hidden && !water.settled) frame = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduced) {
      window.addEventListener('pointerdown', down, { passive: true })
      window.addEventListener('pointermove', move, { passive: true })
      window.addEventListener('pointercancel', cancelTap, { passive: true })
      window.addEventListener('blur', cancelTap)
      window.addEventListener('click', click, { passive: true })
      document.addEventListener('visibilitychange', visibility)
    }
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointercancel', cancelTap)
      window.removeEventListener('blur', cancelTap)
      window.removeEventListener('click', click)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [reduced])
  return <canvas className="lake-background" ref={ref} aria-hidden="true" />
}

export function SiteMotion({ pageKey }: { pageKey: string }) {
  const reduced = useReducedMotion()
  usePageReveal(pageKey, reduced)
  return <LakeBackground reduced={reduced} />
}
