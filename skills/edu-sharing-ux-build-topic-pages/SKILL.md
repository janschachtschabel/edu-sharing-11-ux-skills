---
name: edu-sharing-ux-build-topic-pages
description: Baut, ändert und prüft Themenseiten im edu-sharing-Frontend (topic-page) – Seitenvarianten und Vorlagen (Templates), Swimlanes (Container, Akkordeon, Sprungmarken) mit Layouts und Hintergrundformen, Widgets (Inhalts-Teaser, Sammlungs-Chips, Text, KI-Text, iframe, Medien, Themenbaum, Kopfbereich, Breadcrumb, Profiling) und neue eigene Widgets – nach DESIGN.md und den Rollen-Tokens der Themenseiten. Verwenden bei Themenseite, Topic Page, Fachportal-Seite, Seitenvorlage, Template, Seitenvariante, Profiling, Zielgruppe, Swimlane, Abschnitt, Akkordeon, Sprungmenü, Anker, Widget, Teaser, Inhalts-Teaser, Sammlungs-Chips, Themenbaum, Header der Themenseite, Seite bearbeiten oder edu-sharing-topic-page im edu-sharing- oder WirLernenOnline-Kontext.
metadata:
  owner: team-5-ui-ux
  version: 0.1.0
---
# Themenseiten bauen

## Zweck
Themenseiten (`src/app/pages/topic-page/`) sind redaktionell gestaltete Seiten zu einer Sammlung. Sie bestehen aus Swimlanes und Widgets und haben eigene Layout- und Farbregeln. Dieser Skill ergänzt `edu-sharing-ux-build-components`; dessen allgemeine Regeln (Tokens, `esIcon`, Fokus, i18n) gelten weiter.

## Ablauf
1. **Ebene bestimmen.** Geht es um die Struktur (Variante, Vorlage, Swimlane), um ein vorhandenes Widget oder um ein neues Widget? Grundlage: [references/topic-page-architecture.md](references/topic-page-architecture.md).
2. **Vorhandenes prüfen.** Die Widget-Liste in [references/widgets.md](references/widgets.md) durchsehen. Oft reicht ein neues Layout eines vorhandenen Widgets, z. B. `contentTeaserLayout`, statt eines neuen Widgets.
3. **Neues Widget**: genau nach den Schritten in `widgets.md` §3 anlegen (`WIDGETS`, Config-Interface, `WidgetComponentInterface`, Lazy-Import, i18n).
4. **Stylen** mit den Rollen-Tokens aus `_topic-page-variables.scss` (`$primary`, `$surface…`, `$on-surface`, `$outline`) bzw. den CSS-Variablen aus DESIGN.md. Breite und Umbruch per **Container Query**, weil ein Widget 2, 3, 4 oder 6 von 6 Spalten breit sein kann.
5. **Zustände**: Laden (`es-spinner`, solange nicht `initialized`), leer (`es-info-message mode="info"`), nicht verfügbar (`mode="warning"`); dazu Bearbeiten und Ansehen.
6. **Texte** unter `TOPIC_PAGE.WIDGET.<NAME>.` in `src/assets/i18n/topic-page/{de,en,fr,it}.json` (Skill `edu-sharing-ux-write-copy`).
7. **Prüfen**:
   - `lint-design-rules.mjs` (Skill `edu-sharing-ux-build-components`)
   - Bearbeiten und Ansehen, hell und dunkel, mit eigener Themenfarbe
   - Breiten 2/6 und 6/6, Mobil (≤ 800px)
   - eingebettet als `edu-sharing-topic-page`
8. **Abschluss-Checkliste** abhaken und in der Antwort wiedergeben.

## Verbindlich
- **Speichern**: Es gibt kein „Speichern/Verwerfen“. Jede Änderung wird sofort gespeichert:
  - Struktur über `savePageVariantConfig`
  - Widget-Konfiguration nur über `configChanged` und `retrieveWidgetConfig()`, **nie direkt über die Node-API**
  - Nach jeder Änderung erscheint der Info-Toast „Änderungen werden gespeichert“; bei Fehlern ein Toast mit „Seite neu laden“.
- **Kopf des Widgets** (Überschrift, Beschreibung, KI-Kennzeichnung) rendert `es-generic-widget-header`. Ein Widget rendert ihn nicht selbst.
- **Einstellungen im Bearbeiten-Modus** nur über `es-widget-configuration-buttons`: Pillen-Leiste, Layout-Umschalter jeweils mit `ariaLabel`, Einbetten über `embedConfigurationOption`.
- **Layout-Varianten** als `LayoutOption[]` mit `ariaLabel`, `icon` und `viewValue`; Texte unter `TOPIC_PAGE.WIDGET.LAYOUT.*`.
- **Farben**:
  - Nur Rollen-Tokens bzw. CSS-Variablen, keine Hex-Werte.
  - Nutzerfarben (Themenfarbe, Swimlane, Kopf) im Dark Mode über `ThemeService.toDarkSurfaceColor()` leiten.
  - Text auf dunkler Nutzerfarbe über `.bright-color` → `--textOnDarkSurface`.
- **Raster**: 6 Spalten, `gap: 16px`. Widgets sind 2, 3, 4 oder 6 Spalten breit; unter 768px immer 6. Swimlane-Layouts: `one_column`, `two_columns`, `three_columns`, `left_side_panel`, `right_side_panel`.
- **Abhängigkeiten von Funktionen des Servers** filtern: KI-Text nur mit KI-Unterstützung, Medien nur mit Rendering Service 2.
- **Externe Inhalte** (iframe): nur mit Bestätigungsseite, `sandbox`, `loading="lazy"` und einem **übersetzten** `title`.
- **Rechte**: Bearbeiten nur mit `Write` an der Sammlung. Vorlagen und erweiterte Swimlane-Einstellungen nur für Admins. Vererbte Seiten sind nur lesbar; die erste Änderung erzeugt eine eigene Kopie.
- **Barrierefreiheit**:
  - Icon-only-Buttons mit `aria-label` oder `matTooltip` + `tooltipAriaLabel`.
  - Keine verschachtelten Buttons.
  - Listen und Bäume mit Rolle und `aria-selected`; Vorbild ist der Themenbaum.
  - Die Breadcrumb in einem `<nav>`.

## Spielraum
- Anordnung innerhalb eines Widgets, solange Kopf, Einstellungsleiste und Zustände den Mustern folgen.
- Wahl von Swimlane-Typ, Layout, Hintergrundform und Farbe ist redaktionelle Entscheidung; der Code bietet die Optionen nur an.

## Nie
- Ein Widget statisch importieren oder außerhalb von `WIDGETS` / `registerCustomWidget` registrieren.
- Ein eigenes „Speichern“ in einem Widget.
- Hex-Werte, `#fff`-Verläufe oder Schatten mit festen Werten (im Bestand mehrfach vorhanden; siehe `topic-page-architecture.md` §7).
- `font-family: 'Montserrat'` fest eintragen. Die Schrift kommt über `$brand-font-family`.
- Fachjargon in UI-Texten („Swimlane“ heißt für Nutzende „Abschnitt“). Du- und Sie-Form nicht im selben Bereich mischen.
- `bypassSecurityTrust…` für frei eingegebene URLs ohne `sandbox` und Bestätigung.
- Höhen ohne Einheit an `style.height` binden (der Bug `'400'` im Themenbaum).

## Verweise
- Begriffe, Datenmodell, Varianten und Vorlagen, Layout, Swimlanes, Editor, Tokens, Dark Mode, Fallstricke: [references/topic-page-architecture.md](references/topic-page-architecture.md)
- Alle Widgets mit Konfiguration, Optik und Zuständen; Anleitung für neue Widgets: [references/widgets.md](references/widgets.md)
- Einbetten als `edu-sharing-topic-page` / `edu-sharing-generic-widget`: Skill `edu-sharing-ux-build-embeds`

## Abschluss-Checkliste
- [ ] Vorhandenes Widget oder Layout geprüft; ein neues Widget ist begründet
- [ ] Neues Widget: `WIDGETS`, Config-Interface (`extends BaseWidgetConfig`), `WidgetComponentInterface`, Lazy-Import, i18n de/en/fr/it
- [ ] Gespeichert wird nur über `configChanged`; kein eigenes Speichern
- [ ] Zustände: Laden, leer, nicht verfügbar, Bearbeiten und Ansehen
- [ ] Container Query; geprüft bei 2/6 und 6/6 sowie bei ≤ 800px
- [ ] Nur Rollen-Tokens bzw. CSS-Variablen; Nutzerfarben dunkel über `toDarkSurfaceColor`
- [ ] Icon-only-Buttons mit Label; keine verschachtelten Buttons; Tastatur geprüft
- [ ] Lint auf neuen Zeilen: 0 FEHLER
- [ ] Eingebettet (`edu-sharing-topic-page`) geprüft: ohne Hauptnavigation, Rand 0
