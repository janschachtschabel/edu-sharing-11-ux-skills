---
name: edu-sharing-ux-audit-accessibility
description: Prüft Angular-Komponenten, Screens und Merge Requests im edu-sharing-Frontend auf Barrierefreiheit nach WCAG 2.1 AA (Kontrast in Light/Dark Mode, Tastatur, Fokus, Screenreader, esIcon-Labels, Zielgrößen, Kontrastmodus) und liefert Befunde als Datei:Zeile mit konkretem Fix. Verwenden bei barrierefrei, Barrierefreiheit, A11y, Accessibility, WCAG, BITV, Kontrast, Tastatur, Tastaturbedienung, Fokus, Screenreader, aria, alt-Text, Lighthouse/axe-Befund oder "vor dem Merge Request prüfen" im edu-sharing- oder WirLernenOnline-Kontext.
metadata:
  owner: team-5-ui-ux
  version: 0.6.0
---
# edu-sharing-Barrierefreiheit prüfen

## Zweck
Ein Audit findet A11y-Fehler, bevor sie gemergt werden. Jeder Befund nennt Datei und Zeile, die verletzte WCAG-Regel, die Schwere und einen Fix mit edu-sharing-Mitteln (Token, Mixin, Direktive).

Dieser Skill **ändert keinen Code**, außer die Nutzenden verlangen es ausdrücklich.

## Ablauf
1. **Umfang klären.** Geprüft werden die geänderten Dateien des MR (`git diff --name-only`) bzw. die genannte Komponente samt Template, SCSS und TS.
2. **Automatisch prüfen.**
   - Statische Prüfung:
     ```bash
     node ../edu-sharing-ux-build-components/scripts/lint-design-rules.mjs <dateien>
     ```
     A11y-relevant sind die Regeln `img-without-alt`, `focus-removed`, `no-color-literal` und `no-mat-icon`.
   - Kontraste mit `scripts/contrast.mjs <vorder> <hinter> --vars projects/edu-sharing-ui/assets/scss/variables.scss`, für beide Modi (zweiter Lauf mit `--dark`).
   - Gibt es eine Story: Storybook öffnen (`npm run storybook`), Panel „Accessibility“ (axe) in Light und Dark ansehen.
   - Gibt es eine laufende Instanz (lokal oder Staging): Branding-Farben und Klickflächen messen, wie in [references/checklist.md](references/checklist.md) Abschnitt 7 beschrieben. Das geht nur lesend.
3. **Manuell prüfen.** Die Checkliste in [references/checklist.md](references/checklist.md) Punkt für Punkt durchgehen. Dabei das Template lesen, nicht nur das SCSS.
4. **Bewerten.** Schwere nach der Tabelle unten. Gleichartige Befunde zusammenfassen und alle Fundstellen nennen.
5. **Ausgeben.** Format siehe unten. Am Ende steht eine Liste dessen, was nur im Browser prüfbar war und noch offen ist.

## Verbindlich
- Maßstab ist **WCAG 2.1 AA**, dazu die Zielgröße aus **WCAG 2.2 AA (2.5.8, ≥ 24 × 24px)** wie in DESIGN.md Regel 11:
  - Text-Kontrast ≥ 4,5:1, große Schrift (≥ 18pt bzw. 14pt fett) ≥ 3:1
  - Nicht-Text (Icons, Ränder, Fokusrahmen, Zustände von Bedienelementen) ≥ 3:1
- Kontrast wird **in Light und Dark Mode** geprüft. Zusätzlich gilt: Eine Fläche mit `--primary` muss mit beliebigem Branding funktionieren, deshalb dient `--light-primary-text` als Textfarbe.
- Bekannte Werte (berechnet):

  | Kombination | Kontrast | Ergebnis |
  |---|---|---|
  | `--textMediumLight` auf `--backgroundColor` | 4,09 | ✗ |
  | `--textVeryLight` auf weiß | 2,32 | ✗ |
  | weiß auf `--colorStatusPositive` | 2,32 | ✗ |
  | weiß auf `--colorStatusWarning` | 2,55 | ✗ |
  | `--textLight` auf `#f3f3f3` | 6,41 | ✓ |
  | `--primary` (Default) auf weiß | 5,27 | ✓ |
  | WLO `--primary` `#003b7c` auf weiß / weiß darauf | 10,96 | ✓ |
  | WLO `--accent` `#e4f700` auf weiß | 1,19 | ✗ (nur als Fläche mit dunkler Schrift) |
  | `--focusColor` dunkel (WLO, ≈ `#606f8f`) auf `#262626` | 3,00 | Grenzwert für 1.4.11 |
  | `--focusColor` hell **Default** (`#7f9bb0`) auf weiß / `#fafafa` (Kachel) | 2,91 / 2,79 | ✗ 1.4.11; Befund an Team 6 |
  | `--focusColor` hell WLO (`#4d76a3`) auf weiß | 4,73 | ✓ |
  | `--placeholderColor` auf Suchfeld `#eee` | 3,91 | ✗ für Text (Platzhalter) |

- Kontrast wird zusätzlich mit den bekannten Branding-Farben gerechnet, mindestens WLO (primary `#003b7c`, accent `#e4f700`).
- Fix-Mittel nur aus dem Designsystem:
  - Text-Tokens tauschen
  - `setGlobalKeyboardFocus()` / `setGlobalInsetFocus()`
  - `esIcon` mit `[aria]="true"` oder `[altText]`
  - `[attr.aria-label]="'KEY' | translate"`
  - `es-spinner` (hat `aria-live`)
  - Löschbestätigung für Knoten: `DialogsService.openDeleteNodesDialog({ nodes })`, nicht `openGenericDialog` mit `DELETE_OR_CANCEL`
  - `contrastMode()` für Zusatzkontrast
- Texte für Labels kommen aus i18n-Schlüsseln, nie hart eingetragen.

## Schwere

| Stufe | Bedeutung | Beispiele |
|---|---|---|
| **Kritisch** | Funktion für eine Gruppe nicht nutzbar | nicht per Tastatur erreichbar; Icon-only-Button ohne Name; Fokusfalle; Dialog ohne Fokus-Rückgabe |
| **Hoch** | AA verletzt, mit Umweg nutzbar | Textkontrast < 4,5:1; Fokus unsichtbar; Fehler nur über Farbe erkennbar |
| **Mittel** | AA-Grenzfall oder nur im Dark Mode bzw. mit Branding | Kontrast nur im Dark Mode zu niedrig; Ziel < 24 × 24 px |
| **Niedrig** | Best Practice | Überschriften-Hierarchie springt; `ICON_LABELS`-Schlüssel fehlt bei dekorativem Icon |

## Ausgabeformat
```
## A11y-Audit: <Komponente/MR>
Geprüft: <Dateien> · Modi: Light, Dark · Werkzeuge: lint, contrast.mjs, [Storybook axe]

| # | Schwere | Datei:Zeile | WCAG | Befund | Fix |
|---|---|---|---|---|---|
| 1 | Hoch | src/app/…/x.component.scss:42 | 1.4.3 | `--textMediumLight` auf `--backgroundColor` = 4,09:1 | `color: var(--textLight)` (6,41:1) |

Nur im Browser prüfbar / offen:
- …
```

## Spielraum
- Zielgröße: Maßstab ist 24 × 24 px (WCAG 2.2 AA, 2.5.8). Kleiner als die Material-Ist-Größen (Icon-Button 40px, Button 36px) als „Mittel“ melden; < 24px als „Hoch“. 44px (AAA) nur als Hinweis.
- Code aus der Zeit vor dem MR nur melden, wenn der MR ihn anfasst. Sonst unter „Altlasten (außerhalb des MR)“ sammeln.

## Nie
- Fixes mit Hex-Farben oder `outline: none` vorschlagen.
- `aria-label` auf Elemente setzen, die schon sichtbaren Text haben (doppelte Ansage).
- `role="button"` auf `div` empfehlen, wenn ein `<button>` möglich ist.
- Kontrast nur im Light Mode bewerten.
- Pauschal „sieht barrierefrei aus“ ohne Belege.

## Verweise
- Prüfpunkte mit edu-sharing-Bezug: [references/checklist.md](references/checklist.md)
- Kontrast-Rechner: `scripts/contrast.mjs`

## Abschluss-Checkliste
- [ ] Alle geänderten Templates und SCSS-Dateien gelesen
- [ ] Lint gelaufen, Ergebnis eingearbeitet
- [ ] Kontrast jeder neuen Text- und Flächenkombination in Light und Dark angegeben
- [ ] Tastaturweg beschrieben: Tab-Reihenfolge, Enter/Space, Esc in Dialogen und Menüs
- [ ] Jeder Befund hat Datei:Zeile, WCAG-Nummer und einen Fix mit Token, Mixin oder Direktive
- [ ] Offene Browser-Prüfungen aufgelistet
