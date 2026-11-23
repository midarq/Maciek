import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { contact, labels, path } from './data'
import type { Locale, Localized } from './data'
import { edition, editionCopy, events2027, eventDistance, eventPath, eventSchedule, say, signupUrl, startIds, startSlot, text, triathlonVariants } from './edition'
import type { Event2027, EventId, ScheduleItem, TriathlonVariant } from './edition'
import { Icon, PageIntro, PageMeta, PartnerGroups } from './components'
import { localUrl } from './urls'
import { archivedSitePlan, archivalVideo, reviewContent, routeLaps, ruleDocuments, showDetail } from './details'
import type { RouteMap, RuleDocument } from './details'
import { RuleDocumentArticle, RulesDirectory, RulesFor } from './rules'

type Props = { lang: Locale }
const ui = say
function TablePlaceholder({ lang }: Props) { return <span className="table-placeholder">{ui(lang, 'Do uzupełnienia', 'Wird ergänzt')}</span> }
function Facts({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return <dl className="detail-list">{rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
}
function PendingDetails({ lang, fields }: Props & { fields: Localized[] }) {
  return <Facts rows={fields.map(field => ({ label: field[lang], value: <TablePlaceholder lang={lang} /> }))} />
}
function Paragraphs({ lang, items }: Props & { items: Localized[] | null }) {
  return items?.length ? <div className="prose-stack">{items.map((item, index) => <p key={index}>{item[lang]}</p>)}</div> : <Missing lang={lang} />
}
function Section({ id, eyebrow, title, children, className = '' }: { id?: string; eyebrow?: string; title: string; children: ReactNode; className?: string }) {
  return <section className={`section content-section${!title && !eyebrow ? ' content-section--plain' : ''} ${className}`} id={id}><div className="shell">{(eyebrow || title) && <header className="section-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></header>}<div className="section-body">{children}</div></div></section>
}
function SectionNav({ lang, items, activeId, onSelect }: Props & { items: [string, string][]; activeId?: string | null; onSelect?: (id: string) => void }) {
  const { hash } = useLocation()
  return <nav className="section-nav shell" aria-label={labels[lang].sections}>{items.map(([id, title]) => <a href={`#${id}`} key={id} onClick={() => onSelect?.(id)} aria-current={(activeId === undefined ? hash.slice(1) : activeId) === id ? 'location' : undefined}>{title}</a>)}</nav>
}
export function ContentReviewNotice({ lang }: Props) {
  return reviewContent ? <div className="content-review-notice"><div className="shell">{ui(lang, 'Podgląd roboczy 2027 — propozycje tras, lokalizacji i świadczeń wymagają potwierdzenia organizatora.', 'Entwurf 2027 — Strecken, Orte und Leistungen müssen vom Veranstalter bestätigt werden.')} <Link to={path(lang, 'regulaminy')}>{ui(lang, 'Projekty regulaminów', 'Reglemententwürfe')}</Link></div></div> : null
}
function ArchivalSitePlan({ lang }: Props) {
  return <figure className="site-plan-card"><a href={localUrl(archivedSitePlan)} target="_blank" rel="noopener noreferrer"><img src={localUrl(archivedSitePlan)} alt={ui(lang, 'Archiwalny plan: start, strefa zmian, meta i parking przy biurze', 'Archivierter Lageplan: Start, Wechselzone, Ziel und Parkplatz am Wettkampfbüro')} width="1400" height="910" loading="lazy" /></a><figcaption><strong>{ui(lang, 'Archiwalny plan sytuacyjny', 'Archivierter Lageplan')}</strong><span>{ui(lang, 'Materiał z poprzedniej edycji. Plan 2027 do uzupełnienia.', 'Material einer früheren Ausgabe. Lageplan 2027 wird ergänzt.')}</span><a href={localUrl(archivedSitePlan)} target="_blank" rel="noopener noreferrer">{ui(lang, 'Otwórz plan', 'Lageplan öffnen')}</a></figcaption></figure>
}
function FirstTriathlon({ lang }: Props) {
  return <aside className="info-panel info-panel--yellow"><p className="eyebrow">{ui(lang, 'Dla debiutantów', 'Für Einsteiger')}</p><h3>{ui(lang, 'Mój pierwszy triathlon', 'Mein erster Triathlon')}</h3><p>{editionCopy.first[lang]}</p><Facts rows={[
    { label: ui(lang, 'Warunki kwalifikacji', 'Teilnahmevoraussetzungen'), value: edition.firstTriathlon.criteria || <TablePlaceholder lang={lang} /> },
    { label: ui(lang, 'Zgłoszenie do klasyfikacji', 'Anmeldung zur Wertung'), value: edition.firstTriathlon.classification || <TablePlaceholder lang={lang} /> },
    { label: ui(lang, 'Nagrody', 'Preise'), value: edition.firstTriathlon.prizes || <TablePlaceholder lang={lang} /> },
  ]} /></aside>
}
export function Missing({ lang, what }: Props & { what?: string }) {
  return <span className="missing">{ui(lang, 'Do uzupełnienia', 'Wird ergänzt')}{what ? `: ${what}` : ''}</span>
}
export function Unconfirmed({ lang, what }: Props & { what: string }) {
  return <span className="unconfirmed">{ui(lang, 'Do potwierdzenia', 'Zu bestätigen')}: {what}</span>
}
export function SignupButton({ lang, event, variant, label, compact = false }: Props & { event: EventId; variant?: string; label?: string; compact?: boolean }) {
  const url = signupUrl(event, variant)
  const title = label || labels[lang].signup
  if (compact && !url) return <p className="signup-placeholder">{title}: <TablePlaceholder lang={lang} /></p>
  return url ? <a className="button event-signup" href={url}>{title}<Icon name="external" /></a> : <div className="signup-state"><button className="button event-signup" disabled>{title}</button><Missing lang={lang} what={ui(lang, 'link do zapisów', 'Anmeldelink')} /></div>
}
function CardTitle({ lang, event }: Props & { event: Event2027 }) {
  const accent = event.titleAccent[lang]
  return <h3 className="race-card__title">{event.titleLines.map((line, index) => {
    const value = line[lang]
    const position = value.indexOf(accent)
    return <span className="race-card__title-line" key={index}>{position < 0 ? value : <>{value.slice(0, position)}<span className="race-card__title-accent">{accent}</span>{value.slice(position + accent.length)}</>}{index === 0 ? ' ' : null}</span>
  })}</h3>
}
function EventCard({ lang, event }: Props & { event: Event2027 }) {
  const distance = eventDistance(event, lang)
  return <article className={`race-card race-card--${event.id}`}>
    <Link className="race-card__image" to={eventPath(event, lang)} aria-label={event.name[lang]}><img src={localUrl(event.image)} alt={event.name[lang]} width={event.imageWidth} height={event.imageHeight} loading="lazy" /><CardTitle lang={lang} event={event} /></Link><span className="race-card__stripe" aria-hidden="true" />
    <div className="race-card__body"><p className="race-card__date">{edition.weekend[lang]}</p><p className="race-card__description">{event.description[lang]}</p>{distance && <p className="race-card__distance">{distance}</p>}<div className="race-card__actions"><SignupButton lang={lang} event={event.id} /></div></div>
  </article>
}
export function Home2027({ lang }: Props) {
  return <><PageMeta lang={lang} title={ui(lang, 'Sportowy weekend w Lipianach 2027', 'Sportwochenende in Lipiany 2027')} description={editionCopy.heroLead[lang]} />
    <section className="home-hero" aria-labelledby="home-title">
      <div className="shell home-hero__inner"><div className="home-hero__content">
        <p className="hero-date">{edition.weekend[lang]}</p>
        <h1 id="home-title">{labels[lang].title}<br /><span>{labels[lang].titleEnd}</span></h1>
        <p className="home-hero__lead">{editionCopy.heroLead[lang]}</p>
        <div className="button-row"><Link className="button button--large" to={path(lang, 'zapisy')}>{labels[lang].signup}</Link><Link className="button button--outline-light" to={path(lang, 'program')}>{ui(lang, 'Zobacz program', 'Zum Programm')}</Link></div>
      </div></div>
      <div className="home-hero__visual"><picture><source media="(max-width: 767px)" srcSet={localUrl(edition.heroMobileImage)} width="1536" height="1024" /><img className="home-hero__image" src={localUrl(edition.heroImage)} width="1983" height="793" alt="" fetchPriority="high" /></picture><span className="home-hero__location"><Icon name="pin" />Lipiany</span></div>
      <div className="discipline-stripe" aria-hidden="true"><span /><span /><span /></div>
    </section>
    <section className="section races-section" id="zawody"><div className="shell"><header className="section-heading"><p className="eyebrow">{ui(lang, 'Wybierz swoją konkurencję', 'Wähle deine Disziplin')}</p><h2>{ui(lang, 'Zawody', 'Wettkämpfe')}</h2></header><div className="race-grid edition-race-grid">{events2027.map(event => <EventCard lang={lang} event={event} key={event.id} />)}</div></div></section>
    <section className="section weekend-overview"><div className="shell">
      <header className="weekend-overview__heading"><p className="eyebrow">{ui(lang, 'Jeden weekend. Wiele powodów, by tu być.', 'Ein Wochenende. Viele Gründe, dabei zu sein.')}</p><h2>{ui(lang, 'Sport i spotkanie', 'Sport und Begegnung')}</h2></header>
      <div className="audience-grid">{[
        { slug: 'program', image: '/assets/img/weekend-program.jpg', imageSmall: '/assets/img/weekend-program-800.jpg', height: 933, title: ui(lang, 'Program weekendu', 'Wochenendprogramm'), accent: ui(lang, 'Program', 'Wochenendprogramm'), copy: ui(lang, 'W sobotę po zawodach przewidziana jest impreza dla uczestników.', 'Am Samstag ist nach den Wettkämpfen ein Treffen für Teilnehmer vorgesehen.') },
        { slug: 'dla-zawodnika', image: '/assets/img/tresc/290691924_571654034329279_7826286303397459888_n.jpg', imageSmall: '/assets/img/tresc/290691924_571654034329279_7826286303397459888_n-w800.jpg', height: 934, title: ui(lang, 'Dla zawodnika', 'Für Teilnehmer'), accent: ui(lang, 'zawodnika', 'Teilnehmer'), copy: ui(lang, 'Przygotuj swój start. Pakiety, regulaminy, dojazd i kontakt w jednym miejscu.', 'Bereite deinen Start vor. Unterlagen, Regeln, Anreise und Kontakt an einem Ort.') },
        { slug: 'dla-kibica', image: '/assets/img/weekend-spectators.jpg', imageSmall: '/assets/img/weekend-spectators-800.jpg', height: 933, title: ui(lang, 'Dla kibica', 'Für Zuschauer'), accent: ui(lang, 'kibica', 'Zuschauer'), copy: ui(lang, 'Zaplanuj sportowy weekend z bliskimi. Sprawdź program i informacje dla kibiców.', 'Plane ein Sportwochenende mit deinen Liebsten. Programm und Informationen für Zuschauer.') },
      ].map(item => {
        const accentStart = item.title.indexOf(item.accent)
        return <Link className={`race-card audience-card audience-card--${item.slug}`} to={path(lang, item.slug)} key={item.slug}>
          <div className="race-card__image audience-card__image"><img src={localUrl(item.image)} srcSet={`${localUrl(item.imageSmall)} 800w, ${localUrl(item.image)} 1400w`} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1536px) 30vw, 464px" width="1400" height={item.height} alt="" loading="lazy" decoding="async" /><h3 className="race-card__title">{item.title.slice(0, accentStart)}<span className="race-card__title-accent">{item.accent}</span>{item.title.slice(accentStart + item.accent.length)}</h3></div>
          <span className="race-card__stripe" aria-hidden="true" />
          <div className="race-card__body"><p className="race-card__description">{item.copy}</p></div>
        </Link>
      })}</div>
    </div></section>
    <section className="partners-section"><div className="shell"><PartnerGroups lang={lang} /></div></section>
  </>
}
function dayName(date: string, lang: Locale) { return edition.days.find(day => day.date === date)?.name[lang] || new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'de-DE', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`)) }
function Slot({ lang, id }: Props & { id: string }) {
  const row = startSlot(id)
  return <div className="start-slot"><p className="eyebrow">{id === 'dzieci' ? ui(lang, 'Początek rywalizacji', 'Wettkampfbeginn') : ui(lang, 'Start', 'Start')}</p><strong>{row?.time || <TablePlaceholder lang={lang} />}</strong>{row?.day && <span>{dayName(row.day, lang)}</span>}{row?.place && <p>{row.place[lang]}</p>}</div>
}
function Schedule({ lang, rows }: Props & { rows: ScheduleItem[] }) {
  const days = [...new Set(rows.map(row => row.day))]
  if (days.length > 1) return <div className="schedule-groups">{days.map(day => <section key={day || 'other'}><h3>{day ? dayName(day, lang) : ui(lang, 'Pozostałe punkty', 'Weitere Programmpunkte')}</h3><Schedule lang={lang} rows={rows.filter(row => row.day === day)} /></section>)}</div>
  const startMinutes = (row: ScheduleItem) => { const match = row.time?.match(/(\d{1,2}):(\d{2})/); return match ? Number(match[1]) * 60 + Number(match[2]) : Infinity }
  const sorted = [...rows].sort((a, b) => startMinutes(a) - startMinutes(b))
  return <div className="schedule-table schedule-list"><table><thead><tr><th scope="col">{ui(lang, 'Godzina', 'Uhrzeit')}</th><th scope="col">{ui(lang, 'Wydarzenie', 'Programmpunkt')}</th><th scope="col">{ui(lang, 'Miejsce', 'Ort')}</th></tr></thead><tbody>{sorted.length ? sorted.map(row => <tr key={row.id}><td className="schedule-time">{row.time?.replace('od ', lang === 'de' ? 'ab ' : 'od ').replace('do ', lang === 'de' ? 'bis ' : 'do ') || <TablePlaceholder lang={lang} />}</td><td className="schedule-name">{row.name[lang]}</td><td className="schedule-place">{row.place?.[lang] || <TablePlaceholder lang={lang} />}</td></tr>) : <tr><td><TablePlaceholder lang={lang} /></td></tr>}</tbody></table></div>
}
function MapGallery({ lang, maps }: Props & { maps: RouteMap[] }) {
  if (!maps.length) return <Missing lang={lang} what={ui(lang, 'mapy trasy', 'Streckenkarten')} />
  return <div className={`route-map-grid${maps.length === 1 ? ' route-map-grid--single' : ''}`}>{maps.map(map => <figure className="route-map" key={map.id}><a className="route-map__image" href={localUrl(map.url)} target="_blank" rel="noopener noreferrer" aria-label={`${map.name[lang]} — ${ui(lang, 'powiększ', 'vergrößern')}`}><img src={localUrl(map.url)} alt={map.alt[lang]} width="1169" height="826" loading="lazy" decoding="async" /></a><figcaption><strong>{map.name[lang]}</strong><a href={localUrl(map.url)} download>{ui(lang, 'Pobierz mapę', 'Karte herunterladen')}</a></figcaption></figure>)}</div>
}
function VariantMaps({ lang, variant }: Props & { variant: 'sprint' | 'olimpijka' }) {
  return <div className="variant-maps"><h3>{ui(lang, 'Mapy trasy', 'Streckenkarten')}</h3>{showDetail('triathlonRoutes') && <p>{routeLaps[variant][lang]}</p>}<MapGallery lang={lang} maps={edition.resources.triathlon.maps.filter(map => map.variant === variant)} /></div>
}
function WaterRoute({ lang, distance }: Props & { distance: string }) {
  return distance === '1000' ? <>{showDetail('openWater1000Route') && <p>{ui(lang, 'Jedna pętla o długości 1000 m wyznaczona bojami.', 'Eine mit Bojen markierte Runde über 1000 m.')}</p>}<MapGallery lang={lang} maps={edition.resources['open-water'].maps.filter(map => map.variant === '1000')} /></> : <PendingDetails lang={lang} fields={[text('Liczba i długość pętli', 'Anzahl und Länge der Runden'), text('Kierunek opływania boi', 'Schwimmrichtung und Reihenfolge der Bojen'), text('Mapa 3000 m', 'Streckenkarte 3000 m')]} />
}
function Resources({ lang, event, routeOnly = false, maps = true, route = true, documents = true }: Props & { event: EventId; routeOnly?: boolean; maps?: boolean; route?: boolean; documents?: boolean }) {
  const data = edition.resources[event]
  return <div className="event-resources">{route && <div className="course-description"><h3>{ui(lang, 'Trasa', 'Strecke')}</h3>{data.routeDescription ? <p>{data.routeDescription[lang]}</p> : <Missing lang={lang} what={ui(lang, 'opis trasy', 'Streckenbeschreibung')} />}</div>}
    {maps && (event === 'triathlon' ? <>{(['sprint', 'olimpijka'] as const).map(variant => <VariantMaps key={variant} lang={lang} variant={variant} />)}</> : event === 'open-water' ? <div className="resource-grid">{edition.openWaterDistances.map(distance => <section className="info-panel" key={distance}><h3>{distance} m</h3><WaterRoute lang={lang} distance={distance} /></section>)}</div> : <MapGallery lang={lang} maps={data.maps} />)}
    <div className="resource-grid">{!routeOnly && <section className="info-panel"><h3>{ui(lang, 'Pakiet startowy', 'Startpaket')}</h3><Paragraphs lang={lang} items={data.package} /></section>}{documents && <section className="info-panel"><h3>{ui(lang, 'Regulaminy', 'Reglement')}</h3><RulesFor lang={lang} event={event} /></section>}</div>
  </div>
}
function EventHero({ lang, event }: Props & { event: Event2027 }) {
  return <PageIntro lang={lang} title={event.name[lang]} lead={event.description[lang]} image={event.image} tone={event.id} meta={eventDistance(event, lang)}><div className="button-row"><SignupButton lang={lang} event={event.id} /><Link className="text-link" to={path(lang, event.programSlug)}>{ui(lang, 'Program zawodów', 'Wettkampfprogramm')}</Link></div></PageIntro>
}
function Preparation({ lang, event, documents = true }: Props & { event: EventId; documents?: boolean }) {
  return <Section title={ui(lang, 'Przed startem', 'Vor dem Start')}><Resources lang={lang} event={event} maps={false} route={false} documents={documents} /><Link className="text-link" to={path(lang, 'dla-zawodnika')}>{ui(lang, 'Odbiór pakietów, dojazd i przygotowanie do startu', 'Startunterlagen, Anreise und Vorbereitung')}</Link></Section>
}
export function Event2027Page({ lang, event }: Props & { event: Event2027 }) {
  return <><PageMeta lang={lang} title={`${event.name[lang]} 2027`} description={event.description[lang]} /><EventHero lang={lang} event={event} />{event.id === 'triathlon' ? <TriathlonContent lang={lang} /> : <>{event.id === 'open-water' ? <OpenWaterContent lang={lang} /> : <RunningContent lang={lang} />}<Preparation lang={lang} event={event.id} />{event.id === 'bieg' && <RunningArchive lang={lang} />}</>}</>
}
function VariantPanel({ lang, id, title, distance, open, onToggle, children }: Props & {
  id: TriathlonVariant; title: string; distance: string; open: boolean; onToggle: () => void; children: ReactNode
}) {
  return <section className="variant-accordion__item" id={id} data-open={open || undefined}>
    <h2><button className="variant-accordion__toggle" id={`${id}-toggle`} type="button" aria-expanded={open} aria-controls={`${id}-panel`} onClick={onToggle}>
      <span className="variant-accordion__name">{title}</span>
      <span className="variant-accordion__distance"><span className="variant-accordion__label">{ui(lang, 'Pływanie / rower / bieg', 'Schwimmen / Rad / Laufen')}</span><span>{distance}</span></span>
      <span className="variant-accordion__time"><span className="variant-accordion__label">{id === 'dzieci' ? ui(lang, 'Początek', 'Beginn') : 'Start'}</span><span>{startSlot(id)?.time || <TablePlaceholder lang={lang} />}</span></span>
      <span className="variant-accordion__symbol" aria-hidden="true" />
    </button></h2>
    <div className="variant-accordion__panel" id={`${id}-panel`} role="region" aria-labelledby={`${id}-toggle`} hidden={!open}>{children}</div>
  </section>
}
function VariantPreparation({ lang, variant }: Props & { variant: 'sprint' | 'olimpijka' | 'sztafety' }) {
  return <div className="variant-preparation">
    <section className="info-panel"><h3>{ui(lang, 'Pakiet startowy', 'Startpaket')}</h3><Paragraphs lang={lang} items={edition.resources.triathlon.package} /><Link className="text-link" to={path(lang, 'dla-zawodnika')}>{ui(lang, 'Odbiór pakietów, dojazd i przygotowanie do startu', 'Startunterlagen, Anreise und Vorbereitung')}</Link></section>
    <section className="info-panel"><h3>{ui(lang, 'Regulamin i zapisy', 'Reglement und Anmeldung')}</h3>{variant === 'sztafety' ? <><RulesFor lang={lang} event="triathlon" variant="sztafeta-sprint" /><RulesFor lang={lang} event="triathlon" variant="sztafeta-olimpijska" /></> : <RulesFor lang={lang} event="triathlon" variant={variant} />}<SignupButton compact lang={lang} event="triathlon" variant={variant} /></section>
  </div>
}
function TriathlonContent({ lang }: Props) {
  const { hash } = useLocation()
  const panelForHash = (value: string): TriathlonVariant | null => ['sprint', 'olimpijka', 'sztafety', 'dzieci'].includes(value.slice(1)) ? value.slice(1) as TriathlonVariant : null
  const [active, setActive] = useState<TriathlonVariant | null>(() => panelForHash(hash))
  useEffect(() => { setActive(panelForHash(hash)) }, [hash])
  const toggle = (id: TriathlonVariant) => () => setActive(current => current === id ? null : id)
  const childCourse = edition.children.categories[0]
  return <><SectionNav lang={lang} activeId={active} onSelect={id => setActive(panelForHash(`#${id}`))} items={[["sprint", 'Sprint'], ['olimpijka', ui(lang, 'Olimpijka', 'Olympisch')], ['sztafety', ui(lang, 'Sztafety', 'Staffeln')], ['dzieci', ui(lang, 'Dzieci i młodzież', 'Kinder und Jugendliche')]]} />
    <Section title={ui(lang, 'Trasa i start', 'Strecke und Start')}><Facts rows={[
      { label: ui(lang, 'Termin', 'Termin'), value: `${dayName(startSlot('sprint')!.day!, lang)} ${edition.year}` },
      { label: ui(lang, 'Miejsce startu', 'Startort'), value: edition.resources.triathlon.startPlace?.[lang] || <TablePlaceholder lang={lang} /> },
    ]} /><p className="edition-prose triathlon-course">{edition.resources.triathlon.routeDescription?.[lang] || <Missing lang={lang} what={ui(lang, 'opis trasy', 'Streckenbeschreibung')} />}</p></Section>
    <Section title="" className="triathlon-options"><div className="variant-accordion">
      {triathlonVariants.map(variant => <VariantPanel lang={lang} id={variant.id} key={variant.id} title={variant.name[lang]} distance={variant.distances.map(distance => distance.value.replaceAll(' ', '\u00a0')).join(' / ')} open={active === variant.id} onToggle={toggle(variant.id)}>
        <p className="edition-prose">{variant.description[lang]}</p>
        <dl className="distance-grid">{variant.distances.map(distance => <div key={distance.name.pl}><dt>{distance.name[lang]}</dt><dd>{distance.value}</dd></div>)}</dl>
        <div className="variant-info"><Slot lang={lang} id={variant.id} />{variant.id === 'sprint' && <FirstTriathlon lang={lang} />}</div>
        <VariantMaps lang={lang} variant={variant.id} /><VariantPreparation lang={lang} variant={variant.id} />
      </VariantPanel>)}
      <VariantPanel lang={lang} id="sztafety" title={ui(lang, 'Sztafety', 'Staffeln')} distance={ui(lang, 'Sprint lub olimpijka', 'Sprint oder olympische Distanz')} open={active === 'sztafety'} onToggle={toggle('sztafety')}>
        <p className="edition-prose">{editionCopy.relay[lang]}</p><Slot lang={lang} id="sztafety" />
        <div className="resource-grid"><section className="info-panel"><h3>{ui(lang, 'Warianty', 'Varianten')}</h3><Paragraphs lang={lang} items={edition.relay.variants} /></section><section className="info-panel"><h3>{ui(lang, 'Zespół i zgłoszenia', 'Team und Anmeldung')}</h3>{edition.relay.teamComposition ? <p>{edition.relay.teamComposition[lang]}</p> : <Missing lang={lang} />}{edition.relay.rules && <p>{edition.relay.rules[lang]}</p>}<PendingDetails lang={lang} fields={[text('Zgłoszenie i zmiany składu', 'Anmeldung und Änderungen der Besetzung'), text('Minimalny wiek i klasyfikacja firmowa', 'Mindestalter und Firmenwertung'), text('Limit krótkiej sztafety: 100 czy 110 min', 'Zeitlimit der Sprintstaffel: 100 oder 110 min')]} /></section></div>
        {triathlonVariants.map(variant => <section className="relay-course" key={variant.id}><h3>{variant.name[lang]}</h3><VariantMaps lang={lang} variant={variant.id} /></section>)}
        <VariantPreparation lang={lang} variant="sztafety" />
      </VariantPanel>
      <VariantPanel lang={lang} id="dzieci" title={ui(lang, 'Dzieci i młodzież', 'Kinder und Jugendliche')} distance={childCourse ? `${[childCourse.swim, childCourse.bike, childCourse.run].map(value => value.replaceAll(' ', '\u00a0')).join(' / ')}${reviewContent ? ui(lang, ' · propozycja', ' · Vorschlag') : ''}` : ui(lang, 'Do potwierdzenia', 'Zu bestätigen')} open={active === 'dzieci'} onToggle={toggle('dzieci')}>
        <p className="edition-prose">{editionCopy.children[lang]}</p>{reviewContent && <Unconfirmed lang={lang} what={ui(lang, 'pływanie 100 m czy około 150 m; wspólny start o 9:30 lub podział na fale', 'Schwimmen 100 m oder etwa 150 m; gemeinsamer Start um 9:30 Uhr oder Startwellen')} />}<div className="children-table"><table><thead><tr>{[ui(lang, 'Kategoria', 'Altersklasse'), ui(lang, 'Wiek', 'Alter'), ui(lang, 'Roczniki', 'Jahrgänge'), ui(lang, 'Pływanie', 'Schwimmen'), ui(lang, 'Rower', 'Rad'), ui(lang, 'Bieg', 'Laufen'), ui(lang, 'Start', 'Start')].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{edition.children.categories.length ? edition.children.categories.map(row => <tr key={row.age}><th scope="row">{row.name[lang]}</th><td>{row.age}</td><td>{row.birthYears}</td><td>{row.swim}</td><td>{row.bike}</td><td>{row.run}</td><td>{row.time || ui(lang, 'Według podziału startów', 'Nach Startwelleneinteilung')}</td></tr>) : <tr><td colSpan={7}><TablePlaceholder lang={lang} /></td></tr>}</tbody></table></div><div className="resource-grid"><div><Slot lang={lang} id="dzieci" /></div><section className="info-panel"><h3>{ui(lang, 'Dla rodzica i opiekuna', 'Für Eltern und Begleitpersonen')}</h3>{edition.children.guardianRules ? <p>{edition.children.guardianRules[lang]}</p> : <Missing lang={lang} />}</section></div><Resources lang={lang} event="dzieci" /><SignupButton compact lang={lang} event="dzieci" />
      </VariantPanel>
    </div></Section>
  </>
}
function OpenWaterContent({ lang }: Props) {
  const data = edition.resources['open-water']
  return <><Section title={ui(lang, 'Trasa i sprzęt', 'Strecke und Ausrüstung')}><div className="resource-grid"><div><p>{data.routeDescription?.[lang] || <Missing lang={lang} />}</p>{data.startPlace && <p className="location-line">{data.startPlace[lang]}</p>}</div><div className="info-panel"><h3>{ui(lang, 'Co zabrać', 'Was mitnehmen')}</h3><Paragraphs lang={lang} items={data.equipment} /></div></div>{!edition.openWaterDistancesConfirmed && <Unconfirmed lang={lang} what={ui(lang, 'program 2027 przewiduje 1000 m i 3000 m; poprzednia edycja miała 1000 m i 5000 m', 'Das Programm 2027 sieht 1000 m und 3000 m vor; die letzte Ausgabe hatte 1000 m und 5000 m')} />}</Section><Section title={ui(lang, 'Dystanse', 'Distanzen')}><div className="water-distances">{edition.openWaterDistances.map(distance => <section className="distance-option" id={`dystans-${distance}`} key={distance}><h3>{distance} m</h3><p>{distance === '1000' ? ui(lang, 'Krótszy z dwóch dystansów pływackich.', 'Die kürzere der beiden Schwimmdistanzen.') : ui(lang, 'Dłuższe wyzwanie na wodach otwartych.', 'Die längere Freiwasser-Herausforderung.')}</p><Slot lang={lang} id={distance} /><WaterRoute lang={lang} distance={distance} /><SignupButton compact lang={lang} event="open-water" variant={distance} /></section>)}</div></Section></>
}
function RunningContent({ lang }: Props) {
  const data = edition.resources.bieg
  return <><Section title={ui(lang, 'Trasa i start', 'Strecke und Start')}><div className="resource-grid"><div><p>{data.routeDescription?.[lang] || <Missing lang={lang} />}</p><p className="edition-prose">{edition.running.memorial || editionCopy.memorial[lang]}</p>{reviewContent && <Unconfirmed lang={lang} what={ui(lang, 'dystans: około 8 km w projekcie i regulaminie, około 7 km w artykule', 'Distanz: etwa 8 km im Entwurf und Reglement, etwa 7 km im Artikel')} />}<PendingDetails lang={lang} fields={[text('Zweryfikowana mapa lub GPX', 'Geprüfte Streckenkarte oder GPX-Datei')]} /></div><div><Slot lang={lang} id="bieg" /><Facts rows={[{ label: ui(lang, 'Dystans', 'Distanz'), value: edition.running.distance || <TablePlaceholder lang={lang} /> }, { label: ui(lang, 'Start i meta', 'Start und Ziel'), value: data.startPlace?.[lang] || <TablePlaceholder lang={lang} /> }]} /></div></div></Section></>
}
function RunningArchive({ lang }: Props) {
  return <Section title={ui(lang, 'Film z zawodów', 'Wettkampffilm')} eyebrow={ui(lang, 'Archiwum', 'Archiv')}><figure className="archival-video"><video controls playsInline preload="none" poster={localUrl('/assets/img/home-bieg-clean.webp')} aria-label={ui(lang, 'Bieg nad Wądołem — film archiwalny', 'Lauf am Wądół — Archivfilm')}><source src={localUrl(archivalVideo)} type="video/mp4" /><a href={localUrl(archivalVideo)}>{ui(lang, 'Otwórz film', 'Film öffnen')}</a></video><figcaption>{ui(lang, 'Materiał z poprzedniej edycji.', 'Material einer früheren Ausgabe.')}</figcaption></figure></Section>
}
export function Program2027({ lang, event }: Props & { event?: Event2027 }) {
  const title = event ? `${ui(lang, 'Program', 'Programm')} — ${event.name[lang]}` : ui(lang, 'Program weekendu', 'Wochenendprogramm')
  return <><PageMeta lang={lang} title={`${title} 2027`} /><PageIntro lang={lang} title={title} lead={event ? event.description[lang] : editionCopy.weekend[lang]} image={event?.image || '/assets/img/weekend-program.jpg'} />
    {event ? <><Section title={ui(lang, 'Harmonogram', 'Zeitplan')} eyebrow={edition.weekend[lang]}><Schedule lang={lang} rows={eventSchedule(event.id)} /></Section><Section title={ui(lang, 'Trasa i dokumenty', 'Strecke und Dokumente')}><Resources lang={lang} event={event.id} routeOnly /><div className="section-actions"><Link className="text-link" to={eventPath(event, lang)}>{ui(lang, 'Informacje o zawodach', 'Wettkampfinformationen')}</Link><SignupButton compact lang={lang} event={event.id} /></div></Section></> : <><SectionNav lang={lang} items={edition.days.map(day => [day.date, day.name[lang]])} />{edition.days.map(day => <Section id={day.date} key={day.date} title={day.name[lang]} className="program-day"><Schedule lang={lang} rows={edition.schedule.filter(row => row.day === day.date)} /></Section>)}{edition.schedule.some(row => !row.day) && <Section title={ui(lang, 'Pozostałe punkty', 'Weitere Programmpunkte')}><Schedule lang={lang} rows={edition.schedule.filter(row => !row.day)} /></Section>}<Section title={ui(lang, 'Po zawodach', 'Nach den Wettkämpfen')} eyebrow={ui(lang, 'Sport i spotkanie', 'Sport und Begegnung')}><div className="resource-grid"><section className="info-panel info-panel--blue"><h3>{ui(lang, 'Sobotni festyn', 'Samstagsfest')}</h3><p>{editionCopy.party[lang]}</p></section><section className="info-panel"><h3>{ui(lang, 'Spotkanie uczestników', 'Treffen für Teilnehmer')}</h3><PendingDetails lang={lang} fields={[text('Miejsce i godzina', 'Ort und Uhrzeit'), text('Uczestnicy i zasady wstępu', 'Teilnehmer und Eintritt'), text('Część festynu czy osobne wydarzenie', 'Teil des Festes oder eigene Veranstaltung')]} />{edition.party.audience && <p>{edition.party.audience}</p>}{edition.party.entryRules && <p>{edition.party.entryRules}</p>}</section></div></Section></>}
  </>
}
export function Registration2027({ lang }: Props) {
  return <><PageMeta lang={lang} title={ui(lang, 'Zapisy 2027', 'Anmeldung 2027')} /><PageIntro lang={lang} title={labels[lang].signup} lead={ui(lang, 'Wybierz swoje zawody.', 'Wähle deinen Wettkampf.')} /><Section title=""><div className="race-grid registration-grid">{events2027.map(event => <EventCard key={event.id} lang={lang} event={event} />)}</div></Section></>
}
function Directions({ lang }: Props) {
  return <div className="directions-grid"><div><p>{edition.logistics.arrival?.[lang] || 'Lipiany'}</p>{edition.logistics.parking.length ? <Paragraphs lang={lang} items={edition.logistics.parking} /> : <PendingDetails lang={lang} fields={[text('Parkingi i organizacja ruchu', 'Parkplätze und Verkehrsregelung')]} />}</div>{reviewContent && <ArchivalSitePlan lang={lang} />}</div>
}
export function Athlete2027({ lang }: Props) {
  return <><PageMeta lang={lang} title={ui(lang, 'Dla zawodnika — 2027', 'Für Teilnehmer — 2027')} /><PageIntro lang={lang} title={ui(lang, 'Dla zawodnika', 'Für Teilnehmer')} lead={ui(lang, 'Przygotuj swój start. Najważniejsze informacje w jednym miejscu.', 'Bereite deinen Start vor. Die wichtigsten Informationen an einem Ort.')} image="/assets/img/tresc/290691924_571654034329279_7826286303397459888_n.jpg" />
    <SectionNav lang={lang} items={[["pakiety", ui(lang, 'Odbiór pakietów', 'Startunterlagen')], ['co-zabrac', ui(lang, 'Co zabrać', 'Ausrüstung')], ['starty', ui(lang, 'Starty', 'Starts')], ['dojazd', ui(lang, 'Dojazd', 'Anreise')], ['regulaminy', labels[lang].rules], ['kontakt', labels[lang].contact]]} />
    <Section id="pakiety" title={ui(lang, 'Odbiór pakietów', 'Abholung der Startunterlagen')} eyebrow={ui(lang, 'Biuro zawodów', 'Wettkampfbüro')}><div className="resource-grid">{edition.logistics.office?.length ? edition.logistics.office.map((paragraph, index) => <section className={`info-panel info-panel--${index ? 'yellow' : 'blue'}`} key={index}><h3>{edition.days[index].name[lang]}</h3><p>{paragraph[lang]}</p></section>) : <Missing lang={lang} what={ui(lang, 'miejsce i godziny biura', 'Ort und Öffnungszeiten des Büros')} />}</div></Section>
    <Section id="co-zabrac" title={ui(lang, 'Co zabrać na start', 'Was du mitbringen solltest')} eyebrow={ui(lang, 'Przygotowanie', 'Vorbereitung')}><div className="equipment-grid">{events2027.map(event => <section className={`info-panel equipment-card equipment-card--${event.id}`} key={event.id}><h3>{event.name[lang]}</h3><Paragraphs lang={lang} items={edition.resources[event.id].equipment} /></section>)}</div></Section>
    <Section id="starty" title={ui(lang, 'Starty zawodów', 'Wettkampfstarts')} eyebrow={edition.weekend[lang]}><Schedule lang={lang} rows={edition.schedule.filter(row => startIds.includes(row.id))} /></Section>
    <Section id="dojazd" title={ui(lang, 'Dojazd i parkingi', 'Anreise und Parken')} eyebrow="Lipiany"><Directions lang={lang} /></Section>
    <Section id="regulaminy" title={ui(lang, 'Zasady i regulaminy', 'Regeln und Reglement')}><RulesDirectory lang={lang} /></Section>
    <Section id="kontakt" title={labels[lang].contact}><div className="contact-strip"><a href={`mailto:${contact.email}`}>{contact.email}</a><a href="tel:+48607602807">{contact.phone}</a><Link className="text-link" to={path(lang, 'kontakt')}>{ui(lang, 'Kontakt z organizatorem', 'Veranstalter kontaktieren')}</Link></div></Section>
  </>
}
export function Spectator2027({ lang }: Props) {
  return <><PageMeta lang={lang} title={ui(lang, 'Dla kibica — 2027', 'Für Zuschauer — 2027')} /><PageIntro lang={lang} title={ui(lang, 'Dla kibica', 'Für Zuschauer')} lead={ui(lang, 'Sportowy weekend z bliskimi. Bądź blisko emocji.', 'Ein Sportwochenende mit deinen Liebsten. Erlebe die Emotionen.')} image="/assets/img/weekend-spectators.jpg" />
    <Section title={ui(lang, 'Kibicowanie', 'Zuschauen')}><div className="resource-grid"><section className="info-panel"><h3>{ui(lang, 'Punkty kibicowania', 'Zuschauerpunkte')}</h3><Paragraphs lang={lang} items={edition.logistics.spectatorPoints} /></section><section className="info-panel info-panel--green"><h3>{ui(lang, 'Aktywności i festyn', 'Aktivitäten und Fest')}</h3><Paragraphs lang={lang} items={edition.logistics.spectatorActivities} /></section></div></Section>
    <Section title={ui(lang, 'Najważniejsze starty', 'Die wichtigsten Starts')} eyebrow={edition.weekend[lang]}><Schedule lang={lang} rows={edition.schedule.filter(row => startIds.includes(row.id) && row.id !== 'sztafety')} /><Link className="text-link" to={path(lang, 'program')}>{ui(lang, 'Pełny program weekendu', 'Das gesamte Wochenendprogramm')}</Link></Section>
    <Section title={ui(lang, 'Dojazd i parkingi', 'Anreise und Parken')} eyebrow="Lipiany"><Directions lang={lang} /></Section>
  </>
}
export function Rules2027({ lang }: Props) {
  return <><PageMeta lang={lang} title={ui(lang, 'Regulaminy 2027', 'Reglement 2027')} /><PageIntro lang={lang} title={labels[lang].rules} lead={ui(lang, 'Wybierz zawody i otwórz właściwy dokument.', 'Wähle den Wettkampf und öffne das passende Dokument.')} /><Section title=""><RulesDirectory lang={lang} drafts /></Section></>
}
export function Rule2027Page({ lang, document }: Props & { document: RuleDocument }) {
  return <><PageMeta lang={lang} title={`${document.name[lang]} — ${ui(lang, 'regulamin', 'Reglement')} 2027`} /><PageIntro lang={lang} title={document.name[lang]} eyebrow={ui(lang, 'Projekt regulaminu 2027', 'Reglemententwurf 2027')}><Link className="text-link" to={path(lang, 'regulaminy')}>{ui(lang, 'Wszystkie regulaminy', 'Alle Reglements')}</Link></PageIntro><section className="section"><div className="shell"><RuleDocumentArticle lang={lang} document={document} /></div></section></>
}
export function Partners2027({ lang }: Props) { return <><PageMeta lang={lang} title={labels[lang].partners} /><PageIntro lang={lang} title={labels[lang].partners} centered /><Section title="">{!edition.partnersConfirmed && <Unconfirmed lang={lang} what={ui(lang, 'lista partnerów na 2027 — poniżej partnerzy z poprzedniej edycji', 'Partnerliste für 2027 — unten die Partner der letzten Ausgabe')} />}<PartnerGroups lang={lang} /></Section></> }
export function Search2027({ lang }: Props) {
  const [params, setParams] = useSearchParams(), query = params.get('q') || ''
  const entries = [...events2027.map(event => ({ title: event.name[lang], description: event.description[lang], url: eventPath(event, lang) })), ...[{ slug: 'program', title: ui(lang, 'Program weekendu', 'Wochenendprogramm') }, { slug: 'dla-zawodnika', title: ui(lang, 'Dla zawodnika', 'Für Teilnehmer') }, { slug: 'dla-kibica', title: ui(lang, 'Dla kibica', 'Für Zuschauer') }, { slug: 'regulaminy', title: labels[lang].rules }, { slug: 'kontakt', title: labels[lang].contact }, { slug: 'zapisy', title: labels[lang].registration }].map(item => ({ title: item.title, description: edition.weekend[lang], url: path(lang, item.slug) }))]
  if (reviewContent) entries.push(...ruleDocuments.map(document => ({ title: `${ui(lang, 'Regulamin', 'Reglement')} — ${document.name[lang]}`, description: ui(lang, 'Projekt dokumentu 2027', 'Dokumententwurf 2027'), url: path(lang, `regulaminy/${document.id}`) })))
  const normalize = (value: string) => value.toLocaleLowerCase(lang).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l')
  const results = query.trim() ? entries.filter(entry => normalize(`${entry.title} ${entry.description}`).includes(normalize(query.trim()))) : []
  return <><PageMeta lang={lang} title={labels[lang].search} /><PageIntro lang={lang} title={labels[lang].search} /><Section title=""><div className="search-page"><form className="search-form" role="search" onSubmit={event => event.preventDefault()}><Icon name="search" /><label className="visually-hidden" htmlFor="search-2027">{labels[lang].search}</label><input id="search-2027" type="search" value={query} onChange={event => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })} placeholder={labels[lang].searchPlaceholder} /></form><div className="search-results">{results.map(entry => <Link className="search-result" to={entry.url} key={entry.url}><h2>{entry.title}</h2><p>{entry.description}</p></Link>)}{!results.length && <p className="empty-state">{query ? labels[lang].noResults : labels[lang].searchStart}</p>}</div></div></Section></>
}
