import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Locale } from './data'

type Appearance = 'classic' | 'lakes'
const storageKey = 'lipiany-appearance'

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
      const delay = Math.max(0, siblings.indexOf(element) % 4) * 45
      const animation = element.animate([
        { opacity: 0, translate: '0 10px' },
        { opacity: 1, translate: '0 0' },
      ], { duration: 480, delay, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'backwards' })
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

type Ripple = { x: number; y: number; age: number }
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
    let forceX = 0, forceY = 0, previousX = 0, previousY = 0, pressed = false
    let targetScroll = scrollY, easedScroll = scrollY, previousScroll = scrollY
    let lastRipple = 0
    const ripples: Ripple[] = []
    const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

    function resize() {
      width = innerWidth
      height = innerHeight
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
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation)
      for (let ring = 0; ring < 7; ring++) {
        const size = radius * (.5 + ring * .13)
        ctx.beginPath()
        for (let step = 0; step <= 72; step++) {
          const angle = step / 72 * Math.PI * 2
          const edge = 1 + .1 * Math.sin(angle * 3 + seed) + .055 * Math.cos(angle * 5 - seed) + .018 * Math.sin(angle * 4 + phase * .35 + ring * .4)
          const x = Math.cos(angle) * size * edge
          const y = Math.sin(angle) * size * .62 * edge
          if (!step) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
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
        ctx.moveTo(-radius * .32, y)
        ctx.bezierCurveTo(-radius * .1, y - 8 + wave, radius * .12, y + 8 - wave, radius * .34, y)
        ctx.stroke()
      }
      ctx.restore()
    }

    function paint(dt: number) {
      const ctx = context!
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
        ctx.moveTo(rootX, rootY)
        ctx.quadraticCurveTo(rootX - 10 + sway, rootY - 40, rootX - 5 + sway, rootY - 75 - stem * 5)
        ctx.stroke()
      }
      const pollen = width < 768 ? 12 : 24
      for (let dot = 0; dot < pollen; dot++) {
        const px = ((dot * .618033 + .12) % 1) * width + Math.sin(phase * .12 + dot) * 10 + x * .2
        const py = ((dot * .381966 + .23) % 1) * height + Math.cos(phase * .13 + dot * 2) * 10 + y * .2
        ctx.beginPath()
        ctx.arc(px, py, dot % 3 ? 1.2 : 2, 0, Math.PI * 2)
        ctx.fillStyle = dot % 3 ? 'rgba(17,111,182,.13)' : 'rgba(210,163,31,.25)'
        ctx.fill()
      }
      for (let index = ripples.length - 1; index >= 0; index--) {
        const ripple = ripples[index]
        ripple.age += dt
        if (ripple.age > 1.6) { ripples.splice(index, 1); continue }
        ctx.beginPath()
        ctx.ellipse(ripple.x, ripple.y, 12 + ripple.age * 70, 6 + ripple.age * 38, -.2, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(17,111,182,${.24 * (1 - ripple.age / 1.6)})`
        ctx.lineWidth = 1
        ctx.stroke()
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
      pressed = false
      if (!document.hidden && !reduced) frame = requestAnimationFrame(tick)
    }
    function addRipple(event: PointerEvent) {
      if (performance.now() - lastRipple < 160) return
      lastRipple = performance.now()
      ripples.push({ x: event.clientX, y: event.clientY, age: 0 })
      if (ripples.length > 5) ripples.shift()
    }
    function down(event: PointerEvent) {
      if (!event.isPrimary || (event.target instanceof Element && event.target.closest(interactive))) return
      pressed = true
      previousX = event.clientX
      previousY = event.clientY
      targetX = event.clientX / width - .5
      targetY = event.clientY / height - .5
      forceX = targetX * 12
      forceY = targetY * 12
      addRipple(event)
    }
    function move(event: PointerEvent) {
      if (!event.isPrimary) return
      if (event.pointerType === 'mouse' || pressed) {
        targetX = event.clientX / width - .5
        targetY = event.clientY / height - .5
      }
      if (pressed) {
        forceX = clamp(forceX + (event.clientX - previousX) * .45, 30)
        forceY = clamp(forceY + (event.clientY - previousY) * .45, 30)
        previousX = event.clientX
        previousY = event.clientY
        addRipple(event)
      }
    }
    function release() { pressed = false }
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
      window.removeEventListener('blur', release)
      window.removeEventListener('scroll', scroll)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [reduced])
  return <canvas className="lake-background" ref={ref} aria-hidden="true" />
}

export function SiteMotion({ lang, pageKey }: { lang: Locale; pageKey: string }) {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    try { return localStorage.getItem(storageKey) === 'lakes' ? 'lakes' : 'classic' } catch { return 'classic' }
  })
  const reduced = useReducedMotion()
  usePageReveal(pageKey, reduced)
  useLayoutEffect(() => {
    document.documentElement.dataset.scene = appearance
    return () => { delete document.documentElement.dataset.scene }
  }, [appearance])
  useEffect(() => { try { localStorage.setItem(storageKey, appearance) } catch { /* The selected mode still works without storage. */ } }, [appearance])
  return <>
    {appearance === 'lakes' && <LakeBackground reduced={reduced} />}
    <div className="appearance-switch" role="group" aria-label={lang === 'pl' ? 'Wygląd strony' : 'Seitendarstellung'}>
      <button type="button" aria-pressed={appearance === 'classic'} onClick={() => setAppearance('classic')}>{lang === 'pl' ? 'Klasyczny' : 'Standard'}</button>
      <button type="button" aria-pressed={appearance === 'lakes'} onClick={() => setAppearance('lakes')}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2 6c2-3 4 3 7 0s5 3 9 0M2 10c2-3 4 3 7 0s5 3 9 0M2 14c2-3 4 3 7 0s5 3 9 0" /></svg>{lang === 'pl' ? 'Jeziora' : 'Seen'}</button>
    </div>
  </>
}
