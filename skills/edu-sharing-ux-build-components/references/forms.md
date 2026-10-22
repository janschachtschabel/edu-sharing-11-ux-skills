# Formulare im edu-sharing-Stil

Quelle: `src/app/features/mds/**` (Metadaten-Editor), `src/app/shared/components/*` sowie die Dialog-Formulare unter `src/app/features/dialogs` (Stand `maven/fixes/11.0`).

Formulare für **Metadaten** baut man nicht selbst. Dafür gibt es den MDS-Editor (`es-mds-editor-wrapper`), den das Metadatenset (MDS) der Installation konfiguriert. Eigene Formulare für andere Eingaben folgen denselben Mustern.

## Inhalt
1. Grundregeln für Felder
2. Pflicht, Hinweis, Fehler
3. Absenden und Validierung
4. Formulare in Dialogen
5. MDS-Editor: Modi und Widgets
6. Mehrfachbearbeitung und KI-Vorschläge
7. Fertige Eingabe-Bausteine
8. Barrierefreiheit
9. Nicht als Vorbild nehmen

## 1. Grundregeln für Felder

- `mat-form-field` mit dem **globalen `appearance: 'outline'`** (`app.module.ts:107`) verwenden und nicht pro Feld überschreiben. Checkbox, Radio und Slide-Toggle haben global `color: 'primary'`.
- Felder sind 100 % breit. Zwischen Feldern `margin-bottom: 1.5em`. Der Inhalt der Outline-Felder hat `padding-top: 20px`.
- Labels nutzen `--textLight` (AA-Kontrast auf `#f3f3f3`). Auf farbiger oder dunkler Fläche: `class="mat-form-field-bright"`.
- Mehrspaltige Formulare (wie im MDS): 1, 2 oder 4 Spalten per Container-Query, mindestens 345px pro Spalte, `gap: 10px`.
- Abschnittsköpfe wie die MDS-Views: `h3`, 40px hoch, Fläche `--workspaceMetadataBackground`, fett, 110 %. Ausklappbar als `<button aria-expanded>` mit drehendem Pfeil.
- Selten gebrauchte Felder kommen hinter einen Schalter „Erweiterte Felder anzeigen“ (`mat-slide-toggle`). Sie werden nicht weggelassen.

## 2. Pflicht, Hinweis, Fehler

- **Pflichtfeld**: `<span class="required-marker" aria-hidden="true">*</span>` im `mat-label` und `[hideRequiredMarker]="true"` am Feld. Der Stern hat die Farbe von `--colorStatusNegative`, abgedunkelt.
- **Hinweis** über `<mat-hint>`, **Fehler** über `<mat-error>`. Es steht **nie beides gleichzeitig** da; der Fehler ersetzt den Hinweis. Größe `$fontSizeSmall`, `line-height: 1.5`, damit Umlaute nicht abgeschnitten werden.
- Ohne `mat-form-field` (z. B. Checkbox-Gruppe): `<label>` über dem Feld mit 5px Abstand; darunter `<p class="mat-hint subscript">` bzw. `<p class="mat-error subscript">` mit 75 %.
- Fehler erst zeigen, wenn das Feld **`touched` oder `dirty`** ist.
- **Nur für die Veröffentlichung nötig** (`mandatoryForPublish`): als **Warnung** in `--colorStatusWarning`, nicht als Fehler. Text `MDS.REQUIRED_FOR_PUBLISH_MESSAGE`.
- Texte:

  | Schlüssel | Text |
  |---|---|
  | `MDS.REQUIRED_MESSAGE` | „Pflichtfeld“ |
  | `FIELD_REQUIRED` | „Pflichtfeld“ |
  | `MDS.NO_MATCHING_VALUES` | keine Treffer bei Vorschlägen |
  | `MDS.DIFFERENT_VALUES` | „(Verschiedene Werte)“ |

## 3. Absenden und Validierung

| Formular | Muster | Vorbild |
|---|---|---|
| **kurz, ein bis zwei Felder** (Name, Ordner, Suche speichern) | Bestätigen-Button **deaktiviert**, solange die Eingabe ungültig oder leer ist | `input-dialog.component.ts:43-46`, `add-folder-dialog` |
| **lang** (Metadaten, Meldung) | Button **bleibt aktiv**. Beim Klick alle Felder als `touched` markieren, zum **ersten Fehler scrollen** und ihn **fokussieren**; jeder weitere Klick springt zum nächsten | `instance.service.ts:1575-1606` (`showMissingRequiredWidgets`), `node-report-dialog.component.ts:129-163` |

- Beim Scrollen zum Fehler werden eingeklappte Abschnitte und erweiterte Felder aufgeklappt (`scroll-margin-top: 50px`).

## 4. Formulare in Dialogen

- Aufbau: Komponente im `CardDialog`. Die Buttons setzt
  ```ts
  ref.patchConfig({ buttons: [new DialogButton('CANCEL', { color: 'standard' }, …), new DialogButton('SAVE', { color: 'primary' }, …)] })
  ```
- **Ungespeicherte Änderungen**: `closable: Closable.Confirm`.
- **Laden und Speichern**: `ref.patchState({ isLoading: true })`. Ein Spinner liegt über dem Dialog, der Inhalt ist `aria-hidden`, Schließen ist gesperrt. Lange Formulare zusätzlich `disable()`.
- **Automatisches Speichern**: `patchState({ autoSavingState: 'saving' | 'saved' | 'error' })`. Die Fußleiste zeigt `DIALOG.SAVING`/`SAVED`/`SAVING_ERROR`; während des Speicherns sind Esc und Klick daneben gesperrt. Vorbild: `accessibility-dialog.component.ts`.
- Metadaten-Dialog: `DialogsService` (`openMdsEditorDialogForNodes` u. ä.), 600–900px breit. Fortschritt „x / y Feldern ausgefüllt“ steht unten (`es-input-fill-progress`).

## 5. MDS-Editor: Modi und Widgets

`EditorMode` (`types/types.ts:132-139`):

| Modus | Wirkung |
|---|---|
| `nodes` | Bearbeiten, Mehrfachbearbeitung möglich, gibt nur geänderte Werte zurück |
| `form` | eigenständiges Formular, gibt alle Werte zurück |
| `search` | Filter: kein Pflichtstern, keine Pflichtfehler, Baum-Kinder werden mit ausgewählt; beschriftete Widgets sind `role="region"` |
| `inline` | Lesedarstellung; ein Wert wird per Klick bearbeitbar (Hover-Rahmen `--cardSeparatorLineColor`, leer „-“) |
| `viewer` | nur lesen (Detailansicht, Vorschau) |

Widget-Typ → Bedienelement (Registry `WidgetComponents` in `types/mds-types.ts`):

| MDS-Typ | Bedienelement |
|---|---|
| `text`, `number`, `email`, `date`, `month`, `color`, `textarea` | `matInput` |
| `tinyMCE` | Rich-Text-Editor |
| `checkbox` / `toggle` | `mat-checkbox` / `mat-slide-toggle` |
| `radioHorizontal`/`Vertical`, `checkboxHorizontal`/`Vertical` | `mat-radio-group` bzw. mehrere `mat-checkbox` |
| `singleoption` | `mat-select` (optional mit leerer Option) |
| `multivalueBadges`, `singlevalueSuggestBadges` | Chips (`mat-chip-grid` + `mat-autocomplete`) |
| `multivalueSuggestBadges`, `multivalueFixedBadges`, `*Tree`, `collectionTree` | Chips mit Baum-Overlay |
| `multivalueAuthorityBadges` | `es-authority-search-input` + Chips |
| `multivalueButtons` | Button-Auswahl: gewählt `mat-flat-button`, sonst `mat-stroked-button` |
| `slider`, `range` | `ngx-slider` |
| `duration` | zwei Zahlenfelder (Stunden, Minuten) |
| `vcard` | Tabs mit Feldern |
| Native: `author`, `license`, `preview`, `fileupload`, `version`, `childobjects`, `collections`, `comments`, `noderelations` | eigene Komponenten |

**Chips**:
- Enter und Komma schließen einen Eintrag ab. Bei `multivalueFixedBadges` ist keine freie Eingabe möglich; dann erscheint ein Info-Toast.
- Ein Pfeil-Button öffnet die Liste (`aria-label` `MDS.SHOW_OPTIONS_BUTTON`). Treffer sind hervorgehoben; Optionen stehen in `--primary` mit Trennlinien. Das Chip-Label ist höchstens 180px breit.

**Baum**:
- Das Chips-Feld ist höchstens 84px hoch, mit Fokus 210px.
- Das Overlay hat `role="dialog"`, 350–500px Breite und einen Fokus-Fang (`cdkTrapFocus`). Oben stehen eine Suche und „Alle“.
- Tasten: ↑/↓ wählt, ←/→ klappt zu oder auf, Leertaste wählt, Esc schließt.
- Chips lassen sich per Drag & Drop sortieren.

## 6. Mehrfachbearbeitung und KI-Vorschläge

- **Mehrere Elemente** (`nodes`):
  - Pro Feld ein Schalter „Bearbeiten“ (`MDS.BULK_EDIT`).
  - Unterschiedliche Werte zeigen den Platzhalter „(Verschiedene Werte)“.
  - Werte, die nur an einem Teil der Elemente hängen, erscheinen als gestreifte Chips (`.indeterminate`, `--primaryBackground50/100`) mit Tooltip `MDS.INDETERMINATE_NOTICE`.
  - Eine Checkbox ist dann `indeterminate`.
- **KI-Vorschläge**:
  - Banner `.ai-info` in `--aiColor` mit Text `--aiColorText` und dem Schalter „Alle generieren“.
  - Übernommene KI-Werte: Text `--aiColor` mit Schein `--aiColorChipBg`.
  - Vorschlags-Chips gestrichelt (`--aiColorChipBorder`); Zähler 16px auf `--aiColor`.
  - KI-Inhalte **nur** mit den `--aiColor*`-Tokens kennzeichnen.

## 7. Fertige Eingabe-Bausteine

| Baustein | Verhalten |
|---|---|
| `es-input-password` | Feld mit Augen-Button (`aria-label` zum Ein- und Ausblenden), optional eine Stärke-Anzeige im Hinweis (schwach / akzeptabel / mittel / stark) |
| `es-calendar` | schreibgeschütztes Feld; ein Klick öffnet einen Kalender (250px), optional mit „Zurücksetzen“. Alternative mit Fehlern pro Validator: Standard-`matDatepicker` (Vorbild `choose-date.component.html`) |
| `es-authority-search-input` | Personen oder Gruppen suchen: Label schwebt immer, Präfix `search`, Spinner; 500ms Verzögerung, unter 2 Zeichen die zuletzt Eingeladenen |
| `es-multi-line-label` | Checkbox- oder Radio-Label mit fettem Titel und Beschreibung (90 %, `--textLight`) |
| Lizenz | `es-license-details` bzw. der Lizenzdialog; nicht nachbauen |

## 8. Barrierefreiheit

- Jedes Feld hat ein sichtbares `mat-label`. Ein Platzhalter allein reicht nicht.
- Gruppen (Radio, mehrere Checkboxen): `role="group"` + `aria-labelledby` + `aria-describedby` (Hinweis), oder `fieldset`/`legend` (Vorbild `license-dialog-content.component.html:14`).
- **Fehler mit dem Feld verknüpfen**: `mat-error` erledigt das selbst. Bei eigenen `p.mat-error` außerhalb von `mat-form-field` `aria-describedby` auf den Fehler setzen; der MDS-Container tut das heute nicht.
- Nach dem Absenden den Fokus auf das erste fehlerhafte Feld setzen (siehe 3.).
- Eigene Auswahl-Buttons brauchen `aria-pressed`. Klickbare Werte (Inline-Bearbeitung) brauchen `tabindex="0"` und eine Rolle.
- Laden und automatisches Speichern über `aria-live` ansagen. Das `aria-live`-Element muss **vorher** im DOM stehen, nicht erst mit dem Text erzeugt werden.

## 9. Nicht als Vorbild nehmen

- `core-ui-module/styles/mds.scss` (`.mdsGroup`, `.mdsCard`, `.materialize-textarea` …) gehört zu einem entfernten `es-mds` und enthält Farbliterale.
- Selektoren aus der Zeit vor MDC im MDS-Container (`.mat-form-field-invalid.warn .mat-form-field-label`). Die orange Warn-Optik für `mandatoryForPublish` greift deshalb vermutlich nicht mehr.
- Fest eingetragene Farben: Rahmen der Abschnittsköpfe `#999`/`#eee`, Fortschrittsbalken `#777`/`#aaa`, Passwortstärke `#ff9800`/`#37a574`. Der Pflichtstern ist zur Compile-Zeit abgedunkelt und kippt deshalb im Dark Mode nicht.
- Hart eingetragener deutscher Text „Auswahl bearbeiten“ im Baum-Widget.
