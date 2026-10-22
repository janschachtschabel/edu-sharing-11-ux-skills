# Mixins nach Anwendungsfall

Quelle: `projects/edu-sharing-ui/assets/scss/mixins.scss`.

Einbinden:

```scss
@use 'projects/edu-sharing-ui/assets/scss/mixins' as mixins;
@use 'projects/edu-sharing-ui/assets/scss/variables-scss' as vars;
```

`variables-scss` reicht die Mixins mit `@forward` weiter. `vars.clickable()` funktioniert also auch, `mixins.` ist aber lesbarer.

| Fall | Mixin | Hinweis |
|---|---|---|
| Fokus für eigenes klickbares Element | `setGlobalKeyboardFocus($mode: 'outline' \| 'border', $color: var(--focusColor))` | 2px, Offset 2px; in `&.cdk-keyboard-focused` oder `&:focus-visible` |
| Fokus in Listen | Kachel: `setGlobalKeyboardFocus()` auf dem Titel-Link; Tabellenzeile: `setGlobalKeyboardFocus('border')` | so in `node-entries-card.main.scss` und `node-entries-table.component.scss` |
| Fokus innen (eng begrenzte Flächen, z. B. `.btn-circle`) | `setGlobalInsetFocus()` | Innenschatten, auf Touch-Geräten aus; in den Listen-Komponenten nicht verwendet |
| Fokus gestrichelt | `setGlobalDashedFocus()` | |
| Klickbar (Cursor, keine Textauswahl) | `clickable()` | dazu `role`, `tabindex` und Tastatur-Handler |
| Text auf n Zeilen kürzen | `limitLineCount($count, $lineHeight: 1)` | mit Fallback für Engines ohne `line-clamp` |
| Text einzeilig kürzen | `shortenText()` / `limitLineLength($width)` | |
| Standardschatten | `materialShadow()` | `0 0 5px rgba(0,0,0,.3)`; auch der Schatten von `roundedContainerCard()` und der Typ-Badges |
| kleiner / mittlerer / großer Schatten | `materialShadowSmall()` / `materialShadowMedium($opacity: .15)` / `materialShadowMediumLarge($important, $opacity: .6)` / `materialShadowLarge()` | `0 0 3px rgba(0,0,0,.3)` / `0 0 12px rgba(0,0,0,.15)` / `0 0 25px rgba(0,0,0,.6)` (Hover der Kachel mit `.2`) / `0 10px 70px rgba(0,0,0,.15)` |
| Schatten nur unten / oben (Leisten) | `materialShadowBottom($opacity: .1)` / `materialShadowTop($opacity: .1)` | `0 3px 3px rgba(0,0,0,.1)` (auch Grid-Kachel) / `0 -3px 3px rgba(0,0,0,.1)` (Auswahl-Leiste) |
| Gestylte Scrollbar | `materialScrollbar()` / `materialScrollbarLight()` | auf internen Scrollbereichen; Light setzt auch Firefox-Werte |
| Seitenkarte | `roundedContainerCard(vars.$mobileTabSwitchWidth, vars.$mobileTabNavHeight, $drawerNudge: true)` | Margin, Fläche, 20px Radius, Schatten; mobil randlos mit Abstand für die untere Leiste. **Nur auf oberster Ebene `.main-content`**, nie unter `mat-sidenav-container { }` verschachtelt |
| Seitenkarte mit internem Scroll | zusätzlich `roundedContainerStaticScroll(vars.$mobileTabSwitchWidth, vars.$mobileTabNavHeight)` | scrollendes Kind: `flex: 1; min-height: 0; overflow-y: auto` |
| Sidebar oder Filter als Mobil-Modal | `mobileModalOverlay(vars.$mobileTabSwitchWidth, vars.$mobileTabNavHeight, vars.$dialogZIndex)` | eigene Abdunkelung, setzt `--mobileModalHeight` |
| Drawer-Animation mobil aus | `disableDrawerTransitions(vars.$mobileTabSwitchWidth)` | in `::ng-deep` |
| Stil nur im Kontrastmodus | `@include mixins.contrastMode { … }` (gekapselt) / `contrastMode(global)` | Body-Klasse `es-contrast-mode` |
| Overlay über ganzer Fläche | `overlay()` | absolut, z-index 2 |
| Abdunkeln | `darken()` / `darkenLight()` | rgba(0,0,0,.75) / .25 |
| Hintergrund-Unschärfe (nur Overlays) | `blurBackground($radius: 5px, $darken: 0)` | nicht als Deko |
| Unscharfes Hintergrundbild | `blurImage($blurStrength: 25px)` | z. B. Kopfbereich mit Vorschaubild |
| Button-Defaults entfernen | `removeButtonDefaultStyles()` | für `<button>` ohne Material-Optik |
| Platzhalter stylen | `@include mixins.placeholder { color: var(--placeholderColor); }` | |
| Pseudo-Element über ganzer Fläche | `afterPseudoElement { … }` | z. B. Drop-Ziel-Rahmen |

Nicht verwenden:

- `removeDefaultFocus()` allein, denn dann gibt es keinen sichtbaren Fokus.
- `focusShadow()` für neue Elemente. Es setzt einen runden Halo mit fest eingebauten rgba-Werten.
