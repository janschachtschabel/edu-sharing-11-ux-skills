# Angular-Material-Varianten und edu-sharing-Zusatzklassen

Quelle: `projects/edu-sharing-ui/assets/scss/material-theme.scss` (Angular Material 21, MDC).

## Inhalt
1. Reihenfolge beim Anpassen
2. Buttons
3. Formularfelder
4. Auswahl: Checkbox, Slide-Toggle, Button-Toggle, Chips
5. Tabs, Tabellen, Menüs, Sonstiges
6. Wirkungslose Regeln (veraltet, nicht als Vorbild nehmen)

## 1. Reihenfolge beim Anpassen

1. **Input der Komponente** nutzen, z. B. `color="primary"`, `color="warn"` oder `appearance="outline"`.
2. **edu-sharing-Zusatzklasse** aus den Tabellen unten nehmen.
3. **Token** der Komponente setzen: `--mat-<komponente>-<eigenschaft>`, im Komponenten-Scope und mit `var(--…)` als Wert. Beispiel:
   ```scss
   button.mat-mdc-button { --mat-button-text-label-text-color: var(--textOnDarkSurface); }
   ```
4. Nur wenn es kein Token gibt: Klasse `.mat-mdc-*` im Komponenten-Stylesheet. Das ist eine Ausnahme und wird im MR begründet.

Das Theme selbst (Paletten, Typografie) wird **nicht** angefasst. Es kommt aus `init-material-css-vars` mit `mat.m2-define-typography-config`.

## 2. Buttons

Form, Höhe und Innenabstand der Material-Buttons sind **Material-Default**. Der Code setzt keine Form-Overrides; die Defaults liegen in `node_modules` und nicht im Repo. Gemessen: Icon-Button 40px, Textbutton 36px hoch. Das Aussehen aller weiteren Bausteine steht in `component-specs.md`.

Typografie: `$button` 100 %, Gewicht 400, keine Großbuchstaben. Icon und Text im Button haben 10px Abstand (`.mdc-button span { gap: 10px }`).

| Zweck | Markup | Wirkung |
|---|---|---|
| Primäraktion (eine pro Bereich) | `<button mat-flat-button color="primary">` | gefüllt, `--primary` |
| Sekundäraktion | `<button mat-button color="primary">` | Textbutton in Primärfarbe |
| Abbrechen | `<button mat-button class="mat-cancel">` | `--textMediumLight`, Hover `--primary` |
| Umrandet | `<button mat-stroked-button>` | Rahmen `--palette-primary-500`, bei `color="warn"` `--warn` |
| Destruktiv | `<button mat-flat-button color="warn">` | `--palette-warn-500`, weiße Schrift |
| Raised | `<button mat-raised-button>` | weißer Container, Schrift `--primary` |
| Icon-Button | `<button mat-icon-button [attr.aria-label]="'KEY' \| translate"><i esIcon="…"></i></button>` | Ist-Größe 40 × 40px (gemessen auf WLO-Staging); nicht verkleinern |
| FAB auf farbiger Fläche | `<button mat-fab class="mat-white">` | weißer Grund, Icon `--primary` |
| Status-Button | `mat-flat-button` + `.status-negative` | Nur `.status-negative` hat genug Kontrast (5,3:1). `.status-positive` und `.status-warning` haben weiße Schrift mit 2,3:1 bzw. 2,6:1 und sind **nicht für Text** geeignet |
| Zähler-Badge am Icon-Button | `<span class="mat-button-badge">3</span>` im Button | 16px-Kreis, `--colorStatusNegative` |

In Dialogen wird nichts davon selbst gebaut. `DialogButton` mit `color: 'primary' | 'standard' | 'danger'` wird automatisch zu `mat-flat-button primary`, `mat-button primary` bzw. `mat-flat-button warn`.

Größen (gemessen auf WLO-Staging): Icon-Button 40 × 40px, Textbutton 36px hoch, Checkbox-Zielfläche 32 × 32px mit Kästchen 18 × 18px und Radius 2px, Tab-Indikator 2px hoch in Primärfarbe. Diese Werte nicht verkleinern; sie erfüllen die Mindestgröße von 24px (WCAG 2.2 AA).

Fokus: Für `.mat-mdc-button`, `-unelevated-`, `-raised-`, `-icon-button` und `-fab` setzt die Klasse `.cdk-keyboard-focused` den Fokus global über `setGlobalKeyboardFocus()`. Nichts überschreiben.

## 3. Formularfelder

| Zweck | Markup / Klasse | Wirkung |
|---|---|---|
| Standard | `<mat-form-field appearance="outline">` | Label in `--textLight` (AA auf `#f3f3f3`), Hover-Rahmen Palette 300, Label mit `padding-top: 20px` |
| Auf dunkler oder farbiger Fläche | `class="mat-form-field-bright"` | weißes Label, weißer Rahmen und Text; deaktiviert mit 80 % weiß |
| Hinweis / Fehler | `<mat-hint>`, `<mat-error>` | 90 %, `line-height: 1.5` (Umlaute werden nicht abgeschnitten), Hint in `--textLight` |
| Eigenständiges Label | `<mat-label class="mat-label-standalone">` | 90 %, `--textLight` |
| Zweite Label-Zeile | `<span class="label-secondary">` im `label` | 90 %, `--textLight` |
| Pflichtfeld-Marker | `<span class="required-marker">*</span>` | dunkleres `--colorStatusNegative` |
| Option mit Zweittext | `<mat-option>` mit `.mat-option-primary` und `.mat-option-secondary` | 90 % / 75 % |
| Autocomplete mit mehr Höhe | `class="mat-autocomplete-high"` am Panel | max. 350px |
| Datum | `es-calendar` (App) | statt eigenem `mat-datepicker`-Setup |
| Person oder Gruppe suchen | `es-authority-search-input` (App) | |
| Passwort | `es-input-password` (App) | mit Stärkeanzeige |

## 4. Auswahl

| Komponente | Klasse / Token | Wirkung |
|---|---|---|
| `mat-checkbox` | global | gesetzt: Fläche `--primary`, Häkchen in `--defaultBackground` (also hell auf primary); ungesetzt: Hintergrund `--defaultBackground`; deaktiviert-gesetzt: `--primaryBackground100`; Fokus über `setGlobalKeyboardFocus()` (`material-theme.scss:363-392, 420`) |
| Checkbox oder Radio mit Beschreibung | `es-multi-line-label` mit `slot="label"` und `slot="description"` | |
| `mat-slide-toggle` | global | Spur 48 × 26px, Griff 22px, Spur-Rand 2px, kein Schatten |
| Toggle auf farbiger Fläche | `class="mat-primary-bright"` | weißer Griff, Label weiß |
| Toggle mit Label links | Container `.toggle-reverse` | `row-reverse`, 10px Abstand |
| Toggle mit zwei Labels | Container `.mat-slide-toggle-twoside` mit `mat-label` links und rechts | |
| `mat-button-toggle-group` | global; `class="toggle-full-size"` für volle Breite | ausgewählt: Fläche `--primary`, Text Kontrastfarbe |
| `mat-chip` | global | Container `--primaryBackground100`, Entfernen-Icon `--primary` |

## 5. Tabs, Tabellen, Menüs, Sonstiges

| Komponente | Klasse / Token | Wirkung |
|---|---|---|
| `mat-tab-group` | global | Header-Fläche `--roundedContainerBackground`, Icon-Label-Abstand 10px |
| Tabs mit Schatten unter dem Header | `class="mat-tab-group-shadow"` | `materialShadowBottom()` |
| Tabs in einem Container mit internem Scroll | `flex: 1; min-height: 0` an `mat-tab-group` | `.mat-mdc-tab-body-content` scrollt |
| `mat-menu` | global | `min-height: initial`, `overflow-x: hidden` |
| `mat-sidenav` | global; Inhalt in `div.es-mat-sidenav-content` | runde Karte mit 20px Radius und Schatten, transparent |
| Tooltip | `matTooltip` | Standard; für gekürzte Titel |
| Drag & Drop (CDK) | global | Vorschau mit Radius 4px und Schatten, Platzhalter mit 50 % Deckkraft |
| `mat-progress-bar` | nur für Fortschritt mit bekanntem Wert | sonst `es-spinner` |

## 6. Wirkungslose Regeln in `material-theme.scss`

Diese Selektoren stammen aus der Zeit vor MDC (Angular Material ≤ 14) und greifen unter Material 21 nicht [A, im Browser bestätigen]. Sie werden **nicht** kopiert, und es werden keine neuen Regeln darauf aufgebaut:

`.mat-tooltip`, `.mat-tab-group.mat-dark` mit `.mat-tab-header`, `.mat-tab-labels`, `.mat-tab-label` und `.mat-ink-bar`, `.mat-table-clickable .mat-row`, `.mat-mini-fab`, `.mat-form-field .mat-button-select-arrow`, `.mat-form-field-appearance-outline .mat-form-field-prefix/-subscript-wrapper/-label-wrapper/-label`, `.mat-form-field-no-padding/-max-width .mat-form-field-wrapper`, `.mat-form-field-dark` mit `.mat-form-field-outline` und `.mat-form-field-label`, `.mat-radio-container .mat-radio-outer-circle`, `.mat-mdc-checkbox-disabled .mat-checkbox-background/-frame`, `input.mat-input-element`, `.mat-select-value`, `.mat-flat-button`, `.mat-button-no-uppercase .mat-button-wrapper`, `.mat-select-icon .mat-option-text`, `.mat-select-panel/.mat-autocomplete-panel .mat-option`, `.mat-chip-list .mat-chip.mat-standard-chip`, `mat-form-field .mat-form-field-suffix`, im Kontrastmodus `.mat-form-field-outline` und `.mat-autocomplete-panel`.

Ebenfalls nicht verwenden:

- `--mdc-*`-Tokens. Seit Material 19 heißen sie `--mat-*`, zum Beispiel `--mat-button-text-label-text-color` statt `--mdc-text-button-label-text-color`.
- `$buttonBorderRadius: 2px` (veraltet).
