import type { Locale, Localized } from './data'

export const text = (pl: string, de: string): Localized => ({ pl, de })
export const say = (lang: Locale, pl: string, de: string) => lang === 'pl' ? pl : de
export type EventId = 'triathlon' | 'open-water' | 'bieg' | 'dzieci'
export type TriathlonVariant = 'sprint' | 'olimpijka' | 'sztafety' | 'dzieci'
export interface Event2027 {
  id: EventId
  name: Localized
  titleLines: [Localized, Localized]
  titleAccent: Localized
  slug: string
  programSlug: string
  image: string
  imageWidth: number
  imageHeight: number
  description: Localized
  distance: Localized
}
export interface ScheduleItem {
  id: string
  event: EventId | 'weekend'
  name: Localized
  day: string | null
  time: string | null
  place: string | null
}
export interface EventResources {
  startPlace: string | null
  routeDescription: string | null
  maps: { name: string; url: string }[]
  rules: { name: string; url: string } | null
  equipment: string[] | null
  package: string[] | null
}
const emptyResources = (): EventResources => ({ startPlace: null, routeDescription: null, maps: [], rules: null, equipment: null, package: null })

export const events2027: Event2027[] = [
  { id: 'triathlon', titleAccent: text('Triathlon', 'Triathlon'), name: text('Triathlon Lipiany', 'Triathlon Lipiany'), titleLines: [text('Triathlon', 'Triathlon'), text('Lipiany', 'Lipiany')], slug: 'zawody/triathlon-lipiany', programSlug: 'program/triathlon-lipiany', image: '/assets/img/home-triathlon-clean.webp', imageWidth: 1402, imageHeight: 1122, description: text('Sprint, olimpijka i wspólny start w sztafecie. Znajdź swój sposób na triathlon w Lipianach.', 'Sprint, olympische Distanz und gemeinsam als Staffel. Finde deinen Triathlon in Lipiany.'), distance: text('Sprint · Olimpijka · Sztafety', 'Sprint · Olympisch · Staffeln') },
  { id: 'open-water', titleAccent: text('Open Water', 'Open Water'), name: text('Wądół Open Water', 'Wądół Open Water'), titleLines: [text('Wądół', 'Wądół'), text('Open Water', 'Open Water')], slug: 'zawody/open-water', programSlug: 'program/open-water', image: '/assets/img/home-open-water-clean.webp', imageWidth: 1402, imageHeight: 1122, description: text('Wybierz 1000 m lub 3000 m i podejmij wyzwanie na wodach otwartych w Lipianach.', 'Wähle 1000 m oder 3000 m und stelle dich der Freiwasser-Herausforderung in Lipiany.'), distance: text('1000 m · 3000 m', '1000 m · 3000 m') },
  { id: 'bieg', titleAccent: text('Bieg', 'Lauf'), name: text('Bieg nad Wądołem', 'Lauf am Wądół'), titleLines: [text('Bieg nad', 'Lauf am'), text('Wądołem', 'Wądół')], slug: 'zawody/bieg-nad-wadolem', programSlug: 'program/bieg-nad-wadolem', image: '/assets/img/home-bieg-clean.webp', imageWidth: 1402, imageHeight: 1122, description: text('Bieg ku czci Aleksa. Dołącz do wspólnego sportowego spotkania w Lipianach.', 'Ein Lauf zu Ehren von Aleks. Sei beim gemeinsamen Sportwochenende in Lipiany dabei.'), distance: text('', '') },
  { id: 'dzieci', titleAccent: text('Triathlon', 'Triathlon'), name: text('Triathlon dzieci', 'Kindertriathlon'), titleLines: [text('Triathlon', 'Triathlon'), text('dzieci', 'für Kinder')], slug: 'zawody/triathlon-lipiany#dzieci', programSlug: 'program/triathlon-lipiany', image: '/assets/img/tresc/289594026_567886484706034_4173012077054302764_n.jpg', imageWidth: 1400, imageHeight: 934, description: text('Sportowa przygoda dla najmłodszych.', 'Sport für die Jüngsten.'), distance: text('', '') },
]

// Wszystkie dane edycji 2027 edytuj tutaj. Null oznacza brak potwierdzenia.
// Nie przenoś godzin, tras, regulaminów ani formularzy Foxter z edycji 2026.
export const edition = {
  year: 2027,
  weekend: text('12–13 czerwca 2027', '12.–13. Juni 2027'),
  days: [{ date: '2027-06-12', name: text('Sobota, 12 czerwca', 'Samstag, 12. Juni') }, { date: '2027-06-13', name: text('Niedziela, 13 czerwca', 'Sonntag, 13. Juni') }],
  location: 'Lipiany',
  heroImage: '/assets/img/home-hero-panorama.webp',
  heroMobileImage: '/assets/img/home-hero-triathlon.webp',
  registration: {
    events: { triathlon: null, 'open-water': null, bieg: null, dzieci: null } as Record<EventId, string | null>,
    variants: { sprint: null, olimpijka: null, sztafety: null, dzieci: null, '1000': null, '3000': null } as Record<string, string | null>,
  },
  resources: { triathlon: emptyResources(), 'open-water': emptyResources(), bieg: emptyResources(), dzieci: emptyResources() } as Record<EventId, EventResources>,
  // Program od organizatorów podaje 1000 m i 3000 m, a edycja 2026 miała
  // 1000 m i 5000 m. Pokazujemy nowszy dokument, ale strona mówi wprost, że to
  // czeka na potwierdzenie. Po potwierdzeniu ustaw flagę na true; gdyby jednak
  // obowiązywało 5000 m, zmień tę tablicę, id wiersza '3000' w schedule, klucz
  // w registration.variants oraz opis i distance wydarzenia 'open-water'.
  openWaterDistances: ['1000', '3000'],
  openWaterDistancesConfirmed: false,
  // Program weekendu przekazany przez organizatorów (wiadomość od Macieja,
  // listopad 2026). Godziny i punkty programu przepisane bez zmian; niemieckie
  // etykiety to tłumaczenie tych samych punktów — do przejrzenia przez tłumacza.
  // Miejsca (place) nadal czekają na potwierdzenie.
  schedule: [
    // --- Sobota: Open Water i Bieg nad Wądołem ---
    { id: 'ow-pakiety-1000', event: 'open-water', name: text('Odbiór pakietów Open Water 1000 m', 'Startunterlagen Open Water 1000 m'), day: '2027-06-12', time: '8:30–9:30', place: null },
    { id: 'ow-pakiety-3000', event: 'open-water', name: text('Odbiór pakietów Open Water 3000 m', 'Startunterlagen Open Water 3000 m'), day: '2027-06-12', time: '8:30–10:30', place: null },
    { id: 'weekend-otwarcie', event: 'weekend', name: text('Otwarcie weekendu', 'Eröffnung des Wochenendes'), day: '2027-06-12', time: '9:40', place: null },
    { id: 'ow-odprawa-1000', event: 'open-water', name: text('Odprawa dystansu 1000 m', 'Briefing 1000 m'), day: '2027-06-12', time: '9:45', place: null },
    { id: '1000', event: 'open-water', name: text('Start Open Water 1000 m', 'Start Open Water 1000 m'), day: '2027-06-12', time: '10:00', place: null },
    { id: 'ow-limit-1000', event: 'open-water', name: text('Koniec limitu 1000 m', 'Zeitlimit 1000 m endet'), day: '2027-06-12', time: '10:40', place: null },
    { id: 'ow-odprawa-3000', event: 'open-water', name: text('Odprawa dystansu 3000 m', 'Briefing 3000 m'), day: '2027-06-12', time: '10:45', place: null },
    { id: '3000', event: 'open-water', name: text('Start Open Water 3000 m', 'Start Open Water 3000 m'), day: '2027-06-12', time: '11:00', place: null },
    { id: 'ow-dekoracja-1000', event: 'open-water', name: text('Dekoracja dystansu 1000 m', 'Siegerehrung 1000 m'), day: '2027-06-12', time: '11:15–11:40', place: null },
    { id: 'bieg-pakiety', event: 'bieg', name: text('Odbiór pakietów biegu', 'Startunterlagen Lauf'), day: '2027-06-12', time: '10:30–12:45', place: null },
    { id: 'ow-limit-3000', event: 'open-water', name: text('Koniec proponowanego limitu 3000 m', 'Vorgeschlagenes Zeitlimit 3000 m endet'), day: '2027-06-12', time: '12:30', place: null },
    { id: 'ow-dekoracja-3000', event: 'open-water', name: text('Dekoracja dystansu 3000 m', 'Siegerehrung 3000 m'), day: '2027-06-12', time: '12:45–13:05', place: null },
    { id: 'bieg-odprawa', event: 'bieg', name: text('Odprawa przed biegiem', 'Briefing vor dem Lauf'), day: '2027-06-12', time: '13:15', place: null },
    { id: 'bieg', event: 'bieg', name: text('Start Biegu nad Wądołem — około 8 km', 'Start Lauf am Wądół — ca. 8 km'), day: '2027-06-12', time: '13:30', place: null },
    { id: 'bieg-limit', event: 'bieg', name: text('Koniec proponowanego limitu biegu', 'Vorgeschlagenes Zeitlimit des Laufs endet'), day: '2027-06-12', time: '14:45', place: null },
    { id: 'bieg-dekoracja', event: 'bieg', name: text('Dekoracja biegu i Wądół Challenge oraz otwarcie festynu', 'Siegerehrung Lauf und Wądół Challenge sowie Eröffnung des Festes'), day: '2027-06-12', time: '15:00–15:30', place: null },
    { id: 'festyn-dzieci', event: 'weekend', name: text('Proponowane biegi dzieci w ramach festynu', 'Geplante Kinderläufe im Rahmen des Festes'), day: '2027-06-12', time: '15:30–16:15', place: null },
    { id: 'spotkanie', event: 'weekend', name: text('Główny program festynu', 'Hauptprogramm des Festes'), day: '2027-06-12', time: '16:00 →', place: null },
    // --- Niedziela: Triathlon Lipiany ---
    { id: 'tri-pakiety-dzieci', event: 'dzieci', name: text('Odbiór pakietów dzieci i młodzieży', 'Startunterlagen Kinder und Jugendliche'), day: '2027-06-13', time: '7:00–8:30', place: null },
    { id: 'triathlon-office', event: 'triathlon', name: text('Odbiór pakietów dorosłych i sztafet', 'Startunterlagen Erwachsene und Staffeln'), day: '2027-06-13', time: '7:00–9:30', place: null },
    { id: 'triathlon-rowery', event: 'triathlon', name: text('Wstawianie rowerów do strefy zmian', 'Räder in die Wechselzone bringen'), day: '2027-06-13', time: '7:15–9:00', place: null },
    { id: 'dzieci-odprawa', event: 'dzieci', name: text('Odprawa dzieci i opiekunów', 'Briefing für Kinder und Betreuer'), day: '2027-06-13', time: '9:15', place: null },
    { id: 'dzieci', event: 'dzieci', name: text('Start triathlonu dzieci i młodzieży', 'Start Kinder- und Jugendtriathlon'), day: '2027-06-13', time: '9:30', place: null },
    { id: 'dzieci-dekoracja', event: 'dzieci', name: text('Dekoracja dzieci; dodatkowe okno wstawiania rowerów dorosłych po zwolnieniu strefy', 'Siegerehrung Kinder; zusätzliches Zeitfenster für Räder der Erwachsenen, sobald die Wechselzone frei ist'), day: '2027-06-13', time: '10:30–10:45', place: null },
    { id: 'triathlon-odprawa', event: 'triathlon', name: text('Odprawa olimpijki', 'Briefing olympische Distanz'), day: '2027-06-13', time: '10:45', place: null },
    { id: 'olimpijka', event: 'triathlon', name: text('Start olimpijki i sztafet: 1500 m / 40 km / 10 km', 'Start olympische Distanz und Staffeln: 1500 m / 40 km / 10 km'), day: '2027-06-13', time: '11:00', place: null },
    { id: 'sztafety', event: 'triathlon', name: text('Start sztafet', 'Staffelstart'), day: '2027-06-13', time: '11:00 / 12:00', place: null },
    { id: 'sprint-odprawa', event: 'triathlon', name: text('Odprawa krótkiego dystansu', 'Briefing kurze Distanz'), day: '2027-06-13', time: '11:45', place: null },
    { id: 'sprint', event: 'triathlon', name: text('Start 4:18:4 i sztafet: 400 m / 18 km / 4 km', 'Start 4:18:4 und Staffeln: 400 m / 18 km / 4 km'), day: '2027-06-13', time: '12:00', place: null },
    { id: 'sprint-limit', event: 'triathlon', name: text('Koniec limitu krótkiego dystansu', 'Zeitlimit kurze Distanz endet'), day: '2027-06-13', time: '13:40', place: null },
    { id: 'sprint-dekoracja', event: 'triathlon', name: text('Dekoracja 4:18:4 i sztafet krótkich', 'Siegerehrung 4:18:4 und kurze Staffeln'), day: '2027-06-13', time: '14:00–14:30', place: null },
    { id: 'olimpijka-limit', event: 'triathlon', name: text('Koniec limitu olimpijki', 'Zeitlimit olympische Distanz endet'), day: '2027-06-13', time: '15:15', place: null },
    { id: 'olimpijka-dekoracja', event: 'triathlon', name: text('Dekoracja olimpijki i sztafet', 'Siegerehrung olympische Distanz und Staffeln'), day: '2027-06-13', time: '15:30–16:00', place: null },
    { id: 'weekend-zakonczenie', event: 'weekend', name: text('Zakończenie sportowego weekendu', 'Abschluss des Sportwochenendes'), day: '2027-06-13', time: '16:00', place: null },
    { id: 'triathlon-rowery-odbior', event: 'triathlon', name: text('Odbiór rowerów ze strefy zmian', 'Räder aus der Wechselzone abholen'), day: '2027-06-13', time: '→ 16:30', place: null },
  ] as ScheduleItem[],
  relay: { variants: null as string[] | null, teamComposition: null as string | null, rules: null as string | null },
  children: { categories: [] as { age: string; swim: string; bike: string; run: string; scheduleId: string }[], guardianRules: null as string | null },
  firstTriathlon: { criteria: null as string | null, classification: null as string | null, prizes: null as string | null },
  running: { distance: '~8 km' as string | null, memorial: null as string | null },
  party: { audience: null as string | null, entryRules: null as string | null },
  logistics: { office: null as string | null, parking: [] as string[], spectatorPoints: [] as string[], spectatorActivities: [] as string[] },
  privacy: null as { name: string; url: string } | null,
  partnersConfirmed: false,
}

export const triathlonVariants = [
  { id: 'sprint' as const, name: text('Sprint', 'Sprint'), distances: [{ name: text('Pływanie', 'Schwimmen'), value: '400 m' }, { name: text('Rower', 'Rad'), value: '18 km' }, { name: text('Bieg', 'Laufen'), value: '4 km' }], description: text('Chcesz spróbować triathlonu po raz pierwszy? A może lubisz szybkie ściganie od startu do mety? Sprint w Lipianach łączy 400 m pływania, 18 km na rowerze i 4 km biegu. To propozycja zarówno dla debiutantów, jak i osób, które chcą sprawdzić się na krótkim dystansie.', 'Dein erster Triathlon oder ein schnelles Rennen? Der Sprint in Lipiany verbindet 400 m Schwimmen, 18 km Radfahren und 4 km Laufen. Für Debütanten und alle, die sich auf der kurzen Distanz messen möchten.') },
  { id: 'olimpijka' as const, name: text('Olimpijka', 'Olympische Distanz'), distances: [{ name: text('Pływanie', 'Schwimmen'), value: '1500 m' }, { name: text('Rower', 'Rad'), value: '40 km' }, { name: text('Bieg', 'Laufen'), value: '10 km' }], description: text('Szukasz dłuższego wyzwania? Olimpijka to 1500 m pływania, 40 km na rowerze i 10 km biegu. Wybierz ten dystans, jeśli chcesz sprawdzić przygotowanie, wytrzymałość i umiejętność rozłożenia sił w trzech dyscyplinach.', 'Du suchst eine längere Herausforderung? Die olympische Distanz umfasst 1500 m Schwimmen, 40 km Radfahren und 10 km Laufen. Teste deine Vorbereitung, Ausdauer und Krafteinteilung in drei Disziplinen.') },
]
// Punkty programu pokazywane jako „starty zawodów” — kolejność bierze się
// z kolejności w edition.schedule, więc lista sama układa się chronologicznie.
export const startIds = ['1000', '3000', 'bieg', 'dzieci', 'olimpijka', 'sztafety', 'sprint']
export function eventById(id: EventId) { return events2027.find(event => event.id === id)! }
export function signupUrl(id: EventId, variant?: string) { return (variant ? edition.registration.variants[variant] : null) || edition.registration.events[id] }
export function eventSchedule(id: EventId) { return edition.schedule.filter(row => row.event === id || (id === 'triathlon' && row.event === 'dzieci')) }
export function startSlot(id: string) { return edition.schedule.find(row => row.id === id) }
export function eventPath(event: Event2027, lang: Locale) { const [slug, hash] = event.slug.split('#'); return `${lang === 'de' ? '/de' : ''}/${slug}/${hash ? `#${hash}` : ''}` }
export const menu2027 = {
  events: events2027.filter(event => event.id !== 'dzieci').map(event => ({ label: event.name, slug: event.slug })),
  program: [{ label: text('Opis weekendu', 'Das Wochenende'), slug: 'program' }, { label: text('Triathlon Lipiany', 'Triathlon Lipiany'), slug: 'program/triathlon-lipiany' }, { label: text('Bieg nad Wądołem', 'Lauf am Wądół'), slug: 'program/bieg-nad-wadolem' }, { label: text('Open Water', 'Open Water'), slug: 'program/open-water' }],
}

export const editionCopy = {
  heroLead: text('Triathlon, pływanie na wodach otwartych i bieg. Dołącz do sportowego weekendu w Lipianach.', 'Triathlon, Freiwasserschwimmen und Laufen. Sei beim Sportwochenende in Lipiany dabei.'),
  weekend: text('Dwa dni sportowych emocji w Lipianach. W programie triathlon, pływanie na wodach otwartych, bieg i sportowa przygoda dla dzieci. W sobotę po zawodach przewidziana jest impreza dla uczestników.', 'Zwei Tage Sport in Lipiany: Triathlon, Freiwasserschwimmen, Laufen und ein sportliches Abenteuer für Kinder. Am Samstag ist nach den Wettkämpfen ein Treffen für Teilnehmer vorgesehen.'),
  party: text('W sobotę po zawodach spotkamy się na imprezie dla uczestników.', 'Am Samstag ist nach den Wettkämpfen ein Treffen für Teilnehmer geplant.'),
  relay: text('Jeden zespół, wspólny cel. Zbierz znajomych, współpracowników lub klubową ekipę i podzielcie między siebie sportowe wyzwanie. Sztafeta to okazja do wspólnego startu i kibicowania sobie na trasie.', 'Ein Team, ein gemeinsames Ziel. Teile die sportliche Herausforderung mit Freunden, Kollegen oder deinem Verein. Eine Staffel verbindet einen gemeinsamen Start mit gegenseitiger Unterstützung.'),
  children: text('Triathlon dzieci to zaproszenie do sportowej przygody w Lipianach.', 'Der Kindertriathlon lädt zu einem sportlichen Abenteuer in Lipiany ein.'),
  first: text('Pierwszy start? Sprint może być Twoim początkiem z triathlonem. Organizator przewidział kategorię „Mój pierwszy triathlon”.', 'Dein erster Start? Der Sprint kann dein Einstieg in den Triathlon sein. Die Kategorie „Mein erster Triathlon“ ist vorgesehen.'),
  memorial: text('Ten bieg odbywa się ku czci Aleksa. Łączy nas sport i pamięć.', 'Dieser Lauf findet zu Ehren von Aleks statt. Sport und Erinnerung verbinden uns.'),
}

export function eventDistance(event: Event2027, lang: Locale) { return event.id === 'bieg' ? edition.running.distance || event.distance[lang] : event.id === 'dzieci' && edition.children.categories.length ? edition.children.categories.map(row => row.age).join(' · ') : event.distance[lang] }
