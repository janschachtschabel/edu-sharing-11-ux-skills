# Tokens nach Zweck

Quelle: `projects/edu-sharing-ui/assets/scss/variables.scss`. Hell bezeichnet die Werte in `:root`, dunkel die Werte in `body.isDarkTheme`.

„Kippt“ heißt: Der Token wird im Dark Mode neu gesetzt. Tokens, die nicht kippen, sehen im Dark Mode gleich aus und eignen sich nur für Flächen, die in beiden Modi farbig sind.

## Inhalt
1. Primärfarbe und Tönungen
2. Text
3. Flächen
4. Rahmen und Trennlinien
5. Status, Lizenz, KI
6. Form, Größe, Bewegung
7. Abstände (spacing-Skala)
8. Layout-Variablen (SCSS, statisch)
9. Material-Paletten (nur mit Vorsicht)
10. Branding-Beispiel WLO

## 1. Primärfarbe und Tönungen

Schreibweise in der Spalte „Dunkel“: genau wie in `variables.scss`. `color-mix(in srgb, var(--primary) 35%, black)` heißt 35 % Primärfarbe; `color-mix(in srgb, var(--primary), black 55%)` heißt 55 % Schwarz. „Palette N“ im Light-Modus berechnet `angular-material-css-vars` erst im Browser aus der Primärfarbe; Hexwerte dafür stehen nicht im Repo (messen oder mit `contrast.mjs --set palette-primary-N=#hex` rechnen).

| Token | Hell | Dunkel | Zweck |
|---|---|---|---|
| `--primary` | Palette 500 (Default `#48708e`) | Palette 500 (Default `#96cdf8`) | Aktionen, Links, aktive Zustände, Icons |
| `--accent` | Palette 500 | Palette 500 | wie primary (Default identisch) |
| `--warn` | Palette 500 (`#cd2457`) | `#ff6b9d` | destruktive Aktionen |
| `--primaryBackground50` | Palette 50 | `color-mix(in srgb, var(--primary) 35%, black)` | sehr leichte Fläche: Hover, ausgewählt, Info-Box |
| `--primaryBackground100` | Palette 100 | `color-mix(in srgb, var(--primary) 40%, black)` | Chips, leichte Akzentfläche |
| `--primaryBackground300` | Palette 300 | `color-mix(in srgb, var(--primary) 60%, black)` | Fokusfarbe, Scrollbar-Daumen (light) |
| `--primaryBackground700` | Palette 700 | `color-mix(in srgb, var(--primary) 75%, white)` | kräftige Fläche, Text auf heller Tönung |
| `--primaryBackground900` | Palette 900 | `color-mix(in srgb, var(--primary) 35%, white)` | sehr kräftig, Caret, Slider-Bubble |
| `--primaryForeground800` | Palette 800 | `color-mix(in srgb, var(--primary) 60%, white)` | Text auf `--primaryBackground50/100` |
| `--primaryForeground900` | Palette 900 | `color-mix(in srgb, var(--primary) 75%, white)` | Text auf `--primaryBackground50/100`, stärker |
| `--light-primary-text` | Kontrastfarbe zu primary | Palette-Kontrast 500 | Text **auf** `--primary`-Fläche |
| `--textOnDarkSurface` | `--light-primary-text` | `--textMain` | Text auf dunkler oder farbiger Fläche |

### Palettenwerte als Hex (light)

`angular-material-css-vars` berechnet die Palette erst im Browser aus der Primärfarbe. Der Algorithmus ist an WLO-Staging nachgemessen; alle WLO-Werte stimmen bis auf eine Rundung um 1:

- 50, 100, 200, 300 und 400: Mischung aus Weiß und Primärfarbe mit 12, 30, 50, 70 bzw. 85 % Primärfarbe.
- 600, 700, 800 und 900: Mischung aus Primärfarbe und ihrer „multiplizierten“ Version (`primary × primary / 255` pro Kanal) mit 87, 70, 54 bzw. 25 % Primärfarbe.
- Kontrastfarbe (`--palette-primary-contrast-N`, also `--light-primary-text` bei 500): schwarz bei Helligkeit ≥ 128, sonst weiß.

| Stufe | Token (light) | Default `#48708e` | WLO `#003b7c` |
|---|---|---|---|
| 50 | `--primaryBackground50`, `--listItemSelectedBackground` | `#e9eef1` | `#e0e7ef` |
| 100 | `--primaryBackground100` | `#c8d4dd` | `#b3c4d8` |
| 200 | – | `#a4b8c6` | `#809dbe` |
| 300 | `--primaryBackground300` = **`--focusColor`** | `#7f9bb0` | `#4d76a3` |
| 400 | – | `#63859f` | `#265890` |
| 500 | `--primary` | `#48708e` | `#003b7c` |
| 600 | (Typ-Icon der Kachel) | `#416886` | `#003574` |
| 700 | `--primaryBackground700` | `#385d7b` | `#002d69` |
| 800 | `--primaryForeground800` | `#305371` | `#00265f` |
| 900 | `--primaryBackground900`, `--primaryForeground900` | `#21415f` | `#00194c` |
| Kontrast 500 | `--light-primary-text` | `#ffffff` | `#ffffff` |

Im Dark Mode gilt statt der Palette die `color-mix()`-Formel aus der Tabelle oben. Default-Dark-Primary `#96cdf8` → `--light-primary-text` schwarz.

Kontraste damit:

- **Fokusrahmen Default `#7f9bb0`: auf Weiß 2,91:1, auf `#fafafa` 2,79:1, auf `#f3f3f3` 2,62:1. Das verfehlt 1.4.11 (3:1)** und ist ein Befund an Team 6. Mit WLO-Branding (`#4d76a3`) sind es 4,73:1.
- Auswahlfläche `#e9eef1` mit `--textMain`: 10,0:1.
- `--primaryForeground800` auf Weiß: 8,1:1.

Rechnen mit `contrast.mjs --set palette-primary-300=#7f9bb0`.

## 2. Text

| Token | Hell | Dunkel | Zweck | Kontrast hell |
|---|---|---|---|---|
| `--textMain` | `#383838` | `#e6e6e6` | Fließtext, Titel | 11,7:1 auf weiß |
| `--textLight` | `#585858` | `#cfcfcf` | Sekundärtext, Labels, Hints, Überschriften `.mat-heading-*` | 6,4:1 auf `#f3f3f3` |
| `--textMediumLight` | `#767676` | `#c7c7c7` | Tertiärtext, **nur auf weißer Fläche** | 4,54:1 auf weiß, 4,09:1 auf `#f3f3f3` ✗ |
| `--textVeryLight` | `#aaa` | `#777` | nur Deko, Trennlinien. **Nie für Information** | 2,3:1 ✗ |
| `--placeholderColor` | `#767676` | `#9a9a9a` | Platzhalter in Eingabefeldern | 3,91:1 auf dem Suchfeld (`#eee`) ✗; ein Platzhalter ist kein Label, trotzdem ein Befund an Team 6 |
| `--textRenderingLabels` | `#6f6f6f` | `#b0b0b0` | Labels im Rendering/Metadaten | |
| `--noResultsColor` | `rgba(0,0,0,.54)` | `rgba(255,255,255,.54)` | Leerzustands-Text | |
| `--textWhite` / `--textBlack` | `#fff` / `#000` | **vertauscht** | für `color-mix()`-Mischungen, die mit dem Theme kippen sollen. Im Bestand ist `--textBlack` auch die Textfarbe der Metadaten-Werte auf Kacheln (kippt korrekt). Für neuen Text `--textMain` nehmen; nie als „immer weiß/schwarz“ verwenden |
| `--buttonDisabled` | `#999` | `#6f6f6f` | deaktivierte Eigenbau-Controls | |

## 3. Flächen

| Token | Hell | Dunkel | Zweck |
|---|---|---|---|
| `--backgroundColor` | `#f3f3f3` | `#2d2d2d` | Seitenhintergrund, Sidenav, FAB |
| `--defaultBackground` | `#fff` | `#1e1e1e` | Grundfläche, Checkbox-Hintergrund |
| `--roundedContainerBackground` | `#fff` | `#262626` | große abgerundete Container (Seitenkarte, Tab-Header) |
| `--cardLightBackground` | `#f9f9f9` | `#2a2a2a` | leicht abgesetzte Karte in einem Container |
| `--backgroundElevatedColor` | `#fafafa` | `#242424` | angehobene Fläche |
| `--backgroundTinted` | `#eee` | `#242424` | getönte Fläche, Slider-Spur, Tabelle (dunkel) |
| `--backgroundContainerHigh` / `-Highest` | `#e8e8e8` / `#e3e2e2` | `#2a2a2a` / `#303030` | Container-Ebenen |
| `--backgroundDim` | `#dadada` | `#1a1a1a` | abgedunkelte Fläche |
| `--backgroundOddColor` | `#fafbe6` | `#272727` | ungerade Zeilen |
| `--actionDialogBackground` | `#eee` | `#2d2d2d` | Kopfzeile von Aktionsdialogen |
| `--listItemSelectedBackground` | Palette 50 | `color-mix(in srgb, var(--primary), black 55%)` (= 45 % primary) | ausgewählter Listeneintrag |
| `--listItemSelectedBackgroundEffect` | 5px primary-Kante links + Fläche | dito | ausgewählt mit Markierungsbalken |
| `--workspaceTopBarBackground` / `--workspaceTopBarFontColor` | `#383838` / `#fff` | kippt nicht | Hauptnavigation (Default dunkel) |
| `--workspaceTopBarInputBackground` | `#eee` | `#333` | Suchfeld in der Navigation |
| `--topBarSearchFocusColor` | = `--primaryBackground300` | ebenso | Fokusring des Suchfelds (Maus) |
| `--edgeToggleBackground` / `--edgeToggleShadow` | `#fff` / `0 2px 8px rgba(0,0,0,.25)` | `--backgroundContainerHigh` / `none` | Lasche am Rand von Seitenleisten |
| `--color-readable-overlay` | `rgba(255,255,255,.8)` | `rgba(0,0,0,.6)` | Text über Bild lesbar machen |
| `--color-darken` | `rgba(0,0,0,.2)` | `rgba(255,255,255,.2)` | Abdunkeln/Aufhellen |
| `--footerBackground` | `#f3f3f3` | `#1a1a1a` | Footer |
| `--toastBackground` | `#333` | `#ededed` | Toast |

## 4. Rahmen und Trennlinien

| Token | Hell | Dunkel | Zweck |
|---|---|---|---|
| `--borderLight` | `#eee` | `#383838` | leichte Rahmen |
| `--borderGray` | `#888` | `#c7c7c7` | sichtbare Rahmen (≥ 3:1) |
| `--borderDark` | `#333` | `#ccc` | starke Rahmen |
| `--borderLightPrimary` | `color-mix(in srgb, var(--primary) 15%, white)` | `color-mix(in srgb, var(--primary) 15%, black)` | leichter Rahmen in Primärfarbe |
| `--borderDarkModeOnly` | transparent | `#444` | Kante nur im Dark Mode, wenn die Fläche fast wie der Hintergrund aussieht |
| `--inputBorderColor` | `#9e9e9e` | `#666` | Eigenbau-Eingabefelder |
| `--searchInputBorderColor` | `#ccc` | `#555` | Rahmen von Suchfeldern in Inhalten. Kontrast nur 1,61:1 bzw. 2,03:1, deshalb nicht als einzige Feldbegrenzung verwenden. Das Suchfeld der Navigation hat keinen Rahmen, sondern Fläche `--workspaceTopBarInputBackground` und Schatten |
| `--genericSeperatorLineColor` | `#ececec` | `#383838` | Trennlinie (`.separator-line`) |
| `--tableSeperatorLineColor` | `#d2d2d2` | `#444` | Tabellenzeilen |
| `--cardSeparatorLineColor` | `#ccc` | `#666` | Trennlinie in Karten |

## 5. Status, Lizenz, KI

| Token | Hell | Dunkel | Zweck |
|---|---|---|---|
| `--colorStatusNegative` | `#cd2457` | kippt nicht | Fehler, Ablehnung (Text 5,3:1 auf weiß) |
| `--colorStatusPositive` | `#40bf8e` | kippt nicht | Erfolg **als Fläche oder Icon**. Kein weißer Text darauf (2,3:1) |
| `--colorStatusPositiveText` | `#297a5b` | = `--colorStatusPositive` | Erfolgs-**Text** |
| `--colorStatusWarning` | `#e98c1b` | kippt nicht | Warnung als Fläche oder Icon. Kein weißer Text darauf (2,6:1) |
| `--colorStatusNeutral` | `#ddd` | `#555` | neutraler Status |
| `--colorStarActive` | `#ba7c00` | kippt nicht | aktiver Bewertungsstern (3,5:1, nur Icon) |
| `--licenseOerBadgeBackground` / `--licenseNotOerBadgeBackground` | `#0b0` / `#f5a623` | kippt nicht | OER-Status-Badge (im Lizenzdialog und im Lizenz-Widget des MDS-Editors, **nicht** auf Kacheln) |
| `--licenseBadgeTextColor` | `#000` | kippt nicht | Text auf den Lizenz-Badges; nicht tauschen (Kontrast 8,1:1 bzw. 10,4:1) |
| `--aiColor` | `#2c0799` | kippt nicht | KI-Kennzeichnung |
| `--aiColorChipBg` / `--aiColorChipText` / `--aiColorChipBorder` | gemischt | kippt | KI-Chip |
| `--nodeVirtualColor` / `-Light` | `#42ca8d` / `#b8fcdd` | kippt nicht | virtuelle (noch nicht gespeicherte) Knoten |
| `--chip-color-<mds-feld>` | aus `$chip-colors` | 62 % schwarz gemischt | Chips nach Metadatenfeld (`cclom_general_keyword`, `ccm_taxonid` …) |

Statusfarbe als getönte Fläche, die mit dem Theme kippt (Muster aus `info-message.component.scss`):

```scss
background-color: color-mix(in srgb, var(--colorStatusWarning), var(--textWhite) 75%);
border: 1px solid color-mix(in srgb, var(--colorStatusWarning), var(--textBlack) 25%);
color: color-mix(in srgb, var(--colorStatusWarning), var(--textBlack) 55%);
```

## 6. Form, Größe, Bewegung

| Token | Wert | Zweck |
|---|---|---|
| `--borderRadiusCards` | 20px | Seitenkarte, große Container, Filterkarte, Sidenav-Inhalt. **Nicht** für Kacheln in Listen; die haben keinen Radius |
| `--borderRadiusButtons` | 18px | eigene Pill-Buttons |
| `--borderRadiusBadges` | 10px | Badges, Chips |
| `--roundedContainerMargin` | 15px | Außenabstand großer Container |
| `--cardWidth` | 270px | **Mindest**breite der Kachel. Das Raster nutzt `minmax(var(--cardWidth), 1fr)`, die Kacheln wachsen also. Die Themenseite setzt 314px |
| `--tableIconSize` | 38px | Icon in Tabellenzeilen |
| `--focusColor` | hell `--primaryBackground300`, dunkel `color-mix(in srgb, var(--primary), black 44%)` (= 56 % primary) | Fokusrahmen. Im Dark Mode mit WLO-Farben nur 3,00:1 (Grenzwert): nicht zusätzlich abdunkeln oder transparent machen |
| `--focusWidth` | 2px | Fokusrahmen |
| `--transitionNormal` | 0.2s | Übergänge |
| `--fontSizeXSmall` | 85 % | sehr kleine Schrift |
| `--buttonHoverBackground` | primary mit 8 % Deckkraft | Hover von Eigenbau-Buttons |
| `--mainnavHeight` | wird von `MainNavService` gesetzt (z. B. WLO-Staging: 100px) | **nicht für Layout verwenden**, nie als feste Zahl übernehmen |
| `--mainnavCurrentHeight` | `var(--mainnavHeight)` | **immer** für Höhenberechnung |

## 7. Abstände (spacing-Skala)

Für Abstände gibt es noch keine CSS-Variablen; die Werte werden in px geschrieben. Die Skala bildet den Ist-Stand ab: Von 2004 Abstandswerten im Code treffen 65 % exakt und 95 % mit ±2 px.

| Name (DESIGN.md) | Wert | typische Verwendung im Code |
|---|---|---|
| `hair` | 2px | nur Linien, Fokus-Offset |
| `xs` | 5px | Icon-Abstand, enge Listen |
| `s` | 10px | Standard-Gap (Icon–Text in Buttons/Tabs), Abstand zwischen Elementen |
| `m` | 15px | `--roundedContainerMargin`, Polster in Infoboxen |
| `l` | 20px | Polster in Seitenleisten (`.mat-sidenav-padding`), Abschnittsabstand |
| `xl` | 25px | `$cardPadding`, Dialog-`contentPadding` |
| `xxl` | 30px | größere Abschnitte |
| `xxxl` | 40px | Seitenabschnitte, Leerzustände |

8px und 16px kommen im Code oft vor, meist bei Material-nahen Anpassungen. Für **neuen Code** gilt die Skala; Abweichungen werden begründet (Lint-Warnung `off-scale-spacing`). **Bestehende Bausteine** (z. B. Stats-Pille `2px 8px`, Suchfeld-Radius 3px, Dialog-Leiste `17px 20px`) behalten ihre Ist-Werte; Mockups und Handoffs des Ist-Stands übernehmen sie so, wie sie in `component-specs.md` und `node-entries-anatomy.md` stehen.

## 8. Layout-Variablen (SCSS, statisch)

Quelle: `variables-scss.scss`. Einbinden mit `@use 'projects/edu-sharing-ui/assets/scss/variables-scss' as vars;`.

| Variable | Wert | Zweck |
|---|---|---|
| `vars.$mobileWidth` | 700px | Mobil-Breakpoint (z. B. `.hidemobile`) |
| `vars.$mobileTabSwitchWidth` | 900px | ab hier untere Mobilleiste, Sidebar wird Modal |
| `vars.$mobileSidebarModal` | 900px | Sidebar wird Modal |
| `vars.$mobileWidthPortrait` | 400px | schmale Hochformat-Geräte |
| `vars.$mobileHeight` / `$mobileHeightLandscape` | 750px / 400px | niedrige Viewports |
| `vars.$mobileTabNavHeight` | 62px | Höhe der unteren Mobilleiste |
| `vars.$secondaryBarHeight` | 72px | alle Sekundärleisten (Topbar Workspace, Tab-Nav, Sidebar-Header, Footer-Leisten) |
| `vars.$nodeEntriesTableRowHeight` | 58px | Tabellenzeile |
| `vars.$listItemHeight` | 70px | Listeneintrag |
| `vars.$cardHeight` / `$cardPadding` | 300px / 25px | **Altwert**, nur noch in `oer-page` genutzt. Die Grid-Kachel (`es-node-entries-card`) hat keine feste Höhe; mit drei Metadaten-Zeilen sind es ca. 400–410px |
| `vars.$workspaceSidebarWidth` / `$dialogRightWidth` | 300px / 320px | Seitenleisten |
| `vars.$contextMenuWidth` | 240px | Kontextmenü |
| `vars.$fontSizeXLarge/Large/Small` | 120 % / 110 % / 90 % | relative Schriftgrößen |
| `vars.$dialogZIndex` / `$topBarZIndex` / `$mobileTabsZIndex` | 130 / 98 / 110 | Ebenen (nicht eigene z-index-Zahlen erfinden) |

SCSS-Farbvariablen wie `$warning` und `$colorStatusPositive` sind **deprecated**. Stattdessen `var(--colorStatus…)` verwenden.

## 9. Material-Paletten

`--palette-primary-50 … -900`, `-A100 … -A700`, `--palette-primary-contrast-500` usw. erzeugt `angular-material-css-vars` aus der Primärfarbe. Diese Werte **kippen nicht** im Dark Mode.

Erlaubt sind sie nur:

- in `material-theme.scss`
- für Text auf `--primary`-Fläche (`--palette-primary-contrast-500`)

## 10. Branding-Beispiel WLO

Installationen setzen eigene Farben über `client.config` → `themeColors`. Code darf deshalb nie mit den Default-Hexwerten rechnen. So sieht es bei WLO aus (ausgelesen von `suche.staging.openeduhub.net/edu-sharing/rest/config/v1/values`):

| Variable | WLO hell | WLO dunkel (vom Client abgeleitet) | Folgerung |
|---|---|---|---|
| `--primary` | `#003b7c` | `#abc7ff` | Weiß auf primary 10,96:1, primary auf Weiß 10,96:1. Palette siehe §1 |
| Kachel-Radius | 12px (gemessen auf WLO-Staging) | – | Abweichung über WLO-CSS; der Code-Default hat **keinen** Radius |
| `--mainnavHeight` | 100px (gemessen) | – | höher als der Default 70px |
| `--accent` | `#e4f700` | `#c0d100` | **auf Weiß 1,19:1** → Accent nie als Text- oder Icon-Farbe auf hellen Flächen. Auf Accent-Fläche dunkle Schrift (schwarz 17,6:1, primary 9,2:1) |
| `--footerBackground` / `--footerFontColor` | `#032850` / `#d1d1d1` | – | 9,66:1 |
| `--warn` | Default `#cd2457` | Default `#ff6b9d` | |

Prüfen mit beliebigen Farben: `node ../edu-sharing-ux-audit-accessibility/scripts/contrast.mjs "#e4f700" "#ffffff"`.
