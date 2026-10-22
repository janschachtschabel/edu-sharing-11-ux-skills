# A11y-Prüfpunkte mit edu-sharing-Bezug

Die WCAG-Nummer steht in Klammern. „Fix“ nennt das Mittel aus dem Designsystem.

## Inhalt
1. Wahrnehmbar
2. Bedienbar
3. Verständlich
4. Robust
5. edu-sharing-spezifische Einstellungen
6. Nur im Browser prüfbar
7. Laufende Instanz messen

## 1. Wahrnehmbar

| Prüfpunkt | Woran erkennen | Fix |
|---|---|---|
| Bilder haben eine Alternative (1.1.1) | `<img>` ohne `alt` / `[alt]` | Inhaltsbild: `[alt]="node \| nodeTitle"`; dekorativ: `alt=""` |
| Icons ohne Text haben einen Namen (1.1.1, 4.1.2) | `<button mat-icon-button>` mit nur `<i esIcon>` und ohne `aria-label` | `[attr.aria-label]="'KEY' \| translate"` am Button. Steht das Icon allein ohne Button: `[aria]="true"` (nutzt `ICON_LABELS.<name>`, der Schlüssel muss in `common/*.json` existieren) oder `[altText]` |
| Dekorative Icons sind versteckt | `esIcon` neben sichtbarem Text | Standard ist bereits `aria-hidden`; **nicht** `[aria]="true"` setzen |
| Überschriften sind echte Überschriften (1.3.1) | Titel als `<div class="title">` | `<h2>`/`<h3>` passend zur Seitenhierarchie; Optik über `.mat-heading-N`. Bei `es-mds-viewer` `headingLevel` setzen |
| Formularfelder haben Labels (1.3.1, 3.3.2) | `mat-form-field` ohne `mat-label`, nur `placeholder` | `<mat-label>{{ 'KEY' \| translate }}</mat-label>` |
| Pflichtfelder sind erkennbar | nur Farbe oder `*` ohne Text | `required` am Input; Marker `.required-marker`; Fehler `FIELD_REQUIRED` |
| Information nicht nur über Farbe (1.4.1) | Status nur über `--colorStatus*` | zusätzlich Icon (`es-info-message` hat Icons) oder Text |
| Textkontrast (1.4.3) | Kombination nachschlagen oder messen | `--textLight` statt `--textMediumLight` auf grauen Flächen; `--colorStatusPositiveText` statt `--colorStatusPositive` für Text |
| Nicht-Text-Kontrast (1.4.11) | Rahmen von Eigenbau-Inputs, Icons, Fokusrahmen | Rahmen `--borderGray`/`--inputBorderColor`; Fokus über Mixin. `--borderLight` nur als Deko, nicht als einzige Feldbegrenzung |
| Zoom 200 % und Umbruch (1.4.4, 1.4.10) | feste `px`-Höhen bei Text, `white-space: nowrap` ohne Kürzung | `limitLineCount()` + Tooltip; Breite 320px testen |
| Textabstände (1.4.12) | `line-height` fest mit Abschneiden | `mat-hint`/`mat-error` haben bereits `line-height: 1.5` |
| Inhalt bei Hover/Fokus (1.4.13) | eigene Hover-Popups | `matTooltip` nutzen (schließbar mit Esc, bleibt beim Hover) |

## 2. Bedienbar

| Prüfpunkt | Woran erkennen | Fix |
|---|---|---|
| Alles per Tastatur bedienbar (2.1.1) | `(click)` auf `div`/`span`/`i` | `<button>` oder `es-node-url mode="button"`. Notfalls `role="button" tabindex="0" (keydown.enter) (keydown.space)` |
| Keine Tastaturfalle (2.1.2) | eigene Overlays ohne Esc | `CardDialogService` bzw. `mat-menu` nutzen (Fokus wird verwaltet) |
| Fokus-Reihenfolge logisch (2.4.3) | `tabindex` > 0, CSS-Reihenfolge ≠ DOM | `tabindex` > 0 entfernen, DOM-Reihenfolge anpassen |
| Fokus sichtbar (2.4.7) | `outline: none` ohne Ersatz, `removeDefaultFocus()` allein. **Auch `<a mat-button>`/`<a mat-flat-button>` prüfen:** Der globale Tastaturfokus in `material-theme.scss:456-466` gilt nur für `button.mat-mdc-*`, nicht für Links mit Button-Optik | `&:focus-visible { @include mixins.setGlobalKeyboardFocus(); }`; in Listen wie `es-node-entries` (Kachel: `setGlobalKeyboardFocus()`, Tabellenzeile: Modus `'border'`); bei `a[mat-button]` im Komponenten-SCSS ergänzen |
| Fokus nach Dialog | Dialog selbst gebaut | `CardDialogConfig.autoFocus` (Standard `first-tabbable`); `[esFocusOnOpen]` für eigene Panels |
| Sprungmarken (2.4.1) | Seite ohne Sprungziel zum Hauptinhalt | `esSkipTarget="MAIN_CONTENT"` (+ `role="main"`) am Hauptinhalt, registriert beim `SkipNavService` |
| Seitentitel (2.4.2) | neue Route ohne Titel | `mainNav.setMainNavConfig({ title })` bzw. `[esTitle]` |
| Linkzweck (2.4.4) | „hier“, „mehr“ | sprechender Text oder `aria-label` mit Kontext (`SELECT`: „{{ element }} auswählen“) |
| Name enthält Aktion und Kontext (4.1.2, 2.4.4) | `es-node-url` mit zusätzlichem Inhalt (Aktion, Datum, Badge): Die Komponente setzt standardmäßig `aria-label` = Titel des Knotens und überschreibt damit den Linkinhalt, Screenreader hören weder Aktion noch Datum | `[aria-label]="false"` am `es-node-url`, damit der sichtbare Inhalt der Name ist (Muster: `breadcrumbs.component.html:178`) |
| Zielgröße (2.5.8, WCAG 2.2 AA) | Klickfläche < 24 × 24 px; oder kleiner als die Material-Ist-Größen (Icon-Button 40px, Button 36px, Checkbox 32px – gemessen auf WLO-Staging) | `mat-icon-button`/`mat-button` ohne Größen-Override; Fließtext-Links sind ausgenommen |
| Drag & Drop hat eine Alternative (2.5.x) | nur Ziehen möglich | Aktion zusätzlich als `OptionItem` (Nutzereinstellung `dragAndDropOptions`) |
| Bewegung (2.3.3, AAA – Empfehlung) | neue Animation > `var(--transitionNormal)` | `@media (prefers-reduced-motion: reduce)` abschalten. Im Code bisher nirgends umgesetzt, deshalb nur „Niedrig“ |

## 3. Verständlich

| Prüfpunkt | Woran erkennen | Fix |
|---|---|---|
| Sprache | Text hart im Template | i18n-Schlüssel (`\| translate`) in `de.json` und `en.json` |
| Fehler werden erkannt und beschrieben (3.3.1, 3.3.3) | nur roter Rahmen | `<mat-error>` mit Text, der sagt, was zu tun ist (Skill `edu-sharing-ux-write-copy`) |
| Konsistente Bedienung (3.2.3, 3.2.4) | eigene Button-Reihenfolge in Dialogen | `DialogButton`-Sätze: Standard links, Primär rechts |
| Kein Kontextwechsel bei Eingabe (3.2.2) | Navigation bei `(change)` eines Selects | Bestätigungsbutton |

### Formulare (Details in `edu-sharing-ux-build-components/references/forms.md`)

| Prüfpunkt | Woran erkennen | Fix |
|---|---|---|
| Fehler ist mit dem Feld verknüpft (3.3.1, 1.3.1) | eigenes `p.mat-error` außerhalb von `mat-form-field` ohne `aria-describedby` | `aria-describedby` auf die Fehler-ID; besser `mat-error` im `mat-form-field` |
| Gruppen haben einen Namen (1.3.1) | Radio- oder Checkbox-Gruppe ohne Beschriftung | `role="group"` + `aria-labelledby` oder `fieldset`/`legend` |
| Fokus nach dem Absenden (3.3.1) | ungültiges Formular, Fokus bleibt auf dem Button | zum ersten Fehler scrollen und fokussieren (`showMissingRequiredWidgets`-Muster) |
| Status von Auswahl-Buttons (4.1.2) | `multivalueButtons` bzw. eigene Toggle-Buttons ohne `aria-pressed` | `[attr.aria-pressed]` setzen |
| Statusmeldungen beim Speichern (4.1.3) | `aria-live`-Element entsteht erst mit dem Text | `aria-live`-Element vorher im DOM anlegen, nur den Text tauschen |

### Themenseiten und Einbettung

| Prüfpunkt | Woran erkennen | Fix |
|---|---|---|
| iframe hat einen Namen (4.1.2) | `<iframe>` ohne `title` oder mit fest eingetragenem englischem Titel | übersetzter `title`; beim äußeren Embed dokumentieren, dass die Gastseite ihn setzt |
| Breadcrumb ist Navigation (1.3.1) | `ul/li` ohne `<nav aria-label>` | in `<nav aria-label="…">` fassen |
| Keine verschachtelten Bedienelemente (4.1.2) | `<button>` in `<button>` (z. B. Sammlungs-Chips) | Struktur trennen |
| Gastseite nach Dialog wieder bedienbar | eingebettet: Geschwister im `body` bleiben `inert` | Dialog immer über `CardDialogRef` schließen; im Embed-Test prüfen |

## 4. Robust

| Prüfpunkt | Woran erkennen | Fix |
|---|---|---|
| Name, Rolle, Wert (4.1.2) | eigene Toggles/Checkboxen | `mat-slide-toggle`, `mat-checkbox`, `mat-button-toggle-group` |
| Statusmeldungen (4.1.3) | Ladezustand ohne Ansage, eigene Erfolgs-Banner | `es-spinner` (hat `aria-live="polite"`); Erfolg und Fehler über `Toast` |
| Dynamische Listen | Nachladen ohne Rückmeldung | `es-node-entries-wrapper` (Infinite Scroll/Paginator) statt Eigenbau |

## 5. edu-sharing-spezifische Einstellungen

| Einstellung | Wirkung | Prüfen |
|---|---|---|
| Dark Mode (`body.isDarkTheme`, `?theme=dark`) | alle Tokens kippen | jeder neue Token hat einen Dark-Wert; Kontrast in Dark gemessen |
| Kontrastmodus (`body.es-contrast-mode`, aus `prefers-contrast: more`) | zusätzliche Ränder/Outlines | eigene Overlays oder Felder bekommen bei Bedarf `@include mixins.contrastMode { outline: 1px solid … }` |
| `indicatorIcons` | Icons statt Text an Lizenzen u. ä. | Information bleibt ohne Icon verfügbar (Text oder Tooltip) |
| `toastDuration` / `toastMode` | Nutzende steuern Dauer und Menge der Toasts | keine eigene Dauer; wichtige Infos nicht nur im Toast |
| Branding (`themeColors`) | primary/accent/warn je Installation, z. B. WLO primary `#003b7c`, accent `#e4f700` | Storybook-Theme `red` und `lightBlue` testen: Text auf `--primary` nutzt `--light-primary-text`; Accent nie als Text/Icon auf hellen Flächen (WLO 1,19:1); Kontraste mit `contrast.mjs` für WLO-Werte rechnen |
| Eingebettet (`/embed`, Web Component) | helles Standard-Theme, Gastseite | keine globalen `body`-Styles aus Komponenten |

## 6. Nur im Browser prüfbar

- Screenreader-Ausgabe (NVDA/VoiceOver): Name und Rolle der neuen Bedienelemente, Ansage beim Laden
- Tastaturweg durch den ganzen Flow inklusive Rückkehr des Fokus nach Dialog bzw. Menü
- Kontraste von `color-mix()`-Tokens und `--primaryBackground300` (Fokusrahmen) mit DevTools messen
- 200 % Zoom und 320px Breite
- axe/Storybook-A11y-Panel in Light und Dark

## 7. Laufende Instanz messen (lesend)

Für eine Seite, die im Browser offen ist (lokal oder Staging, z. B. `suche.staging.openeduhub.net/edu-sharing/components/search`). Mit `?theme=light` oder `?theme=dark` lässt sich der Modus erzwingen.

```js
// 1. Branding-Farben der Installation
const cfg = await (await fetch('/edu-sharing/rest/config/v1/values', { credentials: 'include' })).json();
cfg.current?.values?.themeColors ?? cfg.current?.themeColors;

// 2. Aktive Token-Werte
const cs = getComputedStyle(document.body);
['--primary', '--accent', '--focusColor', '--textMain', '--backgroundColor'].map((n) => [n, cs.getPropertyValue(n).trim()]);

// 3. Klickflächen unter 24 px (WCAG 2.2, 2.5.8)
[...document.querySelectorAll('button, a[href], [role=button], [role=tab], input, select')]
  .map((e) => [e, e.getBoundingClientRect()])
  .filter(([, r]) => r.width > 1 && r.height > 1 && (r.width < 24 || r.height < 24))
  .map(([e, r]) => ({ el: e.tagName, label: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30), w: r.width, h: r.height }));
```

Referenzwerte WLO-Suche (hell):

- Icon-Buttons 40 × 40 px, Textbuttons 36 px hoch, Filter-Checkboxen 32 × 32 px
- Unter 24 px liegen nur versteckte Sprunglinks (1 × 1 px), der Footer-Link „Datenschutz“ (Fließtext-Link, ausgenommen) und `.es-sidenav-resizer` (7 px breit; braucht eine Tastatur-Alternative)

