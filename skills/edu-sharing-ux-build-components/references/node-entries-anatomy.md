# Aufbau von Kacheln, Listen und Tabellen (`es-node-entries-wrapper`)

Quelle: `projects/edu-sharing-ui/src/lib/node-entries/…` (Stand `maven/fixes/11.0`). Die Zahlen sind Ist-Werte aus dem SCSS.

Neue Listen oder Kacheln **bauen diese Optik nicht nach**. Sie nutzen `es-node-entries-wrapper`. Diese Datei dient dazu, sie zu beschreiben (Handoff, Review, Mockup) und Varianten passend anzulegen (`#overlay`, `#customCard`, `#actionArea`).

## Inhalt
1. Grid-Kachel (`displayType: Grid`)
2. Zustände der Kachel
3. Sammlungs-Kachel
4. SmallGrid-Kachel
5. Kachelraster
6. Tabelle
7. Metadaten-Zeilen, Lizenz, Datum
8. Badges, Vorschaubild, Bewertung

## 1. Grid-Kachel (`es-node-entries-card`), von oben nach unten

| Teil | Inhalt | Maße und Tokens |
|---|---|---|
| **Container** | CSS-Grid mit den Zeilen 40px, auto, auto | Hintergrund `--backgroundElevatedColor` (#fafafa / dunkel #242424); Schatten `materialShadowBottom()`; **kein Radius**, denn `--borderRadiusCards` gilt für Seitencontainer, nicht für Kacheln; Übergang `--transitionNormal` |
| **1 Kopfleiste** | 1. Typ-Badge (Kreis mit Icon, schiebt den Rest nach rechts), 2. Pin bei angehefteten Sammlungen, 3. Kommentar-Pille (auch bei 0) und ggf. Zähler der Teilobjekte, 4. **Checkbox ganz rechts**, nur wenn die Liste Auswahl erlaubt | Höhe 40px, `padding: 0 20px`, `gap: 15px`; Fläche `color-mix(in srgb, var(--primary), var(--textWhite) 80%)`, also 20 % Primärfarbe, im Dark Mode auf Schwarz |
| **2 Vorschaubild** | `es-preview-image` über die volle Breite; das Bild steht mittig (`contain`) vor einer **unscharfen Kopie** seiner selbst (`blurImage(15px)`) | Höhe 150px |
| **3 Titel** | erste Meta-Zeile; **linksbündig**, höchstens 2 Zeilen mit „…“ (`limitLineCount(2, 1.4)`) | Schrift etwa 144 % (120 % × 120 %), `--textMain`; Gewicht nicht gesetzt |
| **4 Metadaten-Zeilen** | je Zeile links ein Label, rechts der Wert (siehe 7.) | Meta-Bereich `padding: 10px 20px 0`; Zeile mit Mindesthöhe 2.8em und `gap: 5px`; Label 85 % in `--textLight`; Wert rechtsbündig in `--textBlack`, höchstens 3 Zeilen |
| **5 Optionsleiste** | links die Bewertung (falls aktiv), rechts Optionen mit `showAlways` und `more_vert` (`mat-icon-button color="primary"`) | Trennlinie oben `1px solid var(--tableSeperatorLineColor)`; Mindesthöhe 40px; Options-Buttons rund, Hover und Fokus `--backgroundColor` |

- Klickfläche: Bei `DefaultActionLink` umschließt `es-node-url mode="wrapper"` Bild und Metadaten. Bei `Emitter` ist es ein `button` mit Ripple.
- Weitere Aktionen stehen **nicht direkt auf der Kachel**, sondern im Menü `more_vert`. Auf dem Desktop öffnet es ein `matMenu`, mobil ein Bottom Sheet; Rechtsklick und die Kontextmenü-Taste öffnen es ebenfalls. Direkt sichtbar sind nur Optionen mit `showAlways`.
- Kontrastmodus: zusätzlich 1px Rahmen mit 42 % `--textBlack`.
- Virtueller, noch nicht gespeicherter Knoten: `outline: 2px dashed var(--nodeVirtualColor)`.

## 2. Zustände der Kachel

| Zustand | Darstellung |
|---|---|
| Hover | nur mit `singleClickHint: 'dynamic'`: Zeiger als Hand, Schatten `materialShadowMediumLarge(false, .2)`, Fläche `--primaryBackground50` |
| Ausgewählt | Fläche `--primaryBackground50` und gesetzte Checkbox; die Kopfleiste behält ihre eigene Fläche (20 % Primärfarbe); **kein Rahmen, kein Balken**. Der linke 5-px-Balken (`--listItemSelectedBackgroundEffect`) gehört zur **Tabelle**, nicht zur Kachel |
| Tastaturfokus | `setGlobalKeyboardFocus()` auf dem Titel-Link (2px `--focusColor`, Offset 2px); Checkbox im Modus `'border'` |
| Laden | `es-spinner` im Raster (eingebaut) |
| Leer | `<ng-template #empty>` der aufrufenden Seite |

## 3. Sammlungs-Kachel

- Ganze Kachel, Kopfleiste und Bildbereich erhalten die Sammlungsfarbe (`node.collection.color`).
- Metadaten und Optionen liegen auf `--color-readable-overlay` (hell weiß 80 %, dunkel schwarz 60 %).
- Typ-Badge zeigt die Sichtbarkeit statt des Medientyps: `lock` privat, `group` geteilt, `language` öffentlich, `star` redaktionell, `business` Medienzentrum.
- Ohne eigenes Bild: Icon `layers` in einem halbtransparent weißen Kreis.
- Metadaten-Zeile `info`: `layers` mit Anzahl der Untersammlungen und `insert_drive_file` mit Anzahl der Inhalte.

## 4. SmallGrid-Kachel (`es-node-entries-card-small`)

- **Keine Kopfleiste**, also kein Typ-Badge und keine Kommentar-Pille.
- Bild 100px hoch. Die Checkbox liegt absolut oben rechts im Bild auf einem halbtransparent weißen Kreis.
- Metadaten auf `--defaultBackground`: Der Titel spannt über 2 Spalten, die Zeilen 2 und 3 stehen nebeneinander (85 %, einzeilig). **Ohne Labels.**
- Optionen: bis zu 3 `showAsAction`-Optionen rechtsbündig, nur wenn Listen-Optionen vorhanden sind.
- Breite wie im Grid: Mindestbreite `--cardWidth` (270px), wächst mit `1fr`.
- **Sammlung als SmallGrid** (Screenshot Default-Installation, Sammlungs-Streifen der Suche):
  - oben die Bildfläche (100px) in der Sammlungsfarbe mit `layers`-Icon im hellen Kreis
  - darunter Titel (ca. 120 %, bis 2 Zeilen) auf einer hellen Tönung der Sammlungsfarbe
  - unten links die Zähler (`layers` n, `insert_drive_file` n), rechts das Sichtbarkeits-Icon (`lock`, `language`, `business` …)
- Scroll-Pfeile des Streifens: runder `mat-icon-button` mit `keyboard_arrow_right`/`left` am Rand über einem Verlauf zu `--es-node-entries-scroll-gradient-color`.

## 5. Kachelraster (`es-node-entries-card-grid`)

- Spalten: `repeat(auto-fill, minmax(var(--cardWidth), 1fr))` mit `--cardWidth` 270px. **Die Kacheln wachsen** und füllen die Breite.
  - Abstand 20px in beiden Richtungen.
  - Die Themenseite setzt `--cardWidth` auf 314px.
- `gridConfig.maxRows` begrenzt die Zeilen. `layout: 'scroll'` ergibt einen horizontalen Streifen mit Scroll-Snap und eigener Scrollbar; „Mehr laden“ ist die letzte Kachel.
- Scroll-Helfer links und rechts:
  - Verlauf zu `--es-node-entries-scroll-gradient-color` (#fff / dunkel #262626). Seiten überschreiben ihn passend zu ihrem Hintergrund.
  - Darauf ein runder Pfeil-Button mit Hintergrund `--backgroundColor`.
- Drag & Drop:
  - erlaubt: Icon `add_circle_outline` oder `archive` in `--colorStatusPositive`
  - gesperrt: `cancel` in `--colorStatusNegative` auf unscharfem Hintergrund

## 6. Tabelle (`displayType: Table`)

| Spalte | Breite / Inhalt |
|---|---|
| `select` | 58px, Checkbox |
| `icon` | 85px, Typ-Icon in einem 36-px-Kreis mit Hintergrund `--backgroundColor`; die Kopfzeile zeigt „(ausgewählt / gesamt)“ |
| Primärspalte (Titel) | mindestens 30 % |
| weitere Daten | je 145px |
| `actions` | 58px, immer `more_vert` |

- Zeilenhöhe über `$nodeEntriesTableRowHeight` (58px). Text einzeilig mit „…“, Tooltip bei Überlauf.
- Kopfzeile in `--textMediumLight`. Sie entfällt mit `tableConfig.headers = false`. Sortiert wird über `matSort`.
- Ausgewählt: `--listItemSelectedBackgroundEffect` (5px Primärbalken links plus helle Tönung). Hover nur bei `singleClickHint: 'dynamic'`.
- Fokus: `setGlobalKeyboardFocus('border')`.
- `showAsAction` und `numberOfAlwaysVisibleOptions` wirken hier **nicht**. Aktionen laufen über `more_vert` und die Actionbar.

## 7. Metadaten-Zeilen, Lizenz, Datum

- Welche Zeilen erscheinen, bestimmt das **MDS der Installation** (`<lists>` in `mds.xml`, gelesen über `MdsHelperService.getColumns`). Ohne eigenes MDS gilt der Standard für `search` und `collectionReferences`:
  1. Titel
  2. „zuletzt geändert“ (`cm:modified`)
  3. „Lizenz“ (`ccm:commonlicense_key`)
  4. „Herkunft“ (`ccm:replicationsource`, als Logo der Quelle)
- Die Labels kommen aus `NODE.<property>` (Pipe `esListItemLabel`).
- **Lizenz**:
  - Darstellung als **CC-Symbol-Bild**, 20px hoch, mit Tooltip und `alt` = Lizenzname.
  - Mit der Nutzereinstellung `indicatorIcons = false` und in der Tabelle als Text (`LICENSE.NAMES.*`).
  - Die OER-Badge-Farben (`--licenseOerBadgeBackground`) erscheinen **nicht** auf Kacheln, sondern im Lizenzdialog.
- **Datum** (`formatDate` mit Uhrzeit und relativer Angabe):

  | Abstand | Anzeige |
  |---|---|
  | unter 6 Stunden | „Gerade eben“ / „Vor N Minuten“ / „Vor N Stunden“ |
  | heute | „Heute, 14:05“ |
  | gestern | „Gestern, 12:41“ |
  | unter 6 Tagen | „Vor N Tagen, 12:41“ |
  | sonst | „21.10.2026, 12:41“ |

## 8. Badges, Vorschaubild, Bewertung

| Baustein | Aussehen |
|---|---|
| `es-node-type-badge` | Kreis von etwa 28px: `padding: 5px`, Hintergrund `--backgroundColor`, Schatten `materialShadow()`; Icon 18px in `--palette-primary-600` (**dokumentierte Ausnahme** von DESIGN.md Regel 3 im Bestand; kippt im Dark Mode nicht. Neue Bausteine nutzen `--primaryForeground800`). Bild-Icons je Dateityp (PDF rot, Word blau, Video grün) kommen als SVG aus `esNodeIcon` (Medientyp über `esNodeIcon`, Tooltip mit Typ). Im Dark Mode werden Bild-Icons über `--invertSvgFilter` invertiert |
| `es-node-stats-badges` | Pille mit Radius 15px, mindestens 35 × 22px, `padding: 2px 8px`, Hintergrund `--color-readable-overlay`; Icon `comment` 12px mit Zahl |
| `es-node-rating` | nur mit Toolpermission `RATE_READ` und aktivem Bewertungsmodus (Standard `none`). `stars`: 5 Icon-Buttons mit 18px, Farbe `--textLight`, aktiv `--colorStarActive`, dahinter „(Anzahl)“. `likes`: `edu-thumb_up` mit Zähler |
| `es-preview-image` | Bild `contain` auf schwarzem Grund mit unscharfer Kopie. Ohne Vorschaurecht: Fläche `--backgroundColor`. Icon-Vorschau: Fläche `--primaryBackground100`, Icon 35px in einem Kreis mit `--backgroundColor`. Videos laufen nur bei Hover oder Fokus |

## Auffälligkeiten im Code (an Team 6 gemeldet, nicht nachbauen)

- `.card-top-bar-collection-color` enthält den Tippfehler `tranperant` und ist dadurch vermutlich wirkungslos.
- `showRatings` wird ohne `async` geprüft. Die Optionsleiste erscheint deshalb immer.
- Hover und Auswahl nutzen `rgb(var(--primaryBackground50))`. Ob das gültig ist, hängt vom Format der Palettenvariable ab; im Browser prüfen.
