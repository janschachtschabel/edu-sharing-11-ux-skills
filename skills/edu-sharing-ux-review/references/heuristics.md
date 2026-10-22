# Prüffragen nach Heuristik (Nielsen) mit edu-sharing-Mustern

Hinweis aus der Recherche: Ein etablierter Skill für heuristische UX-Reviews existiert nicht [U]. Diese Liste ist eine erste Fassung und wird nach den Testläufen geschärft.

## 1. Sichtbarkeit des Systemzustands
- Gibt es beim Laden eine Anzeige?
  - Bereich: `es-spinner`
  - inline: `es-spinner-small`
  - blockierend: `toast.showProgressSpinner()`
  - im Dialog: `patchState({ isLoading })`
- Wird eine Aktion bestätigt (`Toast` Info)? Bei lang laufenden Aktionen: Ist erkennbar, dass etwas läuft?
- Zeigt eine Auswahl die Anzahl? `es-actionbar` reagiert auf `selectionChange`.
- Ist der aktuelle Ort klar: Titel über `setMainNavConfig({ title })`, `es-breadcrumbs`, aktiver Tab?

## 2. Übereinstimmung mit der realen Welt
- Werden die Begriffe der Nutzenden verwendet (Material, Sammlung, Merkliste) statt Systembegriffe (Node, MDS, ccm:…)?
- Folgen Metadaten-Labels den MDS-Übersetzungen statt eigenen Bezeichnungen?

## 3. Nutzerkontrolle und Freiheit
- Gibt es Abbrechen und Zurück? Dialoge: `Closable.Casual` für Info, `Standard` für Formulare, `Confirm` bei ungespeicherten Änderungen.
- Löschen landet im Papierkorb, und das ist kommuniziert. Endgültiges Löschen nur mit `DELETE_OR_CANCEL`.
- Lassen sich Filter zurücksetzen (`CLEAR_FILTERS`)?

## 4. Konsistenz und Standards
- **Aktionen zu Materialien** laufen über `es-actionbar` und `OptionItem` (gleiche Icons und Reihenfolge wie im Arbeitsbereich und in der Suche), nicht über eigene Button-Leisten.
- **Dialog-Buttons**: Standard links, Primärbutton rechts. Nur ein Primärbutton. Der Gefahrenbutton steht nur in **Bestätigungsdialogen** rechts (`DELETE_OR_CANCEL`). Eine destruktive Nebenaktion in einem Formulardialog (z. B. „Löschen“ neben „Speichern“) kommt nach links: `DialogButton` mit `position: 'opposite'` und `color: 'danger'`.
- **Darstellung von Listen**: `es-node-entries-wrapper` mit Grid, SmallGrid oder Table. Gibt es einen Umschalter, liegt er an derselben Stelle wie in Suche und Sammlungen.
- **Rückmeldungen**: Toast für kurze Info oder Fehler; `es-info-message` für dauerhafte Hinweise im Inhalt; kein `alert()`, kein eigenes Banner.
- **Navigation**: keine eigene Kopfleiste, sondern `es-main-nav`; Sekundärleisten 72px hoch.
- **Icons**: dieselbe Bedeutung wie anderswo. Vorbild sind die Options-Fabriken in `src/app/services/options/`:
  - `delete` steht für Löschen (`OPTIONS.DELETE`).
  - `do_not_disturb_on` steht für „Aus Sammlung entfernen“ (`OPTIONS.REMOVE_REF`).

## 5. Fehlervermeidung
- Sind destruktive Aktionen räumlich und farblich (`color="warn"`) von häufigen Aktionen getrennt?
- Sind Pflichtfelder vor dem Absenden erkennbar (`required-marker`, `mat-error`)?
- Sind Optionen deaktiviert, wenn die Berechtigung fehlt (`esToolpermission`, `OptionItem.enabledCallback`), und erklärt `optionTooltip`, warum?

## 6. Wiedererkennen statt Erinnern
- Werden Vorschaubild, Titel und Typ-Badge (`es-node-type-badge`) gezeigt, damit Materialien wiedererkannt werden?
- Bleiben Auswahl und Filter beim Zurücknavigieren erhalten? Achtung: Geteilte `BehaviorSubject`s werden beim neuen Routing bewusst zurückgesetzt.

## 7. Flexibilität und Effizienz
- Gibt es Mehrfachauswahl (Checkbox, Strg-Klick über `ctrlClickBehavior`) für Massenaktionen?
- Drag & Drop **plus** gleichwertige Menüaktion (`dragAndDropOptions`)?
- Sind häufige Aktionen ohne Menü erreichbar (`numberOfAlwaysVisibleOptions`, `OptionItem.showAsAction`)? Achtung: Diese Einstellungen wirken in `es-actionbar` und auf Karten (Grid, SmallGrid), **nicht** in der Tabellenansicht (`displayType: Table`). Dort laufen die Aktionen über das Zeilenmenü.

## 8. Ästhetik und Minimalismus
- Gibt es genau eine Primäraktion pro Bereich?
- Folgen die Abstände der Skala (5/10/15/20/25/30/40px)? Uneinheitliche Abstände wirken unruhig und sind ein Befund „Niedrig“.
- Werden Metadaten nur gezeigt, wenn sie bei der Aufgabe helfen? Rest über `es-mds-viewer` oder Detailansicht.
- Keine Dekoration ohne Funktion: keine Verläufe, keine zusätzlichen Schatten-Ebenen.

## 9. Fehler erkennen und beheben
- Sagt die Fehlermeldung, was passiert ist und was zu tun ist (Skill `edu-sharing-ux-write-copy`)?
- Bleiben Eingaben nach einem Fehler erhalten?
- Bei fehlender Berechtigung: `toolpermissionError()` bzw. `.toolpermission-missing` statt leerer Fläche.

## 10. Hilfe
- Steht ein kurzer Hinweis im Kontext (`mat-hint`, `es-info-message mode="info"`) statt in externer Doku?
- Haben neue Funktionen bei Bedarf einen Einstieg über `es-tutorial`?

## Zustände-Matrix (für Schritt 5)

| Zustand | Erwartetes Muster |
|---|---|
| Erstbesuch / leer | `#empty`-Template mit Text und, wenn möglich, nächstem Schritt |
| Laden | `es-spinner` im Bereich; kein Springen des Layouts |
| 1 Element | kein Layout-Bruch (Grid mit einer Kachel) |
| 1000 Elemente | Infinite Scroll oder Paginator (`paginationStrategy`) |
| Langer Titel | `limitLineCount()` + Tooltip |
| Kein Vorschaubild | `es-preview-image` zeigt den Fallback des Typs |
| Fehler | `toast.error()`; Bereich bleibt bedienbar |
| Keine Berechtigung | Option deaktiviert mit Tooltip oder ausgeblendet; Erklärung |
| Mobil < 900px | untere Leiste frei, Menüs als Bottom Sheet, Dialoge unten ausgerichtet |
| Dark Mode | keine hellen Flächen, die aus dem Rahmen fallen |
| Eingebettet | helles Theme, keine Abhängigkeit von `es-main-nav` |
| Branding WLO (primary `#003b7c`, accent `#e4f700`) | keine Information hängt an der Accent-Farbe auf hellen Flächen; Primärflächen lesbar |
| Touch / kleine Ziele | Bedienelemente mindestens 24 × 24 px, Material-Größen nicht verkleinert (Icon-Button 40px) |
