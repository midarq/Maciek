import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { contact, labels, loadContent, path } from './data'
import type { Locale, SiteContent } from './data'
import { Icon, Loading, PageIntro, PageMeta, PartnerGroups, RegistrationBand, RichContent } from './components'
import { localUrl } from './urls'

let cachedContent: SiteContent | null = null
function useContent() {
  const [content, setContent] = useState(cachedContent)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    let active = true
    loadContent().then(data => { cachedContent = data; if (active) setContent(data) }).catch(error => { if (active) setError(error as Error) })
    return () => { active = false }
  }, [])
  if (error) throw error
  return content
}

export function ArticlePage({ lang, slug }: { lang: Locale; slug: string }) {
  const content = useContent()
  if (!content) return <Loading lang={lang} />
  const page = content.pages[slug]?.[lang]
  if (!page) return <MissingPage lang={lang} />
  return <><PageMeta lang={lang} title={page.title} /><PageIntro lang={lang} title={page.title} centered={slug === 'partnerzy'} /><section className="section article-section"><div className="shell">{slug === 'partnerzy' ? <PartnerGroups lang={lang} /> : <RichContent html={page.html} lang={lang} />}</div></section><RegistrationBand lang={lang} /></>
}

export function ContactPage({ lang }: { lang: Locale }) {
  const t = labels[lang]
  const started = useRef(Date.now())
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle')
  const [mailLink, setMailLink] = useState(`mailto:${contact.email}`)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    data.set('ts', String(started.current))
    data.set('lang', lang)
    const subject = encodeURIComponent(String(data.get('subject') || ''))
    const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`)
    setMailLink(`mailto:${contact.email}?subject=${subject}&body=${body}`)
    if (import.meta.env.VITE_STATIC_HOSTING === 'true') { setStatus('fallback'); return }
    setStatus('sending')
    try {
      const response = await fetch(localUrl('/kontakt/wyslij.php'), { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      const result: { ok?: boolean } = await response.json()
      if (!response.ok || !result.ok) throw new Error('Mail unavailable')
      setStatus('sent'); form.reset()
    } catch { setStatus('fallback') }
  }
  return <><PageMeta lang={lang} title={t.contact} /><PageIntro lang={lang} title={t.contact} lead={t.contactLead} /><section className="section"><div className="shell contact-layout">
    <div className="contact-details"><p className="eyebrow">{t.organizer}</p><a href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span><Icon /></a><a href="tel:+48607602807"><Icon name="phone" /><span>{contact.phone}</span><Icon /></a><a href={contact.facebook} target="_blank" rel="noreferrer"><span>Facebook</span><Icon name="external" /></a></div>
    <form className="contact-form" onSubmit={submit}><div className="form-grid"><label>{t.name}<input name="name" autoComplete="given-name" maxLength={80} required /></label><label>{t.email}<input name="email" type="email" autoComplete="email" maxLength={120} required /></label></div><label>{t.subject}<input name="subject" maxLength={120} required /></label><label>{t.message}<textarea name="message" rows={6} maxLength={5000} required /></label><label className="checkbox"><input name="rodo" type="checkbox" required /><span>{t.consent}</span></label><div className="honeypot" aria-hidden="true"><input name="_gotcha" tabIndex={-1} autoComplete="off" aria-label="Leave empty" /></div><button type="submit" className="button" disabled={status === 'sending'}>{status === 'sending' ? t.sending : t.send}<Icon /></button><div className="form-status" role="status">{status === 'sent' && <p className="form-status--success"><Icon name="check" />{t.sent}</p>}{status === 'fallback' && <><p>{t.mailFallback}</p><a className="text-link" href={mailLink}>{t.openMail}<Icon name="external" /></a></>}</div></form>
  </div></section></>
}

export function MissingPage({ lang }: { lang: Locale }) {
  const t = labels[lang]
  return <><PageMeta lang={lang} title={t.notFound} /><PageIntro lang={lang} title={t.notFound} lead={t.notFoundText}><Link className="button" to={path(lang)}>{t.backHome}<Icon /></Link></PageIntro></>
}

export function ContentRoute({ lang, slug }: { lang: Locale; slug: string }) {
  const content = useContent()
  const location = useLocation()
  if (!content) return <Loading lang={lang} />
  const redirect = content.redirects[location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`]
  if (redirect) return <Navigate to={redirect} replace />
  return <ArticlePage lang={lang} slug={slug} />
}
