import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { WaterSurface } from './water'

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
    let width = 0, height = 0, frame = 0, lastPaint = 0, phase = 0
    let targetX = 0, targetY = 0, pointerX = 0, pointerY = 0
    let forceX = 0, forceY = 0, previousX = 0, previousY = 0, pressed = false, touchingBackground = false, pendingTouch = false
    let targetScroll = scrollY, easedScroll = scrollY, previousScroll = scrollY
    let water = new WaterSurface(1, 1), accumulator = 0
    let lastImpact = 0, impactX = 0, impactY = 0
    const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

    function resize() {
      width = innerWidth
      height = innerHeight
      water = new WaterSurface(width, height)
      accumulator = 0
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
      paint(0)
    }

    function lake(cx: number, cy: number, radius: number, rotation: number, color: string, seed: number) {
      const ctx = context!
      const cosine = Math.cos(rotation), sine = Math.sin(rotation)
      function point(x: number, y: number, first = false) {
        water.project(cx + x * cosine - y * sine, cy + x * sine + y * cosine)
        if (first) ctx.moveTo(water.x, water.y)
        else ctx.lineTo(water.x, water.y)
      }
      for (let ring = 0; ring < 7; ring++) {
        const size = radius * (.5 + ring * .13)
        const steps = Math.max(96, Math.min(360, Math.ceil(size * Math.PI * 2 / 10)))
        ctx.beginPath()
        for (let step = 0; step <= steps; step++) {
          const angle = step / steps * Math.PI * 2
          const edge = 1 + .1 * Math.sin(angle * 3 + seed) + .055 * Math.cos(angle * 5 - seed) + .018 * Math.sin(angle * 4 + phase * .35 + ring * .4)
          const x = Math.cos(angle) * size * edge
          const y = Math.sin(angle) * size * .62 * edge
          point(x, y, !step)
        }
        ctx.closePath()
        ctx.strokeStyle = `rgba(${color},${.14 - ring * .009})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
      // Fine currents inside the shoreline shapes.
      ctx.strokeStyle = `rgba(${color},.10)`
      for (let row = -2; row <= 2; row++) {
        const y = row * radius * .095
        const wave = Math.sin(phase * .3 + row) * 5
        ctx.beginPath()
        for (let step = 0; step <= 32; step++) {
          const t = step / 32, u = 1 - t
          point(radius * (-.32 * u ** 3 - .3 * u * u * t + .36 * u * t * t + .34 * t ** 3), y + 3 * u * u * t * (-8 + wave) + 3 * u * t * t * (8 - wave), !step)
        }
        ctx.stroke()
      }
    }

    function paint(dt: number) {
      const ctx = context!
      accumulator += dt
      while (accumulator >= 1 / 60) { water.step(); accumulator -= 1 / 60 }
      water.updateNormals()
      const ease = 1 - Math.exp(-dt * 4)
      pointerX += (targetX - pointerX) * ease
      pointerY += (targetY - pointerY) * ease
      easedScroll += (targetScroll - easedScroll) * ease
      forceX *= Math.exp(-dt * 3.2)
      forceY *= Math.exp(-dt * 3.2)
      const x = pointerX * 10 + forceX
      const y = pointerY * 8 + forceY - easedScroll * .018
      ctx.clearRect(0, 0, width, height)
      if (washContext) ctx.drawImage(wash, 0, 0, width, height)
      else { ctx.fillStyle = '#f5f8f7'; ctx.fillRect(0, 0, width, height) }
      lake(width * .13 + x + Math.sin(phase * .11) * 14, height * .72 + y, Math.min(420, Math.max(140, width * .27)), -.35, '17,111,182', .7)
      lake(width * .95 - x * .7, height * .27 + y * .6 + Math.sin(phase * .13) * 12, Math.min(350, Math.max(150, width * .23)), .55, '103,156,54', 2.4)
      lake(width * .74 + x * .4, height * .97 + y * .8, Math.min(260, Math.max(110, width * .16)), -.15, '17,111,182', 3.6)
      // Reed stems sway slowly near the lower shore.
      ctx.strokeStyle = 'rgba(103,156,54,.15)'
      ctx.lineWidth = 1.2
      for (let stem = 0; stem < 5; stem++) {
        const rootX = width * .88 + stem * 10 + x * .4
        const rootY = height * .9 + y * .5
        const sway = Math.sin(phase * .35 + stem * .55) * 7
        ctx.beginPath()
        for (let step = 0; step <= 24; step++) {
          const t = step / 24, u = 1 - t
          water.project(rootX + 2 * u * t * (-10 + sway) + t * t * (-5 + sway), rootY - 80 * u * t - t * t * (75 + stem * 5))
          if (!step) ctx.moveTo(water.x, water.y)
          else ctx.lineTo(water.x, water.y)
        }
        ctx.stroke()
      }
      const pollen = width < 768 ? 12 : 24
      for (let dot = 0; dot < pollen; dot++) {
        const px = ((dot * .618033 + .12) % 1) * width + Math.sin(phase * .12 + dot) * 10 + x * .2
        const py = ((dot * .381966 + .23) % 1) * height + Math.cos(phase * .13 + dot * 2) * 10 + y * .2
        water.project(px, py)
        ctx.beginPath()
        ctx.arc(water.x, water.y, dot % 3 ? 1.2 : 2, 0, Math.PI * 2)
        ctx.fillStyle = dot % 3 ? 'rgba(17,111,182,.13)' : 'rgba(210,163,31,.25)'
        ctx.fill()
      }
    }

    function tick(now: number) {
      frame = requestAnimationFrame(tick)
      if (now - lastPaint < 1000 / 30) return
      const dt = Math.min((now - lastPaint) / 1000, .05)
      lastPaint = now
      phase += dt
      paint(dt)
    }
    function visibility() {
      cancelAnimationFrame(frame)
      frame = 0
      lastPaint = 0
      pressed = touchingBackground = pendingTouch = false
      if (!document.hidden && !reduced) frame = requestAnimationFrame(tick)
    }
    function stir(x: number, y: number) {
      if (performance.now() - lastImpact < 33 || Math.hypot(x - impactX, y - impactY) < 8) return
      const steps = Math.min(4, Math.ceil(Math.hypot(x - impactX, y - impactY) / 18))
      for (let step = 1; step <= steps; step++) water.disturb(impactX + (x - impactX) * step / steps, impactY + (y - impactY) * step / steps, 16, -1.3)
      impactX = x
      impactY = y
      lastImpact = performance.now()
    }
    function down(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return
      if (event.target instanceof Element && event.target.closest(interactive)) {
        // A link tap stays a link tap. If the browser turns it into a scroll,
        // subsequent finger movement can still leave a gentle wake.
        pendingTouch = event.pointerType === 'touch' && !!event.target.closest('a') && !event.target.closest('dialog')
        if (pendingTouch) {
          previousX = impactX = event.clientX
          previousY = impactY = event.clientY
          lastImpact = performance.now()
        }
        return
      }
      pendingTouch = false
      pressed = true
      touchingBackground = event.pointerType === 'touch'
      previousX = event.clientX
      previousY = event.clientY
      targetX = event.clientX / width - .5
      targetY = event.clientY / height - .5
      forceX = targetX * 12
      forceY = targetY * 12
      water.disturb(event.clientX, event.clientY, 23, -10)
      impactX = event.clientX
      impactY = event.clientY
      lastImpact = performance.now()
    }
    function move(event: PointerEvent) {
      if (!event.isPrimary) return
      if (event.pointerType === 'touch') return
      if (event.pointerType === 'mouse' || pressed) {
        targetX = event.clientX / width - .5
        targetY = event.clientY / height - .5
      }
      if (pressed) {
        forceX = clamp(forceX + (event.clientX - previousX) * .45, 30)
        forceY = clamp(forceY + (event.clientY - previousY) * .45, 30)
        previousX = event.clientX
        previousY = event.clientY
        stir(event.clientX, event.clientY)
      }
    }
    function touchMove(event: TouchEvent) {
      if (!touchingBackground || event.touches.length !== 1) return
      const touch = event.touches[0]
      targetX = touch.clientX / width - .5
      targetY = touch.clientY / height - .5
      forceX = clamp(forceX + (touch.clientX - previousX) * .45, 30)
      forceY = clamp(forceY + (touch.clientY - previousY) * .45, 30)
      previousX = touch.clientX
      previousY = touch.clientY
      stir(touch.clientX, touch.clientY)
    }
    function release(event: Event) {
      pressed = false
      if (event.type === 'pointercancel') {
        if (pendingTouch) { touchingBackground = true; pendingTouch = false }
      } else { touchingBackground = pendingTouch = false }
    }
    function scroll() {
      targetScroll = scrollY
      forceY = clamp(forceY - (scrollY - previousScroll) * .12, 30)
      previousScroll = scrollY
    }
    resize()
    if (!reduced) {
      visibility()
      window.addEventListener('pointerdown', down, { passive: true })
      window.addEventListener('pointermove', move, { passive: true })
      window.addEventListener('pointerup', release, { passive: true })
      window.addEventListener('pointercancel', release, { passive: true })
      window.addEventListener('touchmove', touchMove, { passive: true })
      window.addEventListener('touchend', release, { passive: true })
      window.addEventListener('touchcancel', release, { passive: true })
      window.addEventListener('blur', release)
      window.addEventListener('scroll', scroll, { passive: true })
      document.addEventListener('visibilitychange', visibility)
    }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', release)
      window.removeEventListener('touchcancel', release)
      window.removeEventListener('blur', release)
      window.removeEventListener('scroll', scroll)
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
