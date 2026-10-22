---
name: edu-sharing-ux-write-handoff
description: Erstellt aus Figma-Entwürfen, Screenshots, Skizzen oder Konzepttexten eine Handoff-Datei (Markdown) für die Umsetzung im edu-sharing-Angular-Frontend durch Team 6 – mit Zuordnung zu vorhandenen edu-sharing-/Material-Komponenten, Token-Namen, Zuständen, Texten als i18n-Schlüssel, Barrierefreiheit, Randfällen und Abnahme-Checkliste. Verwenden bei Handoff, Übergabe, Entwickler-Übergabe, Spezifikation, Spec, Umsetzungsvorgabe, Ticket-Beschreibung für UI, "Figma an die IT übergeben" oder "Konzept für Team 6 aufbereiten" im edu-sharing- oder WirLernenOnline-Kontext.
metadata:
  owner: team-5-ui-ux
  version: 0.5.0
---
# Handoffs für edu-sharing schreiben

## Zweck
Ein Handoff übersetzt ein Design in die Sprache des Codes: Bausteine, Tokens, Zustände und i18n-Schlüssel. Damit kann ein Coding-Agent oder eine Entwicklerin das Feature ohne Rückfragen bauen und die Abnahme prüfen.

## Ablauf
1. **Quellen anfordern.** Figma-Link oder Export, Screenshots aller Zustände, Ticket, Zielgruppe. Fehlt ein Zustand (leer, Fehler, mobil), wird er als offene Frage notiert und nicht erfunden.
2. **Bausteine zuordnen.** Für jedes UI-Element einen vorhandenen Baustein suchen. Grundlage sind die Kurzliste in der DESIGN.md und `building-blocks.md` im Skill `edu-sharing-ux-build-components`. Ein Neubau braucht eine Begründung.
   - Aktionen auf Listen und in Dialogen werden ein `OptionItem` in der vorhandenen `es-actionbar`. Ein eigener Button braucht eine Begründung.
   - Jeden genannten Service, Input, Scope und Endpunkt im Code nachschlagen (`grep`), bevor er in den Handoff kommt. Dabei prüfen, ob er direkt nutzbar ist (`providedIn`, nötige Provider). Was sich nicht bestätigen lässt, als `[Annahme]` markieren.
3. **Werte übersetzen.**
   - Figma-Farben werden zum passenden Token: Hex mit der Token-Tabelle der DESIGN.md bzw. `tokens.md` abgleichen. Achtung bei WLO-Entwürfen: `#003b7c` ist `--primary` und `#e4f700` ist `--accent` im WLO-Branding, nicht neue Farben. Accent darf nicht als Text auf hellen Flächen stehen (1,19:1); dafür eine offene Frage notieren.
   - Gibt es keinen passenden Token, als `[Abweichung]` mit Vorschlag für einen neuen Token (Light- und Dark-Wert) markieren.
   - Abstände werden auf die `spacing`-Skala der DESIGN.md gerundet (5/10/15/20/25/30/40px). Figma-Werte im 4/8-Raster (8, 12, 16, 24) auf den nächsten Skalenwert setzen und im Handoff vermerken.
   - Klickflächen: Material-Größen übernehmen (Icon-Button 40px, Button 36px); kleinere Figma-Ziele als `[Abweichung]` markieren (Minimum 24px).
4. **Texte festlegen.** i18n-Schlüssel mit de- und en-Text nach dem Skill `edu-sharing-ux-write-copy`.
5. **Vorlage füllen.** [assets/handoff-template.md](assets/handoff-template.md) Abschnitt für Abschnitt ausfüllen. Leere Abschnitte bleiben nicht leer, sondern werden zu offenen Fragen.
6. **Prüfen** mit der Abschluss-Checkliste.
7. **Ablage nennen:**
   - `handoffs/<feature>.md` im Frontend-Repo
   - Verweis im Ticket
   - offene Fragen als Liste am Ende, gerichtet an Team 5

## Verbindlich
- Höchstens 1–2 Seiten. Was in der DESIGN.md steht, wird nicht wiederholt.
- Nur Token-Namen, nie Hex-Werte, außer im Vorschlag für einen neuen Token.
- Jeder Zustand der Tabelle „Zustände“ ist ausgefüllt oder steht als offene Frage da.
- Jede Abweichung von der DESIGN.md ist mit **[Abweichung]** markiert und begründet.
- Die Abnahme-Checkliste ist prüfbar: Komponente, Token, Zustand, Zahl, Text-Schlüssel. Sie wird aus der Vorlage **vollständig** übernommen, keine Zeile wird gestrichen (A11y-Audit und Storybook-Story bleiben drin).

## Spielraum
- Detailtiefe bei Interaktion und Animation nach Komplexität des Features.
- Ob Mockups als Bild eingebettet oder verlinkt werden.

## Nie
- Pixelgenaue Nachbauten von Figma-Werten, die keinem Token entsprechen, ohne Markierung als Abweichung.
- Komponenten außerhalb von Angular Material und `ngx-edu-sharing-ui` vorschlagen.
- Texte als Fließtext ohne Schlüssel.
- Fehlende Zustände raten.

## Verweise
- Vorlage: [assets/handoff-template.md](assets/handoff-template.md)
- Ist-Aufbau zum Abgleich mit dem Entwurf, im Skill `edu-sharing-ux-build-components`: `references/page-layouts.md` (Seiten), `references/node-entries-anatomy.md` (Kacheln, Listen), `references/component-specs.md` (Bausteine). Weicht der Entwurf davon ab, ist das eine `[Abweichung]`. Formulare: `references/forms.md`.
- Themenseite (Widget, Abschnitt, Vorlage): Skill `edu-sharing-ux-build-topic-pages`; dort steht, welche Konfiguration ein Widget braucht. Einbettung: Skill `edu-sharing-ux-build-embeds`; dann im Handoff Gastseite, Höhe und `window.__env` festhalten.
- Ausgefülltes Beispiel: `handoffs/beispiel-zuletzt-angesehen.md` im Skill-Repo

## Abschluss-Checkliste
- [ ] Persona, Aufgabe, Einstieg und Erfolgskriterium benannt
- [ ] Jeder Bereich ist einem vorhandenen Baustein zugeordnet oder als Neubau begründet
- [ ] Nur Token-Namen; neue Tokens mit Light- und Dark-Wert
- [ ] Desktop und Mobil (≤ 900px) beschrieben
- [ ] Alle Zustände inklusive leer, Fehler und keine Berechtigung
- [ ] Texte als Schlüssel mit de und en
- [ ] A11y-Abschnitt: Überschriften, Labels, Kontrast, Tastatur
- [ ] Randfälle 0/1/1000, langer Titel, fehlendes Bild, eingebettet
- [ ] Offene Fragen aufgelistet
