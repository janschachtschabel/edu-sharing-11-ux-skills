# Aussehen der wiederverwendeten Bausteine

Quelle: SCSS und Templates in `projects/edu-sharing-ui/src/lib` und `src/app` (Stand `maven/fixes/11.0`). Die Werte sind Ist-Werte.

Die Defaults von Angular Material (Höhe, Radius und Innenabstand der Buttons, Farbe des Tab-Indikators) liegen in `node_modules` und **nicht** im Repo. Sie gelten unverändert, weil der Code keine Form-Overrides für Buttons setzt.

## Inhalt
1. Schrift und Überschriften
2. Icons
3. Buttons und Actionbar
4. Sortierung und Ansicht
5. Suchfeld und aktive Filter
6. Dialog (`CardDialog`)
7. Hinweise, Toast, Laden
8. Avatar
9. Badges und Chips
10. Tabs, Brotkrumen, Edge-Toggle
11. Sammlungsfarben

## 1. Schrift und Überschriften

- **Eine Familie: `open_sansregular`.** Es gibt zwei `@font-face`-Einträge (normal, kursiv) aus einer **variablen** TTF-Datei, beide als `font-weight: normal` deklariert. Einen eigenen Semibold- oder Bold-Schnitt gibt es nicht. Ob 600 und fett aus der variablen Achse kommen oder synthetisch erzeugt werden, ist nur im Browser prüfbar.
- Basis 10pt auf `html`/`body`, Fallback `Arial, Sans-Serif`. Komponenten setzen keine eigene Schrift.
- Material-Stufen:

  | Stufe | Größe / Gewicht |
  |---|---|
  | body | 100 % / 400 |
  | subtitle-2 | 90 % / 600 |
  | button | 100 % / 400 |
  | headline-1 | 150 % |
  | headline-2 | 140 % |

- Überschrift-Klassen, alle in `--textLight`:

  | Klasse | Größe | Gewicht |
  |---|---|---|
  | `.mat-heading-1` | 220 % | normal |
  | `.mat-heading-2` | 180 % | normal |
  | `.mat-heading-3` | 150 % | normal |
  | `.mat-heading-4` | 120 % | fett |
  | `.mat-heading-5` | 100 % | fett |
  | `.mat-heading-6` | 90 % | fett |

  Dazu `.mat-heading-underline` (1px `--textVeryLight`).
- Dialogtitel: 130 %, normales Gewicht. Filter-Kopf „Filter“: 140 %, 400.

## 2. Icons

- `.material-icons` 24px (Font: Material Symbols Outlined), `.edu-icons` 22px. `i.mat-icon` folgt der Schriftgröße (1em × 1em).
- In Buttons gilt der Default von 24px; eine globale Regel gibt es nicht.
- Übliche Größen in Komponenten:

  | Stelle | Größe |
  |---|---|
  | Stats-Badges | 12px |
  | Sammlungs-Info | 12pt |
  | Badge-Icons in Kacheln | 18px |
  | Schließen in `es-info-message` | 18px |
  | Edge-Toggle | 26px |
  | „Neu“-Kacheln | 32px |
  | Tabellen-Icon (`--tableIconSize`) | 38px |

## 3. Buttons und Actionbar

- **Material-Buttons**:
  - Form, Höhe und Innenabstand sind Material-Default; gemessen auf WLO: Icon-Button 40px, Textbutton 36px hoch.
  - Code-Overrides:
    - Outline von `mat-stroked-button` in `--primary` bzw. `--warn`
    - Label als flex mit `gap: 10px`
    - `warn` in `--palette-warn-500` mit weißer Schrift
    - `mat-raised-button` mit weißem Container und Schrift `--primary`
    - `.mat-cancel` in `--textMediumLight`, Hover `--primary`
    - Tastaturfokus über `setGlobalKeyboardFocus()`
  - `--borderRadiusButtons` (18px) gilt nur für wenige eigene Buttons, nicht für Material-Buttons.
- **`es-actionbar`** (flex, `gap: 10px`):
  - Immer sichtbare Optionen sind `mat-stroked-button color="primary"`; mit `highlight` werden sie zu `mat-flat-button`.
  - „Mehr“ ist ein `mat-button` mit `more_vert`.
  - Toggles (z. B. Ansicht) sind `mat-icon-button` in `--textLight`, getrennt durch eine 1px-Linie.

  | Input | Aussehen |
  |---|---|
  | `appearance="button"` (Default) | Icon und Text; Text unter 1100px ausgeblendet |
  | `appearance="icon-button"` | nur Icons |
  | `appearance="round"` | 45 × 45px, rund, `materialShadow()`, Icon 24px; mit `style="flat"`: Fläche `--backgroundColor`, Icon `--primary` |
  | `backgroundType="primary"` | auf Primärfläche: Text `--light-primary-text`, Flat-Button invertiert (Fläche `--backgroundColor`, Text primary) |
  | `backgroundType="dark"` | wirkt vermutlich nicht (Selektor aus der Zeit vor MDC) |

- **Dialog-Buttons**:
  - Leiste mit `padding: 17px 20px` und Trennlinie oben; links und rechts je eine Gruppe mit `gap: 10px`.
  - Buttons mit `padding: 0 2rem` und Gewicht 600.
  - Unter 400px Breite sind alle Buttons gleich breit.

## 4. Sortierung und Ansicht

- **Sortier-Button**:
  - `mat-button color="primary"` mit dem Spaltennamen und `arrow_upward`/`arrow_downward`.
  - Die Label-Farbe ist `--primaryForeground800` (Default `#305371`, 8,1:1 auf Weiß). Der Code begründet das mit zu hellem primary auf grauem Grund; die Kopfzeile liegt aber auf der weißen Ergebniskarte, die dunklere Stufe hält den Kontrast auch bei hellen Branding-Farben.
- **Sortiermenü** (`es-sort-dropdown`):
  - 240px breit.
  - Kopf „Sortieren nach“ (80 %, fett, `--textLight`).
  - Einträge in `--primary`; der aktive ist fett und hat einen 5px-Balken links.
  - Für Screenreader steht „ausgewählt“ visuell versteckt dabei.
- **Ansicht umschalten**: ein **einzelner** Toggle-`mat-icon-button` in der Actionbar (`list` ↔ `view_module`), keine Toggle-Gruppe.
- **Spaltenwähler** (Tabelle):
  - `mat-icon-button` `settings` mit `aria-haspopup="dialog"`.
  - Panel mit Radius 4px, `--backgroundColor`, Checkboxen und Ziehgriffen; Esc schließt.
- **`es-node-entries-global-options`** ist **kein** Ansichtsumschalter, sondern eine gestrichelte „Neu“-Kachel im Raster:
  - Rahmen `3px dashed var(--primary)`, Icon 32px, Label fett.
  - Deaktiviert gestrichelt in `--buttonDisabled`.

## 5. Suchfeld und aktive Filter

- **Suchfeld** (siehe `page-layouts.md` §1):
  - Rechteck mit Radius 3px, 40px hoch, `--workspaceTopBarInputBackground`, Schatten `0 3px 3px rgba(0,0,0,.05)`.
  - Fokus: mit der Maus ein Ring `--topBarSearchFocusColor`, mit der Tastatur Outline 2px `--focusColor`.
  - a11y: `role="search"`; der Filter-Button hat `aria-expanded` und `aria-controls`.
- **Aktive Filter** erscheinen als `mat-chip-option` mit Entfernen-Icon `cancel` im **Vorschlags-Panel unter dem Suchfeld**:
  - Panel: Radius 2px, `--backgroundColor`, `padding: 10px`, Überschriften 90 % in `--textLight`.
  - Chip-Fläche je Metadatenfeld über `--chip-color-<feld>`, z. B. Schlagwort, Bildungsstufe, Ressourcentyp, Fach; dunkel mit 62 % Schwarz gemischt.
  - Die Filter-Seitenleiste selbst zeigt keine Chips.

## 6. Dialog (`CardDialog`)

- Container: Radius 4px, Fläche `--backgroundColor`, Schatten `mat-elevation-z24`. Höchstens 95 % von Breite und Höhe, zentriert.
- Kopf:
  - 70px hoch, Fläche `--actionDialogBackground`, Unterkante 1px `--cardSeparatorLineColor`.
  - Optional ein Avatar: Kreis 46px auf `--backgroundColor`, Icon in primary.
  - Titel 130 % in `--textMain`, Untertitel in `--textLight`, beide einzeilig mit „…“.
  - Schließen-Button in einer 70 × 70px-Zone.
- Inhalt mit `contentPadding` (Default 25px). Laden: Overlay `--backgroundColor` mit 65 % Deckkraft.
- **Mobil** (`Breakpoints.XSmall`): 100 % breit, `height: calc(100% - 30px)`, unten angedockt, Radius 8px nur oben.
- a11y: `role="dialog"`, `aria-modal`, `aria-labelledby` zeigt auf den Titel.

## 7. Hinweise, Toast, Laden

- **`es-info-message`**: Radius 2px, `padding: 15px 20px`, Icon mit 20px Abstand.

  | Modus | Fläche | Rahmen | Text |
  |---|---|---|---|
  | info | `--primaryBackground50` | `--primary` | `--primaryForeground900` |
  | warning | Mischung aus `--colorStatusWarning` | ebenso | ebenso |
  | error | Mischung aus `--colorStatusNegative` | ebenso | ebenso |

  Die Mischungen stehen in `tokens.md` §5. Mit `closable` erscheint oben rechts ein 32 × 32px-Schließen-Button.
- **Toast** (`Toast`-Service, intern MatSnackBar):
  - Fläche `--toastBackground` (#333 / dunkel #ededed), Text `--textWhite`.
  - Links ein 8px-Streifen: info #40bf8e, Fehler #c15d5d.
  - Aktions-Button fett in `--toastButtonColor`.
  - Fehler werden mit `aria-live` assertive angesagt. Position und Breite sind Material-Default.
- **`es-spinner`**:
  - Drei animierte Sechsecke (je 50px, Animation 2s) in festen Blautönen #c1c6e3, #7f91c3 und #3162a7, ohne Theme- oder Dark-Variante.
  - Container 54px hoch; `aria-live="polite"` „Lädt...“.
- **`es-spinner-small`**: `mat-progress-spinner` in primary, 20px.
- **`es-global-progress`**: Vollbild-Abdunklung (rgba 0,0,0,.75, Unschärfe 5px), Meldung in Weiß bei 120 %.

## 8. Avatar (`es-user-avatar`)

| `size` | Kreis | Initialen | Icon |
|---|---|---|---|
| large (Default) | 120px | 56px | 60px |
| medium | 70px | 32px | 36px |
| small (Navigation) | 40px | 16px | 22px |
| xsmall | 24px | 11px | 14px |
| xxsmall | 16px | 8px | 11px |

- Initialen in Weiß auf der **Autoritätsfarbe**. Der Hash des Namens wählt sie aus 6 Werten: #4584B3, #9B393C, #84B97C, #71B0A4, #7A79D5, #AE9957. Ohne Name gilt #4584B3. Gäste erhalten „G“.
- Gruppen: drei versetzte Ringe.
- Keine Dark-Mode-Variante.

## 9. Badges und Chips

Es gibt **keinen zentralen Badge-Stil**. Die Muster:

| Muster | Aussehen | Einsatz |
|---|---|---|
| Kreis-Badge (`card-top-bar-badge`) | `padding: 5px`, `--backgroundColor`, `materialShadow()`, Icon 18px in `--palette-primary-600` | Typ- und Pin-Badge auf Kacheln |
| Pille (Stats) | Radius 15px, `padding: 2px 8px`, mindestens 35 × 22px, `--color-readable-overlay` | Kommentare und Teilobjekte |
| `--borderRadiusBadges` (10px) | `padding: 7px 8px`, Statusfarben als 60 %-Mischung | Aufgaben-Badges, Verwendungen, Zeitraum-Umschalter |
| Zähler am Button (`.mat-button-badge`) | 16px-Kreis, `--colorStatusNegative`, fett | Benachrichtigungen u. ä. |
| Lizenz-Badge | `--licenseOerBadgeBackground` / `--licenseNotOerBadgeBackground`, Text `--licenseBadgeTextColor`, 80 %, fett, Großbuchstaben, `padding: 4px 12px`, Radius 8px | nur Lizenzdialog und Lizenz-Widget |
| KI-Vorschlag | gestrichelter Rahmen `--aiColorChipBorder`, 40px hoch, Text `--aiColorChipText`; übernommen: Fläche `--aiColorChipBg` | MDS-Editor |
| Standard-Chip | Fläche `--primaryBackground100`, Entfernen-Icon `--primary` | `mat-chip` |

## 10. Tabs, Brotkrumen, Edge-Toggle

- **Tabs**:
  - Kopf auf `--roundedContainerBackground`, Icon und Label mit `gap: 10px`; Schatten unten mit `.mat-tab-group-shadow`.
  - Typische Höhe 72px über `--mat-tab-container-height`. Die Farbe des Aktiv-Indikators ist Material-Default (vermutlich primary).
- **Brotkrumen** (`es-breadcrumbs`):
  - Links in `--primary`, `padding: 2px 4px`, höchstens 300px mit „…“. Das aktuelle Element ist fett und nicht verlinkt.
  - Trenner `keyboard_arrow_right` in `--textLight`. Unter 900px Kurzform mit horizontalem Scroll.
  - a11y: `nav aria-label`, Liste mit Einträgen.
- **Edge-Toggle**:
  - Rund, 46 × 46px, Fläche `--edgeToggleBackground`, Schatten `--edgeToggleShadow`, Rahmen `--borderDarkModeOnly`, Icon 26px. Hover `--primaryBackground50`.
  - a11y: `aria-expanded`, `aria-controls`, `aria-label`.

## 11. Sammlungsfarben

- 12 gedeckte Standardfarben (`DEFAULT_COLLECTION_COLORS`): #975B5D, #692426, #E6B247, #A89B39, #699761, #32662A, #60998F, #29685C, #759CB7, #537997, #976097, #692869.
- Installationen ersetzen sie über `collections.colors`.
- Darauf liegt Text auf `--color-readable-overlay`.
- **`es-small-collection`** ist ein Banner „In Sammlung einfügen“ (Radius 10px, rechts Fläche `--primary`), **kein** Karussell. Das Sammlungs-Karussell auf der Suche ist `es-node-entries-wrapper` in `SmallGrid` mit `layout: 'scroll'`.
