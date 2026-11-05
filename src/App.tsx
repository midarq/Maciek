import { Component, useEffect } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { Footer, Header, PageIntro, PageMeta } from './components'
import { history, labels, path } from './data'
import type { Locale } from './data'
import { events2027 } from './edition'
import { Athlete2027, Event2027Page, Home2027, Partners2027, Program2027, Registration2027, Rules2027, Search2027, Spectator2027 } from './edition-pages'
import { ArticlePage, ContactPage, ContentRoute, MissingPage } from './pages'
import { SiteMotion } from './motion'

class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info.componentStack) }
  render() { return this.state.failed ? <div className="shell error-page"><h1>Nie udało się wczytać strony</h1><button className="button" onClick={() => window.location.reload()}>Odśwież stronę</button></div> : this.props.children }
}
const redirects: Record<string, string> = {
  triathlon: 'zawody/triathlon-lipiany', 'open-water': 'zawody/open-water', bieg: 'zawody/bieg-nad-wadolem',
  'triathlon-dzieci': 'zawody/triathlon-lipiany#dzieci', 'triathlon-dzieci-i-mlodzikow': 'zawody/triathlon-lipiany#dzieci',
  harmonogram: 'program', trasy: 'program/triathlon-lipiany', 'plan-sytuacyjny': 'program/triathlon-lipiany',
  'opis-imprezy': 'zawody/triathlon-lipiany', 'pakiet-startowy': 'dla-zawodnika#pakiety', dojazd: 'dla-zawodnika#dojazd',
  noclegi: 'dla-kibica', 'utrudnienia-w-ruchu': 'dla-zawodnika#dojazd', 'dane-konta': 'zapisy',
  'regulaminy-puchar': 'regulaminy', 'bieg-nad-wadolem': 'zawody/bieg-nad-wadolem', 'open-water-13-czerwca-2026': 'zawody/open-water',
}
export default function App() {
  const location = useLocation()
  const parts = location.pathname.replace(/\/index\.html$/, '/').split('/').filter(Boolean)
  const lang: Locale = parts[0] === 'de' ? 'de' : 'pl'
  const slug = (lang === 'de' ? parts.slice(1) : parts).join('/')
  const event = events2027.find(event => event.id !== 'dzieci' && event.slug === slug)
  const programEvent = events2027.find(event => event.id !== 'dzieci' && event.programSlug === slug)
  useEffect(() => {
    document.documentElement.lang = lang
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
    else {
      let attempts = 0
      const timer = window.setInterval(() => {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        if (target) { target.scrollIntoView({ behavior: 'instant' }); clearInterval(timer) }
        if (++attempts > 40) clearInterval(timer)
      }, 50)
      return () => clearInterval(timer)
    }
  }, [location.pathname, location.hash, lang])
  let page: ReactNode
  if (redirects[slug]) {
    const [target, hash] = redirects[slug].split('#')
    page = <Navigate to={path(lang, target) + (hash ? `#${hash}` : location.hash)} replace />
  } else if (!slug) page = <Home2027 lang={lang} />
  else if (event) page = <Event2027Page lang={lang} event={event} />
  else if (slug === 'program') page = <Program2027 lang={lang} />
  else if (programEvent) page = <Program2027 lang={lang} event={programEvent} />
  else if (slug === 'dla-zawodnika') page = <Athlete2027 lang={lang} />
  else if (slug === 'dla-kibica') page = <Spectator2027 lang={lang} />
  else if (slug === 'zapisy') page = <Registration2027 lang={lang} />
  else if (slug === 'regulaminy') page = <Rules2027 lang={lang} />
  else if (slug === 'partnerzy') page = <Partners2027 lang={lang} />
  else if (slug === 'kontakt') page = <ContactPage lang={lang} />
  else if (['szukaj', 'suche'].includes(slug)) page = <Search2027 lang={lang} />
  else if (slug === 'aktualnosci') page = <Home2027 lang={lang} />
  else if (slug === 'wyniki') page = <><PageMeta lang={lang} title={labels[lang].results} /><PageIntro lang={lang} title={labels[lang].results} /><section className="section"><div className="shell"><Link to={path(lang, 'program')}>{lang === 'pl' ? 'Program weekendu' : 'Wochenendprogramm'}</Link></div></section></>
  else if (history.some(item => item.slug === slug)) page = <ArticlePage lang={lang} slug={slug} />
  else if (/^(?:2026\/|category\/|portfolio\/|pl\/|opis-imprezy|regulamin|formularz|rejestracja|blog-home-page|search-results-page|triathlon-lipiany-2024)/.test(slug)) page = <ContentRoute lang={lang} slug={slug} />
  else page = <MissingPage lang={lang} />
  return <><a className="skip-link" href="#main">{labels[lang].skip}</a><Header lang={lang} slug={slug} /><main id="main" tabIndex={-1}><PageBoundary key={`${lang}/${slug}`}>{page}</PageBoundary></main><Footer lang={lang} /><SiteMotion lang={lang} pageKey={location.pathname} /></>
}
