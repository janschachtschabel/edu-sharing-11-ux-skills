---
name: edu-sharing-ux-build-embeds
description: Baut, ändert und prüft eingebettete edu-sharing-Oberflächen – die App und Bausteine als Web Components (edu-sharing-app, edu-sharing-topic-page, edu-sharing-generic-widget, edu-sharing-preview-sidebar, edu-sharing-actionbar), die Rendering-Komponente edu-sharing-render, einbettbare Seiten unter /components/embed (MDS-Formular, Lizenz, Widget) sowie LMS-/LTI-Abläufe (apply-to-lms, LTI) – mit den Regeln für fremde Gastseiten (kein Shadow DOM, globale Styles, helles Theme, Höhe, Overlays, postMessage). Verwenden bei Web Component, Custom Element, einbetten, Embed, iframe, Einbindung in andere Seite, Moodle, LMS, LTI, Lernplattform, WordPress, Rendering-Komponente, Widget einbetten, window.__env, Gastseite oder Host-Seite im edu-sharing- oder WirLernenOnline-Kontext.
metadata:
  owner: team-5-ui-ux
  version: 0.1.0
---
# Eingebettete edu-sharing-Oberflächen bauen

## Zweck
edu-sharing läuft nicht nur als eigene App. Es wird als Web Component, per iframe oder als Rendering-Komponente in fremde Seiten (Gastseiten) eingebunden, etwa in Lernplattformen. Dort gelten andere Regeln: Die Gastseite gehört nicht edu-sharing. Dieser Skill ergänzt `edu-sharing-ux-build-components`.

## Ablauf
1. **Einbettungsart bestimmen** ([references/embedding.md](references/embedding.md) §1):
   - ganze App oder ein Baustein als Web Component
   - Rendering-Komponente
   - iframe-Seite `/components/embed/<komponente>`
   - LMS- bzw. LTI-Ablauf
2. **Vorhandenes Element nutzen.** Die vorhandenen Custom Elements (§2) haben feste Inputs und Outputs. Wird ein neuer Baustein einbettbar, registriert man ihn über `EDU_SHARING_WEB_COMPONENTS` und baut kein eigenes Element-Bootstrapping.
3. **Gastseite einplanen**: Höhe, Hintergrund, Schrift, `z-index` von Overlays, Theme (§4). Für jede Annahme über die Gastseite festhalten, wer sie erfüllt: wir oder der Betreiber der Gastseite.
4. **Kommunikation**: Daten gehen nur auf Anforderung an die Elternseite (Events, §3). Fenster werden nur aus einer Nutzeraktion heraus geöffnet.
5. **Prüfen**:
   - in einer **leeren Testseite** (`src/web-component/index.html` als Vorbild) und in einer Gastseite mit eigenen Styles
   - hell (Standard) und mit `?theme=dark` an der URL der Gastseite
   - Tastatur und Dialoge (Gastseite wird `inert`)
   - schmale Breite
6. **Abschluss-Checkliste** abhaken.

## Verbindlich
- **Kein Shadow DOM.** Unsere globalen Styles wirken auf die Gastseite:
  - `html, body { font-family; margin }`, `body { color; background }`
  - `:root`-Variablen, `body.isDarkTheme`
  - Theme-Farben werden per `setProperty` auf `<html>` gesetzt, das Favicon wird ersetzt
  - Neue Komponenten fügen **keine weiteren** globalen Selektoren auf `html`, `body` oder `:root` hinzu. Was global sein muss (CDK-Overlays), kommt in `globals.scss`.
- **Helles Theme ist Standard**, wenn eingebettet (`isExternalContext`). Dark Mode nur über `?theme=` an der Gastseite. Ein Entwurf darf Dark Mode nicht voraussetzen.
- **Höhe**:
  - Das Element bringt keine eigene Höhe mit (`contain: content`, intern scrollend). Die Gastseite gibt die Höhe vor, und das wird dokumentiert.
  - Rendering-Komponente: Höhe über die Attribute `component_height` und `footer_height`, nicht über CSS der Gastseite.
- **Keine Hauptnavigation**, eingebettet (`mainnav=false`, `show: false`): `--mainnavHeight` ist 0. Layouts nutzen `var(--mainnavCurrentHeight)` und rechnen nie mit festen 70px. Themenseiten setzen eingebettet `--roundedContainerMargin: 0`.
- **Tiefe Links verlassen das Embed**: `render`, `collections` und `workspace` öffnen in einem **neuen Tab** auf dem Repository. Das wird sichtbar gemacht (Icon `open_in_new` und ein Label, z. B. „öffnet in neuem Tab“).
- **Fenster** nur innerhalb der Nutzeraktion öffnen (`UIHelper.getNewWindow`). Für Popup-Blocker gibt es einen Hinweis (`POPUP_BLOCKED`).
- **Overlays** (Menüs, Dialoge, Tooltips) hängen am `body` der **Gastseite**: Schrift explizit setzen, `z-index`-Konflikte einplanen. Modale Dialoge setzen alle Geschwister im `body` auf `inert` und `aria-hidden`. Dialoge deshalb sparsam und immer sauber schließen.
- **iframe-Seiten** (`/components/embed/*`):
  - Hintergrund transparent; die Gastseite muss den Kontrast liefern.
  - Kein eigenes „Speichern“: Die Elternseite holt die Werte (`EVENT_PARENT_FETCH_DATA` → `EVENT_POST_DATA`).
  - Den `title` des iframes setzt die Gastseite; das wird dokumentiert.
- **Konfiguration** nur über `window.__env` (z. B. `EDU_SHARING_API_URL`), gesetzt **vor** dem Laden der Skripte.
- **Rendering-Komponente**:
  - Fehler werden nicht als Toast gezeigt (Toast ohne Wirkung). Leer- und Fehlerzustände müssen in der Fläche selbst verständlich sein.
  - Jeder innere iframe hat `title` = Titel des Materials.
- **LTI-Abschluss**: Der Dialog lässt sich nicht wegklicken (`Closable.Disabled`) und schickt danach `lti.close` an die Elternseite.

## Spielraum
- Ob ein neuer Baustein als eigenes Custom Element, über `edu-sharing-generic-widget` oder als iframe-Seite angeboten wird. Das hängt davon ab, wie viel Isolation die Gastseite braucht (iframe: mehr Isolation, aber Höhe und Kommunikation aufwendiger).

## Nie
- Shadow DOM als selbstverständlich annehmen oder auf ungestörte Styles der Gastseite verlassen.
- Neue globale Styles auf `html`, `body` oder `:root` aus einer Komponente heraus.
- Dark Mode, Hauptnavigation, Footer oder Cookie-Banner im eingebetteten Fall voraussetzen.
- Ein Fenster nach einem `await` öffnen, ohne es vorher in der Nutzeraktion angelegt zu haben.
- Daten ungefragt per `postMessage` an `'*'` senden, außer bei den dokumentierten Abschluss-Events (LTI).
- Feste Pixelhöhen, die eine bestimmte Gastseite annehmen.

## Verweise
- Einbettungsarten, Elemente mit Inputs und Outputs, Events, was sich eingebettet ändert, Fallstricke: [references/embedding.md](references/embedding.md)
- Themenseite eingebettet: Skill `edu-sharing-ux-build-topic-pages`

## Abschluss-Checkliste
- [ ] Einbettungsart gewählt und begründet; vorhandenes Element oder Registrierung über `EDU_SHARING_WEB_COMPONENTS` genutzt
- [ ] Keine neuen globalen Styles auf `html`, `body` oder `:root`
- [ ] In einer leeren Testseite und in einer Gastseite mit eigenen Styles geprüft
- [ ] Höhe vorgegeben und dokumentiert; intern scrollend
- [ ] Hell geprüft; mit `?theme=dark` nichts kaputt
- [ ] Overlays und Dialoge: Schrift, `z-index`, Fokus-Rückgabe, Gastseite nach dem Schließen nicht mehr `inert`
- [ ] Tiefe Links als „neuer Tab“ erkennbar; Fenster nur aus Nutzeraktionen
- [ ] Leer- und Fehlerzustand sichtbar ohne Toast (Rendering)
- [ ] `window.__env` und benötigte Attribute für den Betreiber der Gastseite dokumentiert
