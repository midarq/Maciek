import { Link, useSearchParams } from 'react-router'
import { contact, labels, path } from './data'
import type { Locale } from './data'
import { edition, editionCopy, events2027, eventDistance, eventPath, eventSchedule, say, signupUrl, startSlot, triathlonVariants } from './edition'
import type { Event2027, EventId, ScheduleItem } from './edition'
import { Icon, PageIntro, PageMeta, PartnerGroups } from './components'
import { localUrl } from './urls'

type Props = { lang: Locale }
const ui = say
function TablePlaceholder({ lang }: Props) { return <span className="table-placeholder">{ui(lang, 'Do uzupełnienia', 'Wird ergänzt')}</span> }
export function SignupButton({ lang, event, variant, label }: Props & { event: EventId; variant?: string; label?: string }) {
  const url = signupUrl(event, variant)
  const title = label || labels[lang].signup
  return url ? <a className="button event-signup" href={url}>{title}<Icon name="external" /></a> : <div className="signup-state"><button className="button event-signup" disabled>{title}</button></div>
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
function Slot({ lang, id }: Props & { id: string }) {
  const row = startSlot(id)
  return <div className="start-slot"><span>{ui(lang, 'Termin startu', 'Starttermin')}</span>{(row?.day || row?.time) && <strong>{[row.day ? dayName(row.day, lang) : '', row.time].filter(Boolean).join(' · ')}</strong>}{row?.place && <p>{row.place}</p>}</div>
}
function dayName(date: string, lang: Locale) { return edition.days.find(day => day.date === date)?.name[lang] || new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'de-DE', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`)) }
function Schedule({ lang, rows }: Props & { rows: ScheduleItem[] }) {
  const columns: { key: 'day' | 'time' | 'name' | 'place'; label: string; value: (row: ScheduleItem) => string }[] = [
    { key: 'day', label: ui(lang, 'Dzień', 'Tag'), value: row => row.day ? dayName(row.day, lang) : '' },
    { key: 'time', label: ui(lang, 'Godzina', 'Uhrzeit'), value: row => row.time || '' },
    { key: 'name', label: ui(lang, 'Wydarzenie', 'Programmpunkt'), value: row => row.name[lang] },
    { key: 'place', label: ui(lang, 'Miejsce', 'Ort'), value: row => row.place || '' },
  ]
  return <div className="schedule-table"><table><thead><tr>{columns.map(column => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead><tbody>{rows.length ? rows.map(row => <tr key={row.id}>{columns.map(column => <td key={column.key} data-label={column.label}>{column.value(row) || <TablePlaceholder lang={lang} />}</td>)}</tr>) : <tr><td colSpan={columns.length}><TablePlaceholder lang={lang} /></td></tr>}</tbody></table></div>
}
function Resources({ lang, event, routeOnly = false }: Props & { event: EventId; routeOnly?: boolean }) {
  const data = edition.resources[event]
  return <div className="resource-grid">
    <section><h3>{ui(lang, 'Trasa i mapy', 'Strecke und Karten')}</h3>{data.routeDescription && <p>{data.routeDescription}</p>}{data.maps.map(map => <figure className="route-map" key={map.url}><a href={localUrl(map.url)} target="_blank" rel="noopener noreferrer" aria-label={`${map.name} — ${ui(lang, 'powiększ', 'vergrößern')}`}><img src={localUrl(map.url)} alt={map.name} loading="lazy" /></a><figcaption>{map.name} · <a href={localUrl(map.url)} download>{ui(lang, 'Pobierz mapę', 'Karte herunterladen')}</a></figcaption></figure>)}</section>
    <section><h3>{ui(lang, 'Regulamin', 'Reglement')}</h3>{data.rules && <a className="text-link" href={localUrl(data.rules.url)}>{data.rules.name}<Icon name="file" /></a>}{!routeOnly && <><h3>{ui(lang, 'Pakiet startowy', 'Startpaket')}</h3>{!!data.package?.length && <ul>{data.package.map(item => <li key={item}>{item}</li>)}</ul>}</>}</section>
  </div>
}
function EventHero({ lang, event }: Props & { event: Event2027 }) {
  const distance = eventDistance(event, lang)
  return <section className={`event-hero event-hero--${event.id}`}><div className="shell event-hero__inner"><div><nav className="breadcrumb" aria-label={ui(lang, 'Nawigacja okruszkowa', 'Brotkrümelnavigation')}><Link to={path(lang)}>{labels[lang].home}</Link><span>/</span><span>{labels[lang].events}</span></nav><p className="eyebrow event-hero__date">{event.id === 'bieg' ? ui(lang, 'Bieg ku czci Aleksa', 'Lauf zu Ehren von Aleks') : edition.weekend[lang]}</p><h1>{event.name[lang]}</h1><p className="event-hero__lead">{event.description[lang]}</p>{distance && <p className="event-hero__facts">{distance}</p>}<SignupButton lang={lang} event={event.id} label={event.id === 'bieg' ? ui(lang, 'Zapisz się na bieg', 'Zum Lauf anmelden') : event.id === 'triathlon' ? ui(lang, 'Zapisz się na triathlon', 'Zum Triathlon anmelden') : labels[lang].signup} /></div><div className="event-hero__photo"><img src={localUrl(event.image)} alt={event.name[lang]} width={event.imageWidth} height={event.imageHeight} /></div></div></section>
}
export function Event2027Page({ lang, event }: Props & { event: Event2027 }) {
  return <><PageMeta lang={lang} title={`${event.name[lang]} 2027`} description={event.description[lang]} /><EventHero lang={lang} event={event} />
    {event.id === 'triathlon' ? <TriathlonContent lang={lang} /> : event.id === 'open-water' ? <OpenWaterContent lang={lang} /> : <RunningContent lang={lang} />}
    <section className="section"><div className="shell"><h2>{ui(lang, 'Przed startem', 'Vor dem Start')}</h2><Resources lang={lang} event={event.id} /><div className="button-row"><Link className="text-link" to={path(lang, event.programSlug)}>{ui(lang, 'Zobacz harmonogram i trasę', 'Zeitplan und Strecke ansehen')}<Icon /></Link><SignupButton lang={lang} event={event.id} /></div></div></section>
  </>
}
function TriathlonContent({ lang }: Props) {
  return <><nav className="variant-navigation shell" aria-label={ui(lang, 'Wybierz dystans', 'Distanz wählen')}>{['sprint', 'olimpijka', 'sztafety', 'dzieci'].map((id, i) => <a href={`#${id}`} key={id}>{[ui(lang, 'Sprint', 'Sprint'), ui(lang, 'Olimpijka', 'Olympisch'), ui(lang, 'Sztafety', 'Staffeln'), ui(lang, 'Triathlon dzieci', 'Kindertriathlon')][i]}<Icon name="chevron" /></a>)}</nav>
    {triathlonVariants.map(variant => <section className="section variant-section" id={variant.id} key={variant.id}><div className="shell"><p className="eyebrow">Triathlon Lipiany</p><h2>{variant.name[lang]}</h2><dl className="distance-grid">{variant.distances.map(distance => <div key={distance.value}><dt>{distance.name[lang]}</dt><dd>{distance.value}</dd></div>)}</dl><p className="edition-prose">{variant.description[lang]}</p>{variant.id === 'sprint' && <aside className="first-triathlon"><h3>{ui(lang, 'Mój pierwszy triathlon', 'Mein erster Triathlon')}</h3><p>{editionCopy.first[lang]}</p>{edition.firstTriathlon.criteria && <p>{edition.firstTriathlon.criteria}</p>}{edition.firstTriathlon.classification && <p>{edition.firstTriathlon.classification}</p>}{edition.firstTriathlon.prizes && <p>{edition.firstTriathlon.prizes}</p>}</aside>}<Slot lang={lang} id={variant.id} />{edition.resources.triathlon.routeDescription && <p className="edition-prose">{edition.resources.triathlon.routeDescription}</p>}<div className="button-row"><Link className="text-link" to={path(lang, 'program/triathlon-lipiany')}>{ui(lang, 'Zobacz harmonogram i trasę', 'Zeitplan und Strecke')}<Icon /></Link><SignupButton lang={lang} event="triathlon" variant={variant.id} label={variant.id === 'sprint' ? ui(lang, 'Zapisz się na sprint', 'Zum Sprint anmelden') : ui(lang, 'Zapisz się na olimpijkę', 'Zur olympischen Distanz anmelden')} /></div></div></section>)}
    <section className="section variant-section" id="sztafety"><div className="shell"><h2>{ui(lang, 'Sztafety', 'Staffeln')}</h2><p className="edition-prose">{editionCopy.relay[lang]}</p>
      <div className="resource-grid">
        <div><h3>{ui(lang, 'Dostępne warianty', 'Verfügbare Varianten')}</h3>{!!edition.relay.variants?.length && <ul>{edition.relay.variants.map(v => <li key={v}>{v}</li>)}</ul>}</div>
        <div><h3>{ui(lang, 'Zespół i zgłoszenia', 'Team und Anmeldung')}</h3>{edition.relay.teamComposition && <p>{edition.relay.teamComposition}</p>}{edition.relay.rules && <p>{edition.relay.rules}</p>}</div>
      </div>
      <Slot lang={lang} id="sztafety" /><SignupButton lang={lang} event="triathlon" variant="sztafety" label={ui(lang, 'Zapisz sztafetę', 'Staffel anmelden')} />
    </div></section>
    <section className="section variant-section" id="dzieci"><div className="shell"><h2>{ui(lang, 'Triathlon dzieci', 'Kindertriathlon')}</h2><p className="edition-prose">{editionCopy.children[lang]}</p>
      <div className="children-table"><table><thead><tr>{[ui(lang, 'Kategoria wiekowa', 'Altersklasse'), ui(lang, 'Pływanie', 'Schwimmen'), ui(lang, 'Rower', 'Rad'), ui(lang, 'Bieg', 'Lauf'), ui(lang, 'Start', 'Start')].map(t => <th key={t}>{t}</th>)}</tr></thead><tbody>{edition.children.categories.length ? edition.children.categories.map(row => <tr key={row.age}><th scope="row">{row.age}</th><td>{row.swim}</td><td>{row.bike}</td><td>{row.run}</td><td>{startSlot(row.scheduleId)?.time || <TablePlaceholder lang={lang} />}</td></tr>) : <tr><td colSpan={5}><TablePlaceholder lang={lang} /></td></tr>}</tbody></table></div>
      <h3>{ui(lang, 'Dla rodzica i opiekuna', 'Für Eltern und Begleitpersonen')}</h3>{edition.children.guardianRules && <p>{edition.children.guardianRules}</p>}
      <Slot lang={lang} id="dzieci" /><Resources lang={lang} event="dzieci" /><SignupButton lang={lang} event="dzieci" label={ui(lang, 'Zapisz dziecko', 'Kind anmelden')} />
    </div></section>
  </>
}
function OpenWaterContent({ lang }: Props) {
  const data = edition.resources['open-water']
  return <section className="section"><div className="shell"><div className="water-distances">{['1000', '5000'].map(distance => <section className="distance-option" id={`dystans-${distance}`} key={distance}><h2>{distance} m</h2><p>{distance === '1000' ? ui(lang, 'Krótszy z dwóch dystansów pływackich.', 'Die kürzere der beiden Schwimmdistanzen.') : ui(lang, 'Dłuższe wyzwanie na wodach otwartych, z wyraźnie wytrzymałościowym charakterem.', 'Die längere Freiwasser-Herausforderung mit Ausdauercharakter.')}</p><Slot lang={lang} id={distance} /><SignupButton lang={lang} event="open-water" variant={distance} /></section>)}</div>
    <h3>{ui(lang, 'Miejsce i sprzęt', 'Ort und Ausrüstung')}</h3>{data.startPlace && <p>{data.startPlace}</p>}{!!data.equipment?.length && <ul>{data.equipment.map(item => <li key={item}>{item}</li>)}</ul>}
  </div></section>
}
function RunningContent({ lang }: Props) {
  const place = edition.resources.bieg.startPlace
  return <section className="section"><div className="shell"><h2>{ui(lang, 'Bieg ku czci Aleksa', 'Lauf zu Ehren von Aleks')}</h2><p className="edition-prose">{edition.running.memorial || editionCopy.memorial[lang]}</p>
    <dl className="event-facts"><div><dt>{ui(lang, 'Dystans', 'Distanz')}</dt><dd>{edition.running.distance}</dd></div><div><dt>{ui(lang, 'Miejsce startu', 'Startort')}</dt><dd>{place}</dd></div></dl>
    <Slot lang={lang} id="bieg" />
  </div></section>
}

export function Program2027({ lang, event }: Props & { event?: Event2027 }) {
  const title = event ? `${ui(lang, 'Program', 'Programm')} — ${event.name[lang]}` : ui(lang, 'Program sportowego weekendu', 'Programm des Sportwochenendes')
  return <><PageMeta lang={lang} title={`${title} 2027`} description={event ? ui(lang, `Harmonogram, miejsce i trasy: ${event.name.pl}.`, `Zeitplan, Ort und Strecken: ${event.name.de}.`) : editionCopy.weekend[lang]} /><PageIntro lang={lang} title={title} lead={edition.weekend[lang]} /><section className="section"><div className="shell">
    {event ? <><Schedule lang={lang} rows={eventSchedule(event.id)} /><Resources lang={lang} event={event.id} routeOnly /><div className="button-row"><SignupButton lang={lang} event={event.id} /></div></> : <><p className="edition-prose">{editionCopy.weekend[lang]}</p>{edition.days.map(day => <section className="program-day" key={day.date}><h2>{day.name[lang]}</h2><Schedule lang={lang} rows={edition.schedule.filter(row => row.day === day.date)} /></section>)}<section className="program-day"><h2>{ui(lang, 'Starty', 'Starts')}</h2><Schedule lang={lang} rows={edition.schedule.filter(row => !row.day)} /></section><aside className="party-note"><h3>{ui(lang, 'Sobotnia impreza dla uczestników', 'Samstagstreffen für Teilnehmer')}</h3><p>{editionCopy.party[lang]}</p>{edition.party.audience && <p>{edition.party.audience}</p>}{edition.party.entryRules && <p>{edition.party.entryRules}</p>}</aside><div className="program-links">{events2027.filter(e => e.id !== 'dzieci').map(e => <Link key={e.id} to={path(lang, e.programSlug)}>{e.name[lang]}<Icon /></Link>)}</div><Link className="button" to={path(lang, 'zapisy')}>{labels[lang].signup}</Link></>}
  </div></section></>
}

export function Registration2027({ lang }: Props) { return <><PageMeta lang={lang} title={ui(lang, 'Wybierz swoje zawody — zapisy 2027', 'Wähle deinen Wettkampf — Anmeldung 2027')} /><PageIntro lang={lang} title={ui(lang, 'Wybierz swoje zawody', 'Wähle deinen Wettkampf')} lead={ui(lang, 'Wybierz zawody, w których chcesz wystartować.', 'Wähle den Wettkampf, bei dem du starten möchtest.')} /><section className="section"><div className="shell"><div className="race-grid registration-grid">{events2027.map(event => <EventCard key={event.id} lang={lang} event={event} />)}</div></div></section></> }
export function Athlete2027({ lang }: Props) {
  const anchors = [['pakiety', ui(lang, 'Odbiór pakietów', 'Startunterlagen')], ['co-zabrac', ui(lang, 'Co zabrać', 'Was mitnehmen')], ['starty', ui(lang, 'Starty zawodów', 'Wettkampfstarts')], ['dojazd', ui(lang, 'Dojazd i parkingi', 'Anreise und Parken')], ['regulaminy', ui(lang, 'Zasady i regulaminy', 'Regeln und Reglement')], ['kontakt', ui(lang, 'Kontakt', 'Kontakt')]]
  return <><PageMeta lang={lang} title={ui(lang, 'Dla zawodnika — informacje 2027', 'Für Teilnehmer — Informationen 2027')} /><PageIntro lang={lang} title={ui(lang, 'Dla zawodnika', 'Für Teilnehmer')} lead={ui(lang, 'Wszystko, co pomoże Ci przygotować start w Lipianach.', 'Informationen zur Vorbereitung deines Starts in Lipiany.')} /><section className="section"><div className="shell"><nav className="page-toc" aria-label={labels[lang].sections}>{anchors.map(([id, title]) => <a href={`#${id}`} key={id}>{title}</a>)}</nav>
    <section className="info-block" id="pakiety"><h2>{ui(lang, 'Odbiór pakietów', 'Startunterlagen')}</h2>{edition.logistics.office && <p>{edition.logistics.office}</p>}<Link to={path(lang, 'program')}>{ui(lang, 'Program weekendu', 'Wochenendprogramm')}</Link></section>
    <section className="info-block" id="co-zabrac"><h2>{ui(lang, 'Co zabrać', 'Was mitnehmen')}</h2><div className="resource-grid">{events2027.map(e => <div key={e.id}><h3>{e.name[lang]}</h3>{!!edition.resources[e.id].equipment?.length && <ul>{edition.resources[e.id].equipment!.map(item => <li key={item}>{item}</li>)}</ul>}</div>)}</div></section>
    <section className="info-block" id="starty"><h2>{ui(lang, 'Starty zawodów', 'Wettkampfstarts')}</h2><Schedule lang={lang} rows={edition.schedule.filter(row => ['sprint', 'olimpijka', 'sztafety', 'dzieci', '1000', '5000', 'bieg'].includes(row.id))} /></section>
    <section className="info-block" id="dojazd"><h2>{ui(lang, 'Dojazd i parkingi', 'Anreise und Parken')}</h2><p>Lipiany</p>{edition.logistics.parking.length > 0 && <ul>{edition.logistics.parking.map(item => <li key={item}>{item}</li>)}</ul>}</section>
    <section className="info-block" id="regulaminy"><h2>{ui(lang, 'Zasady i regulaminy', 'Regeln und Reglement')}</h2><RulesList lang={lang} /></section>
    <section className="info-block" id="kontakt"><h2>{ui(lang, 'Kontakt', 'Kontakt')}</h2><p><a href={`mailto:${contact.email}`}>{contact.email}</a></p><p><a href="tel:+48607602807">{contact.phone}</a></p><Link to={path(lang, 'kontakt')}>{ui(lang, 'Napisz do organizatora', 'Veranstalter kontaktieren')}</Link></section>
    <Link className="button" to={path(lang, 'zapisy')}>{ui(lang, 'Wybierz zawody i zapisz się', 'Wettkampf wählen und anmelden')}</Link>
  </div></section></>
}
export function Spectator2027({ lang }: Props) {
  const blocks = [{ title: ui(lang, 'Dojazd i parkingi', 'Anreise und Parken'), items: edition.logistics.parking }, { title: ui(lang, 'Punkty kibicowania', 'Zuschauerpunkte'), items: edition.logistics.spectatorPoints }, { title: ui(lang, 'Aktywności dla osób towarzyszących', 'Aktivitäten für Begleitpersonen'), items: edition.logistics.spectatorActivities }]
  return <><PageMeta lang={lang} title={ui(lang, 'Dla kibica — weekend w Lipianach 2027', 'Für Zuschauer — Wochenende in Lipiany 2027')} /><PageIntro lang={lang} title={ui(lang, 'Dla kibica', 'Für Zuschauer')} lead={ui(lang, 'Bądź blisko sportowych emocji i wspieraj swoich bliskich.', 'Erlebe den Sport und unterstütze deine Liebsten.')} /><section className="section"><div className="shell">
    <div className="resource-grid">{blocks.map(block => <section key={block.title}><h2>{block.title}</h2>{block.items.length > 0 && <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}</div>
    <h2>{ui(lang, 'Najważniejsze starty', 'Die wichtigsten Starts')}</h2><Schedule lang={lang} rows={edition.schedule.filter(row => ['sprint', 'olimpijka', 'dzieci', '1000', '5000', 'bieg'].includes(row.id))} /><aside className="party-note"><h2>{ui(lang, 'Sobotnie spotkanie', 'Samstagstreffen')}</h2><p>{editionCopy.party[lang]}</p></aside><div className="button-row"><Link className="text-link" to={path(lang, 'program')}>{ui(lang, 'Zobacz program', 'Zum Programm')}<Icon /></Link><Link className="button" to={path(lang, 'zapisy')}>{ui(lang, 'Chcesz wystartować? Zapisz się', 'Selbst starten? Anmelden')}</Link></div>
  </div></section></>
}
function RulesList({ lang }: Props) {
  return <div className="rules-list">{events2027.map(e => <section key={e.id}><h3>{e.name[lang]}</h3>{edition.resources[e.id].rules && <a href={localUrl(edition.resources[e.id].rules!.url)}>{edition.resources[e.id].rules!.name}</a>}</section>)}</div>
}
export function Rules2027({ lang }: Props) {
  return <><PageMeta lang={lang} title={ui(lang, 'Regulaminy 2027', 'Reglement 2027')} /><PageIntro lang={lang} title={labels[lang].rules} lead={ui(lang, 'Dokumenty dla właściwych zawodów i kategorii.', 'Dokumente für die jeweiligen Wettkämpfe und Klassen.')} /><section className="section"><div className="shell"><RulesList lang={lang} /><Link className="text-link" to={path(lang, 'kontakt')}>{ui(lang, 'Kontakt z organizatorem', 'Kontakt zum Veranstalter')}<Icon /></Link></div></section></>
}
export function Partners2027({ lang }: Props) { return <><PageMeta lang={lang} title={labels[lang].partners} /><PageIntro lang={lang} title={labels[lang].partners} centered /><section className="section"><div className="shell"><PartnerGroups lang={lang} /></div></section></> }
export function Search2027({ lang }: Props) {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const entries = [...events2027.map(e => ({ title: e.name[lang], description: e.description[lang], url: eventPath(e, lang) })), ...[{ slug: 'program', title: ui(lang, 'Program weekendu', 'Wochenendprogramm') }, { slug: 'dla-zawodnika', title: ui(lang, 'Dla zawodnika', 'Für Teilnehmer') }, { slug: 'dla-kibica', title: ui(lang, 'Dla kibica', 'Für Zuschauer') }, { slug: 'regulaminy', title: labels[lang].rules }, { slug: 'kontakt', title: labels[lang].contact }, { slug: 'zapisy', title: labels[lang].registration }].map(e => ({ title: e.title, description: edition.weekend[lang], url: path(lang, e.slug) }))]
  const normalize = (value: string) => value.toLocaleLowerCase(lang).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l')
  const results = query.trim() ? entries.filter(e => normalize(`${e.title} ${e.description}`).includes(normalize(query.trim()))) : []
  return <><PageMeta lang={lang} title={labels[lang].search} /><PageIntro lang={lang} title={labels[lang].search} /><section className="section"><div className="shell search-page"><form className="search-form" role="search" onSubmit={e => e.preventDefault()}><Icon name="search" /><label className="visually-hidden" htmlFor="search-2027">{labels[lang].search}</label><input id="search-2027" type="search" value={query} onChange={e => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} placeholder={labels[lang].searchPlaceholder} /></form><div className="search-results">{results.map(e => <Link className="search-result" to={e.url} key={e.url}><div><h2>{e.title}</h2><p>{e.description}</p></div><Icon /></Link>)}{!results.length && <p className="empty-state">{query ? labels[lang].noResults : labels[lang].searchStart}</p>}</div></div></section></>
}
