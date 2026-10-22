---
name: edu-sharing-ux-build-components
description: Baut und ändert Angular-Komponenten, Kacheln, Listen, Seiten und Dialoge im edu-sharing-Frontend (ngx-edu-sharing-ui, Angular Material 21, SCSS-Tokens, Dark Mode) nach der edu-sharing-DESIGN.md. Verwenden bei Aufgaben zu Komponente, Kachel, Card, Karte, Suchergebnis, Trefferliste, Materialliste, Sammlung, Tabelle, Button, Dialog, Formular, Seite, Layout, Sidebar, mobile Ansicht, SCSS, Farben, Dark Mode, Theme, Icon, Storybook-Story oder Material-Komponente (mat-button, mat-form-field, mat-slide-toggle) im edu-sharing- oder WirLernenOnline-Kontext – auch wenn nur "mach das hübscher" oder "style das" gesagt wird.
metadata:
  owner: team-5-ui-ux
  version: 0.6.0
---
# edu-sharing-Komponenten bauen

## Zweck
Neue oder geänderte UI im edu-sharing-Frontend sieht in jeder Installation (Branding), im Dark Mode, im Kontrastmodus und eingebettet korrekt aus, weil sie nur vorhandene Bausteine, Tokens und Mixins nutzt.

## Ablauf
- Geht es um eine **Themenseite** (Vorlage, Abschnitt, Widget), zusätzlich den Skill `edu-sharing-ux-build-topic-pages` laden. Geht es um **Einbettung** (Web Component, iframe, Lernplattform), den Skill `edu-sharing-ux-build-embeds`.

0. **Handoff lesen**, falls es einen gibt (`handoffs/<feature>.md`). Er geht der DESIGN.md für dieses Feature vor. Offene Fragen daraus zuerst stellen. Ist keine Antwort möglich, die Annahme in einem austauschbaren Service oder einer Konstante kapseln, im Code kommentieren und in der Antwort nennen.
1. **Baustein suchen.** In [references/building-blocks.md](references/building-blocks.md) nachsehen. Wenn ein Baustein passt, nimm ihn und konfiguriere ihn über Inputs. Bau ihn nicht nach. Wie Kacheln, Listen und Tabellen aussehen, steht in [references/node-entries-anatomy.md](references/node-entries-anatomy.md); das Aussehen der übrigen Bausteine in [references/component-specs.md](references/component-specs.md).
2. **Ort festlegen.** Wird der Baustein von mehreren Features genutzt, gehört er nach `projects/edu-sharing-ui/src/lib/` und wird in `index.ts` exportiert. Sonst kommt er unter `src/app/pages/<seite>/` (Teil einer Seite) bzw. `src/app/features/<feature>/` (seitenübergreifendes Feature). Den Ort danach wählen, wie der Nachbarcode organisiert ist.
3. **Layout wählen.** Muster aus [references/layout-patterns.md](references/layout-patterns.md) übernehmen: Seitenrahmen, interner Scroll, mobile Leiste, Drawer. Den Aufbau der vorhandenen Seiten (Navigation, Suche, Sammlungen, Arbeitsbereich) zeigt [references/page-layouts.md](references/page-layouts.md); neue Seiten richten sich danach.
4. **Stylen.** Tokens aus [references/tokens.md](references/tokens.md) und Mixins aus [references/mixins.md](references/mixins.md) verwenden. Für Material-Komponenten gilt die Reihenfolge aus [references/material-variants.md](references/material-variants.md).
5. **Formulare** nach [references/forms.md](references/forms.md) (Muster für Absenden und Validierung §3). Metadaten nicht als eigenes Formular, sondern über den MDS-Editor.
6. **Zustände umsetzen.** default, hover, focus (Tastatur), active, disabled, loading, leer, Fehler. Wird eine vorhandene Option oder ein vorhandener Service wiederverwendet, im Ergebnis nennen, welches Lade- und Rückmeldeverhalten er schon mitbringt (z. B. `showProgressSpinner()`, Toast).
7. **Texte anlegen.** i18n-Schlüssel in `src/assets/i18n/<bereich>/de.json` und `en.json` anlegen. Den Ton legt der Skill `edu-sharing-ux-write-copy` fest.
8. **Story schreiben.** Story `<name>.component.stories.ts` anlegen. Vorbild ist `info-message.component.stories.ts`; der Theme-Wrapper greift global über `.storybook/preview.ts`. In Storybook (`npm run storybook`, Port 6006) Light, Dark und das Panel „Accessibility“ prüfen. Ohne Storybook: die Seite mit `?theme=light` und `?theme=dark` öffnen.
9. **Prüfen.** `node <skill>/scripts/lint-design-rules.mjs <geänderte Dateien>` ausführen.
   - Auf **neuen oder geänderten Zeilen** dürfen 0 FEHLER bleiben; Warnungen dort begründen oder beheben.
   - Vorbestehende FEHLER in berührten Dateien nur **melden** (Datei:Zeile), nicht ungefragt mitändern. Ob sie vorher schon da waren, per `git diff` bzw. Vergleich mit HEAD belegen.
10. **Abschluss-Checkliste** unten abhaken und in der Antwort mit [x]/[ ] wiedergeben.

## Verbindlich
- **Farben** nur über `var(--…)` aus `projects/edu-sharing-ui/assets/scss/variables.scss`.
  - Primärtönungen über `--primaryBackground50/100/300/700/900` und `--primaryForeground800/900`.
  - Ein neuer Token wird in `:root` **und** in `body.isDarkTheme` eingetragen. Im Dark Mode bevorzugt `color-mix(in srgb, var(--primary) N%, black|white)`.
- **SCSS-Import** im Komponenten-Stylesheet:
  ```scss
  @use 'projects/edu-sharing-ui/assets/scss/mixins' as mixins;
  @use 'projects/edu-sharing-ui/assets/scss/variables-scss' as vars;
  ```
  Ein `$x` ohne Namespace kompiliert nicht. `@use './common' as *` exportiert `variables-scss` nicht weiter.
- **Icons** als `<i esIcon="name"></i>`:
  - Präfix `edu-` lädt edu-icons, `svg-` lädt ein SVG aus `assets/images/icons/`.
  - Steht ein Icon allein (Icon-Button ohne Text), braucht es `[aria]="true"` (Text aus `ICON_LABELS.<name>`) oder `[altText]="'KEY' | translate"`.
- **Radien:** Seitenkarten und große Container `var(--borderRadiusCards)` (20px); **Kacheln in Listen haben keinen Radius**. Badges `var(--borderRadiusBadges)` (10px), Dialog 4px, Material-Buttons im Default (siehe `component-specs.md`).
- **Abstände:** padding, margin und gap nur aus der Skala 5/10/15/20/25/30/40px (DESIGN.md `spacing`, Details in [references/tokens.md](references/tokens.md) Abschnitt 7). 2px nur für Linien und Fokus-Offset.
- **Klickflächen:** mindestens 24 × 24 px. Material-Größen nicht verkleinern: Icon-Button 40px, Button 36px hoch, Checkbox 32px. Kein Override von `--mdc-icon-button-state-layer-size` oder `height` nach unten.
- **Schatten:** nur `mixins.materialShadow()`, `materialShadowSmall()`, `materialShadowMedium()`, `materialShadowBottom()`.
- **Fokus:** Eigene klickbare Elemente bekommen `&.cdk-keyboard-focused, &:focus-visible { @include mixins.setGlobalKeyboardFocus(); }`. Material-Buttons, Checkboxen und Slide-Toggles haben das bereits global.
- **Klickbare Nicht-Buttons** bekommen `@include mixins.clickable()`, `role` und `tabindex="0"` sowie Enter- und Space-Handler. Besser ist ein `<button>` oder `es-node-url`.
- **Textkürzung:**
  - mehrzeilig: `@include mixins.limitLineCount(2, 1.3)`
  - einzeilig: `@include mixins.shortenText()`
  - Die Kürzung erkennt `[esCheckTextOverflow]`. Dann den vollen Text per `matTooltip` anbieten.
- **Mobil:**
  - Ab `max-width: vars.$mobileTabSwitchWidth` (900px) ist die untere Leiste (62px) fixiert.
  - Inhalt am unteren Rand bekommt `margin-bottom: vars.$mobileTabNavHeight`.
  - Menüs nutzen auf Mobilgeräten `es-dropdown.triggerBottomSheet()`.
- **Angular:**
  - `@if`/`@for` (mit `track`).
  - `input()`/`output()`/`computed()` bevorzugen, `viewChild()` statt `@ViewChild` mit `setTimeout`.
  - `subscribe({ next, error })`.
  - Keine Spread-Syntax im Template.
  - Template-Referenzen anders benennen als Klassen-Properties (`#fooRef`).
- **Daten** über `ngx-edu-sharing-api` (`NodeService`, `*V1Service`), nie über `@Deprecated` `RestXxxService`.
- **Dialoge** über `DialogsService`:
  - Bestehende `openXxxDialog()` nutzen oder `openGenericDialog({ title, message, buttons: SAVE_OR_CANCEL, maxWidth })`.
  - Knoten löschen: immer `DialogsService.openDeleteNodesDialog({ nodes })` (Papierkorb, Warnung bei Verwendungen in Sammlungen). `DELETE_OR_CANCEL` nur für andere Löschvorgänge.
  - Ein neuer Dialog wird als Komponente mit `inject(CARD_DIALOG_DATA)` und `inject(CardDialogRef)` gebaut und über `CardDialogService.open()` geöffnet.
- **Rückmeldung:**
  - Erfolg: `toast.show({ message: 'TOAST.…', type: 'info', subtype: ToastType.InfoSimple })`
  - Fehler: `toast.error(err)`
  - Lang laufende, blockierende Aktion: `toast.showProgressSpinner()`

## Spielraum
- Anordnung von Metadaten, Badges und Aktionen innerhalb einer Kachel, solange `es-node-entries-wrapper` mit `#overlay`/`#customCard`/`#actionArea` das nicht schon abdeckt.
- Wahl zwischen `Grid`, `SmallGrid` und `Table` nach Inhalt: Bilder → Grid, viele Metadaten → Table.
- Welcher Wert der `spacing`-Skala (DESIGN.md: 5/10/15/20/25/30/40px) wo passt. Werte außerhalb der Skala (z. B. 8/16px aus Material-Nähe) nur mit Begründung; 2px nur für Linien und Fokus-Offsets.
- Animationen mit `var(--transitionNormal)` (0.2s).

## Nie
- Hex, `rgb()`, `rgba()` oder Farbnamen in Komponenten-SCSS, Templates oder `style=""`.
- `--palette-primary-X` als Flächen- oder Textfarbe (einzige Ausnahme im Bestand: Icon im Typ-Badge der Kachel mit `--palette-primary-600`; für Neues `--primaryForeground800`).
- `<mat-icon>`, `MatSnackBar`, `MatDialog.open()` direkt.
- `mat.theme()`, `mat.define-theme()` oder das Setzen von `--mat-sys-*`.
- Selektoren aus der Zeit vor MDC (`.mat-form-field-wrapper`, `.mat-tab-label`, `.mat-flat-button`, `.mat-radio-outer-circle`) oder `--mdc-*`-Tokens.
- `::ng-deep` auf `.mdc-*`-Interna, wenn es ein `--mat-*`-Token gibt.
- Feste Höhen mit Nav-Pixelwert (`calc(100vh - 70px)`).
- `font-family` in Komponenten.
- Eine eigene Spinner- oder Leerzustands-Optik pro Feature.
- Weiße Schrift auf `--colorStatusPositive` oder `--colorStatusWarning`.
- `--accent` oder `color="accent"` als Text- oder Icon-Farbe auf hellen Flächen. Mit WLO-Branding (`#e4f700`) ergibt das 1,19:1.
- Icon oder Text einer **vorhandenen** Aktion app-weit ändern, weil ein Auftrag es für einen Ort verlangt. Nur am genannten Ort ändern (eigenes `OptionItem` oder Override) und die app-weite Änderung als offene Frage stellen.
- Feste Annahmen über die Primärfarbe (z. B. „blau, also weiße Schrift“). Text auf `--primary` immer `var(--light-primary-text)`.
- Tokens, die nicht in `variables.scss` stehen. Vorher prüfen:
  ```bash
  grep -n "\-\-name:" projects/edu-sharing-ui/assets/scss/variables.scss
  ```

## Verweise
- Tokens nach Zweck, mit Dark-Mode-Verhalten: [references/tokens.md](references/tokens.md)
- Material-Varianten und Zusatzklassen, wirksam und veraltet: [references/material-variants.md](references/material-variants.md)
- Mixins mit Anwendungsfall: [references/mixins.md](references/mixins.md)
- Seitenrahmen, Scroll, Mobil, Drawer: [references/layout-patterns.md](references/layout-patterns.md)
- Vorhandene Bausteine (Lib und App): [references/building-blocks.md](references/building-blocks.md)
- Do/Don't mit Code: [references/examples.md](references/examples.md)
- Aufbau von Kachel, SmallGrid, Tabelle, Metadaten-Zeilen: [references/node-entries-anatomy.md](references/node-entries-anatomy.md)
- Seitenaufbau Navigation, Mobilleiste, Suche, Sammlungen, Arbeitsbereich und was die Konfiguration bestimmt: [references/page-layouts.md](references/page-layouts.md)
- Aussehen von Schrift, Icons, Buttons, Actionbar, Suchfeld, Dialog, Toast, Avatar, Badges, Tabs: [references/component-specs.md](references/component-specs.md)
- Formulare: Felder, Pflicht, Hinweis und Fehler, Validierung, Dialogformulare, MDS-Editor und Widgets, Mehrfachbearbeitung, KI: [references/forms.md](references/forms.md)
- Prüfskript: `scripts/lint-design-rules.mjs`

## Abschluss-Checkliste
- [ ] Vorhandenen Baustein geprüft; Neubau begründet
- [ ] `lint-design-rules.mjs`: 0 FEHLER auf neuen/geänderten Zeilen; vorbestehende FEHLER gemeldet, nicht mitgeändert
- [ ] Nur Tokens aus `variables.scss`; neue Tokens in `:root` und `body.isDarkTheme`
- [ ] In Storybook im Light- und Dark-Theme geprüft; bei Theme `red` gibt es keine fest eingebaute Primärfarbe
- [ ] Neue Farbkombinationen auch mit WLO-Branding gerechnet (primary `#003b7c`, accent `#e4f700`, Werte in `tokens.md` Abschnitt 10)
- [ ] `off-scale-spacing`-Warnungen behoben oder begründet; keine Klickfläche unter Material-Ist-Größe
- [ ] Fokus mit Tab sichtbar; alles per Tastatur bedienbar; Icon-only-Buttons haben ein Label
- [ ] Kontrast ≥ 4,5:1 für Text, ≥ 3:1 für Icons und Ränder, laut `addon-a11y` ohne Verstöße
- [ ] Lade-, Leer- und Fehlerzustand vorhanden
- [ ] Bei 375px Breite kein horizontaler Scroll; untere Leiste verdeckt nichts
- [ ] Texte in `de.json` und `en.json`; kein Text hart im Template
- [ ] Storybook-Story ergänzt
- [ ] Wiederverwendbare Lib-Komponente in `projects/edu-sharing-ui/src/lib/index.ts` exportiert (sonst NG3001)
