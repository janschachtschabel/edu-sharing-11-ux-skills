# Seitenlayouts: Navigation, Suche, Sammlungen, Arbeitsbereich

Quelle: `Frontend/src/app/main/navigation/…`, `pages/search-page`, `pages/collections-page`, `pages/workspace-page` (Stand `maven/fixes/11.0`). Die Werte sind Code-Defaults. Was eine Installation per Konfiguration ändert (z. B. WLO), steht jeweils dabei und gesammelt in Abschnitt 6.

Neue Seiten bauen **keine eigene Navigation**. Sie fügen sich in diesen Rahmen ein (siehe `layout-patterns.md`).

## Inhalt
1. Hauptnavigation (`es-main-nav`, `es-top-bar`)
2. Untere Mobilleiste (`es-main-menu-bottom`)
3. Suchseite
4. Sammlungsseite
5. Arbeitsbereich (Workspace)
6. Was die Konfiguration bestimmt
7. Detailansicht eines Materials (Render-Seite)
8. Vorschau-Seitenleiste
9. Startseite (Dashboard)
10. Redaktionsseite
11. Hochladen und Erstellen
12. Login, Profil, Fehler- und Ladeseite
13. Gemeinsame Muster

## 1. Hauptnavigation

- Aufbau: `es-skip-nav`, `es-banner` (optional), dann `es-top-bar` mit dem eingesetzten `es-search-field`. Die Leiste ist `sticky` oben mit `z-index` `$topBarZIndex` (98).
- Fläche: `.main-bar`, Höhe **70px**, Hintergrund `--workspaceTopBarBackground` (Default **#383838**, dunkel), Schrift `--workspaceTopBarFontColor` (#fff).
  - Im Dark-Mode-Block wird die Fläche nicht überschrieben.
  - Auf der Startseite gilt `--landingPageTopBarBackground`, im Safe-Bereich `--workspaceTopBarSafeBackground` (#963a3a).
  - Installationen ändern Fläche und Farben über Branding bzw. `customCSS`. WLO zeigt die Leiste z. B. ohne eigene dunkle Fläche.
- `--mainnavHeight` wird **zur Laufzeit gemessen**: Höhe der Leiste plus eventuelle Systemmeldung, `0px` wenn ausgeblendet. Für Layout immer `var(--mainnavCurrentHeight)` nutzen, nie 70px fest eintragen.

Elemente von links nach rechts:

| Element | Aussehen |
|---|---|
| Bereichsknopf | Logo (`mainnav.icon.url`, Default `edu-white.svg`, 35px breit), Name des Bereichs (auf der Suche „Suchumgebung“ = `SEARCH.TITLE`), Pfeil (`keyboard_arrow_down` bei Menüstil `dropdown`, `keyboard_arrow_right` bei `sidebar`); 250px breit |
| „Neu“ | Button mit Icon `add` und Label `WORKSPACE.ADD`; Höhe 40px, Radius 0, Fläche = Schriftfarbe mit 8 % Deckkraft (`--workspaceTopBarNewAlpha`); öffnet das Erstellen-Menü (mobil als Bottom Sheet) |
| Suchfeld | siehe unten; `flex: auto`, höchstens 550px |
| rechts | Logout-Timer (Safe), Slot `BeforeUserMenu`, Impressum/Datenschutz (nur ohne Footer), Chat-Button (nur mobil), **Dark-Mode-Umschalter** (`mat-icon-button`, `dark_mode`/`light_mode`, wechselt nur hell ↔ dunkel), Benachrichtigungen, **Nutzer-Button** (`es-user-avatar size="small"`, Name max. 160px, `keyboard_arrow_down`; Menü als `es-dropdown`, mobil als Bottom Sheet) |

**Suchfeld** (`es-search-field`):

- Form: **Rechteck** mit Radius 3px, Höhe 40px, Fläche `--workspaceTopBarInputBackground` (#eee / dunkel #333). Fokusring `--topBarSearchFocusColor`.
- Von links nach rechts:
  1. optional ein Filter-Button `filter_list` mit `matBadge` (Anzahl aktiver Filter); nur auf der Suchseite und nicht in der Ansicht „Alle“
  2. das Eingabefeld (Platzhalter `SEARCH.SEARCH_STUFF` = „Suchen ...“)
  3. `clear`, nur wenn ein Wert eingegeben ist; unter 400px ausgeblendet
  4. `search` als Absenden ganz rechts
- Unter dem Feld erscheint ein Overlay: aktive Filter als entfernbare `mat-chip-option` und Vorschläge aus den Facetten.

**Hauptmenü:**

- Gesteuert über `mainnav.mainMenuStyle`. Default ist `sidebar`.
- Die Seitenleiste ist links fixiert, 300px breit, auf `--workspaceTreeBackground` und mit Abdunklung. Inhalt: Profilkopf, Menüeinträge, Link „Lizenzinformationen“.

**Mobil:**

- Ab ≤ 900px fällt der Bereichsknopf weg (stattdessen der Bereichsname, nur ohne Suchfeld). Das Impressum wird ausgeblendet, der Chat-Button eingeblendet.
- Unter 800px werden die Labels ausgeblendet, unter 600px auch Nutzername und Pfeil.
- Die Leiste bleibt beim Scrollen stehen. Die untere Leiste blendet sich beim Scrollen aus (`.mobile-move-bottom`).

## 2. Untere Mobilleiste (`es-main-menu-bottom`)

- Nur ≤ 900px, `position: fixed; bottom: 0`. Höhe 62px (`$mobileTabNavHeight`), Fläche `--backgroundColor` mit Schatten.
- **Dieselben Einträge wie das Hauptmenü** (`MainMenuEntriesService`):
  - Start (`home`), nicht für Gäste
  - Arbeitsbereich (`cloud`)
  - Suche (`search`)
  - Sammlungen (`layers`)
  - Aufgaben (`assignment`)
  - Redaktionsvorschläge
  - Stream (nur wenn aktiviert)
  - Login (nur für Gäste)
  - Safe, Rechte und Admin nie mobil
- Label: Schlüssel `SIDEBAR.<NAME>_SHORT`: Start, Workspace, Suche, Sammlungen, Aufgaben, Prüfen (Redaktionsvorschläge), Stream, Login, (Safe, Konten, Admin nur Desktop). Icon über dem Label, Label 9pt in `--textLight`.
- **Aktiver Eintrag:** Farbe `--primary`, oben ein 4px-Balken `--primary`, Label fett.
- Konfiguration: `hideMainMenu` blendet Bereiche aus, `menuEntries` ergänzt eigene Einträge.

## 3. Suchseite

Von oben nach unten:

1. `h1` „Suchumgebung“, nur für Screenreader.
2. Lade-Fortschritt `mat-progress-bar`, absolut oben.
3. **Repository-Tabs** (`mat-tab-nav-bar`):
   - nur bei **mehr als einem** Repository
   - „Alle“ (`SEARCH.REPOSITORY_ALL`), dann je Repository ein Tab mit 32px-Icon (rund) und Titel
   - 72px hoch, Kartenfläche, Schatten unten
4. Bereich mit grauem Seitenhintergrund. Links die **Filter-Seitenleiste** (falls offen), daneben die Ergebniskarte `.main-content` (`roundedContainerCard`).
5. `es-footer`.

**Filter-Seitenleiste** (`es-search-page-filters-sidebar`):

- Eigene runde Karte, in der Breite verstellbar: Default 319px (`searchFilterBarWidth`), 269–619px.
- **Standard geschlossen**:
  - Geöffnet wird sie über den Filter-Button im Suchfeld oder über `es-edge-toggle` (runder 46px-Knopf am Rand, nicht mobil, nicht in „Alle“).
  - `searchSidenavMode`: `never` (Default), `always`, `auto` (nur Desktop).
  - Der Zustand bleibt in der Sitzung erhalten.
- Kopf 72px mit „Filter“ und Button „zurücksetzen“ (Icon `undo`).
- Inhalt:
  1. Button „Gespeicherte Suchen“ (stroked, primary)
  2. optional die Auswahl des MDS
  3. Filterfelder aus dem MDS (`es-mds-editor-wrapper`, `groupId="ngsearch"`). Welche Filter es gibt, bestimmt also das MDS der Installation.
- Filter-Leiste und redaktionelle Seitenleiste (rechts, `mat-sidenav`, 600px) schließen sich gegenseitig aus.
- **Mobil ≤ 900px:** Die Filter öffnen als **Dialog** mit Titel „Filter“, Untertitel „n Ergebnis(se)“ und mindestens 350px Breite.

**Ergebniskarte** (Scroll-Bereich mit 25px seitlichem Polster):

1. Optional ein Banner „In Sammlung hinzufügen“ bzw. eine Primäraktion.
2. **Sammlungen-Leiste**:
   - Überschrift „Sammlungen (n)“, darunter `es-node-entries-wrapper` in `SmallGrid` mit `gridConfig.layout: 'scroll'`, also ein horizontaler Streifen ohne Checkbox, mit Pfeil-Buttons am Rand.
   - Nur im eigenen Repository, ausgeblendet bei 0 Treffern.
   - Reihenfolge: angepinnte zuerst, dann nach Änderungsdatum.
3. **Materialien**:
   - Überschriften „Sammlungen (n)“ und „Materialien (n)“: groß (ca. 150 %), normales Gewicht, `--textLight` (Screenshot der Default-Installation); Tag im Code `h2` bzw. Titel-Slot von `es-node-entries-wrapper`.
   - Kopfzeile: links „Materialien“ mit der Trefferzahl **in Klammern** („Materialien (402677)“; beim Laden ein 24px-Spinner statt der Zahl).
   - Rechts in der Kopfzeile, laut Screenshot in dieser Reihenfolge: Icon-Button „Alle auswählen“, Icon-Button Ansicht (`list`), dann der Sortier-Button (z. B. „Relevanz ↓“). Im Detail:
     - **Sortier-Button** (`mat-button color="primary"`, Text = Spaltenname, z. B. „zuletzt geändert“, Pfeil `arrow_upward`/`arrow_downward`, öffnet ein Menü)
     - die `es-actionbar` nur mit Toggles: **Ansicht umschalten** als **einzelner** `mat-icon-button` (Icon `list` in Grid, `view_module` in Table) und „Alle auswählen“ (`select_all`/`deselect`, nur in Grid)
   - Darunter das Raster: Default ist **Grid** (Aufbau der Kachel in `node-entries-anatomy.md`).
   - Leerzustand: Such-Icon 60px und „Die Suchanfrage ergab keinen Treffer.“, zentriert.
4. **Auswahl-Leiste** (bei Auswahl):
   - Fester Fuß **unten in der Karte**, außerhalb des Scroll-Bereichs, mindestens 72px hoch, Schatten oben.
   - Inhalt: Schließen, „{{count}} ausgewählt“ (Textbutton in Primärfarbe; öffnet nach oben eine Übersicht der Auswahl), dann `es-actionbar`.
   - Welche Optionen die Actionbar zeigt, berechnet `OptionsHelperService` für den Scope `Search` aus Rechten und Konfiguration (z. B. Merkliste `OPTIONS.ADD_NODE_STORE`, Herunterladen, In Sammlung). Eine feste Liste gibt es nicht; für Mockups 2 Optionen plus „Mehr“.

**Ansicht „Alle“:** je Repository ein horizontaler Streifen mit „Titel (n)“ und dem Link „Mehr anzeigen“.

## 4. Sammlungsseite

**Startebene (ohne Sammlung):**

- Tabs (`mat-tab-group`, gestreckt, Icon und Label, 72px hoch):
  - Meine (`person`) und Eingeladen (`group`), beide nicht für Gäste
  - Redaktionelle (`star`), wenn vorhanden
  - Medienzentrum (`domain`)
  - Öffentlich (`language`)
- Inhalt mit `padding: 0 10%`, ohne Seitenleiste.

**In einer Sammlung:** zweispaltig, `grid-template-columns: 250px auto`.

- **Links** die Infospalte `es-collection-info-bar`, scrollt für sich. Fläche ist die Sammlungsfarbe. Von oben nach unten:
  1. Bild auf unscharfem Hintergrund, sonst `layers` im Kreis
  2. Aktionen als runde Icons, 2 immer sichtbar
  3. `h1`-Titel
  4. „n Untersammlungen“ und „n Materialien“
  5. Ersteller (`person`)
  6. Freigabestatus mit Icon
  7. Metadaten (`es-mds-viewer`, `groupId="collection_sidebar"`)
  8. Rechte (Avatare) und Aufrufe, nur mit Berechtigung
- **Rechts**:
  - fester Kopf mit `es-breadcrumbs`, 72px, Kartenfläche, Schatten
  - darunter scrollt `es-collection-content` mit Abschnitten untereinander, **ohne Tabs**:
    1. Untersammlungen (`SmallGrid`, Global-Option „anlegen“)
    2. Vorschläge (`es-collection-proposals`)
    3. „Materialien“ (Default Grid, Toggle-Actionbar)
- Auswahl-Leiste unten über die volle Breite, wie bei der Suche.
- Rechts optional die redaktionelle Seitenleiste (`mat-sidenav`, 600px). `es-edge-toggle` gibt es nur dort.
- **Mobil ≤ 700px:** einspaltig. Brotkrumen als Overlay (90 % weiß, Unschärfe). Infozeilen, Beschreibung und Rechte werden ausgeblendet.

## 5. Arbeitsbereich (Workspace)

- Karte `.frame` (`roundedContainerCard`) mit fester Höhe.
- Kopfzeile 72px (`$workspaceBreadcrumbsHeight`): Brotkrumen links, `es-actionbar` rechts mit Verlauf.
- Links der Ordnerbaum, 300px breit (`$workspaceTreeWidth`), Fläche `--workspaceTreeBackground`, Speicherplatzanzeige unten; mobil ausgeblendet.
- Mitte `es-workspace-explorer`. Rechts die redaktionelle Seitenleiste (`mat-sidenav`, 600px).
- Auswahl-Leiste unten, mindestens 72px.

## 6. Was die Konfiguration bestimmt (`client.config`, Schema `Values.java`)

| Schlüssel | Wirkung | Default |
|---|---|---|
| `themeColors`, `customCSS` | Farben und Optik, z. B. Fläche der Navigation | Default-Farben |
| `mainnav.mainMenuStyle` | Hauptmenü `sidebar` oder `dropdown` | `sidebar` |
| `mainnav.icon.url` | Logo | `assets/images/edu-white.svg` |
| `hideMainMenu`, `menuEntries` | Menü- und Mobilleisten-Einträge | alle Standardeinträge |
| `searchSidenavMode` | Filterleiste offen: `never` / `always` / `auto` | `never` |
| `searchFilterBarWidth` | Startbreite der Filterleiste | 319 |
| `availableRepositories`, `availableMds` | Repository-Tabs, MDS-Auswahl | alle |
| `searchPreviewMode` | Vorschau als `Sidebar` oder `RenderingPage` | `Sidebar` |
| `banner` | Banner über der Navigation | keins |
| `stream.enabled` | Menüeintrag Stream | aus |

Nicht im Repo ablesbar, nur an der Installation selbst:

- Welche Metadaten auf Kacheln und als Filter erscheinen (MDS der Installation)
- Logo, Menüeinträge, eigenes CSS
- Ob es Repository-Tabs, redaktionelle Sammlungen oder Medienzentren gibt
- Inhalte der Erweiterungs-Slots (`MainScopeButton`, `BeforeUserMenu`, `BelowTopBar`, `resultsTop`, `filterBarBottom`, `belowTabs`, `breadcrumbs`)

## 7. Detailansicht eines Materials (Render-Seite)

- Die Route `render/:node` führt auf eine Weiche. Sie lädt **render2** (aktuell, wenn das Backend Rendering Service 2 meldet) oder **legacy** als Rückfall. Mit `?renderer=legacy|render2` lässt sich die Variante erzwingen.
- **render2**: Die Hauptnavigation ist ausgeblendet. Rechts liegt die redaktionelle Seitenleiste (`mat-sidenav`, 600px, verstellbar). In der Mitte steht `es-render-wrapper-component` als Seitenkarte (`roundedContainerCard` und `roundedContainerStaticScroll`).
  1. **Kopfzeile** (fest), 3 Spalten auf `--backgroundColor`:
     - „Zurück“ (`mat-button`, mindestens 200px; unter 700px nur ein Icon von 50px)
     - Titel als `h1`, zentriert, 110 %, mit Info-Button, der zu den Metadaten scrollt
     - `es-actionbar` mit 1 sichtbaren Option (mobil 0)
  2. **Scrollbereich**: Fehler als `es-info-message mode="error"`; Leiste der Serienobjekte (Vorschauen 100 × 75px, Auswahl mit 3px-Rahmen `--primaryBackground300`); Laden über `es-spinner`.
  3. **Darstellung** (`rs-root`, Rendering Service 2), Breite je Typ, unter 700px jeweils 90 %:

     | Typ | Breite |
     |---|---|
     | HTML, H5P, PDF, Dokument | 70 % |
     | Video | 50 % |
     | Audio | 70 % |
     | Bild, Link | 50–60 % |

  4. **Metadaten**: `es-mds-editor-wrapper` im Modus `viewer` mit der MDS-Gruppe `io_render`, mehrspaltig. Die Gruppen sind Karten mit Radius 5px.
  5. **Fuß**: `es-imprint-privacy`.
- Verwendungen und Versionen öffnet man über die Seitenleiste. Vor/Zurück zwischen Materialien gibt es auf render2 nicht, nur in der Vorschau-Seitenleiste.

## 8. Vorschau-Seitenleiste (aus Suche und Sammlungen)

- Gesteuert über `searchPreviewMode`: Mit `Sidebar` (Default) öffnet ein Klick auf eine Kachel die **Vorschau rechts**; mit `RenderingPage` geht es direkt zur Detailansicht.
- Rahmen `es-editorial-sidebar`:
  - Kopf 72px: Zurück, `h2` mit 140 %, Vollbild-Umschalter (nur Desktop), Schließen.
  - Fläche `--roundedContainerBackground`. Unter 900px wird sie zum Mobil-Modal (`mobileModalOverlay`).
- Inhalt der Vorschau, von oben nach unten:
  1. Vorschaubild (Höhe `--previewHeight`) mit dem Button „Anzeigen“ in der Mitte (Radius 18px, weißer Rahmen 3px); ein Klick zeigt das Material direkt dort an.
  2. Bereich mit `padding: 15px`: Statistik und Bewertung links, `es-actionbar appearance="icon-button"` rechts.
  3. Metadaten aus der MDS-Gruppe `preview_sidebar`.
  4. Leiste unten fest, mindestens 72px: „Vorherige“ | „Alle Details“ (`mat-stroked-button`, zur Detailansicht) | „Nächste“. Im Bearbeitungsmodus steht dort nur „Speichern“.
- Ohne gewählte Option zeigt die Seitenleiste eine Optionsliste: Zeilen mit `padding: 16px 20px`, Icon 30px, Titel fett, Beschreibung zweizeilig in `--textLight`, Hover `--primaryBackground50`.

## 9. Startseite (Dashboard, Route `landing`)

- Navigation mit eigener Variante: `--landingPageTopBarBackground` und verwandte Tokens. Das Suchfeld hat keine Filter; eine Suche führt zur Suchseite.
- Von oben nach unten auf `--defaultBackground`:
  1. **Schnellzugriffe** (`es-shortcut-entries`):
     - Container `--landingPageShortcutBackground`, Kacheln 124 × 124px mit Radius 8px auf `--landingPageShortcutTileBackground` (Default Palette 700) und Schrift `--landingPageShortcutTileFontColor`.
     - Icon 48px; Titel zweizeilig, klein, fett.
     - Die Kachel „Neu“ ist gestrichelt. Bei Überlauf kommen eine Ausblend-Kante und „Aufklappen“ dazu.
     - Konfiguration `frontpage.dashboard.shortcuts` (`maxEntries`, Default 4).
  2. **Swimlanes** im Wechsel auf `--backgroundColor` und `--backgroundOddColor`. Konfiguration `frontpage.dashboard.swimlanes`. Standard:

     | Swimlane | Darstellung |
     |---|---|
     | Sammlungen | SmallGrid |
     | Letzte Aktivitäten | Stream-Spalten |
     | Aufgaben | SmallGrid mit „Neue Aufgabe“ |
     | Mediathek | Grid |
     | Letzte Freigaben | Stream-Spalten |

     - Jede Swimlane hat einen aufklappbaren Kopf: `h2.mat-heading-3`, zentriert (unter 900px links), Pfeil rechts. Der Zustand wird gespeichert, Inhalte laden erst beim Aufklappen.
     - Inhalt: `gridConfig { layout: 'scroll', maxRows: 1 }`, höchstens 25 Elemente, „Alle anzeigen“ rechts. Spalten aus der MDS-Liste `swimlane_<id>`.
     - Leer: „Keine Elemente verfügbar“.
  3. `es-footer`.

## 10. Redaktionsseite (Route `editorial/:modus`)

- Modi `activity`, `share`, `assignment`, `suggestions`. Die Seite scrollt nie im Body; die Höhe ist `100vh - --mainnavCurrentHeight`.
- **Links** die Filter (`esResizableSidenav`, verstellbar): Kopf „Filter“ 72px, Inhalt MDS im Modus `search` mit `padding: 20px`.
- **Rechts** die redaktionelle Seitenleiste (600px) mit Optionen wie „Einsortieren“, „Inhalte verwalten“ (`es-nodes-selector` mit Tabs Suche, Methodik, Sammlungen, Arbeitsbereich, Upload), Abgabe und Aufgabe.
- **Mitte** die Seitenkarte:
  1. Kopf 72px: Brotkrumen „Start › Modus › Pfad“ und eine Actionbar nur mit Toggles
  2. ein fester `mat-tab-group` (Tabs 60px)
  3. die Liste `es-node-entries-wrapper`; leer: `EDITORIAL.<MODUS>.EMPTY`
  4. bei Auswahl die Auswahl-Leiste unten (72px)
- **Mobil unter 900px**: Filter und Seitenleiste werden Mobil-Modals.
- **Verstellbare Seitenleiste** (`esResizableSidenav`):
  - Breite zwischen `max(400px, 20 %)` und `min(800px, 50 %)`, gespeichert pro Seite.
  - Griff `.es-sidenav-resizer` mit `role="separator"`; Tastatur: Pfeile ±10px, mit Shift ±50px, Pos1/Ende.

## 11. Hochladen und Erstellen

- **Erstellen-Menü** („Neu“ in der Navigation), Optionen nach Priorität: Einfügen, Neue Sammlung, Material aus Suche, **Objekt hinzufügen** (`cloud_upload`), Konnektoren, Kamera, LTI-Tools, eigene Optionen, Neuer Ordner.
- Dateien lassen sich auch ins Fenster ziehen. Dann erscheint eine Vollbild-Ablagezone mit `cloud_upload`, ist das Ablegen nicht erlaubt, `cloud_off`.
- **Dialogkette**:
  1. „Objekt hinzufügen“ (600px breit, mindestens 700px hoch): Ablageort, Ablagezone bzw. Dateiliste, Speicherplatz, Trennlinie „oder“, Link-Feld mit Vorschau und Warnung bei Dubletten, LTI-Umschalter.
  2. Fortschritt beim Hochladen (700px, nicht schließbar).
  3. optional der Lizenzdialog (`licenseDialogOnUpload`)
  4. Metadaten nach `upload.postDialog`: `SimpleEdit` (Default, 600px), `Mds` (600–900px) oder `None`.
- Die Route `upload` (z. B. aus einer Lernplattform) öffnet direkt diesen Dialog.

## 12. Login, Profil, Fehler- und Ladeseite

- **Login**:
  - `es-card` zentriert, 600px breit, mit Anbieterauswahl 900px; maximiert, wenn der Viewport zu schmal ist.
  - Inhalt: Logo 100px hoch (eigene Dark-Variante), dann zweispaltig Anbieterauswahl und Formular, darunter `es-powered-by`.
- **Profil**:
  - Vollbild-Hintergrundbild, darauf eine Karte von 480px (unter 900px 100 %).
  - Kopf in der Autoritätsfarbe mit Avatar, Name und E-Mail, darunter Statistik und „Über mich“.
  - Aufklappbereiche: Persistente IDs, Passwort, Datenexport.
- **Fehlerseite** (`error/:code`, unbekannte Routen ergeben 404):
  - Fläche fest `#444`, Text weiß.
  - Illustration `404.svg`, `500.svg` oder `invalid.svg` links, rechts `h1` und `h2` sowie der Link „Zur Suche“.
  - Texte aus `MESSAGES.<code>`.
- **Ladebildschirm** (`es-loading-screen`): Vollbild `#444`, animiertes Logo, `z-index` 140.

## 13. Gemeinsame Muster

| Muster | Werte | Einsatz |
|---|---|---|
| Sekundärleiste | 72px (`$secondaryBarHeight`) | Kopf von Seitenleisten, Filterkopf, Tabs, Auswahl-Leiste, feste Leiste der Vorschau |
| Seitenkarte | `roundedContainerCard` (+ `roundedContainerStaticScroll`) | Suche, Sammlungen, Arbeitsbereich, Redaktion, Detailansicht |
| Seitenleiste rechts | `mat-sidenav` 600px, `esResizableSidenav`, Breite je Seite gespeichert | Suche, Sammlungen, Redaktion, Detailansicht |
| Mobil-Modal | `mobileModalOverlay` unter 900px | redaktionelle Seitenleiste, Filter |
| Modale Karte | `CardDialog` bzw. `es-card` mit benannten Breiten von 400–1200px | Login, Upload, alle Dialoge |
| Vollbild dunkel | `#444` | Fehlerseite, Ladebildschirm |
| Fußzeile | `es-footer` bzw. `es-imprint-privacy` | Suche, Sammlungen, Startseite, Detailansicht |

**Offen**: Was der Rendering Service 2 (`rs-root`) selbst anzeigt (Lizenz, Kommentare, Verwandtes), und welche Felder die MDS-Gruppen `io_render`, `preview_sidebar` und `swimlane_<id>` enthalten. Beides hängt vom MDS der Installation ab.
