import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { contact, labels, partnerGroups, partners, path, searchSlug } from './data'
import type { Locale } from './data'
import { edition, events2027, eventPath, menu2027, say } from './edition'
import { absoluteUrl, appPath, localHtml, localUrl } from './urls'

const icons = {
  arrow: 'M4 12h16m-6-6 6 6-6 6', chevron: 'm6 9 6 6 6-6', menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6', search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 0 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  file: 'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h6',
  external: 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
  mail: 'M3 5h18v14H3V5Zm0 0 9 8 9-8',
  phone: 'm8 3 3 5-3 3c1 3 2 4 5 5l3-3 5 3c-1 6-6 6-12 0S2 4 8 3Z',
  check: 'm5 12 4 4L20 5',
}
export function Icon({ name = 'arrow', className = '' }: { name?: keyof typeof icons; className?: string }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[name]} /></svg>
}

function FacebookLink({ lang, className = '' }: { lang: Locale; className?: string }) {
  return <a className={`social-link ${className}`} href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label={lang === 'pl' ? 'Triathlon Lipiany na Facebooku (nowa karta)' : 'Triathlon Lipiany auf Facebook (neuer Tab)'} title="Facebook">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.018 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.091 24 18.098 24 12.073Z" /></svg>
  </a>
}

export function Brand({ lang }: { lang: Locale }) {
  return <Link className="brand" to={path(lang)} aria-label="Triathlon Lipiany">
    <span className="brand__mark" aria-hidden="true"><img src={localUrl('/assets/img/logo.webp')} alt="" width="320" height="132" /></span>
    <span className="brand__name" aria-hidden="true">Triathlon <span>Lipiany</span></span>
  </Link>
}

function Dropdown({ title, items, open, setOpen }: { title: string; items: { label: string; to: string }[]; open: boolean; setOpen: (value: boolean) => void }) {
  const { pathname } = useLocation()
  const currentPath = pathname.replace(/\/index\.html$/, '/')
  const ref = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const id = useId()
  useEffect(() => {
    const close = (event: globalThis.MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])
  return <div className="dropdown" data-active={items.some(item => item.to === currentPath) || undefined} ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => { if (!ref.current?.contains(document.activeElement)) setOpen(false) }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); button.current?.focus(); event.preventDefault() }
    if (event.key === 'ArrowDown' && event.target === button.current) { setOpen(true); requestAnimationFrame(() => ref.current?.querySelector<HTMLAnchorElement>('a')?.focus()); event.preventDefault() }
  }}>
    <button className="nav-link" ref={button} aria-expanded={open} aria-controls={id} onClick={event => { if (event.detail === 0) setOpen(!open); else setOpen(true) }}>{title}<Icon name="chevron" /></button>
    <div className="dropdown__panel" id={id} hidden={!open}>
      {items.map(item => <Link key={item.to} to={item.to} aria-current={item.to === currentPath ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
    </div>
  </div>
}

export function Header({ lang, slug }: { lang: Locale; slug: string }) {
  const t = labels[lang]
  const location = useLocation()
  const [mobile, setMobile] = useState(false)
  const [openMenu, setOpenMenu] = useState<'events' | 'program' | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const eventItems = menu2027.events.map(item => ({ label: item.label[lang], to: path(lang, item.slug) }))
  const programItems = menu2027.program.map(item => ({ label: item.label[lang], to: path(lang, item.slug) }))
  function changeMenu(name: 'events' | 'program', open: boolean) { setOpenMenu(current => open ? name : current === name ? null : current) }
  useEffect(() => { setMobile(false); setOpenMenu(null) }, [location.pathname])
  useEffect(() => {
    if (mobile) { dialog.current?.showModal(); document.body.style.overflow = 'hidden' }
    else { dialog.current?.close(); document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [mobile])
  useEffect(() => {
    const mq = matchMedia('(min-width: 1200px)')
    const close = () => { if (mq.matches) setMobile(false) }
    mq.addEventListener('change', close)
    return () => mq.removeEventListener('change', close)
  }, [])
  function languageLink(next: Locale) {
    const nextSlug = ['suche', 'szukaj'].includes(slug) ? searchSlug(next) : slug
    return path(next, nextSlug) + location.search + location.hash
  }
  const language = <div className="languages" role="group" aria-label={t.language}>{(['pl', 'de'] as const).map(value => <Link key={value} to={languageLink(value)} lang={value} aria-label={value === 'pl' ? 'Polski' : 'Deutsch'} title={value === 'pl' ? 'Polski' : 'Deutsch'} aria-current={value === lang ? 'page' : undefined}>
    <svg className="language-flag" viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill={value === 'pl' ? '#fff' : '#000'} />
      <rect y={value === 'pl' ? 10 : 20 / 3} width="30" height={value === 'pl' ? 10 : 20 / 3} fill={value === 'pl' ? '#dc143c' : '#d00'} />
      {value === 'de' && <rect y={40 / 3} width="30" height={20 / 3} fill="#ffce00" />}
    </svg>
  </Link>)}</div>
  return <>
    <header className="header">
      <div className="shell header__inner">
        <Brand lang={lang} />
        <nav className="desktop-nav" aria-label={lang === 'pl' ? 'Menu główne' : 'Hauptmenü'}>
          <Dropdown title={t.events} items={eventItems} open={openMenu === 'events'} setOpen={open => changeMenu('events', open)} />
          <Dropdown title={say(lang, 'Program', 'Programm')} items={programItems} open={openMenu === 'program'} setOpen={open => changeMenu('program', open)} />
          <Link className="nav-link" to={path(lang, 'dla-zawodnika')} aria-current={slug === 'dla-zawodnika' ? 'page' : undefined}>{say(lang, 'Dla zawodnika', 'Für Teilnehmer')}</Link>
          <Link className="nav-link" to={path(lang, 'dla-kibica')} aria-current={slug === 'dla-kibica' ? 'page' : undefined}>{say(lang, 'Dla kibica', 'Für Zuschauer')}</Link>
        </nav>
        <div className="header__actions">
          <Link className="icon-button header__search" to={path(lang, searchSlug(lang))} aria-label={t.search}><Icon name="search" /></Link>
          <div className="header__languages">{language}</div>
          <button className="icon-button burger" type="button" onClick={() => setMobile(true)} aria-label={t.menu} aria-expanded={mobile} aria-controls="mobile-menu"><Icon name="menu" /></button>
          <Link className="button header__signup" to={path(lang, 'zapisy')} aria-current={slug === 'zapisy' ? 'page' : undefined}>{t.signup}</Link>
          <FacebookLink lang={lang} className="header__social" />
        </div>
      </div>
    </header>
    <dialog className="mobile-menu" ref={dialog} id="mobile-menu" onCancel={event => { event.preventDefault(); setMobile(false) }} onClose={() => setMobile(false)} onClick={event => { if (event.target === event.currentTarget) setMobile(false) }}>
      <div className="mobile-menu__top"><Brand lang={lang} /><button className="icon-button" onClick={() => setMobile(false)} aria-label={t.close}><Icon name="close" /></button></div>
      <nav className="mobile-menu__nav" aria-label={t.menu}>
        <Link to={path(lang)}>{t.home}</Link>
        <details><summary>{t.events}<Icon name="chevron" /></summary><div>{eventItems.map(item => <Link key={item.to} to={item.to} aria-current={path(lang, slug) === item.to ? 'page' : undefined}>{item.label}</Link>)}</div></details>
        <details><summary>{say(lang, 'Program', 'Programm')}<Icon name="chevron" /></summary><div>{programItems.map(item => <Link key={item.to} to={item.to} aria-current={path(lang, slug) === item.to ? 'page' : undefined}>{item.label}</Link>)}</div></details>
        <Link to={path(lang, 'dla-zawodnika')}>{say(lang, 'Dla zawodnika', 'Für Teilnehmer')}</Link><Link to={path(lang, 'dla-kibica')}>{say(lang, 'Dla kibica', 'Für Zuschauer')}</Link>
        <Link to={path(lang, searchSlug(lang))}>{t.search}<Icon name="search" /></Link>
      </nav>
      <div className="mobile-menu__bottom">{language}<div className="mobile-menu__end"><Link className="button" to={path(lang, 'zapisy')}>{t.signup}</Link><FacebookLink lang={lang} /></div></div>
    </dialog>
  </>
}

export function Footer({ lang }: { lang: Locale }) {
  const t = labels[lang]
  return <footer className="footer"><div className="shell">
    <div className="footer__grid">
      <div className="footer__brand">
        <div className="footer__identity"><Brand lang={lang} /><FacebookLink lang={lang} className="footer__social" /></div>
        <p>{t.footer}</p>
      </div>
      <nav className="footer__group footer__events" aria-label={t.events}>
        <h2>{t.events}</h2>
        <div className="footer__links">{events2027.map(event => <Link key={event.id} to={eventPath(event, lang)}>{event.name[lang]}</Link>)}</div>
      </nav>
      <nav className="footer__group footer__information" aria-label={t.information}>
        <h2>{t.information}</h2>
        <div className="footer__links footer__links--columns">{[{ slug: 'program', name: say(lang, 'Program weekendu', 'Wochenendprogramm') }, { slug: 'dla-zawodnika', name: say(lang, 'Dla zawodnika', 'Für Teilnehmer') }, { slug: 'dla-kibica', name: say(lang, 'Dla kibica', 'Für Zuschauer') }, { slug: 'regulaminy', name: t.rules }, { slug: 'partnerzy', name: t.partners }, { slug: 'kontakt', name: t.contact }].map(item => <Link key={item.slug} to={path(lang, item.slug)}>{item.name}</Link>)}{edition.privacy && <a href={edition.privacy.url}>{edition.privacy.name}</a>}</div>
      </nav>
      <div className="footer__group footer__contact-group">
        <h2>{t.contact}</h2>
        <address className="footer__contact">
          <a href={`mailto:${contact.email}`}><Icon name="mail" />{contact.email}</a>
          <a href="tel:+48607602807"><Icon name="phone" />{contact.phone}</a>
        </address>
        <p className="footer__organizer">{t.organizer}</p>
      </div>
    </div>
  </div></footer>
}

export function PartnerGroups({ lang }: { lang: Locale }) {
  return <div className="partner-groups">
    {partnerGroups.map(group => <section className={`partner-group partner-group--${group.key}`} key={group.key} aria-labelledby={`${group.key}-title`}>
      <h2 id={`${group.key}-title`}>{group.title[lang]}</h2>
      <ul className="partner-grid" aria-label={group.title[lang]}>
        {partners.filter(partner => partner.group === group.key).map(partner => <li className="partner-card" key={partner.name}>
          <a className="partner-link" href={partner.website} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} — ${lang === 'pl' ? 'strona internetowa (nowa karta)' : 'Website (neuer Tab)'}`}>
            <span className="partner-mark"><img src={localUrl(partner.image)} alt={partner.name} loading="lazy" decoding="async" /></span>
          </a>
        </li>)}
      </ul>
    </section>)}
  </div>
}

export function RegistrationBand({ lang }: { lang: Locale }) {
  const t = labels[lang]
  return <section className="registration-band"><div className="shell registration-band__inner"><div><p className="eyebrow">{edition.weekend[lang]}</p><h2>{say(lang, 'Dołącz do sportowego weekendu', 'Sei beim Sportwochenende dabei')}</h2></div><Link className="button" to={path(lang, 'zapisy')}>{t.signup}</Link></div></section>
}

export function PageMeta({ title, description, lang }: { title: string; description?: string; lang: Locale }) {
  const location = useLocation()
  useEffect(() => {
    document.title = `${title} — Triathlon Lipiany`
    document.documentElement.lang = lang
    const summary = description || labels[lang].lead
    document.querySelector('meta[name="description"]')?.setAttribute('content', summary)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', summary)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'de' ? 'de_DE' : 'pl_PL')
    const clean = location.pathname.replace(/\/index\.html$/, '/')
    const canonical = clean.endsWith('/') ? clean : `${clean}/`
    const pl = canonical.replace(/^\/de\//, '/').replace(/^\/suche\/$/, '/szukaj/')
    const de = `/de${pl.replace(/^\/szukaj\/$/, '/suche/')}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', absoluteUrl(canonical))
    document.querySelector('link[hreflang="pl"]')?.setAttribute('href', absoluteUrl(pl))
    document.querySelector('link[hreflang="de"]')?.setAttribute('href', absoluteUrl(de))
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', absoluteUrl(canonical))
  }, [title, description, lang, location.pathname])
  return null
}

export function PageIntro({ lang, title, lead, children, centered = false }: { lang: Locale; title: string; lead?: string; children?: ReactNode; centered?: boolean }) {
  return <section className={`page-intro${centered ? ' page-intro--centered' : ''}`}><div className="shell"><nav className="breadcrumb" aria-label={lang === 'pl' ? 'Nawigacja okruszkowa' : 'Brotkrümelnavigation'}><Link to={path(lang)}>{labels[lang].home}</Link><span>/</span><span>{title}</span></nav><h1>{title}</h1>{lead && <p>{lead}</p>}{children}</div></section>
}

export function Loading({ lang }: { lang: Locale }) { return <div className="loading shell" role="status"><span className="loading__dot" />{labels[lang].loading}</div> }

export function RichContent({ html, lang }: { html: string; lang: Locale }) {
  const navigate = useNavigate()
  const dialog = useRef<HTMLDialogElement>(null)
  const [preview, setPreview] = useState({ src: '', alt: '' })
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    const load = target.closest<HTMLButtonElement>('[data-embed-load]')
    if (load) {
      const gate = load.closest<HTMLElement>('[data-embed]')
      if (gate?.dataset.embed) {
        const decoded = new TextDecoder().decode(Uint8Array.from(atob(gate.dataset.embed), char => char.charCodeAt(0)))
        const container = document.createElement('div')
        container.className = 'external-content'
        container.innerHTML = decoded
        gate.replaceWith(container)
        container.querySelectorAll('script').forEach(old => {
          const script = document.createElement('script')
          Array.from(old.attributes).forEach(attribute => script.setAttribute(attribute.name, attribute.value))
          script.textContent = old.textContent
          old.replaceWith(script)
        })
      }
      return
    }
    const anchor = target.closest<HTMLAnchorElement>('a[href]')
    if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    if (/\.(jpe?g|png|webp)$/i.test(anchor.pathname)) {
      event.preventDefault()
      setPreview({ src: anchor.href, alt: anchor.querySelector('img')?.alt || '' })
      dialog.current?.showModal()
    } else if (anchor.origin === location.origin && !appPath(anchor.pathname).startsWith('/assets/') && !anchor.download && !anchor.target) {
      event.preventDefault()
      navigate(appPath(anchor.pathname) + anchor.search + anchor.hash)
    }
  }
  return <>
    <div className="rich-content" onClick={handleClick} dangerouslySetInnerHTML={{ __html: localHtml(html) }} />
    <dialog className="image-preview" ref={dialog} aria-label={labels[lang].imagePreview} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}><button className="icon-button" onClick={() => dialog.current?.close()} aria-label={labels[lang].close}><Icon name="close" /></button>{preview.src && <img src={preview.src} alt={preview.alt} />}</dialog>
  </>
}
