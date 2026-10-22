# Regeln aus Code ableiten (wenn es kein Figma gibt)

Erprobt am edu-sharing-Frontend (Angular 21, Angular Material 21, `angular-material-css-vars`).

## Was lesen, in dieser Reihenfolge

| Quelle | Wonach suchen | Wird zu |
|---|---|---|
| Vorhandene `AGENTS.md`/`CLAUDE.md` | bereits formulierte Regeln, Fallstricke | Rohfassung; auf Aktualität prüfen |
| Token-Datei (`variables.scss`, `:root`, Dark-Block) | Name, Hell-Wert, Dunkel-Wert, Kommentar zum Zweck | DESIGN.md-Tokens + `tokens.md` |
| Theme-Setup (`material-theme.scss`, Theme-Service) | Default-Farben, Typografie, Branding-Mechanismus | Leitbild, Kernregeln „kein eigenes Theme“ |
| Mixins | Muster für Schatten, Fokus, Layout | `mixins.md` |
| Statische SCSS-Variablen | Breakpoints, feste Höhen, z-Index | `tokens.md` (Layout) |
| Komponentenbibliothek (`index.ts`, Module) | Selektoren, Inputs, Varianten | `building-blocks.md` |
| **Templates und SCSS der Kernkomponenten** (Kachel, Liste, Tabelle, Dialog, Navigation, Suchfeld) | Aufbau von oben nach unten, Maße, Zustände, Fokus-Mixin | `node-entries-anatomy.md`, `component-specs.md` |
| **Templates der Hauptseiten** (Suche, Sammlungen, Arbeitsbereich) und Konfigurationsschema (`Values.java`) | Seitenaufbau, Defaults, was die Konfiguration steuert | `page-layouts.md` |
| **Alle Seiten-Ordner** (`src/app/pages/*`), **Seitensysteme mit eigenem Editor** (z. B. Themenseiten mit Vorlagen und Widgets) und **eigene Variablen-Dateien** darin | eigene Tokens und Schriften, eigene Registry, eigene Regeln | eigener Skill (z. B. `edu-sharing-ux-build-topic-pages`) |
| **Web-Component- und Embed-Builds** (`angular.json`-Ziele, `projects/*`, Custom Elements) | Einbettungsarten, globale Styles, Theme, Events | eigener Skill (z. B. `edu-sharing-ux-build-embeds`) |
| **Formular-Systeme** (z. B. MDS-Editor) | Feldmuster, Validierung, Fehler, Mehrfachbearbeitung | `forms.md` |
| Storybook | vorhandene Stories, Theme-Wrapper | Prüfweg in der Checkliste |
| i18n-Dateien | Anrede, Gendern, generische Schlüssel, Begriffe (zählen) | `ux-copy.md` |
| Häufigkeiten per grep | `@if` vs. `*ngIf`, `mat-icon` vs. eigene Direktive, Farbliterale | Baseline und Anti-Patterns |

> Lehre aus dem Mockup-Test: Tokens und Mixins allein reichen nicht. Ein Agent kannte jede Farbe und jeden Radius, wusste aber nicht, wie eine Kachel oder die Suchseite aufgebaut ist, und hat sie falsch erfunden. Den Aufbau der 5–10 wichtigsten Komponenten und Seiten deshalb immer mit aus den Templates ableiten und mit einem Mockup-Test in einer sauberen Sitzung prüfen.

## Prüfen, bevor etwas zur Regel wird

1. **Wirkt es noch?** Selektoren aus älteren Framework-Versionen (bei Angular Material z. B. Klassen ohne `-mdc-`) und umbenannte Tokens (`--mdc-*` → `--mat-*`) werden aussortiert.
2. **Ist es Bestand oder Vorbild?** Wenn 200 Dateien Hex-Farben nutzen, ist das Bestand und keine Regel. Die Regel kommt aus den Kommentaren und Tokens.
3. **Gibt es den Wert wirklich?** Jeder Token, jede Komponente und jeder i18n-Schlüssel, der in einem Skill steht, wird per grep bestätigt.
4. **Kontrast messen.** Alle Text-Flächen-Paare werden berechnet, in Light und Dark. Bestehende Verstöße landen als Befund in der Arbeitsnotiz, nicht als Regel.
5. **Widerspruch zum Auftrag?** Beispiel: Der Auftrag sagt „Material Design 3“, der Code nutzt M2-Typografie. Beides gegenüberstellen und Team 5 fragen.

## Laufende Instanz messen

Nicht alles steht im Code: Branding-Farben kommen aus der Konfiguration der Installation, und echte Größen entstehen erst im Browser. Erprobt auf `suche.staging.openeduhub.net`:

- **Branding**: `GET /edu-sharing/rest/config/v1/values` liefert `themeColors` (WLO: primary `#003b7c`, accent `#e4f700`, Footer-Farben). Diese Werte mit `contrast.mjs` gegen alle Flächen rechnen. So fiel auf, dass die WLO-Akzentfarbe auf Weiß nur 1,19:1 hat.
- **Größen**: Bounding-Boxes aller Bedienelemente per JS auslesen (Skript im A11y-Skill, `checklist.md` Abschnitt 7). Ergebnis bei WLO: Icon-Button 40px statt der angenommenen 48px. Die Messung hat damit eine Annahme widerlegt.
- Nur lesend arbeiten: keine Formulare absenden, nichts speichern.

## Skalen aus Häufigkeiten ableiten

Wenn der Code keine Skala hat (z. B. für Abstände): alle Werte einer Eigenschaftsgruppe (padding/margin/gap) zählen und Kandidaten-Skalen nach Abdeckung vergleichen, exakt und mit ±2px. Bei edu-sharing deckt das 5px-Raster 65 % exakt bzw. 95 % ab, das 4/8-Raster nur 25 % bzw. 76 %. Gewählt wird die Skala, die den Ist-Stand am besten trifft, nicht die modischste.

## Baseline aus dem Bestand

Ein Lint-Skript, das die geplanten „Nie“-Regeln prüft, wird über den bestehenden Code laufen gelassen. Die Zahlen zeigen, was ein Agent aus dem Nachbarcode lernen würde, und sie liefern die Begründung für die Regeln.
