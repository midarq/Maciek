import { Link, useLocation } from 'react-router'
import type { Locale } from './data'
import { contact, labels, path } from './data'
import { edition, events2027, say, signupUrl, startSlot } from './edition'
import type { EventId } from './edition'
import { reviewContent, ruleDocuments } from './details'
import type { RuleDocument } from './details'
import { localUrl } from './urls'

type Props = { lang: Locale; event: EventId; variant?: string }
const pending = (lang: Locale) => <span className="table-placeholder">{say(lang, 'Do uzupełnienia', 'Wird ergänzt')}</span>
function documentsFor(event: EventId, variant?: string) {
  return ruleDocuments.filter(document => document.event === event && (!variant || document.id === variant))
}
export function RulesFor({ lang, event, variant }: Props) {
  const approved = edition.resources[event].rules
  if (approved) return <a href={localUrl(approved.url)}>{approved.name[lang]}</a>
  return <ul className="rule-links">{documentsFor(event, variant).map(document => <li key={document.id}>
    {document.url ? <a href={localUrl(document.url)}>{document.name[lang]} — 2027</a>
      : reviewContent ? <Link to={`${path(lang, 'regulaminy')}#${document.id}`}>{document.name[lang]} — {say(lang, 'projekt 2027', 'Entwurf 2027')}</Link>
        : <><span>{document.name[lang]}</span>{pending(lang)}</>}
  </li>)}</ul>
}

function RuleDraft({ lang, document }: { lang: Locale; document: RuleDocument }) {
  const { hash } = useLocation()
  const row = startSlot(document.startId), data = edition.resources[document.event]
  const label = (pl: string, de: string) => say(lang, pl, de)
  const facts = [
    [label('Organizator', 'Veranstalter'), labels[lang].organizer],
    [label('Kontakt', 'Kontakt'), `${contact.email} · ${contact.phone}`],
    [label('Termin', 'Termin'), row?.day ? edition.days.find(day => day.date === row.day)?.name[lang] + ' 2027' : null],
    [document.event === 'dzieci' ? label('Początek rywalizacji', 'Wettkampfbeginn') : label('Start', 'Start'), document.event === 'open-water' ? `1000 m: ${startSlot('1000')?.time} · 3000 m: ${startSlot('3000')?.time}` : row?.time],
    [label('Dystans', 'Distanz'), document.event === 'bieg' ? edition.running.distance : document.distances],
    [label('Miejsce startu', 'Startort'), data.startPlace?.[lang]],
    [label('Limit — propozycja', 'Zeitlimit — Vorschlag'), document.proposedLimit],
  ]
  const sections = [
    [label('III. Klasyfikacje i warunki udziału', 'III. Wertungsklassen und Teilnahmebedingungen'), label('Kategorie, roczniki, minimalny wiek, dokumenty i zasady udziału opiekunów.', 'Wertungsklassen, Geburtsjahrgänge, Mindestalter, Unterlagen und Regeln für Begleitpersonen.')],
    [label('IV. Zgłoszenia, opłaty i zmiany', 'IV. Anmeldung, Gebühren und Änderungen'), label('Terminy zapisów, limit miejsc, stawki i terminy opłat, zwroty, zmiany zawodnika lub składu sztafety.', 'Anmeldefristen, Teilnehmerlimit, Gebühren und Zahlungsfristen, Erstattungen und Änderungen von Teilnehmern oder Staffelbesetzung.')],
    [label('VII. Nagrody', 'VII. Preise'), label('Klasyfikacje, nagradzane miejsca i zasady odbioru nagród; osobne zasady „Mój pierwszy triathlon” i Wądół Challenge, jeśli dotyczą.', 'Wertungen, prämierte Plätze und Ausgabe der Preise; gegebenenfalls Regeln für „Mein erster Triathlon“ und Wądół Challenge.')],
    [label('VIII. Dane osobowe i wizerunek', 'VIII. Personenbezogene Daten und Bildrechte'), label('Aktualna klauzula przekazana lub zatwierdzona przez organizatora dla właściwych zawodów.', 'Aktuelle, vom Veranstalter bereitgestellte oder bestätigte Bestimmungen für den jeweiligen Wettkampf.')],
    [label('IX. Reklamacje', 'IX. Beschwerden'), label('Sposób, adres i terminy zgłoszenia oraz rozpatrzenia reklamacji.', 'Verfahren, Anschrift und Fristen für das Einreichen und Bearbeiten von Beschwerden.')],
    [label('X. Postanowienia końcowe', 'X. Schlussbestimmungen'), label('Zasady bezpieczeństwa, zmiany lub odwołanie zawodów i pozostałe zatwierdzone postanowienia.', 'Sicherheitsregeln, Änderungen oder Absage des Wettkampfs und weitere bestätigte Bestimmungen.')],
  ]
  return <details className="rule-draft" id={document.id} open={hash === `#${document.id}` || undefined}>
    <summary>{document.name[lang]} — {label('projekt regulaminu 2027', 'Reglemententwurf 2027')}</summary>
    <div className="rule-draft__body">
      <p className="eyebrow">{label('Wersja robocza — do zatwierdzenia', 'Entwurf — zu bestätigen')}</p>
      <h4>{label('I–II. Organizacja, termin i trasa', 'I–II. Organisation, Termin und Strecke')}</h4>
      <div className="schedule-table"><table><tbody>{facts.map(([name, value]) => <tr key={name}><th scope="row">{name}</th><td>{value || pending(lang)}</td></tr>)}</tbody></table></div>
      {data.routeDescription && <p>{data.routeDescription[lang]}</p>}
      <h4>{sections[0][0]}</h4>
      {document.event === 'dzieci' && edition.children.categories.length > 0 && <div className="schedule-table"><table><thead><tr><th>{label('Kategoria', 'Altersklasse')}</th><th>{label('Roczniki 2027', 'Geburtsjahrgänge 2027')}</th><th>{label('Dystans', 'Distanz')}</th></tr></thead><tbody>{edition.children.categories.map(category => <tr key={category.age}><th scope="row">{category.name[lang]} · {category.age}</th><td>{category.birthYears}</td><td>{category.swim} / {category.bike} / {category.run}</td></tr>)}</tbody></table></div>}
      <p>{sections[0][1]}</p>{pending(lang)}
      <h4>{sections[1][0]}</h4><p>{sections[1][1]}</p>{signupUrl(document.event) ? <a href={signupUrl(document.event)!}>{labels[lang].signup}</a> : pending(lang)}
      <h4>{label('V. Sprzęt i przebieg zawodów', 'V. Ausrüstung und Wettkampfablauf')}</h4>
      {document.id.startsWith('sztafeta-') && edition.relay.teamComposition && <p>{edition.relay.teamComposition[lang]}</p>}
      {document.event === 'dzieci' && edition.children.guardianRules && <p>{edition.children.guardianRules[lang]}</p>}
      {data.equipment?.map((item, index) => <p key={index}>{item[lang]}</p>)}
      <p>{label('Zasady sprzętowe, limity etapów i procedury zmian:', 'Ausrüstungsregeln, Zeitlimits der Abschnitte und Wechselverfahren:')} {pending(lang)}</p>
      <h4>{label('VI. Pakiet i świadczenia', 'VI. Startpaket und Leistungen')}</h4>
      {data.package?.length ? data.package.map((item, index) => <p key={index}>{item[lang]}</p>) : pending(lang)}
      {sections.slice(2).map(([title, description]) => <section key={title}><h4>{title}</h4><p>{description}</p>{pending(lang)}</section>)}
      <p className="rule-draft__source"><a href={document.source} target="_blank" rel="noopener noreferrer">{label('Pierwowzór 2026 — materiał archiwalny', 'Vorlage 2026 — Archivmaterial')}</a></p>
    </div>
  </details>
}

export function RulesDirectory({ lang, drafts = false }: { lang: Locale; drafts?: boolean }) {
  return <div className={`rules-list${drafts && reviewContent ? ' rules-list--drafts' : ''}`}>{events2027.map(event => <section key={event.id}>
    <h3>{event.id === 'dzieci' ? say(lang, 'Triathlon dzieci i młodzieży', 'Kinder- und Jugendtriathlon') : event.name[lang]}</h3>
    {drafts && reviewContent ? documentsFor(event.id).map(document => document.url
      ? <p key={document.id}><a href={localUrl(document.url)}>{document.name[lang]} — 2027</a></p>
      : <RuleDraft key={document.id} lang={lang} document={document} />)
      : <RulesFor lang={lang} event={event.id} />}
  </section>)}</div>
}

