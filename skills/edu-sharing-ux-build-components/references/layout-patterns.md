# Layout-Muster

Quelle: `Frontend/CLAUDE.md` (Abschnitte Layout und Global Styles), `mixins.scss`, `variables-scss.scss`.

## Inhalt
1. Seite mit Navigation
2. Seitenrahmen ohne Body-Scroll (Standard für neue Seiten)
3. Kopfzeile fest, Inhalt scrollt darunter
4. Flex- und Grid-Fallen
5. Mobil (unter 900px = `vars.$mobileTabSwitchWidth`)
6. Seitenleisten (`mat-sidenav`)
7. Feste Maße
8. Eingebettet (Web Component, `/embed`)

## 1. Seite mit Navigation

Wie Navigation, Suche, Sammlungen und Arbeitsbereich heute aufgebaut sind, steht in `page-layouts.md`. Diese Datei beschreibt die Muster, mit denen eine neue Seite in diesen Rahmen passt.

- Die Hauptnavigation ist ein globales `<es-main-nav>` in `app.component.html`. Eine Seite baut **keine eigene** Navigation. Sie ruft in `ngOnInit` Folgendes auf:
  ```ts
  this.mainNav.setMainNavConfig({ title: 'BEREICH.TITLE', currentScope: 'bereich' });
  ```
  Pflicht ist nur `currentScope`.
- Das Suchfeld in der Leiste wird über `SearchFieldService.patchConfig(...)` konfiguriert.

## 2. Seitenrahmen ohne Body-Scroll (Standard für neue Seiten)

```scss
@use 'projects/edu-sharing-ui/assets/scss/mixins' as mixins;
@use 'projects/edu-sharing-ui/assets/scss/variables-scss' as vars;

:host {
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--mainnavCurrentHeight));
    overflow: hidden;
}
.main-content { // oberste Ebene, nicht verschachtelt
    @include mixins.roundedContainerCard(vars.$mobileTabSwitchWidth, vars.$mobileTabNavHeight);
    @include mixins.roundedContainerStaticScroll(vars.$mobileTabSwitchWidth, vars.$mobileTabNavHeight);
}
.scroll-area {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    @include mixins.materialScrollbarLight();
}
```

- Höhen immer mit `--mainnavCurrentHeight` rechnen, nicht mit `--mainnavHeight` und nie mit einer Pixelzahl.
- Eine Lade-`mat-progress-bar`, die nur über die Deckkraft ausgeblendet wird, belegt weiter Platz. Sie bekommt deshalb `position: absolute`.

## 3. Kopfzeile fest, Inhalt scrollt darunter

- Der begrenzte Vorfahre bekommt `overflow: hidden; display: flex; flex-direction: column`.
- Der Header bekommt `flex-shrink: 0`.
- Der Inhalt liegt in einem eigenen Wrapper mit `flex: 1; min-height: 0; overflow-y: auto`.
- `position: sticky` reicht nicht: Die Scrollbar läuft dann neben dem Header mit.

## 4. Flex- und Grid-Fallen

- Jedes Flex-Kind in der Scroll-Kette braucht `min-height: 0`. Der Standard `min-height: auto` verhindert `overflow-y: auto`.
- Ein Grid-Item, das selbst scrollt und `min-height: 0` hat, kollabiert in `auto`-Reihen auf die Höhe 0.
  - Das ist nur bei fester Reihenhöhe sicher (`grid-template-rows: 1fr`).
  - Sonst `overflow: visible; min-height: auto` setzen.
- Eine `mat-tab-group` in einem solchen Container braucht `flex: 1; min-height: 0`.

## 5. Mobil (unter 900px = `vars.$mobileTabSwitchWidth`)

- `es-main-menu-bottom` ist dort fixiert: `position: fixed; bottom: 0`, Höhe `vars.$mobileTabNavHeight` (62px).
- Inhalt, der den unteren Rand erreicht, braucht Abstand dazu:
  ```scss
  @media screen and (max-width: vars.$mobileTabSwitchWidth) {
      margin-bottom: vars.$mobileTabNavHeight;
  }
  ```
  `roundedContainerCard()` enthält das bereits.
- Die Seitenkarte wird randlos: kein Radius, kein Schatten.
- Sidebars und Filter werden zum Modal, entweder über `mobileModalOverlay(...)` oder über `vars.$mobileSidebarModal`.
- Menüs öffnen als Bottom Sheet:
  ```ts
  dropdownRef.triggerBottomSheet();
  ```
- Elemente, die unter 700px wegfallen, bekommen die Klasse `.hidemobile`.
- Dialoge sind auf Mobilgeräten unten ausgerichtet, volle Breite, `height: calc(100% - 30px)`. Das regelt `CardDialogService`.

## 6. Seitenleisten (`mat-sidenav`)

- Inhalt in `div.es-mat-sidenav-content` (runde Karte); Polster `.mat-sidenav-padding` (20px).
- Wenn die Karte zur offenen Leiste rücken soll, setzt die Seite die Klassen selbst. Angular Material setzt sie nicht:
  ```html
  <mat-sidenav-container
      [class.mat-sidenav-container-left-open]="leftOpen"
      [class.mat-sidenav-container-right-open]="rightOpen">
  ```
- Leiste auf- und zuklappen: `es-edge-toggle` (`open`, `side`, `labelOpen`, `labelClose`).
- Breite ändern: `.es-sidenav-resizer` mit `.start` oder `.end`.

## 7. Feste Maße

- Sekundärleisten (Topbar, Tab-Navigation, Sidebar-Header, Auswahl- und Footer-Leisten): `vars.$secondaryBarHeight` (72px)
- Kachel: Breite `var(--cardWidth)` (270px), Höhe `vars.$cardHeight` (300px), Polster `vars.$cardPadding` (25px)
- Tabellenzeile: `vars.$nodeEntriesTableRowHeight` (58px)
- Listeneintrag: `vars.$listItemHeight` (70px)
- Container-Außenabstand: `var(--roundedContainerMargin)` (15px)

## 8. Eingebettet (Web Component, `/embed`)

Ausführlich im Skill `edu-sharing-ux-build-embeds`. Kurz:

- Das Standard-Theme ist hell, außer `?theme=` sagt etwas anderes.
- Es gibt keinen Shadow Root. Darum keine globalen Selektoren auf `body` oder `html` aus Komponenten setzen, denn sie würden die Gastseite verändern.
- `meta[name="theme-color"]` wird eingebettet nicht gesetzt.
