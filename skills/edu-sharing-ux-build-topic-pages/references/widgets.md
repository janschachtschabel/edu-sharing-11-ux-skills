# Widgets der Themenseiten

Quelle: `Frontend/src/app/pages/topic-page/widgets/**` und `shared/types/custom-definitions.ts` (Stand `maven/fixes/11.0`).

## Inhalt
1. Registry und Rahmen
2. Vorhandene Widgets
3. Neues Widget anlegen
4. Gemeinsame Bausteine

## 1. Registry und Rahmen

- **Registry** `WIDGETS` (`custom-definitions.ts:54-70`): `collection-chips`, `topics-column-browser`, `content-teaser`, `media-rendering`, `text`, `iframe`, `ai-text`.
  - Daraus entsteht automatisch die Auswahl `WIDGET_TYPE_OPTIONS`.
  - Fest eingebaut, nicht wählbar: `topic-header`, `breadcrumb`, `profiling`, `side-menu-wrapper`.
- **`es-generic-widget`** lädt jedes Widget **lazy** (`getComponentClass`, `generic-widget.component.ts:850-907`) und setzt die Inputs per `setInput`. Außerdem liefert es den gemeinsamen Rahmen:
  - Kopf: `es-generic-widget-header` mit `h3` (zentriert) und Beschreibung, beide auch KI-generierbar
  - Laden: Spinner mit mindestens 200px Höhe
  - Bearbeiten: 1px-Rahmen `$outline`, Radius 8px, `padding: 0 16px 16px`
  - „Einbetten“ (Icon `code`), nur wenn Web Components aktiv sind
- **Schnittstelle** `WidgetComponentInterface` (`generic-widget.component.ts:77-99`):

  | Teil | Elemente |
  |---|---|
  | Inputs | `contextNodeId`, `editMode` (InputSignal), `gridIndex`, `swimlaneIndex`, `pageVariantNode`, `embedConfigurationOption` |
  | Outputs | `configChanged` (`EventEmitter<void>`), `embedWidgetClicked` |
  | Signals | `initialized`, `updateInProgress` |
  | optionale Methoden | `retrieveWidgetConfig`, `setWidgetValues`, `preLoadAction`, `postLoadAction`, `retrieveCustomAiKeyValuePairs` |

- **Speichern**: `configChanged` → `persistConfig()` führt die Basis- und die Widget-Konfiguration zusammen. Ein neuer Widget-Knoten entsteht über das Event `widgetNodeAdded`.

## 2. Vorhandene Widgets

| Widget | Konfiguration | Optik und Defaults | Zustände und a11y |
|---|---|---|---|
| `text` | nur Kopf (Überschrift, Beschreibung) | – | Spinner; Einbetten |
| `iframe` | `src`, `width`, `height`, `border`, `confirmation`, `title` | 100 % × 450px, ohne Rahmen, Bestätigung an; `sandbox`, lazy | Bestätigungsseite; Hinweis bei fehlender `src`. Der Fallback-Titel „Embedded Content“ ist fest eingetragen, also übersetzen |
| `content-teaser` (+ `generic-node-entries`) | `contentTeaserLayout`, `blacklistedNodeIds`, `propertyFilters`, `searchText`, `sort`, `includeCustomCard` | Layouts Single / Split / **Standard** (Default) / Compact / List (/ Map); Kachel 314px, Single/Split breiter (`max(314px, 100% - 200px)` bzw. 850px); höchstens 11 Elemente | leer: `NO_CONTENTS`; Auswahlrahmen 3px `$primary` |
| `collection-chips` | `collectionListLayout` (Chips / Kacheln), `sortedNodeIds` | Chips auf `$primary`, Radius 25px, Text fett und groß; Kacheln 164 × 164px; Reihenfolge per Drag & Drop | leer: `NO_SUBCOLLECTIONS`; „Mehr / Weniger anzeigen“ |
| `media-rendering` | `mediaRenderingLayout` (Preview / TitlePreview / TitlePreviewButtons), `selectedNodeId` | Default Preview; nur mit Rendering Service 2 | Warnung „nicht verfügbar“, Info „kein Element“ |
| `ai-text` | `prompt`, `texts[]` | nur mit KI-Unterstützung | Prompt-Formular, `NO_ANSWER_DEFINED`, Spinner; KI-Label |
| `topics-column-browser` | `height`, `sidebarEmbedding` | Spalten-Browser; ≤ 860px einspaltig | `role="listbox"`/`option`, `aria-selected`, Roving Tabindex (gutes Vorbild) |
| `topic-header` (fest) | `textBackgroundColor`, `aiGeneratedImage`, `userUploadedNodeId` | Text:Bild 5:3, `padding: 40px`; ≤ 800px untereinander | `h1`, KI-Label |
| `breadcrumb` (fest) | `editorialMemberNodeIds` | mindestens 76px hoch, mit Auswahl der Variante | `ul/li`, **ohne `<nav>`** (ergänzen) |
| `profiling` (fest) | MDS-Gruppe `topic_page_profiling` | „Zurücksetzen“ links, „Übernehmen“ | Toast `CHANGES_SAVED`/`RESET` |

## 3. Neues Widget anlegen

1. **Typ** als Konstante in `WIDGETS` eintragen (`custom-definitions.ts:54`).
2. **Konfiguration** als Interface `extends BaseWidgetConfig` definieren und in die Union in `widget-config.ts` aufnehmen.
3. **Standalone-Komponente** mit `WidgetComponentInterface` anlegen:
   - `editMode` als `InputSignal`, `initialized`/`updateInProgress` als Signals
   - `retrieveWidgetConfig()` gibt die aktuelle Konfiguration zurück
   - Bei Änderungen `configChanged.emit()` aufrufen (`EventEmitter<void>`). `es-generic-widget` holt die Konfiguration dann über `retrieveWidgetConfig()` und speichert sie
4. **Lazy-Import** als `case` in `getComponentClass` eintragen, Inputs bei Bedarf in `setWidgetInputs` (`generic-widget.component.ts:856, 940`).
5. **Texte**: `TOPIC_PAGE.SWIMLANE.SELECT_WIDGET.<KEY>` (Name in der Auswahl) und ein eigenes Präfix `readonly i18nPrefix = 'TOPIC_PAGE.WIDGET.<NAME>.'`, in de/en/fr/it.
6. **Funktionen des Servers** prüfen, wie bei KI und Rendering 2 (`swimlane.component.ts:42-58`, `select-widget-type.component.ts:34-43`).
7. **Storybook-Story** anlegen, mit Bearbeiten und Ansehen.

Für ein Widget aus einem anderen Projekt reicht statt 1 und 4:

```ts
GenericWidgetGlobalService.registerCustomWidget({ id, matchingWidgetType, component })
```

**Gerüst:**

```ts
@Component({ selector: 'es-my-widget', standalone: true, templateUrl: './my-widget.component.html', styleUrls: ['./my-widget.component.scss'] })
export class MyWidgetComponent implements WidgetComponentInterface {
    readonly i18nPrefix = 'TOPIC_PAGE.WIDGET.MY_WIDGET.';
    @Input() contextNodeId: string;
    editMode: InputSignal<boolean> = input<boolean>(false);
    @Output() configChanged = new EventEmitter<void>(); // signalisiert nur „geändert“
    initialized: WritableSignal<boolean> = signal(false);
    updateInProgress: WritableSignal<boolean> = signal(false);
    private config: MyWidgetConfig;
    retrieveWidgetConfig(): MyWidgetConfig {
        return this.config; // es-generic-widget liest die Konfiguration hier ab und speichert sie
    }
    private onLayoutChange(layout: MyLayout) {
        this.config = { ...this.config, layout };
        this.configChanged.emit();
    }
}
```

```html
@if (!initialized()) { <es-spinner></es-spinner> }
@else if (items().length === 0) { <es-info-message mode="info" [message]="i18nPrefix + 'EMPTY'"></es-info-message> }
@else { … }
@if (editMode()) { <es-widget-configuration-buttons …></es-widget-configuration-buttons> }
```

```scss
:host { container-type: inline-size; }
@container (max-width: 575.98px) { /* schmale Breite: 2/6 oder mobil */ }
```

## 4. Gemeinsame Bausteine (`widgets/shared`)

| Baustein | Einsatz |
|---|---|
| `es-widget-configuration-buttons` | Einstellungsleiste im Bearbeiten-Modus: Pille mit Radius 24px, Layout-Umschalter 52px (mit `ariaLabel`), `optionOne`/`optionTwo`, Einbetten; Container Query bei 575.98px |
| `es-color-picker` | Farbwahl (Palette der Sammlungsfarben, „keine Farbe“) |
| `es-editable-text` | bearbeitbare Überschrift (h1–h3) oder Markdown-Text |
| `es-ai-label` | Kennzeichnung „KI-generiert“ (`TOPIC_PAGE.AI.GENERATED`) |
| `es-image-wrapper` | Bild mit Upload oder KI-Bild |
| `tooltipAriaLabel` (Direktive) | übernimmt den Tooltip-Text als `aria-label` für Icon-Buttons |
