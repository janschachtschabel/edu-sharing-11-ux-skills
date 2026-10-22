# Handoff: Zuletzt angesehen (Sammlungsbereich) · v0.1 · Figma: – · Ticket: BEISPIEL

> **Beispiel-Handoff**, erzeugt mit dem Skill `edu-sharing-ux-write-handoff`, um den Ablauf zu testen. Es ist keine echte Anforderung.

## Ziel und Nutzerkontext
- Persona: Lehrende
- Aufgabe: Ein Material wiederfinden, das in den letzten Tagen angesehen wurde.
- Einstieg: neuer Tab „Zuletzt angesehen“ auf der Sammlungsseite
- Erfolgskriterium: Das gesuchte Material ist mit 1 Klick vom Tab aus geöffnet.

## Komponenten
| Bereich | Baustein | Variante / Inputs |
|---|---|---|
| Liste | `es-node-entries-wrapper` | `displayType: SmallGrid` (keine Umschaltung; die Standard-Umschaltung kennt nur Grid ↔ Table), `paginationStrategy: 'infinite-scroll'`, `scope`: [Annahme] `Scope.DashboardSwimlane` wie in der vorhandenen Ansicht mit `recentActivity` (`dashboard-swimlane.component.html:94`), mit Team 6 bestätigen, `checkbox: false` |
| Aktionen je Kachel | Standard-Optionen über `OptionsHelperService` | keine neuen Optionen |
| Leerzustand | `<ng-template #empty>` | Icon `history` + Text |
| Tab | `mat-tab-group` der Sammlungsseite | neuer `mat-tab` |

## Design-Tokens
- Keine neuen Tokens.
- Leerzustand: Text `--noResultsColor`, Icon `--textLight`.

## Layout und Breakpoints
| | Desktop (> 900px) | Mobil (≤ 900px) |
|---|---|---|
| Rahmen | vorhandene `.main-content` der Sammlungsseite | unverändert (bereits mit `$mobileTabNavHeight`) |
| Liste | SmallGrid, Kachelbreite nach Komponente | SmallGrid einspaltig |

## Zustände
| Zustand | Darstellung |
|---|---|
| loading | `es-spinner` der Liste (eingebaut) |
| leer | `COLLECTIONS.RECENT.EMPTY` + `COLLECTIONS.RECENT.EMPTY_HINT` |
| Fehler | `toast.error(err)` (`COMMON_API_ERROR`); Abschnitt bleibt bedienbar |
| keine Berechtigung | Materialien ohne Leserecht werden nicht gelistet |
| Gast (nicht angemeldet) | Tab ausgeblendet |

## Interaktion
- Klick auf Kachel öffnet das Material: `(clickItem)="nodeHelper.navigateToNode($event)"` mit dem ganzen `$event`.
- Tastatur: Tab erreicht den Tab-Reiter und danach die Kacheln; Enter öffnet.

## Texte
| Schlüssel | de | en |
|---|---|---|
| `COLLECTIONS.RECENT.TAB` | Zuletzt angesehen | Recently viewed |
| `COLLECTIONS.RECENT.EMPTY` | Keine zuletzt angesehenen Materialien | No recently viewed materials |
| `COLLECTIONS.RECENT.EMPTY_HINT` | Materialien, die Sie öffnen, erscheinen hier. | Materials you open will appear here. |

`de-informal`: `EMPTY_HINT` = „Materialien, die Du öffnest, erscheinen hier.“

## Barrierefreiheit
- Der Tab-Name ist der sichtbare Text, kein zusätzliches Label nötig.
- Das Icon im Leerzustand ist dekorativ (`esIcon` ohne `[aria]`).
- Kontrast `--noResultsColor` (rgba 0,0,0,.54) auf weiß: im Browser messen. Unter 4,5:1 → `--textLight`.

## Randfälle
- Langer Titel: von SmallGrid gekürzt (eingebaut)
- 0 Elemente: Leerzustand; 1 Element: eine Kachel; > 100: Infinite Scroll
- Eingebettet: Tab nicht vorhanden (Sammlungsseite wird nicht eingebettet)

## Offene Fragen an Team 5
1. Woher kommen die Daten? Vorhanden ist `SearchService` mit `searchMode: 'recentActivity'` (`projects/edu-sharing-api/src/lib/wrappers/search.service.ts:175`, genutzt in `dashboard-swimlane`). Reicht das, oder braucht es einen echten Ansichts-Verlauf?
2. Wie viele Tage oder Einträge werden höchstens angezeigt?

## Abnahme-Checkliste
- [ ] `es-node-entries-wrapper` mit SmallGrid und `#empty`
- [ ] `lint-design-rules.mjs`: 0 FEHLER
- [ ] Texte in `collections/de.json`, `en.json`, `de-informal.json`
- [ ] Light/Dark, 375px geprüft
- [ ] Gäste sehen den Tab nicht
- [ ] A11y-Audit (`edu-sharing-ux-audit-accessibility`) ohne Befunde „Kritisch“ oder „Hoch“
- [ ] Storybook-Story vorhanden
