import type { Localized } from './data'
import type { EventId } from './edition'

const t = (pl: string, de: string): Localized => ({ pl, de })

// An ordinary build uses confirmed information. Development and the organizer's
// GitHub Pages preview also show proposals, clearly marked as a draft.
export const reviewContent = import.meta.env.VITE_REVIEW_CONTENT === 'true'
  || (import.meta.env.DEV && import.meta.env.VITE_REVIEW_CONTENT !== 'false')
export const confirmations = {
  locations: false,
  triathlonRoutes: false,
  childrenRoute: false,
  childrenCategories: false,
  guardianRules: false,
  openWaterRoute: false,
  openWater1000Route: false,
  runningRoute: false,
  runningDistance: false,
  relayFormat: false,
  equipment: false,
  packages: false,
} satisfies Record<string, boolean>
export const showDetail = (area: keyof typeof confirmations) => reviewContent || confirmations[area]
export const runningDistance = '~8 km'

export const places = {
  mgok: t('Miejsko-Gminny Ośrodek Kultury (MGOK), ul. Okrzei 1, Lipiany', 'Kulturzentrum MGOK, ul. Okrzei 1, Lipiany'),
  saturdayOffice: t('Biuro zawodów w rejonie MGOK, ul. Okrzei 1, Lipiany', 'Wettkampfbüro beim Kulturzentrum MGOK, ul. Okrzei 1, Lipiany'),
  openWaterStart: t('Jezioro Wądół przy MGOK, ul. Okrzei 1, Lipiany', 'Wądół-See beim Kulturzentrum MGOK, ul. Okrzei 1, Lipiany'),
  openWaterFinish: t('Brzeg jeziora Wądół przy MGOK, ul. Okrzei 1, Lipiany', 'Ufer des Wądół-Sees beim Kulturzentrum MGOK, ul. Okrzei 1, Lipiany'),
  office: t('Biuro zawodów, Hala Sportowa, ul. Kopernika 9, Lipiany', 'Wettkampfbüro, Sporthalle, ul. Kopernika 9, Lipiany'),
  beach: t('Plaża miejska nad jeziorem Wądół, ul. Lipowa, Lipiany', 'Stadtstrand am Wądół-See, ul. Lipowa, Lipiany'),
  transition: t('Strefa zmian przy Stadionie Miejskim, Lipiany', 'Wechselzone am Stadtstadion, Lipiany'),
}

export const schedulePlaces: Record<string, Localized> = {
  'ow-pakiety-1000': places.saturdayOffice,
  'ow-pakiety-3000': places.saturdayOffice,
  'ow-odprawa-1000': places.openWaterStart,
  '1000': places.openWaterStart,
  'ow-limit-1000': places.openWaterFinish,
  'ow-odprawa-3000': places.openWaterStart,
  '3000': places.openWaterStart,
  'bieg-pakiety': places.saturdayOffice,
  'ow-limit-3000': places.openWaterFinish,
  'bieg-odprawa': places.mgok,
  bieg: places.mgok,
  'bieg-limit': places.mgok,
  'tri-pakiety-dzieci': places.office,
  'triathlon-office': places.office,
  'triathlon-rowery': places.transition,
  'dzieci-odprawa': places.beach,
  dzieci: places.beach,
  'dzieci-dekoracja': t('Strefa zmian przy Stadionie Miejskim; miejsce dekoracji do uzupełnienia', 'Wechselzone am Stadtstadion; Ort der Siegerehrung wird ergänzt'),
  'triathlon-odprawa': places.beach,
  olimpijka: places.beach,
  sztafety: places.beach,
  'sprint-odprawa': places.beach,
  sprint: places.beach,
  'triathlon-rowery-odbior': places.transition,
}

export const routeDescriptions: Record<EventId, Localized> = {
  triathlon: t(
    'Etap pływacki zaczyna się w wodzie przy plaży miejskiej nad jeziorem Wądół, przy ul. Lipowej w Lipianach. Od wyjścia z wody do strefy zmian przy Stadionie Miejskim jest około 100 m. Etap kolarski biegnie po pofałdowanej trasie asfaltowej. Etap biegowy prowadzi ulicami Lipian, po asfalcie i kostce brukowej. Przebieg etapów, nawroty i metę pokazują mapy poszczególnych dystansów.',
    'Der Schwimmstart erfolgt im Wasser des Wądół-Sees am Stadtstrand an der ul. Lipowa. Vom Wasserausstieg sind es rund 100 m bis zur Wechselzone am Stadtstadion. Die Radstrecke verläuft auf einer welligen Asphaltstrecke. Gelaufen wird auf Asphalt und Pflaster. Auf den Streckenkarten sind die einzelnen Abschnitte, Wendepunkte und das Ziel eingezeichnet.',
  ),
  dzieci: t(
    'Start, meta i strefa zmian triathlonu dzieci znajdują się w rejonie plaży miejskiej przy ul. Lipowej w Lipianach. Po wyjściu z jeziora Wądół zawodnicy pokonują około 80 m do strefy zmian. Trasa rowerowa prowadzi przez Lipiany i odcinek drogi wojewódzkiej nr 119. Na etapie biegowym zawodnicy pokonują dwie pętle przy ul. Lipowej. Dystanse i godziny startu poszczególnych grup podajemy w tabeli.',
    'Start, Ziel und Wechselzone des Kinder- und Jugendtriathlons liegen im Bereich des Stadtstrands an der ul. Lipowa. Vom Wasserausstieg am Wądół-See sind es rund 80 m bis zur Wechselzone. Die Radstrecke führt durch Lipiany und über einen Abschnitt der Woiwodschaftsstraße 119. Gelaufen werden zwei Runden an der ul. Lipowa. Die Altersklassen, Distanzen und Startzeiten stehen in der Tabelle.',
  ),
  'open-water': t(
    'Zawody odbędą się na jeziorze Wądół w Lipianach. Baza zawodów znajduje się przy Miejsko-Gminnym Ośrodku Kultury, ul. Okrzei 1. Start odbywa się z wody, z linii wyznaczonej bojami, a meta znajduje się przy brzegu. Trasę każdego dystansu wyznaczają boje.',
    'Der Wettkampf findet im Wądół-See in Lipiany statt. Der Treffpunkt liegt am Kulturzentrum MGOK, ul. Okrzei 1. Der Start erfolgt im Wasser zwischen Bojen. Das Ziel liegt am Ufer. Die Strecken sind mit Bojen markiert.',
  ),
  bieg: t(
    'Start i meta Biegu nad Wądołem znajdują się przy Miejsko-Gminnym Ośrodku Kultury w Lipianach, ul. Okrzei 1. Trasa przełajowa prowadzi wokół jeziora Wądół. Na zawodników czekają odcinki leśne, podbiegi i zbiegi, a podłoże miejscami jest piaszczyste lub trawiaste. Na trasie występują też korzenie.',
    'Start und Ziel des Geländelaufs befinden sich am Kulturzentrum MGOK, ul. Okrzei 1, Lipiany. Die Strecke führt rund um den Wądół-See. Sie umfasst Waldwege, Anstiege und Gefälle sowie Abschnitte mit Sand, Gras und Wurzeln.',
  ),
}

export const equipment: Record<EventId, Localized[]> = {
  triathlon: [t('Przygotuj strój pływacki, okularki, sprawny rower, kask i buty biegowe. Do biura zawodów zabierz dokument ze zdjęciem. Zasady stosowania pianki, oznaczenia sprzętu i umieszczenia numeru startowego znajdziesz w regulaminie swojego dystansu.', 'Bringe Schwimmbekleidung, Schwimmbrille, ein funktionstüchtiges Fahrrad, Helm und Laufschuhe mit. Für das Wettkampfbüro brauchst du einen Lichtbildausweis. Die Ausschreibung enthält die Regeln für Neoprenanzüge sowie die Kennzeichnung von Ausrüstung und Startnummer.')],
  'open-water': [t('Zabierz okularki i strój dopasowany do wybranej klasyfikacji. Przed startem sprawdź w regulaminie zasady dotyczące pianki, czepka i bojki oraz sposób odbioru chipa pomiarowego.', 'Bringe eine Schwimmbrille und für deine Wertungsklasse geeignete Schwimmbekleidung mit. Die Regeln für Neoprenanzug, Badekappe, Boje und die Ausgabe des Zeitmesschips findest du in der Ausschreibung.')],
  bieg: [t('Wybierz obuwie odpowiednie do biegu w terenie. Zabierz do biura dokumenty wymagane przez regulamin. Numer startowy otrzymasz przy odbiorze pakietu.', 'Wähle Schuhe, die für das Laufen im Gelände geeignet sind. Bringe die in der Ausschreibung genannten Unterlagen mit. Du erhältst deine Startnummer bei der Abholung der Startunterlagen.')],
  dzieci: [t('Przygotujcie strój pływacki, okularki, rower, kask, buty do biegania i dokument potwierdzający wiek dziecka. Przy odbiorze pakietu rodzic lub opiekun prawny podpisuje zgodę według zasad regulaminu.', 'Bringt Schwimmbekleidung, Schwimmbrille, Fahrrad, Helm, Laufschuhe und einen Altersnachweis des Kindes mit. Die Einwilligung unterschreibt ein Elternteil oder eine erziehungsberechtigte Person bei der Abholung der Startunterlagen im Wettkampfbüro.')],
}

export const packages: Record<EventId, Localized[]> = {
  triathlon: [t('W pakiecie otrzymasz numery startowe. Na zawodach działa elektroniczny pomiar czasu. Na trasie rowerowej i biegowej przewidziane są punkty odżywcze. Na mecie otrzymasz medal finiszera, a po starcie będzie dostępny posiłek regeneracyjny.', 'Das Startpaket enthält die Startnummern. Die Zeitmessung erfolgt elektronisch. Auf der Rad- und Laufstrecke gibt es Verpflegungsstellen. Im Ziel erhältst du eine Finisher-Medaille. Nach dem Wettkampf gibt es eine Mahlzeit zur Regeneration.')],
  'open-water': [t('Podczas zawodów działa elektroniczny pomiar czasu. Po zakończeniu wyścigu dla uczestników przewidziane są napoje i owoce. Zawodnicy, którzy ukończą wyścig, otrzymają pamiątkowy medal.', 'Die Zeitmessung erfolgt elektronisch. Nach dem Wettkampf stehen Getränke und Obst bereit. Wer das Rennen beendet, erhält eine Finisher-Medaille.')],
  bieg: [t('Przed startem otrzymasz numer startowy. Czas zostanie zmierzony elektronicznie, a po ukończeniu biegu otrzymasz medal. Na mecie przewidziane są napoje i owoce.', 'Deine Startnummer erhältst du vor dem Lauf. Die Zeitmessung erfolgt elektronisch. Im Ziel erhältst du eine Finisher-Medaille. Getränke und Obst stehen im Zielbereich bereit.')],
  dzieci: [t('Pakiet młodego zawodnika obejmuje numery startowe, czepek i posiłek regeneracyjny. Każdy zawodnik, który ukończy zawody, otrzyma medal.', 'Das Startpaket enthält die Startnummern, eine Badekappe und eine Mahlzeit zur Regeneration. Wer den Wettkampf beendet, erhält eine Medaille.')],
}

export interface RouteMap {
  id: string
  variant: 'sprint' | 'olimpijka' | '1000'
  name: Localized
  alt: Localized
  url: string
}
const map = (id: string, variant: RouteMap['variant'], pl: string, de: string, file: string): RouteMap => ({ id, variant, name: t(pl, de), alt: t(`Mapa trasy: ${pl}`, `Streckenkarte: ${de}`), url: `/assets/img/tresc/${file}` })
export const routeMaps: RouteMap[] = [
  map('sprint-swim', 'sprint', 'Sprint — pływanie 400 m', 'Sprint — Schwimmen 400 m', '6c089a64-4df8-4c46-a387-2aa8acfa7cde.jpg'),
  map('sprint-bike', 'sprint', 'Sprint — rower 18 km, jedna pętla', 'Sprint — Radfahren 18 km, eine Runde', '0ffddca5-9ab6-4cb3-85eb-4fe05994790f.jpg'),
  map('sprint-run', 'sprint', 'Sprint — bieg 4 km, dwie pętle po 2 km', 'Sprint — Laufen 4 km, zwei Runden à 2 km', '8e22c2c0-f823-4c67-935e-3af35d89d1f7.jpg'),
  map('olympic-swim', 'olimpijka', 'Olimpijka — pływanie 1500 m', 'Olympische Distanz — Schwimmen 1500 m', 'trasa-pływacka-Olimpijka.jpg'),
  map('olympic-bike', 'olimpijka', 'Olimpijka — rower 40 km, dwie pętle po 20 km', 'Olympische Distanz — Radfahren 40 km, zwei Runden à 20 km', 'trasa-rowerowa-Olimpijka.jpg'),
  map('olympic-run', 'olimpijka', 'Olimpijka — bieg 10 km, cztery pętle po 2,5 km', 'Olympische Distanz — Laufen 10 km, vier Runden à 2,5 km', 'trasa-biegowa-Olimpijka.jpg'),
  map('ow-1000', '1000', 'Open Water — jedna pętla 1000 m wyznaczona bojami', 'Open Water — eine mit Bojen markierte Runde über 1000 m', 'trasa-1km.jpg'),
]

export const routeLaps = {
  sprint: t('400 m w jeziorze Wądół · 18 km rowerem: jedna pętla · 4 km biegiem: dwie pętle po 2 km.', '400 m im Wądół-See · 18 km Radfahren: eine Runde · 4 km Laufen: zwei Runden à 2 km.'),
  olimpijka: t('1500 m w jeziorze Wądół · 40 km rowerem: dwie pętle po 20 km · 10 km biegiem: cztery pętle po 2,5 km.', '1500 m im Wądół-See · 40 km Radfahren: zwei Runden à 20 km · 10 km Laufen: vier Runden à 2,5 km.'),
}
export const relayVariants = [
  t('Sprint: 400 m pływania, 18 km na rowerze i 4 km biegu.', 'Sprint: 400 m Schwimmen, 18 km Radfahren und 4 km Laufen.'),
  t('Olimpijka: 1500 m pływania, 40 km na rowerze i 10 km biegu.', 'Olympische Distanz: 1500 m Schwimmen, 40 km Radfahren und 10 km Laufen.'),
]
export const relayTeam = t('Sztafeta liczy trzy osoby. Każdy zawodnik pokonuje jeden etap. Przy zgłoszeniu drużyny wskażcie, kto płynie, kto jedzie na rowerze i kto biegnie.', 'Ein Team besteht aus drei Personen. Jede Person übernimmt eine Disziplin. Gebt bei der Teamanmeldung an, wer schwimmt, wer Rad fährt und wer läuft.')
export const guardianRules = t('Do startu dziecka potrzebna jest pisemna zgoda rodzica lub opiekuna prawnego. Zgodę podpisuje się w biurze zawodów przy odbiorze pakietu. Zabierzcie legitymację szkolną lub inny dokument dziecka pozwalający potwierdzić jego wiek. Zasady towarzyszenia dziecku na poszczególnych etapach podamy w regulaminie zawodów.', 'Für den Start ist die schriftliche Einwilligung eines Elternteils oder einer erziehungsberechtigten Person erforderlich. Sie wird bei der Abholung der Startunterlagen im Wettkampfbüro unterschrieben. Bitte bringt einen Schülerausweis oder einen anderen Altersnachweis des Kindes mit. Die Regeln zur Begleitung auf der Strecke stehen in der Ausschreibung.')
const childrenCourse = { swim: '100 m', bike: '6 km', run: '1 km', time: null }
export const childrenCategories = [
  { name: t('Dzieci', 'Kinder'), age: '8–10', birthYears: '2017–2019', ...childrenCourse },
  { name: t('Żacy', 'Schüler'), age: '11–12', birthYears: '2015–2016', ...childrenCourse },
  { name: t('Młodzicy', 'Jugend B'), age: '13–14', birthYears: '2013–2014', ...childrenCourse },
  { name: t('Juniorzy', 'Jugendliche'), age: '15–17', birthYears: '2010–2012', ...childrenCourse },
]

export const officeInfo = [
  t('W sobotę 12 czerwca pakiety Open Water i Biegu nad Wądołem odbierzesz w biurze zawodów w rejonie MGOK przy ul. Okrzei 1. Odbiór dla Open Water 1000 m jest planowany w godz. 8:30–9:30, dla 3000 m w godz. 8:30–10:30, a dla biegu w godz. 10:30–12:45.', 'Am Samstag, 12. Juni, werden die Startunterlagen für Wądół Open Water und den Lauf am Wądół im Wettkampfbüro beim Kulturzentrum MGOK an der ul. Okrzei 1 ausgegeben: Open Water 1000 m von 8:30 bis 9:30 Uhr, Open Water 3000 m von 8:30 bis 10:30 Uhr und der Lauf am Wądół von 10:30 bis 12:45 Uhr.'),
  t('W niedzielę 13 czerwca biuro triathlonu działa w Hali Sportowej przy ul. Kopernika 9. Pakiety dzieci i młodzieży będą wydawane w godz. 7:00–8:30, a pakiety dorosłych i sztafet w godz. 7:00–9:30. Strefa zmian i start są w rejonie plaży miejskiej przy ul. Lipowej.', 'Am Sonntag, 13. Juni, ist das Triathlon-Wettkampfbüro in der Sporthalle an der ul. Kopernika 9. Startunterlagen für Kinder und Jugendliche werden von 7:00 bis 8:30 Uhr ausgegeben, für Erwachsene und Staffeln von 7:00 bis 9:30 Uhr. Wechselzone und Triathlonstarts liegen im Bereich des Stadtstrands an der ul. Lipowa.'),
]
export const arrivalInfo = t('Sobotnie zawody Open Water i Bieg nad Wądołem odbywają się w rejonie MGOK przy ul. Okrzei 1 w Lipianach. W niedzielę kieruj się na plażę miejską przy ul. Lipowej, jeśli chcesz zobaczyć start triathlonu. Biuro niedzielnych zawodów mieści się w Hali Sportowej przy ul. Kopernika 9. Plan parkingów i zmiany w organizacji ruchu opublikujemy przed weekendem.', 'Am Samstag finden Wądół Open Water und der Lauf am Wądół beim Kulturzentrum MGOK an der ul. Okrzei 1 statt. Am Sonntag könnt ihr die Triathlonstarts am Stadtstrand an der ul. Lipowa verfolgen. Das Wettkampfbüro am Sonntag befindet sich in der Sporthalle an der ul. Kopernika 9. Informationen zu Parkplätzen und Verkehrsänderungen veröffentlichen wir vor dem Sportwochenende.')
export const spectatorPoints = [t('W sobotę zawodnikom można kibicować w wyznaczonej strefie nad jeziorem przy MGOK oraz w rejonie startu i mety biegu. W niedzielę dobre miejsca do obserwowania triathlonu znajdziesz w strefie startu przy plaży miejskiej oraz przy wyznaczonych punktach na trasie biegowej i mecie. Dokładne lokalizacje i dojścia pokażemy na planie zawodów.', 'Am Samstag könnt ihr die Wettkämpfe von den ausgewiesenen Bereichen am See beim Kulturzentrum MGOK und am Start und Ziel des Laufs verfolgen. Am Sonntag gibt es Zuschauerbereiche am Start am Stadtstrand sowie an ausgewiesenen Punkten der Laufstrecke und im Zielbereich. Die genauen Standorte stehen im Veranstaltungsplan.')]
export const festivalInfo = t('Po sobotnich startach planujemy festyn dla mieszkańców, rodzin i kibiców. Szczegółowy program, miejsce i zasady udziału w aktywnościach podamy w programie weekendu.', 'Nach den Wettkämpfen am Samstag ist ein Fest für Einwohner, Familien und Zuschauer geplant. Weitere Informationen zum Programm, zum Veranstaltungsort und zur Teilnahme findet ihr im Wochenendprogramm.')

export interface RuleDocument {
  id: string
  event: EventId
  name: Localized
  source: string
  url: string | null
  startId: string
  distances: string
  proposedLimit: string | null
}
export const ruleDocuments: RuleDocument[] = [
  { id: 'sprint', event: 'triathlon', name: t('Sprint 4:18:4', 'Sprint 4:18:4'), source: 'https://triathlon-lipiany.pl/regulaminy/#yf55', url: null, startId: 'sprint', distances: '400 m / 18 km / 4 km', proposedLimit: '100 min' },
  { id: 'olimpijka', event: 'triathlon', name: t('Olimpijka', 'Olympische Distanz'), source: 'https://triathlon-lipiany.pl/regulaminy/#w7bb', url: null, startId: 'olimpijka', distances: '1500 m / 40 km / 10 km', proposedLimit: '255 min' },
  { id: 'sztafeta-sprint', event: 'triathlon', name: t('Sztafeta sprint', 'Sprintstaffel'), source: 'https://triathlon-lipiany.pl/regulaminy/#x63a', url: null, startId: 'sprint', distances: '400 m / 18 km / 4 km', proposedLimit: null },
  { id: 'sztafeta-olimpijska', event: 'triathlon', name: t('Sztafeta olimpijska', 'Olympische Staffel'), source: 'https://triathlon-lipiany.pl/regulaminy/#yd23', url: null, startId: 'olimpijka', distances: '1500 m / 40 km / 10 km', proposedLimit: '255 min' },
  { id: 'open-water', event: 'open-water', name: t('Wądół Open Water — 1000 m i 3000 m', 'Wądół Open Water — 1000 m und 3000 m'), source: 'https://triathlon-lipiany.pl/wp-content/uploads/2026/03/Wadol-Open-Water2.pdf', url: null, startId: '1000', distances: '1000 m / 3000 m', proposedLimit: '40 min / 90 min' },
  { id: 'bieg', event: 'bieg', name: t('Bieg nad Wądołem', 'Lauf am Wądół'), source: 'https://triathlon-lipiany.pl/wp-content/uploads/2026/06/Regulamin-Bieg-nad-Wadolem-2026.pdf', url: null, startId: 'bieg', distances: runningDistance, proposedLimit: '75 min' },
  { id: 'dzieci', event: 'dzieci', name: t('Triathlon dzieci i młodzieży', 'Kinder- und Jugendtriathlon'), source: 'https://triathlon-lipiany.pl/wp-content/uploads/2025/11/REGULAMIN-Tri-dzieci-i-Modziez-2026.pdf', url: null, startId: 'dzieci', distances: `${childrenCourse.swim} / ${childrenCourse.bike} / ${childrenCourse.run}`, proposedLimit: null },
]

export const archivalVideo = '/assets/bieg-nad-wadolem-archiwum.mp4'
export const archivedSitePlan = '/assets/img/tresc/plan-sytuacyjny.jpg'
