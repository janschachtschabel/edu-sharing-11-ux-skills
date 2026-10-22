# Themenseiten: Aufbau, Daten, Layout, Editor

Quelle: `Frontend/src/app/pages/topic-page/**` (unten `tp/`), `ccmodel.xml`, `config/defaults/.../mds.xml` (Stand `maven/fixes/11.0`).

## Inhalt
1. Begriffe und Datenmodell
2. Varianten, Vorlagen, Profiling
3. Seitenlayout
4. Swimlanes
5. Editor (Bearbeiten-Modus)
6. Tokens, Schrift, Dark Mode, Mobil
7. Fallstricke im Bestand

## 1. Begriffe und Datenmodell

| Begriff (UI) | Code | Gespeichert als |
|---|---|---|
| Themenseite | `es-custom-topic-page` → `es-template-page` (`TemplateComponent`) | Sammlung mit Aspekt `ccm:page_ref` (`ccm:page_config_ref`, `ccm:page_config_propagate_ref`) |
| Seitenkonfiguration | Page-Config-Knoten (`ccm:map`, Aspekt `ccm:page`) | `ccm:page_config` = `{ default?, variants[] }` |
| Variante | Varianten-Knoten (`ccm:page_variant`) | `ccm:page_variant_config` = `{ structure: { swimlanes[], headerNodeId?, breadcrumbNodeId?, topicColor?, anchorItemColor? } }` |
| Abschnitt (Swimlane) | Eintrag in `swimlanes[]` | `{ id, type, heading, grid[], repeat?, backgroundColor?, backgroundShape?, backgroundShapeMirrored? }` |
| Widget | Kindknoten `WIDGET_<uuid>` der Variante | `ccm:widget_config` (JSON), optional `ccm:bapi_config` (KI) |

- **Route**: `components/topic-pages?collectionId=…&variantId=…`. Mit `openMenu=profiling|topicTree|statistics|settings` öffnet sich das Seitenmenü.
- **Vererbung**: Hat eine Sammlung keine eigene Konfiguration, gilt die der Eltern. Sie ist nur lesbar; die erste Änderung legt eine eigene Kopie an.
- **Rechte**:
  - Bearbeiten: `Write` an der Sammlung (`node-util.ts:6-8`)
  - Vorlagen und erweiterte Swimlane-Einstellungen: Admin
  - globale Vorlagen: `ACCESS_ADD_CHILDREN` am Ordner `TOPIC_PAGE_TEMPLATES`
- Rechts liegt die redaktionelle Seitenleiste (600px, 400–800px).

## 2. Varianten, Vorlagen, Profiling

- **Vorlage (Template)**:
  - Eine Variante unter `page_config_propagate_ref` mit `ccm:page_variant_is_template`, `…_template_ref` und `…_template_version`. Jede Änderung im Vorlagen-Modus erhöht die Patch-Version.
  - Vorlagen-Swimlanes können eine **`repeat`-Regel** haben (`source`, `orderBy`, `orderDescending`, `maxItems`, Platzhalter wie `${item.title}`).
- **Neue Themenseite oder Vorlage** (Dialog, mindestens 700px): Kopie von `topicPage` oder `template`, mit Suche, MDS-Filter `topic_page_variant_search` und Trefferliste.
- **Variante konfigurieren**:
  - Titel und MDS-Gruppe `topic_page_variant_configuration`.
  - Buttons: Löschen, Neu generieren (bei Update der Vorlage), globale Vorlage bearbeiten oder hinzufügen, Übernehmen.
- **Welche Variante angezeigt wird**:
  1. `variantId` aus der URL.
  2. Sonst die Variante mit den meisten Treffern zwischen Profiling-Auswahl und Varianten-Eigenschaften; bei Gleichstand die mit weniger Variablen.
  3. Sonst `default` bzw. die erste Variante.
- **Profiling**:
  - Dimensionen `ccm:educationalcontext` und `ccm:page_variant_profiling_target_group` (Lernende, Lehrende, allgemein); MDS-Gruppe `topic_page_profiling`.
  - Die Auswahl liegt im SessionStorage. Bedient wird sie über das Seitenmenü „Profiling“ mit „Zurücksetzen“ und „Übernehmen“.
  - Manuell wechseln: `mat-select` in der Breadcrumb.

## 3. Seitenlayout

- **Rahmen**: `main` als Seitenkarte (`--roundedContainerMargin`, `--borderRadiusCards`, `materialShadow`); unter 900px randlos. Variablen am Host:

  | Variable | Wert |
  |---|---|
  | `--topic-color` | Themenfarbe, Default `$primary-dark` |
  | `--anchor-item-bg-color` | `$surface` |
  | `--anchor-menu-height` | 108px |
  | `--border-radius` | **24px** |
  | `--content-max-width` | **1440px** |
  | `--offcanvas-menu-width` | 48px |
  | `--offcanvas-offset` | 8px |

- **Kopf** (`topic-header`):
  - Fläche `var(--topic-color)`, `padding: 32px 56px 32px 8px`, Inhalt höchstens 1440px breit mit Radius 24px.
  - Text und Bild im Verhältnis 5:3, `padding: 40px`; ab ≤ 800px untereinander.
  - Titel `h1`. Beschreibung höchstens 1000 Zeichen, „mehr“ ab 650.
  - Mit Sprungmenü unten 54px zusätzlich.
- **Breadcrumb**: Balken `$primary-dark` mit Text `$on-primary`, mindestens 76px hoch, mit Auswahl der Variante.
- **Inhalt**:
  - Swimlanes mit `--swimlane-gap: 32px`, `padding: 0 56px 0 8px`, höchstens 1440px breit.
  - Überschriften mit 164px seitlichem Abstand (Akkordeon 120px).
  - Container `padding: 32px 0`.
  - Akkordeon: Radius 16px, Kopf mindestens 83px hoch, `padding: 24px 32px`.
- **Raster**: 6 Spalten `minmax(0, 1fr)`, `gap: 16px`, Breiten 2/3/4/6; unter 768px alles 6.
- **Seitenmenü rechts** (`side-menu-wrapper`):
  - fixiert bei `top: calc(50% + 50px)`, `z-index` 97
  - Einträge 48px breit, Text senkrecht (`writing-mode: vertical-rl`), Radius 10px
  - Ansehen: Profiling und Themenbaum; Bearbeiten: Einstellungen der Variante
- **Filter**: verstellbare Seitenleiste mit 319px (275–619px), MDS-Gruppe `search_topic_page`; mobil als Dialog.

## 4. Swimlanes

| Typ | Darstellung |
|---|---|
| `container` | normaler Abschnitt mit Überschrift |
| `accordion` | aufklappbar, Radius 16px, Fläche `$surface-container-low` |
| `anchor` | erzeugt ein **rundes Sprungmenü** (108px, Text höchstens 3 Zeilen, Treffer-Badge) |

- **Layouts**:

  | Layout | Spalten |
  |---|---|
  | `one_column` | 6 |
  | `two_columns` | 3 + 3 |
  | `three_columns` | 2 + 2 + 2 |
  | `left_side_panel` | 2 + 4 |
  | `right_side_panel` | 4 + 2 |

- **Hintergrund**: Fläche `$surface-container-lowest`, oder eine Farbe; mit Form `None`, `Arrow`, `Flag` oder `Round` (jeweils Large/Small, gespiegelt möglich).
  - Die Formen sind SVGs mit `fill="currentColor"`.
  - Mit Form wird nur die Form gefärbt, ohne Form die Fläche.
- **Ansehen**: Leere Abschnitte und Abschnitte ohne Suchtreffer werden ausgeblendet.
- **Bearbeiten**: Rahmen 1px `$outline`, Radius 16px. Links ↑/↓ als `mini-fab` zum Verschieben (kein Drag & Drop), rechts „Einstellungen“ (`tune`) und „Löschen“.
  - Unten rechts stehen Farbe, Form und Spiegeln; Form und Spiegeln sind erst mit gesetzter Farbe aktiv.
  - Zwischen Abschnitten liegt eine Linie mit „+“-Knopf, der ein Menü Typ → Layout öffnet.
  - Einstellungsdialog: Überschrift, Typ, Reihenfolge der Kacheln (Drag & Drop), für Admins „Erweitert“ (`repeat`).

## 5. Editor (Bearbeiten-Modus)

- Umschalter „Seite bearbeiten“/„Vorschau“ in der Hauptnavigation, nach dem Erstellen-Menü. Im Bearbeiten-Modus öffnen sich alle Akkordeons.
- **Sofort speichern**, kein Verwerfen: Info-Toast „Deine Änderungen werden gespeichert.“; bei Fehler ein Toast mit „Seite neu laden“. Löschen fragt mit Ja/Nein nach.
- Dialoge mindestens 700px breit (Generic Dialog): Abschnitt bearbeiten, Löschen, Variante oder Vorlage anlegen, QR-Code, Widget einbetten.
- Hinweis-Banner für den Modus „globale Vorlage“, die Vorschau einer Variante (blättern, „Verwenden“, beenden) und den Vorlagen-Modus.
- **Farbwähler** (`es-color-picker`): Themenfarbe, Farbe des Sprungmenüs, Abschnitt, Kopf. Palette aus `collections.colors` bzw. den 12 Standard-Sammlungsfarben, dazu „keine Farbe“.

## 6. Tokens, Schrift, Dark Mode, Mobil

Rollen-Tokens in `tp/_topic-page-variables.scss`, angelehnt an M3-Rollen und auf edu-sharing-Variablen abgebildet:

| Token | Bedeutung |
|---|---|
| `$primary` | `var(--primary, #003b7c)` |
| `$primary-dark` | dunkle Primärfläche (Breadcrumb, Default-Themenfarbe) |
| `$on-primary` | Text auf Primärfläche |
| `$surface`, `$surface-container-lowest/-low/…` | Flächen → `--defaultBackground`, `--cardLightBackground`, `--backgroundColor` |
| `$on-surface`, `$outline` | Text und Rahmen |
| `$error`, `$success`, `$warn` | Status, mit Hex-Fallback |
| `$neon-default` | `#e4f700`, Hervorhebung von Suchtreffern |
| `$pink-default` | `#ec4a70` |
| `$brand-font-family` | **`'Montserrat'`**, Schrift der Themenseiten (z. B. Überschriften); nur hier, nicht im übrigen Frontend |
| Schriftgrößen | 120 / 110 / 100 / 90 % |
| `$widget-border-radius` | `var(--border-radius, 24px)` |

- Eigene CSS-Variablen: `--topic-color`, `--anchor-item-bg-color`, `--content-max-width`, `--swimlane-gap`, `--scroll-gradient-color`, `--sideMenuRightInset`, `--collection-chip-tile-bg`.
- **Dark Mode**:
  - Nutzerfarben (Abschnitt, Kopf) laufen durch `ThemeService.toDarkSurfaceColor()`: HCT-Ton 30, der Farbton bleibt.
  - Dunkle Farben bekommen `.bright-color` und damit Text `--textOnDarkSurface`.
  - Eigene `prefers-color-scheme`-Regeln gibt es nicht.
- **Mobil**: ≤ 800px eigene Overrides (Kopf untereinander, Label des Bearbeiten-Buttons weg). ≤ 900px randlos, Seitenleiste als Overlay (`z-index` 98).
- **Eingebettet** (`:host(.embedded)`): `--roundedContainerMargin: 0`, `--mainnavCurrentHeight: 0`.
- Texte: `src/assets/i18n/topic-page/*.json`, Präfix `TOPIC_PAGE.`, z. B. `TOPIC_PAGE.SIDE_MENU.EDIT_PAGE` „Seite bearbeiten“, `TOPIC_PAGE.SWIMLANE.POSITION_UP` „Abschnitt nach oben verschieben“.

## 7. Fallstricke im Bestand (nicht nachbauen)

- **Fest eingetragene Farben ohne Dark-Mode-Weg**:
  - `--scroll-gradient-color: #fff`
  - Badge `#fff` auf `$pink-default`
  - `#ccc` in Breadcrumb und Einstellungsleiste
  - Fehlerbox `#b71c1c`/`#ffcdd2`
  - Grüntöne im Einbettungsdialog
  - Kopf-Default `#FFFFFF`
  - Schatten `rgba(0,0,0,.4)`
- **Rohfarbe im Dark Mode**: Hintergrundformen und Scroll-Verlauf bekommen die Nutzerfarbe ungefiltert.
- **Höhe ohne Einheit**: `[height]="'400'"` am Themenbaum ist ungültig und wird verworfen.
- **Ungenutzte Selektoren**: `.mat-grid-tile`, `.drop-list`, `.config-selection-container`. Dazu `font-family: 'Montserrat'` fest eingetragen statt `$brand-font-family`.
- **Barrierefreiheit**:
  - Teilen und QR-Code nur mit `matTooltip`, ohne Label
  - Kachel-Löschen als `div role="button"` ohne Tastatur
  - verschachtelte Buttons in den Sammlungs-Chips
  - `lang="de"` fest gesetzt
  - „Mehr anzeigen“ ohne `aria-expanded`
  - Breadcrumb ohne `<nav>`
- **Texte**: Du- und Sie-Form gemischt, „Swimlanes“ als Wort im UI, ein Schlüssel `"undefined"`, `SAVE_CONFIG_MESSAGE` doppelt.
- **Sicherheit**: `safeUrl` umgeht die Prüfung für frei eingegebene iframe-Adressen; abgemildert durch `sandbox`.
- **Storybook**: Es gibt nur eine Story (Farbwähler). Neue Widgets sollten eine bekommen.
