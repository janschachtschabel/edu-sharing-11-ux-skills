---
name: edu-sharing Designsystem
version: 0.4.0
# Defaultwerte Light-Theme. Im Code NIE die Hex-Werte, immer var(--<key>).
# Branding überschreibt primary/accent/warn je Installation (client.config themeColors),
# z. B. WLO: primary #003b7c, accent #e4f700 – Code muss mit jeder Primärfarbe funktionieren.
colors:
  primary: "#48708e"            # --primary: Aktionen, Links, aktive Zustände
  warn: "#cd2457"               # --warn / --colorStatusNegative: Fehler, Löschen
  text-main: "#383838"          # --textMain: Fließtext
  text-light: "#585858"         # --textLight: Sekundärtext, Labels, Hints
  text-medium-light: "#767676"  # --textMediumLight: nur auf #fff (4,54:1)
  background: "#f3f3f3"         # --backgroundColor: Seitenhintergrund
  surface: "#ffffff"            # --roundedContainerBackground: Karten/Container
  surface-default: "#ffffff"    # --defaultBackground
  border-light: "#eeeeee"       # --borderLight
  status-positive-text: "#297a5b" # --colorStatusPositiveText
  status-warning: "#e98c1b"     # --colorStatusWarning (nur Fläche/Icon)
  ai: "#2c0799"                 # --aiColor: KI-Kennzeichnung
typography:                   # nur ein Schnitt `open_sansregular` (variable TTF); 600/fett ohne eigenen Font-Face
  body: { fontFamily: "open_sansregular, Arial, sans-serif", fontSize: "10pt", fontWeight: 400 }
  subtitle: { fontFamily: "open_sansregular, Arial, sans-serif", fontSize: "90%", fontWeight: 600 }
  headline-1: { fontFamily: "open_sansregular, Arial, sans-serif", fontSize: "150%", fontWeight: 400 }
  headline-2: { fontFamily: "open_sansregular, Arial, sans-serif", fontSize: "140%", fontWeight: 400 }
rounded:
  badge: "10px"    # --borderRadiusBadges
  button: "18px"   # --borderRadiusButtons
  card: "20px"     # --borderRadiusCards
spacing:                    # 5px-Raster des Ist-Codes (95 % aller Abstände ±2px)
  hair: "2px"                 # nur Linien-/Fokus-Offsets
  xs: "5px"
  s: "10px"                   # Standard-Gap (Icon–Text in Buttons/Tabs)
  m: "15px"                   # --roundedContainerMargin
  l: "20px"                   # Polster in Seitenleisten (.mat-sidenav-padding)
  xl: "25px"                  # $cardPadding / Dialog contentPadding
  xxl: "30px"
  xxxl: "40px"
---
# edu-sharing Designsystem

## Leitbild
Für Lehrende, Lernende und Redaktionen, die Bildungsinhalte finden, ablegen, teilen: ruhig, dicht lesbar, Inhalte vor Dekoration. Läuft mit eigenem Branding je Installation und eingebettet in fremde Seiten – daher nur Tokens.

Basis: Angular 21, Angular Material 21 (MDC-Komponenten), Theme über `angular-material-css-vars` (M2-Paletten 50–900). Maßstab ist der **Ist-Stand** dieses Codes (ohne seine bekannten Fehler), kein M3-Zielbild. Quelle der Wahrheit: `projects/edu-sharing-ui/assets/scss/`.

## Kernregeln
1. Erst vorhandene Bausteine (`ngx-edu-sharing-ui`, `src/app/shared`, Angular Material), dann neu bauen. Wiederverwendbares gehört in die Lib und wird in `index.ts` exportiert.
2. Farben nur als `var(--…)` aus `variables.scss`. Kein Hex/`rgb()`/`white` in Komponenten. Fehlt ein Token: in `:root` **und** `body.isDarkTheme` ergänzen.
3. Primär-Tönungen über `--primaryBackground50/100/300/700/900` und `--primaryForeground800/900`, nicht `--palette-primary-X` (kippt im Dark Mode nicht).
4. SCSS-`$variablen` dürfen nur `var(--…)` enthalten, keine Farbliterale (Dark Mode wirkt nur über CSS-Variablen).
5. Material anpassen: erst Input (`color`, `appearance`), dann edu-sharing-Zusatzklasse, dann `--mat-<komponente>-*`-Token. Keine `--mdc-*`-Tokens, keine Klassen vor MDC (`.mat-form-field-wrapper`).
6. Kein M3-Theme (`mat.theme()`, `--mat-sys-*` setzen) – das Theme kommt aus `material-theme.scss`.
7. Icons nur `<i esIcon="name"></i>`; bedeutungstragend mit `[aria]="true"` oder `[altText]`. Kein `<mat-icon>`.
8. Radien: Seitenkarten/Container `--borderRadiusCards`; Kacheln in Listen ohne Radius; Badges `--borderRadiusBadges`. Schatten nur über Mixins `materialShadow*()`. Abstände (padding/margin/gap) nur aus der `spacing`-Skala: 5/10/15/20/25/30/40px.
9. Fokus immer sichtbar: `@include setGlobalKeyboardFocus()` (2px `--focusColor`, Offset 2px). `outline: none` nur mit Ersatz.
10. Kontrast Text ≥ 4,5:1, große Schrift/Icons/Ränder ≥ 3:1 – in Light **und** Dark Mode. `--textMediumLight` nie auf `--backgroundColor`, `--textVeryLight` nie für Informationstext.
11. Klickziele ≥ 24 × 24 px (WCAG 2.2 AA). Material-Größen nicht verkleinern (Ist: Icon-Button 40px, Button 36px hoch).
12. Breakpoints nur aus `variables-scss` (`vars.$mobileTabSwitchWidth` 900px, `vars.$mobileWidth` 700px). Unter 900px Platz für die untere Leiste lassen (`vars.$mobileTabNavHeight` 62px).
13. Höhen mit `var(--mainnavCurrentHeight)`, nie feste Nav-Höhe. Seiten nutzen `roundedContainerCard()` (+ `roundedContainerStaticScroll()`).
14. Jede Datenansicht hat Lade- (`es-spinner`/`es-spinner-small`), Leer- (`#empty`-Template) und Fehlerzustand (`Toast.error()`).
15. Texte nur über i18n-Schlüssel (`| translate`), mindestens `de.json` + `en.json`. Deutsch siezt.
16. Templates: `@if`/`@for`, Signals bevorzugt, keine Spread-Syntax im Template.
17. Neue sichtbare Komponente bekommt eine Storybook-Story, geprüft in Light, Dark und `addon-a11y`.

## Komponenten-Kurzliste
| Begriff | Baustein | Hinweis |
|---|---|---|
| Kachel/Liste/Tabelle von Materialien | `es-node-entries-wrapper` | `displayType`: Grid, SmallGrid, Table, Tree; `#empty`-Template |
| Sortierung / Ansicht | Sortier-`mat-button` primary / Toggle in `es-actionbar` | Ansicht: ein Icon-Button `list` ↔ `view_module` |
| Typ, Lizenz auf Kachel | `es-node-type-badge`, `es-list-node-license` | Kreis-Icon; Lizenz als CC-Symbol |
| Aktionsleiste | `es-actionbar` | `OptionItem[]`, Überlauf ins Menü |
| Menü | `es-dropdown` | mobil `triggerBottomSheet()` |
| Hinweisbox | `es-info-message` | `mode`: info, warning, error |
| Laden | `es-spinner`, `es-spinner-small` | groß: Bereich, klein: inline |
| Dialog | `DialogsService.openGenericDialog()` | Primärbutton rechts |
| Rückmeldung | `Toast.show()` / `Toast.error()` | Schlüssel unter `TOAST.` |
| Avatar | `es-user-avatar` | `size` xxsmall–large |
| Navigation | `MainNavService.setMainNavConfig()` | keine eigene Nav je Seite |

## Nie
- Verlaufstext, Deko-Glassmorphism (Unschärfe nur in Overlays: `blurBackground()`), fremde Icon-Sets, eigene Schriften (Ausnahme: `$brand-font-family` auf Themenseiten).
- `MatSnackBar` oder `MatDialog` direkt; `@Deprecated` `RestXxxService`.
- Weiße Schrift auf `--colorStatusPositive`/`--colorStatusWarning` (2,3:1 / 2,6:1).
- Tokens erfinden (z. B. `--textOnPrimary` existiert nicht).
- `--accent` als Text- oder Icon-Farbe auf hellen Flächen (WLO-Accent `#e4f700` auf Weiß: 1,19:1).

## Do / Don't
- Do `color: var(--textLight);` · Don't `color: #585858;`
- Do `background: var(--primaryBackground50);` · Don't `background: var(--palette-primary-50);`
- Do `<i esIcon="delete" [aria]="true"></i>` · Don't `<mat-icon>delete</mat-icon>`
- Do `@include mixins.materialShadow();` · Don't `box-shadow: 0 2px 4px #0003;`

## Skills (`/edu-sharing-ux-…`) – bei passender Aufgabe laden
| Skill | Laden bei |
|---|---|
| `edu-sharing-ux-build-components` | Komponente, Kachel, Liste, Seite, Dialog, Formular, SCSS, Dark Mode |
| `edu-sharing-ux-audit-accessibility` | A11y, WCAG, Kontrast, Tastatur, Screenreader; vor jedem MR mit UI-Änderung |
| `edu-sharing-ux-review` | UX-Review, Usability, Flow/Screen bewerten |
| `edu-sharing-ux-write-copy` | Labels, Fehlermeldungen, Leerzustände, Toasts, i18n-Texte |
| `edu-sharing-ux-build-topic-pages` | Themenseite, Vorlage, Variante, Swimlane/Abschnitt, Widget |
| `edu-sharing-ux-build-embeds` | Web Component, iframe-Embed, Rendering-Komponente, LMS/LTI |
| `edu-sharing-ux-write-handoff` | Figma/Konzept → Handoff für Team 6 |
| `edu-sharing-ux-create-skills` | (Team 5) Designregeln/Skills anlegen oder ändern |
