export type Locale = 'pl' | 'de'
export type Localized = Record<Locale, string>
export type EventKey = 'triathlon' | 'open-water' | 'bieg'

export const labels = {
  pl: {
    home: 'Start', events: 'Zawody', information: 'Informacje', results: 'Wyniki', contact: 'Kontakt',
    signup: 'Zapisz się', registration: 'Zapisy', registrationAt: 'Zapisy prowadzi Foxter Sport',
    menu: 'Otwórz menu', close: 'Zamknij', search: 'Szukaj', skip: 'Przejdź do treści',
    sections: 'Na tej stronie', more: 'O zawodach', route: 'Trasa', date: 'Termin', distance: 'Dystanse',
    title: 'Sportowy weekend', titleEnd: 'w Lipianach',
    lead: 'Triathlon, pływanie i bieg nad jeziorem Wądół.',
    weekend: '12–13 czerwca 2027', location: 'Lipiany · jezioro Wądół',
    prepare: 'Dla zawodnika', program: 'Harmonogram', access: 'Dojazd', rules: 'Regulaminy',
    partners: 'Partnerzy', history: 'Historia', news: 'Aktualności', organizer: 'Stowarzyszenie Epidemia Sportu',
    footer: 'Triathlon, pływanie i bieg. Jeden sportowy weekend nad jeziorem Wądół.',
    copyright: 'Wszelkie prawa zastrzeżone.', language: 'Wybór języka',
    searchHint: 'Wpisz nazwę zawodów, dystans lub temat.', searchPlaceholder: 'Np. trasa, regulamin, noclegi…',
    noResults: 'Nie znaleziono pasujących stron.', searchStart: 'Szukaj w informacjach o zawodach, trasach i zapisach.',
    loading: 'Wczytywanie…', imagePreview: 'Podgląd zdjęcia', notFound: 'Nie znaleziono strony',
    notFoundText: 'Sprawdź adres lub wróć do strony głównej.', backHome: 'Wróć na stronę główną',
    name: 'Imię', email: 'Adres e-mail', subject: 'Temat', message: 'Wiadomość', send: 'Wyślij wiadomość',
    sending: 'Wysyłanie…', sent: 'Dziękujemy. Wiadomość została wysłana.',
    consent: 'Zgadzam się na przetwarzanie moich danych w celu odpowiedzi na tę wiadomość.',
    mailFallback: 'Możesz wysłać tę wiadomość przez swój program pocztowy.', openMail: 'Otwórz wiadomość w poczcie',
    contactLead: 'Masz pytanie o zawody? Skontaktuj się z organizatorem.',
  },
  de: {
    home: 'Start', events: 'Wettkämpfe', information: 'Informationen', results: 'Ergebnisse', contact: 'Kontakt',
    signup: 'Anmelden', registration: 'Anmeldung', registrationAt: 'Anmeldung über Foxter Sport',
    menu: 'Menü öffnen', close: 'Schließen', search: 'Suche', skip: 'Zum Inhalt springen',
    sections: 'Auf dieser Seite', more: 'Über den Wettkampf', route: 'Strecke', date: 'Termin', distance: 'Distanzen',
    title: 'Sportwochenende', titleEnd: 'in Lipiany',
    lead: 'Triathlon, Schwimmen und Laufen am Wądół-See.',
    weekend: '12.–13. Juni 2027', location: 'Lipiany · Wądół-See',
    prepare: 'Für Teilnehmer', program: 'Zeitplan', access: 'Anreise', rules: 'Vorschriften',
    partners: 'Partner', history: 'Geschichte', news: 'Aktuelles', organizer: 'Verein Epidemia Sportu',
    footer: 'Triathlon, Schwimmen und Laufen. Ein Sportwochenende am Wądół-See.',
    copyright: 'Alle Rechte vorbehalten.', language: 'Sprachauswahl',
    searchHint: 'Suche nach Wettkämpfen, Distanzen oder Informationen.', searchPlaceholder: 'Z. B. Strecke, Reglement, Unterkunft…',
    noResults: 'Keine passenden Seiten gefunden.', searchStart: 'Suche nach Informationen zu Wettkämpfen, Strecken und Anmeldung.',
    loading: 'Wird geladen…', imagePreview: 'Bildvorschau', notFound: 'Seite nicht gefunden',
    notFoundText: 'Prüfe die Adresse oder gehe zur Startseite.', backHome: 'Zur Startseite',
    name: 'Name', email: 'E-Mail-Adresse', subject: 'Betreff', message: 'Nachricht', send: 'Nachricht senden',
    sending: 'Wird gesendet…', sent: 'Vielen Dank. Die Nachricht wurde gesendet.',
    consent: 'Ich stimme der Verarbeitung meiner Daten zur Beantwortung dieser Nachricht zu.',
    mailFallback: 'Du kannst diese Nachricht über dein E-Mail-Programm senden.', openMail: 'Nachricht im E-Mail-Programm öffnen',
    contactLead: 'Fragen zum Wettkampf? Kontaktiere den Veranstalter.',
  },
}

export const information: { slug: string; name: Localized }[] = [
  { slug: 'triathlon-dzieci', name: { pl: 'Triathlon dzieci i młodzików', de: 'Triathlon für Kinder und Jugendliche' } },
  { slug: 'regulaminy', name: { pl: 'Regulaminy', de: 'Vorschriften' } },
  { slug: 'dojazd', name: { pl: 'Dojazd', de: 'Anreise' } },
  { slug: 'noclegi', name: { pl: 'Noclegi', de: 'Übernachtung' } },
  { slug: 'utrudnienia-w-ruchu', name: { pl: 'Utrudnienia w ruchu', de: 'Verkehrsbehinderungen' } },
  { slug: 'dane-konta', name: { pl: 'Dane konta', de: 'Bankverbindung' } },
  { slug: 'partnerzy', name: { pl: 'Partnerzy', de: 'Partner' } },
]

export const history = [
  { slug: 'historia-polskiego-triathlonu', name: { pl: 'Historia polskiego triathlonu', de: 'Geschichte des polnischen Triathlons' } },
  { slug: 'historia-lipiany-pyrzyce', name: { pl: 'Historia triathlonu Lipiany–Pyrzyce', de: 'Triathlon Lipiany–Pyrzyce' } },
  { slug: 'legendy-polskiego-triathlonu', name: { pl: 'Legendy polskiego triathlonu', de: 'Legenden des polnischen Triathlons' } },
]

export const contact = { email: 'info@triathlon-lipiany.pl', phone: '+48 607 602 807', facebook: 'https://www.facebook.com/triathlonlipiany' }

interface Partner {
  name: string
  group: 'partners' | 'sponsors' | 'media'
  image: string
  website: string
}

export const partnerGroups: { key: Partner['group']; title: Localized }[] = [
  { key: 'partners', title: { pl: 'Partnerzy', de: 'Partner' } },
  { key: 'sponsors', title: { pl: 'Sponsorzy', de: 'Sponsoren' } },
  { key: 'media', title: { pl: 'Patron medialny', de: 'Medienpartner' } },
]

// Ten sam zestaw firm i instytucji co na oryginalnej planszy. Logotypy są
// osobnymi plikami z oficjalnych stron albo oryginalnych materiałów zawodów.
export const partners: Partner[] = [
  { name: 'BPI', group: 'sponsors', image: '/assets/img/partner-bpi.jpg', website: 'https://bpi.dk/' },
  { name: 'CHEFS CULINAR', group: 'sponsors', image: '/assets/img/partner-chefs-culinar.svg', website: 'https://www.chefsculinar.pl/' },
  { name: 'Tricarbon', group: 'sponsors', image: '/assets/img/partner-tricarbon.jpg', website: 'https://tricarbon.pl/' },
  { name: 'Bar RAB', group: 'sponsors', image: '/assets/img/partner-bar-rab.jpg', website: 'https://pstryku.pl/restauracje/bar-rab' },
  { name: 'Fanex', group: 'sponsors', image: '/assets/img/partner-fanex.svg', website: 'https://fanex.pl/' },
  { name: 'CJS Tłumaczenia', group: 'sponsors', image: '/assets/img/partner-cjs-tlumaczenia.png', website: 'https://cjstlumaczenia.com/' },
  { name: 'Gmina Lipiany', group: 'partners', image: '/assets/img/partner-lipiany.svg', website: 'https://lipiany.pl/' },
  { name: 'Pomorze Zachodnie', group: 'partners', image: '/assets/img/partner-pomorze-zachodnie.jpg', website: 'https://wzp.pl/' },
  { name: 'Powiat Pyrzycki', group: 'partners', image: '/assets/img/partner-powiat-pyrzycki.jpg', website: 'https://www.pyrzyce.pl/' },
  { name: 'Barlinek24.pl', group: 'media', image: '/assets/img/partner-barlinek24.jpg', website: 'https://barlinek24.pl/' },
]

export function path(lang: Locale, slug = '') { return `/${lang === 'de' ? 'de/' : ''}${slug ? `${slug.replace(/^\/+|\/+$/g, '')}/` : ''}` }
export const searchSlug = (lang: Locale) => lang === 'de' ? 'suche' : 'szukaj'

export interface ContentSection { id: string; title: string; html: string }
export interface ContentPage { title: string; html: string }
export interface SiteContent {
  pages: Record<string, Record<Locale, ContentPage>>
  events: Record<EventKey, Record<Locale, { sections: ContentSection[]; social: string }>>
  search: Record<Locale, { t: string; u: string; x: string }[]>
  redirects: Record<string, string>
}
let contentPromise: Promise<SiteContent> | undefined
export function loadContent() {
  contentPromise ??= import('./content.json').then(module => module.default as SiteContent)
  return contentPromise
}
