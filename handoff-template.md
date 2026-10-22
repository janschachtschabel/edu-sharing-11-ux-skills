# Handoff: [Feature/Screen] · v[1.0] · [Figma-Link] · [Ticket]

> Gilt für dieses Feature und geht der DESIGN.md vor, wo es ausdrücklich abweicht. Abweichungen sind mit **[Abweichung]** markiert und begründet.
> Ablage: `handoffs/<feature>.md` im Frontend-Repo.

## Ziel und Nutzerkontext
- Persona: [Lehrende | Lernende | Redaktion | Administration]
- Aufgabe: [1 Satz]
- Einstieg: [Route / Menüpunkt / Option in der Actionbar]
- Erfolgskriterium: [prüfbar, z. B. „Material in ≤ 2 Klicks auf der Merkliste“]

## Komponenten
| Bereich | Baustein (edu-sharing/Angular) | Variante / Inputs |
|---|---|---|
| Liste | `es-node-entries-wrapper` | `displayType: Grid`, `paginationStrategy: 'infinite-scroll'`, `#empty` |
| Aktionen | `es-actionbar` | `OptionItem`s: […] |
| Dialog | `DialogsService.openGenericDialog` | `buttons: SAVE_OR_CANCEL`, `maxWidth: 600` |
| Neu (nur mit Begründung) | [Name] | [Warum reicht kein vorhandener Baustein?] |

## Design-Tokens
Nur Token-Namen, keine Hex-Werte. Neue Tokens mit Light- **und** Dark-Wert.
- Flächen: [`--roundedContainerBackground`, `--primaryBackground50`]
- Text: [`--textMain`, `--textLight`]
- Status: [`--colorStatusPositiveText`]
- Neu: [`--tokenName`: hell `color-mix(…)`, dunkel `color-mix(…)`]

## Layout und Breakpoints
| | Desktop (> 900px) | Mobil (≤ 900px = `$mobileTabSwitchWidth`) |
|---|---|---|
| Rahmen | `roundedContainerCard` + `roundedContainerStaticScroll` | randlos, Abstand `$mobileTabNavHeight` |
| Spalten | […] | […] |
| Sidebar/Filter | `mat-sidenav` | `mobileModalOverlay` |
| Menüs | `es-dropdown` | Bottom Sheet |

Abstände: [Werte aus der `spacing`-Skala der DESIGN.md: 5/10/15/20/25/30/40px]

## Zustände
| Zustand | Darstellung |
|---|---|
| default | […] |
| hover / focus (Tastatur) / active | Fokus über `setGlobalKeyboardFocus()` |
| disabled | [Grund + Tooltip-Text-Schlüssel] |
| loading | `es-spinner` / `es-spinner-small` / `patchState({ isLoading })` |
| leer | Text-Schlüssel […] + nächster Schritt |
| Fehler | `toast.error(err)` (API) bzw. `toast.error(null, 'TOAST.<FEATURE>_…')`; Schlüssel immer unter `…TOAST.` |
| keine Berechtigung | [ausgeblendet / deaktiviert + Erklärung] |

## Interaktion und Animation
- Auslöser → Ergebnis: […]
- Dauer: `var(--transitionNormal)` (0.2s); bei `prefers-reduced-motion` aus
- Tastatur: Tab-Reihenfolge […], Enter/Space […], Esc […]

## Texte
Final, als Schlüssel (`de` Sie-Form, `en`; ggf. `de-informal`).
| Schlüssel | de | en |
|---|---|---|
| `FEATURE.TITLE` | […] | […] |

## Barrierefreiheit
- Überschriften-Hierarchie: […]
- Namen für Icon-only-Buttons: […]
- Kontrast neuer Kombinationen (Light/Dark): […] : 1
- Sprungziel/Fokus nach Dialog: […]

## Randfälle
- Langer Titel (> 2 Zeilen): `limitLineCount(2)` + Tooltip
- Fehlendes Vorschaubild: […]
- 0 / 1 / 1000 Elemente: […]
- Eingebettet (`/embed`), Dark Mode, Branding-Theme `red`: […]

## Abnahme-Checkliste
- [ ] Alle Bausteine wie in „Komponenten“ verwendet
- [ ] `lint-design-rules.mjs`: 0 FEHLER
- [ ] Alle Zustände der Tabelle umgesetzt
- [ ] Light/Dark und Mobil 375px geprüft
- [ ] Texte in `de.json` und `en.json`
- [ ] A11y-Audit ohne Befunde „Kritisch“ oder „Hoch“
- [ ] Storybook-Story vorhanden
