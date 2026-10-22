# Do / Don't

Jedes Paar verhindert einen Fehler, den Agenten ohne diese Regeln typischerweise machen (gemessen im Testlauf ohne Skills).

## Inhalt
1. Farbe
2. Neuer Token
3. Icon
4. Kachel und Liste
5. Dialog
6. Rückmeldung
7. Höhe und Mobil
8. Material anpassen
9. Fokus
10. Statusfarbe als Text
11. Abstände
12. Akzentfarbe und Branding
13. Template-Syntax

## 1. Farbe

```scss
// Don't – kippt nicht im Dark Mode, ignoriert Branding
.title { color: #383838; }
.badge { background: #48708e; color: white; }
.hint  { background: var(--palette-primary-50); }

// Do
.title { color: var(--textMain); }
.badge { background: var(--primary); color: var(--light-primary-text); }
.hint  { background: var(--primaryBackground50); color: var(--primaryForeground900); }
```

## 2. Neuer Token

```scss
// Don't – nur hell definiert
:root { --myFeatureHighlight: #fff8e1; }

// Do – in variables.scss beide Blöcke, Dark-Wert aus Theme-Farben gemischt
:root            { --featureHighlightBackground: color-mix(in srgb, var(--colorStatusWarning), white 85%); }
body.isDarkTheme { --featureHighlightBackground: color-mix(in srgb, var(--colorStatusWarning), black 70%); }
```

## 3. Icon

```html
<!-- Don't -->
<mat-icon>delete</mat-icon>
<button mat-icon-button (click)="remove()"><i esIcon="delete"></i></button>

<!-- Do: dekoratives Icon neben Text / Icon-only-Button mit Label -->
<button mat-button color="primary"><i esIcon="add"></i>{{ 'ADD' | translate }}</button>
<button mat-icon-button (click)="remove()" [attr.aria-label]="'OPTIONS.DELETE' | translate">
    <i esIcon="delete"></i>
</button>
```

## 4. Kachel und Liste

```html
<!-- Don't – eigene Kachel, kein Leer-/Ladezustand -->
@for (node of nodes; track node.ref.id) {
    <div class="my-card"><img [src]="node.preview.url" /><h3>{{ node.title }}</h3></div>
}

<!-- Do -->
<es-node-entries-wrapper
    [dataSource]="dataSource"
    [displayType]="NodeEntriesDisplayType.Grid"
    [scope]="Scope.CollectionsCollection"
    (clickItem)="nodeHelper.navigateToNode($event)"
>
    <ng-template #empty>
        <div class="no-results"><i esIcon="search"></i>{{ 'COLLECTIONS.EMPTY' | translate }}</div>
    </ng-template>
</es-node-entries-wrapper>
```

## 5. Dialog

```ts
// Don't
this.matDialog.open(ConfirmComponent, { width: '400px' });

// Do – Knoten löschen: fertiger Dialog (Papierkorb, Warnung bei Verwendungen)
await this.dialogs.openDeleteNodesDialog({ nodes: [node] });

// Do – anderer Löschvorgang (z. B. gespeicherte Einstellung): generischer Dialog
const ref = await this.dialogs.openGenericDialog({
    title: 'BEREICH.DELETE_TITLE',
    message: 'BEREICH.DELETE_MESSAGE',
    buttons: DELETE_OR_CANCEL,
});
```

## 6. Rückmeldung

```ts
// Don't
this.snackBar.open('Gespeichert!', 'OK', { duration: 3000 });

// Do
// Schlüssel neu in common/de.json + en.json unter "TOAST" anlegen
this.toast.show({ message: 'TOAST.BOOKMARKS_SAVED', type: 'info', subtype: ToastType.InfoSimple });
// Fehler
this.service.save().subscribe({ next: …, error: (err) => this.toast.error(err) });
```

## 7. Höhe und Mobil

```scss
// Don't
.panel { height: calc(100vh - 70px); }
@media (max-width: 900px) { .panel { height: 100vh; } }

// Do
@use 'projects/edu-sharing-ui/assets/scss/variables-scss' as vars;
.panel { height: calc(100vh - var(--mainnavCurrentHeight)); }
@media screen and (max-width: vars.$mobileTabSwitchWidth) {
    .panel { height: calc(100vh - var(--mainnavCurrentHeight) - #{vars.$mobileTabNavHeight}); }
}
```

## 8. Material anpassen

```scss
// Don't – Selektor aus der Zeit vor MDC, Token-Name aus Material ≤ 18, globales Theme
.mat-form-field-wrapper { padding-bottom: 0; }
button { --mdc-text-button-label-text-color: #fff; }
@include mat.theme((color: (primary: mat.$azure-palette)));

// Do
:host ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; } // nur wenn begründet
.on-dark button.mat-mdc-button { --mat-button-text-label-text-color: var(--textOnDarkSurface); }
// Feld auf farbiger Fläche: <mat-form-field appearance="outline" class="mat-form-field-bright">
```

## 9. Fokus

```scss
// Don't
.tile:focus { outline: none; }

// Do
@use 'projects/edu-sharing-ui/assets/scss/mixins' as mixins;
.tile {
    @include mixins.clickable();
    &:focus-visible { @include mixins.setGlobalKeyboardFocus(); }
}
```

## 10. Statusfarbe als Text

```scss
// Don't – 2,3:1
.ok { background: var(--colorStatusPositive); color: white; }

// Do – Text in der Textvariante, Fläche getönt
.ok {
    color: var(--colorStatusPositiveText);
    background: color-mix(in srgb, var(--colorStatusPositive), var(--textWhite) 85%);
}
```

## 11. Abstände

```scss
// Don't – Werte außerhalb der Skala, 4/8-Raster passt nicht zum Ist-Stand
.panel { padding: 12px 16px; gap: 6px; }

// Do – spacing-Skala der DESIGN.md (5/10/15/20/25/30/40)
.panel { padding: 10px 15px; gap: 5px; }
```

## 12. Akzentfarbe und Branding

```scss
// Don't – mit WLO-Accent #e4f700 auf Weiß 1,19:1; Schriftfarbe auf primary geraten
.new-badge { color: var(--accent); }
.chip-primary { background: var(--primary); color: white; }

// Do – Accent nur als Fläche mit dunkler Schrift; Text auf primary über Kontrastvariable
.new-badge { background: var(--accent); color: var(--textMain); }
.chip-primary { background: var(--primary); color: var(--light-primary-text); }
```

## 13. Template-Syntax

```html
<!-- Don't -->
<div *ngIf="items.length; else empty"><span *ngFor="let i of items">{{ i }}</span></div>
<es-x [data]="{ ...base, extra: 1 }"></es-x>

<!-- Do -->
@if (items().length) {
    @for (i of items(); track i.id) { <span>{{ i.label }}</span> }
} @else { … }
<es-x [data]="mergedData()"></es-x>
```
