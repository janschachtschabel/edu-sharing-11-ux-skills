---
name: edu-sharing-ux-write-copy
description: Schreibt und prüft Oberflächentexte für das edu-sharing-Frontend – Button-Beschriftungen, Labels, Hinweise, Fehlermeldungen, Leerzustände, Toasts, Dialogtexte, Tooltips und aria-Labels – im edu-sharing-Ton (Sie-Form, Varianten de-informal und de-no-binnen-i, {{GENDER_SEPARATOR}}) und legt sie als ngx-translate-Schlüssel in src/assets/i18n an. Verwenden bei Text, Texte, Wording, Microcopy, UX-Copy, Beschriftung, Label, Button-Text, Fehlermeldung, Fehlertext, Leerzustand, Empty State, Toast, Hinweistext, Dialogtext, Übersetzung, i18n, de.json oder en.json im edu-sharing- oder WirLernenOnline-Kontext.
metadata:
  owner: team-5-ui-ux
  version: 0.5.0
---
# edu-sharing-Oberflächentexte schreiben

## Zweck
Texte sind kurz, eindeutig und in allen Sprachvarianten konsistent. Sie werden als i18n-Schlüssel angelegt, damit Installationen sie über `override` anpassen können.

## Ablauf
1. **Vorhandene Schlüssel suchen.** Generische Schlüssel (siehe [references/ux-copy.md](references/ux-copy.md)) wiederverwenden, z. B. `SAVE`, `CANCEL` oder `CLOSE`. Ein neuer Schlüssel ist nur bei neuem Inhalt nötig.
2. **Ort festlegen.** Die Datei ist `src/assets/i18n/<bereich>/de.json` (Bereiche: `common`, `workspace`, `search`, `collections`, `editorial` …). Den Schlüssel unter dem Präfix des Features anlegen (`COLLECTIONS.RECENT.EMPTY`). Toasts gehören unter `…TOAST.`.
3. **Deutsch schreiben** (Sie-Form) nach den Mustern unten.
4. **Varianten ergänzen:**
   - `en.json` immer.
   - `de-informal.json` nur, wenn der Text die Sie-Form enthält. Dort steht die Du-Form mit großem „Du“.
   - `de-no-binnen-i.json` nur, wenn der Text gegendert ist. Dort steht die neutrale Form.
5. **Einbinden.**
   - Template: `{{ 'KEY' | translate }}`
   - mit Parametern: `| translate: { name: node.title }`
   - Bei `es-info-message`, `DialogButton` und `openGenericDialog` den rohen Schlüssel übergeben. Die Komponente übersetzt ihn selbst.
6. **Abschluss-Checkliste** abarbeiten.

## Verbindlich
- **Anrede:** In `de.json` Sie-Form. `de-informal.json` nutzt die Du-Form mit großem „Du“. Keine Mischung in einem Text.
- **Gendern:** Personenbezeichnungen mit `{{GENDER_SEPARATOR}}` schreiben, z. B. `Autor{{GENDER_SEPARATOR}}in`. Das wird zur Laufzeit zu `*`. Kein `*`, `:` oder Binnen-I direkt. Neutrale Formen sind besser, wo sie natürlich klingen („Lehrende“, „Mitarbeitende“, „Person“).
- **Buttons:**
  - Verb im Infinitiv, 1–3 Wörter, Großschreibung wie im Satz: „Speichern“, „Zur Sammlung hinzufügen“.
  - Kein „OK“, wenn eine konkrete Aktion möglich ist.
  - Unumkehrbar (Löschen): die Folge nennen, „Ja, löschen“ (`YES_DELETE`, Farbe danger).
  - Umkehrbares Entfernen (z. B. aus einer Sammlung): „Entfernen“ ohne „Ja,“, Farbe primary. [Vorschlag aus dem Testlauf; Team 5 bestätigt]
- **Fehlermeldung:** was passiert ist + was die Person tun kann. Beispiel: „Das ausgewählte Bild konnte nicht gelesen werden. Bitte versuchen Sie es mit einem anderen Bild.“
  - Keine Schuldzuweisung, keine Codes im Haupttext.
  - API-Fehler ohne eigenen Text: `toast.error(err)` → `COMMON_API_ERROR`.
- **Leerzustand:**
  - Gibt es im selben Objekt schon Leertexte (z. B. `COLLECTIONS.EMPTY.*`), deren Satzbau übernehmen.
  - Sonst „Keine <Plural>“ oder „Keine <Plural> gefunden“. Beispiel: „Keine Elemente auf der Merkliste“.
  - Optional folgt ein zweiter Satz mit dem nächsten Schritt. Nennt er eine Aktion, die Beschriftung des Buttons **wörtlich** übernehmen, am besten den Schlüssel als Parameter (`{{ action }}`), damit beide gleich bleiben.
- **Toast:** ein Satz im Perfekt oder Passiv, mit Punkt. Beispiel: „Das Element wurde der Sammlung hinzugefügt.“ Platzhalter in `{{ }}`.
- **Ladetext:** „Lädt...“ (`LOADING`) wiederverwenden.
- **Begriffe** (ein Begriff pro Konzept):
  - **Element** für einen beliebigen Knoten (Datei, Link, Ordner)
  - **Material** für Bildungsinhalte aus Nutzersicht
  - **Sammlung**, nicht „Collection“
  - **Ordner**, **Merkliste**, **Freigabe**
  - „Objekt“ in neuen Texten vermeiden
- **Löschen und Entfernen:**
  - **Löschen**: Das Element verschwindet (Papierkorb).
  - **Entfernen**: Nur die Verknüpfung verschwindet, z. B. aus einer Sammlung. Das Original bleibt.
- **aria-Labels:** sagen die Aktion **und** das Objekt, wenn der Kontext fehlt, z. B. „{{ element }} auswählen“ (`SELECT`). Für Icon-Labels gibt es `ICON_LABELS.<icon>` in `common`.

## Spielraum
- Länge und Tonalität von Leerzuständen mit Handlungsaufforderung, z. B. einladend auf Startseiten, nüchtern in der Verwaltung.
- Ob ein Hinweis als `es-info-message` (bleibt sichtbar) oder als Toast (verschwindet) erscheint: Das hängt davon ab, ob die Information zum Handeln gebraucht wird. Wird sie gebraucht, als `es-info-message`.

## Nie
- Texte hart im Template oder im TS-Code, außer bei Debug-Ausgaben.
- „Bitte“ in Button-Texten, Ausrufezeichen in Fehlern, GROSSBUCHSTABEN zur Betonung.
- Technische Begriffe für Nutzende: „Node“, „ccm:io“, „MDS“, „Request“, „403“.
- Gender-Zeichen direkt eintragen statt `{{GENDER_SEPARATOR}}`.
- „Erfolgreich!“-Toasts ohne Inhalt; stattdessen sagen, was passiert ist.
- Neue Schlüssel nur in `de.json` und nicht in `en.json`.

## Verweise
- Generische Schlüssel, Muster und Beispiele: [references/ux-copy.md](references/ux-copy.md)

## Abschluss-Checkliste
- [ ] Vorhandene generische Schlüssel geprüft
- [ ] Schlüssel in `de.json` und `en.json` (gleiche Struktur und Platzhalter)
- [ ] Sie-Form in `de.json`; Du-Variante in `de-informal.json`, falls angesprochen
- [ ] Personenbezeichnungen mit `{{GENDER_SEPARATOR}}` oder neutral
- [ ] Fehlertexte nennen einen nächsten Schritt
- [ ] Begriffe: Element/Material/Sammlung einheitlich; Löschen ≠ Entfernen
- [ ] Icon-only-Buttons haben ein übersetztes `aria-label`
- [ ] Langer Text getestet: Kürzung mit Tooltip oder Umbruch, Umlaute nicht abgeschnitten
- [ ] Jeder Platzhalter (`{{name}}`) wird im Code auch befüllt (`| translate: { … }` bzw. `messageParameters`). Sonst erscheint er roh; dann eine Variante ohne Platzhalter anlegen.
