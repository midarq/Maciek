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
  { id: 'open-water', titleAccent: text('Open Water', 'Open Water'), name: text('Wądół Open Water', 'Wądół Open Water'), titleLines: [text('Wądół', 'Wądół'), text('Open Water', 'Open Water')], slug: 'zawody/open-water', programSlug: 'program/open-water', image: '/assets/img/home-open-water-clean.webp', imageWidth: 1402, imageHeight: 1122, description: text('Wybierz 1000 m lub 5000 m i podejmij wyzwanie na wodach otwartych w Lipianach.', 'Wähle 1000 m oder 5000 m und stelle dich der Freiwasser-Herausforderung in Lipiany.'), distance: text('1000 m · 5000 m', '1000 m · 5000 m') },
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
    variants: { sprint: null, olimpijka: null, sztafety: null, dzieci: null, '1000': null, '5000': null } as Record<string, string | null>,
  },
  resources: { triathlon: emptyResources(), 'open-water': emptyResources(), bieg: emptyResources(), dzieci: emptyResources() } as Record<EventId, EventResources>,
  schedule: [
    { id: 'triathlon-office', event: 'triathlon', name: text('Biuro zawodów i odbiór pakietów', 'Wettkampfbüro und Startunterlagen'), day: null, time: null, place: null },
    { id: 'triathlon-briefing', event: 'triathlon', name: text('Odprawa i strefa zmian', 'Briefing und Wechselzone'), day: null, time: null, place: null },
    { id: 'sprint', event: 'triathlon', name: text('Start sprintu', 'Start Sprint'), day: null, time: null, place: null },
    { id: 'olimpijka', event: 'triathlon', name: text('Start olimpijki', 'Start olympische Distanz'), day: null, time: null, place: null },
    { id: 'sztafety', event: 'triathlon', name: text('Start sztafet', 'Staffelstart'), day: null, time: null, place: null },
    { id: 'dzieci', event: 'dzieci', name: text('Start triathlonu dzieci', 'Start Kindertriathlon'), day: null, time: null, place: null },
    { id: 'open-water-office', event: 'open-water', name: text('Biuro i odprawa Open Water', 'Freiwasserbüro und Briefing'), day: null, time: null, place: null },
    { id: '1000', event: 'open-water', name: text('Start Open Water 1000 m', 'Start Freiwasser 1000 m'), day: null, time: null, place: null },
    { id: '5000', event: 'open-water', name: text('Start Open Water 5000 m', 'Start Freiwasser 5000 m'), day: null, time: null, place: null },
    { id: 'bieg-office', event: 'bieg', name: text('Biuro i odbiór pakietów biegu', 'Laufbüro und Startunterlagen'), day: null, time: null, place: null },
    { id: 'bieg', event: 'bieg', name: text('Start biegu ku czci Aleksa', 'Start des Laufs zu Ehren von Aleks'), day: null, time: null, place: null },
    { id: 'spotkanie', event: 'weekend', name: text('Impreza dla uczestników po zawodach', 'Treffen für Teilnehmer nach den Wettkämpfen'), day: '2027-06-12', time: null, place: null },
  ] as ScheduleItem[],
  relay: { variants: null as string[] | null, teamComposition: null as string | null, rules: null as string | null },
  children: { categories: [] as { age: string; swim: string; bike: string; run: string; scheduleId: string }[], guardianRules: null as string | null },
  firstTriathlon: { criteria: null as string | null, classification: null as string | null, prizes: null as string | null },
  running: { distance: null as string | null, memorial: null as string | null },
  party: { audience: null as string | null, entryRules: null as string | null },
  logistics: { office: null as string | null, parking: [] as string[], spectatorPoints: [] as string[], spectatorActivities: [] as string[] },
  privacy: null as { name: string; url: string } | null,
  partnersConfirmed: false,
}

export const triathlonVariants = [
  { id: 'sprint' as const, name: text('Sprint', 'Sprint'), distances: [{ name: text('Pływanie', 'Schwimmen'), value: '400 m' }, { name: text('Rower', 'Rad'), value: '18 km' }, { name: text('Bieg', 'Laufen'), value: '4 km' }], description: text('Chcesz spróbować triathlonu po raz pierwszy? A może lubisz szybkie ściganie od startu do mety? Sprint w Lipianach łączy 400 m pływania, 18 km na rowerze i 4 km biegu. To propozycja zarówno dla debiutantów, jak i osób, które chcą sprawdzić się na krótkim dystansie.', 'Dein erster Triathlon oder ein schnelles Rennen? Der Sprint in Lipiany verbindet 400 m Schwimmen, 18 km Radfahren und 4 km Laufen. Für Debütanten und alle, die sich auf der kurzen Distanz messen möchten.') },
  { id: 'olimpijka' as const, name: text('Olimpijka', 'Olympische Distanz'), distances: [{ name: text('Pływanie', 'Schwimmen'), value: '1500 m' }, { name: text('Rower', 'Rad'), value: '40 km' }, { name: text('Bieg', 'Laufen'), value: '10 km' }], description: text('Szukasz dłuższego wyzwania? Olimpijka to 1500 m pływania, 40 km na rowerze i 10 km biegu. Wybierz ten dystans, jeśli chcesz sprawdzić przygotowanie, wytrzymałość i umiejętność rozłożenia sił w trzech dyscyplinach.', 'Du suchst eine längere Herausforderung? Die olympische Distanz umfasst 1500 m Schwimmen, 40 km Radfahren und 10 km Laufen. Teste deine Vorbereitung, Ausdauer und Krafteinteilung in drei Disziplinen.') },
]
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
