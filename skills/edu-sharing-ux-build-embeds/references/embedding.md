# Einbettung: Arten, Elemente, Events, Fallstricke

Quelle: `Frontend/src/web-component`, `src/app/web-components`, `src/app/main/web-component*.ts`, `pages/embed-page`, `pages/apply-to-lms-page`, `pages/lti-page`, `projects/rendering-service-web-component`, `projects/rendering-service-lib`, `angular.json` (Stand `maven/fixes/11.0`).

## Inhalt
1. Einbettungsarten
2. Web Components (Custom Elements)
3. iframe-Seiten und Events
4. Was sich eingebettet ändert
5. Rendering-Komponente `edu-sharing-render`
6. LMS und LTI
7. Fallstricke und Lücken

## 1. Einbettungsarten

| Art | Wie | Wofür | Isolation |
|---|---|---|---|
| **Web Component (App-Build)** | Build-Ziel `web-component` → `dist/web-components/app`, Aufruf `npm run build:app-as-component`; Skripte (runtime, polyfills, scripts, main) und `styles.css` einbinden, vorher `window.__env` setzen | ganze Suche oder einzelne Bausteine in fremden Seiten | keine (kein Shadow DOM) |
| **Rendering-Komponente** | Projekt `rendering-service` → `dist/web-components/rendering-service`, `deployUrl` statt `base href` | ein Material darstellen (z. B. in einer Lernplattform) | keine; nur öffentliche Daten |
| **iframe-Seite** | `/edu-sharing/components/embed/<komponente>` | Formulare (Metadaten, Lizenz) und Widgets in fremden Oberflächen | voll (iframe) |
| **LMS-Ablauf** | `components/apply-to-lms/:repo/:node`, `upload`, `components/lti` | Material in eine Lernplattform übernehmen, hochladen, LTI abschließen | Fenster oder iframe der Lernplattform |

`projects/embed` (Route `qr`) ist ein ungenutztes Gerüst; der Ordner `qr/` fehlt.

## 2. Web Components (Custom Elements)

Registriert in `app.web-component.module.ts:28-45`. Attribute werden in dash-case geschrieben (`context-node-id`, `collection-id`). Outputs kommen als DOM-Events an.

| Element | Inputs | Outputs |
|---|---|---|
| `edu-sharing-app` | `search-string`, `ticket` | – |
| `edu-sharing-topic-page` | `collection-id`, `variant-id`, `custom-url`, `custom-url-target`, `show-breadcrumb`, `show-sidebar`, `navigate-in-place`, `preview-panel` | `topicChanged` |
| `edu-sharing-generic-widget` | `context-node-id`, `widget-type`, `config-overwrite`, `edit-mode`, `height`, `display-limit`, `custom-url`, `custom-url-target`, `search-text` … | `itemClickedEvent`, `searchHitsChanged`, `totalSearchResultCountChanged`, `visibleNodesChanged` |
| `edu-sharing-preview-sidebar` | `node`, `custom-options`, `editor-mode`, `group-id`, `show-sticky-bar` | `closed` |
| `edu-sharing-actionbar` | `options` (als JS-Property), `appearance`, `background-type`, `dropdown-position`, `mobile-breakpoint` | – |
| `edu-sharing-spinner` | – | – |

**`edu-sharing-app` im Detail:**

- Rendert die ganze App (`<es-app>`) inklusive Navigation, Cookie-Hinweis und Dialogen.
- Startet auf `/components/search?mainnav=false&q=…`. Mit `ticket` erfolgt die Anmeldung über ein Ticket.
- Die Adresse der Gastseite bleibt unverändert (`WebComponentLocationStrategy`).
- `render`, `collections` und `workspace` öffnen in einem **neuen Tab** auf dem Repository.

Weitere Punkte:

- **Eigene Elemente** ergänzt man über den Token `EDU_SHARING_WEB_COMPONENTS` (`web-component.service.ts:10-34`).
- **Layout**: `:host { display: flex; contain: content }`, Inhalt mit `overflow: auto`. Die Gastseite gibt die Höhe vor (README: `style="height: 100vh"`).

## 3. iframe-Seiten und Events

`/components/embed/:component` (`embed-page.component.ts`):

| `component` | Inhalt | Parameter |
|---|---|---|
| `mds` | `es-mds-editor-wrapper` eingebettet, Modus `form` | `group` (Default `io`), `set` (Default `DEFAULT`), `data` (JSON) |
| `license` | Lizenzauswahl (`es-license-dialog-content`) | `data` |
| `generic-widget` | Widget einer Themenseite | `contextNodeId`, `widgetType`, `editMode=true` |

- Navigation aus, Cookie-Hinweis aus, `html, body` mit transparentem Hintergrund und `overflow-x: hidden`.
- **Datenaustausch**: Die Elternseite sendet `EVENT_PARENT_FETCH_DATA`, die Seite antwortet mit `EVENT_POST_DATA` und den Werten. Es gibt keinen eigenen Speichern-Button.
- Weitere Events an die Elternseite, die der Code verwendet: `EVENT_VIEW_OPENED` (bei jedem Seitenwechsel), `EVENT_APPLY_NODE`, `EVENT_SHARED`, `EVENT_REFRESH`, `EVENT_UPLOAD_CANCELED`, `EVENT_NODE_FOLDER_OPENED`, `EVENT_SESSION_TIMEOUT`, `EVENT_PARENT_SEARCH`, `EVENT_GLOBAL_SEARCH`, `EVENT_APPLY_FILTER`.
- **Unklar**, weil `FrameEventsService` im Download fehlt: Zeichenketten der Events, Ziel-Origin und ob die Höhe automatisch gemeldet wird.

## 4. Was sich eingebettet ändert

| Thema | Verhalten |
|---|---|
| Theme | `isExternalContext` (Web Component oder Pfad `/components/embed`): immer **hell**, außer `?theme=auto\|dark\|light` an der **Gastseiten-URL** |
| Farben | `--primary` usw. per `setProperty` auf `<html>` der Gastseite; das Favicon wird ersetzt |
| Navigation | `mainnav=false` (gilt für die Bereiche `login`, `search`, `collections`) bzw. `show: false` → `--mainnavHeight: 0px` |
| Themenseite | `:host(.embedded)`: `--roundedContainerMargin: 0`, `--mainnavCurrentHeight: 0`, `contain: layout` |
| Globale Styles | dieselben wie in der App: `html, body { font-family … !important; margin: 0 }`, `body { color; background }`, `:root`-Variablen, Schriften und Icons aus `fonts.scss` |
| Overlays | CDK-Overlay-Container am `body` der Gastseite; `z-index` unverändert (CDK-Default); `.es-edge-toggle-pane` hat `z-index` 100 |
| Dialoge | Fokus-Fang; **alle Geschwister im `body` der Gastseite** werden `aria-hidden` und `inert` und danach wiederhergestellt |
| `uiConfig.isEmbedded` | nur in der Rendering-Komponente gesetzt; wirkt nur auf `theme-color` und den Proxy für Entwicklung |
| Assets | `assetsBasePath` (Konfiguration der UI-Bibliothek) |

## 5. Rendering-Komponente `edu-sharing-render`

- **Inputs**:
  - `encoded_node`, `signature`, `signature_algorithm` (Default `SHA512withRSA`), `jwt`, `render_url`
  - `display_mode` (`inline` | `full`)
  - `assets_url`, `resource_url`, `preview_url`
  - `component_height`, `footer_height` (Default 100), `target_blank`
- **Inhalt**: `rs-root`. Mit `inline` kommt eine Metadatenzeile dazu: Titel-Link, Autorinnen und Autoren, Lizenz-Icon und Info-Button. Der Info-Button öffnet ein Overlay mit `es-mds-viewer`, höchstens 300px hoch.
- **Höhe**: `--containerHeight = component_height − footer_height`, gesetzt am **Host**. So bekommen mehrere Instanzen auf einer Seite eigene Höhen.
- **Kontext**:
  - `withCredentials: false`, also nur öffentliche Daten
  - kein Nutzerprofil
  - **Toast ohne Wirkung**: Fehler bleiben unsichtbar, wenn die Fläche sie nicht selbst zeigt
- **Module**:
  - PDF und Dokumente laufen über `rs-module-pdf-iframe`. Das braucht die CSP-Nonce der Gastseite und reicht `--containerHeight` in den iframe weiter.
  - Moodle zeigt nur das Vorschaubild.
- **Styles**: `material-theme`, `overlay-prebuilt.css`, `fonts.scss`, `extension-web-component.scss` (zuletzt). `:host { contain: content }`; die Schrift ist auch auf `.cdk-overlay-container` gesetzt.
- Das Beispiel `example/index.html` nutzt `node_id`. Das ist veraltet, kein Input.

## 6. LMS und LTI

- **Übernehmen in die Lernplattform** (`components/apply-to-lms/:repo/:node`):
  - Sichtbar ist nur ein Spinner. Fehlt `reurl`, erscheint „No reurl received“.
  - Mit `reurl=IFRAME|WINDOW` folgt `EVENT_APPLY_NODE` mit den Daten des Knotens (inkl. `ccrep://`-URL), danach `history.back()`.
  - `reurl` bleibt über alle Navigationen erhalten.
- **Upload aus der Lernplattform** (`upload`): öffnet direkt den Dialog „Objekt hinzufügen“. Abbruch → `EVENT_UPLOAD_CANCELED` und `window.close()`.
- **LTI** (`components/lti`):
  - Navigation aus; Generic Dialog mit `Closable.Disabled` und OK.
  - Danach `postMessage({ subject: 'org.imsglobal.lti.close' }, '*')` an `opener` bzw. `parent`.

## 7. Fallstricke und Lücken

- `theme-color`-Meta: Der Schutz `!isEmbedded` greift im App-Build nicht, weil `isEmbedded` dort `false` bleibt. Der Code fängt das mit `?.` ab.
- Das Favicon wird ohne Null-Prüfung im `<head>` der Gastseite ersetzt.
- `embed-page`: `data` wird ohne `try/catch` als JSON gelesen; `configOverwrite` wird nie gesetzt.
- Für den äußeren iframe (`/components/embed`) setzt das Repo keinen `title`. Das muss die Gastseite tun.
- Ob der Cookie-Hinweis im Web Component erscheint, ist unklar.
- Im Download fehlt `src/app/core-module` (`FrameEventsService`): Event-Namen, Origin und automatische Höhe sind ungeklärt.
