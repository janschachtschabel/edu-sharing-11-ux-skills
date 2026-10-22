# Vorhandene Bausteine

Vor jedem Neubau hier nachsehen. Pfade sind relativ zu `Frontend/`.

- **LIB** steht für `projects/edu-sharing-ui/src/lib/` (npm `ngx-edu-sharing-ui`). Alles ist über `index.ts` exportiert.
- **APP** steht für `src/app/`.

## Inhalt
1. Was suche ich? (Begriff → Baustein)
2. Lib-Komponenten
3. Node-Entries (Kacheln, Listen, Tabellen, Baum)
4. Direktiven und Pipes
5. App-Bausteine
6. Dialoge
7. Toast und Fortschritt
8. Lib oder App?

## 1. Begriff → Baustein

| Gesucht | Baustein |
|---|---|
| Kachel, Card, Suchergebnis, Trefferliste, Materialliste, Sammlungsinhalt | `es-node-entries-wrapper` mit `displayType` |
| Einzelne Material-Zeile | `es-node-row` |
| Vorschaubild | `es-preview-image` |
| Bewertung, Typ-Badge, Statistik-Badges | `es-node-rating`, `es-node-type-badge`, `es-node-stats-badges` |
| Link oder Button zu einem Material | `es-node-url` (`mode`: link, button, wrapper) |
| Aktionen zu einer Auswahl | `es-actionbar` + `OptionItem[]` |
| Kontextmenü, Drei-Punkte-Menü | `es-dropdown` |
| Sortierung | `es-sort-dropdown` |
| Hinweis, Warnung, Fehlerbox im Inhalt | `es-info-message` |
| Laden (Bereich) | `es-spinner` |
| Laden (inline, Button, Baumknoten) | `es-spinner-small` (`diameter`) |
| Laden (blockierend, ganze Seite) | `toast.showProgressSpinner()` oder `<es-global-progress>` |
| Person oder Gruppe anzeigen | `es-user-avatar` |
| Person oder Gruppe suchen | `es-authority-search-input` |
| Metadaten anzeigen | `es-mds-viewer` |
| Metadaten bearbeiten | MDS-Editor (`src/app/features/mds`) |
| Brotkrumen | `es-breadcrumbs` |
| Datum | `es-calendar` |
| Passwort | `es-input-password` |
| Checkbox/Radio mit Beschreibung | `es-multi-line-label` |
| Link-Optik ohne Button | `es-mat-link` |
| Sidebar auf/zu | `es-edge-toggle` |
| Auswahl anzeigen | `es-search-selection-overlay` |
| Sammlung wählen | `es-collection-chooser` |
| Banner „In Sammlung einfügen“ | `es-small-collection` (kein Karussell) |
| Sammlungs-Streifen / Karussell | `es-node-entries-wrapper` mit `SmallGrid` und `gridConfig: { layout: 'scroll' }` |
| „Neu anlegen“-Kachel im Raster | `globalOptions` von `es-node-entries-wrapper` (rendert `es-node-entries-global-options`, gestrichelte Kachel) |
| Dialog | `DialogsService` (siehe 6.) |
| Rückmeldung | `Toast` (siehe 7.) |
| Icon | `<i esIcon>` (siehe 4.) |

## 2. Lib-Komponenten

| Selektor | Wichtige Inputs / Outputs |
|---|---|
| `es-actionbar` | `options: OptionItem[]`; `numberOfAlwaysVisibleOptions=2` (mobil 1); `showCaptions: 'auto' \| true \| false \| 'ifRoom'`; `appearance: 'round' \| 'button' \| 'icon-button'`; `backgroundType: 'bright' \| 'dark' \| 'primary'`; `style: 'default' \| 'flat'`; `highlight: 'first' \| 'last' \| 'manual' \| 'none'`; `showToggleOptions`, `showActionOptions`, `showDisabled`, `dropdownPosition` |
| `es-dropdown` | `options`, `callbackObjects: Node[]`, `position`, `showDisabled`, `menuClass`. Von außen öffnen: `[matMenuTriggerFor]="ref.menu"`. Mobil: `ref.triggerBottomSheet()` |
| `es-info-message` | `message` (i18n-Schlüssel, wird intern übersetzt), `mode: 'info' \| 'warning' \| 'error'`, `closable`; `<ng-content>` für eigenen Inhalt |
| `es-spinner` | keine Inputs; enthält `aria-live="polite"` mit `LOADING` |
| `es-spinner-small` | `diameter=20` |
| `es-user-avatar` | `user`, `size: 'xxsmall' … 'large'`, `link`, `icon`, `customImage` |
| `es-sort-dropdown` | `columns`, `sortBy`, `sortAscending`; `(sort)` |
| `es-node-url` | `node`, `mode`, `scope`, `queryParams`, `disabled`, `aria-label`; `(buttonClick)` |
| `es-mds-viewer` | `groupId`, `setId`, `data`, `showGroupHeadings`, `headingLevel` (1–6, für die Überschriften-Hierarchie setzen) |

## 3. Node-Entries

`es-node-entries-wrapper` ist **die** Komponente für Materiallisten, egal ob als Kacheln, Tabelle oder Baum.

- `displayType: NodeEntriesDisplayType`:
  - `Grid`: große Kachel mit Vorschaubild
  - `SmallGrid`: kompakt
  - `Table`
  - `Tree`
- Daten: `dataSource: NodeDataSource`, `paginationStrategy: 'infinite-scroll' | 'paginator'`, `(fetchData)`
- Auswahl und Aktionen:
  - `checkbox`, `globalOptions`
  - `initConfig: ListOptionsConfig` verbindet die Actionbar mit der Auswahl
  - `(selectionChange)`
- Klick: `elementInteractionType` (`DefaultActionLink` | `Emitter` | `None`), `(clickItem)` und `(dblClickItem)` liefern `NodeClickEvent` (`{ element, source, ctrlKey }`).
  - Beim Weiterreichen das ganze `$event` übergeben, nicht `$event.element`.
- Konfiguration:
  - `gridConfig { maxRows, layout: 'grid' | 'scroll' }`
  - `tableConfig { dataColumnLayout: 'scroll' | 'limit' }`
  - `columns`, `sort`, `dragDrop`
- Tabellenspalten ausblenden: `[checkbox]="false"`, `[showIconColumn]="false"`, `[showActions]="false"`
- Content-Templates:
  - `<ng-template #empty>` für den **Leerzustand, Pflicht**
  - `#title`
  - `#overlay` (Grid, SmallGrid; Positionierung über `.card-overlay`)
  - `#customCard` (Grid)
  - `#actionArea` (SmallGrid)
- Den Ladezustand bringt die Komponente mit (`es-spinner`). Nicht zusätzlich einen eigenen Spinner setzen.

## 4. Direktiven und Pipes

- `<i esIcon="name">`:
  - Reiner Name: Material Icons
  - `edu-…`: edu-icons
  - `custom-…`: custom-icons
  - `svg-…`: `assets/images/icons/<name>.svg`
  - Standard ist `aria-hidden`. `[aria]="true"` holt den Text aus `ICON_LABELS.<name>`, `[altText]` setzt eigenen Text.
- `[esCheckTextOverflow]` mit `#ref="esCheckTextOverflow"` und `ref.hasTextOverflow()`: Tooltip nur bei gekürztem Text
- `[esFocusState]` mit `hasFocus` und `hovering`: Zustände für zusammengesetzte Elemente
- `[esInfiniteScroll]` mit `(scrolled)`, `infiniteScrollDistance=1.5`
- App-Direktiven: `[esSkipTarget]`, `[esFocusOnOpen]`, `[esFileDrop]`, `[esToolpermissionCheck]`, `[esTitle]`
- Pipes:
  - Rechte: `esToolpermission` und `esGlobalAdmin`, jeweils mit `async`, z. B. `@if ('TOOLPERMISSION_X' | esToolpermission | async) { … }`
  - Material-Metadaten: `nodeTitle`, `esNodeIcon`, `esNodeImage`, `esNodeLicense`, `nodePersonName`
  - Formatierung: `formatDate`, `formatSize`, `formatDuration`
  - Personen: `authorityName`

## 5. App-Bausteine (`src/app/shared`)

`SharedModule` exportiert `EduSharingUiModule` und die gängigen Material-Module.

- `es-card` ist **Legacy** und wird nur noch einmal genutzt. Für neue Dialoge `CardDialog` verwenden.
- Navigation: `MainNavService.setMainNavConfig()`, `SearchFieldService.patchConfig()`
- Laden der ganzen App: `LoadingScreenService.addLoadingTask()`

## 6. Dialoge

- `DialogsService` (`src/app/features/dialogs/dialogs.service.ts`) bietet rund 50 fertige Dialoge über `openXxxDialog()`. Erst dort suchen.
- Generischer Dialog:
  ```ts
  const ref = await this.dialogs.openGenericDialog({
      title: 'BEREICH.DIALOG_TITLE',
      message: 'BEREICH.DIALOG_MESSAGE',
      buttons: DELETE_OR_CANCEL, // CANCEL links, YES_DELETE (danger) rechts
      maxWidth: 750,
  });
  ref.afterClosed().subscribe((result) => { if (result === 'YES_DELETE') { … } });
  ```
- **Knoten löschen**: `await this.dialogs.openDeleteNodesDialog({ nodes })`. Das ist der fertige Dialog mit Papierkorb-Logik und Warnung bei Verwendungen; so nutzt ihn auch die Option `OPTIONS.DELETE` in `src/app/services/options/delete-options.ts`. Nicht mit `openGenericDialog` nachbauen.
- Fertige Button-Sätze: `CLOSE`, `OK`, `NEXT`, `OK_OR_CANCEL`, `DELETE_OR_CANCEL`, `YES_OR_NO`, `DISCARD_OR_BACK`, `REPLACE_OR_BACK`, `SAVE_OR_CANCEL`, `USE_OR_CANCEL`.
  - Der Standardbutton steht zuerst, der Primär- oder Gefahrenbutton zuletzt (rechts).
- Eigener Dialog:
  - Komponente mit `inject(CARD_DIALOG_DATA)` und `inject(CardDialogRef)`
  - Öffnen über `CardDialogService.open(Comp, { title, width, closable, buttons })`
  - Methode `openXxxDialog()` im `DialogsService` ergänzen
- Breite `CARD_DEFAULT_WIDTH`: xsmall 400, small 500, normal 600, mlarge 650, large 700, xlarge 800, xxlarge 900, xxxlarge 1200
- `Closable`:
  - `Casual`: Esc, X oder Klick daneben (Standard)
  - `Standard`: Esc oder X, für Formulare
  - `Confirm`: Schließen mit Rückfrage, bei ungespeicherten Änderungen
  - `Disabled`
- Laden im Dialog: `ref.patchState({ isLoading: true })`
- Buttons zur Laufzeit ändern: `ref.patchConfig({ buttons })`
- `DialogButton`:
  ```ts
  new DialogButton('SAVE', { color: 'primary' }, () => …)
  ```
  `color` ist `'standard' | 'primary' | 'danger'`.

## 7. Toast und Fortschritt

Service: `Toast` in `src/app/services/toast.ts`.

- Info:
  ```ts
  toast.show({ message: 'TOAST.X', type: 'info', subtype: ToastType.InfoSimple })
  ```
- Fehler aus der API: `toast.error(err)`. Der Text ist dann `COMMON_API_ERROR`.
- Fehler mit eigenem Text: `toast.error(null, 'BEREICH.ERROR_X')`
- Mit Aktion: `subtype: ToastType.InfoAction`, `action: { label, callback }`
- `toast.toast(...)` ist deprecated.
- Die Anzeigedauer stellen die Nutzenden selbst ein (`toastDuration`). Keine eigene Dauer erzwingen.

## 8. Lib oder App?

- **Lib** (`projects/edu-sharing-ui/src/lib/`): Der Baustein wird in mehreren Features genutzt oder auch außerhalb der App (Web Component, Embed, WLO-Frontends).
  - Neue Declarables werden im Modul deklariert **und** in `index.ts` exportiert, sonst bricht der Build mit NG3001.
  - Pipes liegen in `pipes/` und werden in `common/edu-sharing-ui-common.module.ts` registriert.
- **App** (`src/app/features/<feature>/`): Der Baustein gehört zu genau einem Feature oder braucht App-Services (`DialogsService`, `Toast`, Router-Seiten).
- Nach Änderungen an der Lib zeigt die IDE eventuell veraltete Fehler, weil `tsconfig.json` auf `dist/` zeigt. `ng build` und `serve` nutzen die Quelle.
