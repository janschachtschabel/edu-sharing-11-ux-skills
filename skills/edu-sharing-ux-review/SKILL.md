---
name: edu-sharing-ux-review
description: Führt ein UX-Review eines Screens, Flows, Dialogs oder Merge Requests im edu-sharing-Frontend durch – Nutzerführung, Konsistenz mit edu-sharing-Mustern (Actionbar, Dialoge, Toasts, Leer-/Ladezustände, Mobil-Verhalten), Fehlervermeidung und Verständlichkeit – und liefert eine priorisierte Befundliste nach Schweregrad. Verwenden bei UX prüfen, UX-Review, Usability, Nutzerführung, Bedienbarkeit, Flow prüfen, Screen bewerten, Konzept prüfen, "ist das intuitiv", Feedback zur Oberfläche oder Design-Review im edu-sharing- oder WirLernenOnline-Kontext.
metadata:
  owner: team-5-ui-ux
  version: 0.5.0
---
# UX-Review für edu-sharing

## Zweck
Findet Bedienprobleme und Abweichungen von etablierten edu-sharing-Mustern, bevor Nutzende sie finden. Das Ergebnis ist eine Befundliste, kein Redesign.

Dieser Skill ändert keinen Code. Barrierefreiheit prüft der Skill `edu-sharing-ux-audit-accessibility`, Texte im Detail `edu-sharing-ux-write-copy`.

## Ablauf
1. **Kontext klären** (höchstens 3 Rückfragen, falls unklar):
   - Wer nutzt den Screen: Lehrende, Lernende, Redaktion oder Administration?
   - Was ist die Hauptaufgabe?
   - Welcher Einstieg führt hierher?
2. **Material sammeln.** Template, TS und SCSS des Screens lesen; wenn vorhanden auch Story, Screenshot oder Handoff. Laufzeitverhalten (Dialoge, Toasts, Routing) im TS nachverfolgen.
3. **Hauptaufgabe durchspielen.** Schritt für Schritt aufschreiben, was die Person sieht und tut: Klicks, Entscheidungen, Wartezeiten, mögliche Sackgassen.
4. **Prüffragen anwenden.** Alle Bereiche in [references/heuristics.md](references/heuristics.md) durchgehen: Nielsen-Heuristiken, bezogen auf edu-sharing-Muster.
5. **Zustände prüfen.** Erstbesuch/leer, Laden, 1 Element, 1000 Elemente, langer Titel, fehlendes Vorschaubild, Fehler, keine Berechtigung, mobil unter 900px, Dark Mode, eingebettet. Zustände, die sich ohne Code oder Screen nicht prüfen lassen, als offene Frage aufführen statt sie zu raten.
6. **Bewerten und ausgeben** im Format unten. Höchstens 15 Befunde; ähnliche zusammenfassen.

## Schwere

| Stufe | Bedeutung |
|---|---|
| **Blocker** | Hauptaufgabe nicht lösbar oder Datenverlust möglich (z. B. Löschen ohne Bestätigung) |
| **Hoch** | Aufgabe nur mit Umweg oder Raten lösbar; Muster weicht von edu-sharing ab und führt zu Fehlbedienung |
| **Mittel** | spürbare Reibung, Inkonsistenz, fehlender Zustand |
| **Niedrig** | Feinschliff, Wording, Ausrichtung |

## Ausgabeformat
```
## UX-Review: <Screen/Flow>
Kontext: <Persona> · Hauptaufgabe: <…> · Grundlage: <Dateien/Screenshots>

Durchlauf Hauptaufgabe: 1. … 2. … (⚠ an Stellen mit Reibung)

| # | Schwere | Heuristik | Ort (Datei:Zeile oder UI-Element) | Befund | Empfehlung (edu-sharing-Muster) |
|---|---|---|---|---|---|

Was gut funktioniert: (max. 3 Punkte)
Offene Fragen an Team 5: …
```

## Verbindlich
- Jede Empfehlung nennt ein **vorhandenes** edu-sharing-Muster oder eine vorhandene Komponente:
  - `es-actionbar`/`OptionItem`
  - `DialogsService`-Button-Sätze
  - `Toast`
  - `es-info-message`
  - `#empty`-Template
  - `es-node-entries-wrapper`-Darstellungsarten
  - `es-dropdown` als Bottom Sheet
  - `Closable.Confirm` bei ungespeicherten Änderungen

  Gibt es kein passendes Muster, steht in der Empfehlungsspalte „kein Muster – siehe Offene Frage n“, und die Frage geht an Team 5.
- Befunde sind beobachtbar und prüfbar, nicht „wirkt unruhig“, sondern z. B. „3 gleich gewichtete `mat-flat-button` nebeneinander (Zeile 42); Primäraktion unklar“.
- Das gilt auch für „Was gut funktioniert“: nur nennen, was im Code bis zum Verbraucher nachverfolgt ist. Beispiel: Ein Router-State, den niemand liest, ist kein Plus.
- Mobil (< 900px) und Dark Mode gehören immer zum Review.

## Spielraum
- Ob ein Befund als neue Designregel an Team 5 gemeldet wird (Label `design-rule`), entscheidet die reviewende Person. Der Skill schlägt es bei wiederkehrenden Mustern vor.

## Nie
- Neue visuelle Stilrichtungen vorschlagen (andere Farben, Schriften, Glassmorphism) oder Komponenten außerhalb von Angular Material und `ngx-edu-sharing-ui` empfehlen.
- Geschmacksurteile ohne Bezug zu Aufgabe oder Muster.
- Mehr als eine Primäraktion pro Bereich empfehlen.

## Verweise
- Prüffragen nach Heuristik mit edu-sharing-Mustern: [references/heuristics.md](references/heuristics.md)
- Ist-Aufbau von Seiten, Kacheln und Bausteinen zum Vergleich, im Skill `edu-sharing-ux-build-components`: `references/page-layouts.md`, `references/node-entries-anatomy.md`, `references/component-specs.md`, `references/forms.md`
- Themenseiten: Skill `edu-sharing-ux-build-topic-pages`; eingebettete Oberflächen: Skill `edu-sharing-ux-build-embeds`

## Abschluss-Checkliste
- [ ] Persona und Hauptaufgabe benannt
- [ ] Hauptaufgabe Schritt für Schritt durchgespielt
- [ ] Zustände geprüft: leer, laden, Fehler, viel/wenig Inhalt, mobil, dark
- [ ] Jeder Befund hat Ort, Heuristik, Schwere und eine Empfehlung mit edu-sharing-Muster
- [ ] A11y-Themen an `edu-sharing-ux-audit-accessibility` verwiesen statt selbst tief geprüft. Ausnahme: Ist die Hauptaufgabe per Tastatur nicht lösbar, bleibt der Befund hier in voller Schwere (Blocker oder Hoch).
