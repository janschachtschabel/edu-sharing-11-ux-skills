# Prompts A–D

Platzhalter stehen in [eckigen Klammern].

## Prompt A · Brainstorming starten (Schritt 2)
```
Du hilfst dem UI/UX-Team Designregeln für KI-Coding-Agenten zu erarbeiten.
Produkt: edu-sharing und WirLernenOnline.
Thema dieses Gesprächs: [z. B. Materialkacheln in Suchergebnissen]
Ziel am Ende: [DESIGN.md | Skill | Handoff]
Angehängte Quellen: [tokens.json, Screenshots, Code-Ausschnitt, Styleguide, A11y-Vorgaben]
Fehler eines Agenten ohne Regeln (Baseline): [Liste]
So arbeiten wir:
1. Lies alle Quellen und erstelle eine Bestandsaufnahme in drei Listen:
   - Fakten: Wert oder Regel + Quelle (Datei, Seite oder Zeile)
   - Annahmen: was du ableitest, mit Begründung
   - Offene Fragen: Lücken und Widersprüche zwischen Quellen
2. Stelle höchstens 5 Rückfragen pro Runde, die wichtigsten zuerst.
3. Erfinde keine Werte, Komponentennamen oder Regeln. Fehlt etwas, kommt es zu den offenen Fragen.
4. Schlage zu jeder Regel ein Do/Don't-Paar vor und nenne den Baseline-Fehler, den sie verhindert.
5. Prüfe am Ende jeder Runde: Was würde ein Coding-Agent mit diesen Regeln immer noch falsch machen?
Wenn ich „Arbeitsnotiz“ schreibe, fasse den Stand auf höchstens einer Seite zusammen:
Fakten mit Quelle · beschlossene Regeln · Do/Don't · Anti-Patterns · offene Fragen.
```

Impulse für die Iterationsrunden:
- „Wo widersprechen sich die Quellen? Stelle beide Stellen gegenüber.“
- „Formuliere Regel [n] so, dass ein Agent sie prüfen kann: Token, Komponente, Zustand oder Zahl.“
- „Spiel den Agenten: Löse Testaufgabe [n] nur mit den bisherigen Regeln und markiere, wo du rätst.“
- „Welche dieser Regeln kennt ein Modell ohnehin? Streiche sie.“
- Zusätzlich bei Code als Quelle: „Welche dieser Regeln wirkt im aktuellen Framework gar nicht mehr (veraltete Selektoren, umbenannte Tokens)?“
- Zusätzlich bei Code als Quelle: „Berechne die Kontraste aller Text-Flächen-Paare in Light und Dark.“

## Prompt B · Zur DESIGN.md verdichten (Schritt 3)
```
Überführe die Arbeitsnotiz unten in eine DESIGN.md nach der angehängten Vorlage.
- Token-Block als YAML-Frontmatter, nur Werte aus der Arbeitsnotiz.
- Abschnitte in der Reihenfolge der Vorlage; leere Abschnitte weglassen.
- 10–20 Kernregeln, nummeriert, jede prüfbar (Token, Komponente, Zustand oder Zahl).
- Keine Adjektive ohne Wert, keine Datumsangaben, ein Begriff pro Konzept.
- Gesamtlänge unter 8 KB.
Gib danach getrennt aus: (1) offene Fragen, (2) Stellen, an denen du gekürzt hast.
Arbeitsnotiz: [einfügen]
Vorlage: [DESIGN.md-Vorlage einfügen]
```

## Prompt C · Zum Skill verdichten (Schritt 3)
```
Erstelle aus der Arbeitsnotiz unten einen Skill nach dem SKILL.md-Standard (agentskills.io).
Thema: [z. B. Materialkacheln bauen]
Auslöser, die Entwickler:innen tippen: [Kachel, Card, Suchergebnis, Trefferliste]
Anforderungen:
1. Frontmatter: name (max. 64 Zeichen, kleinbuchstaben-mit-bindestrich, Präfix + Verb + Gegenstand, z. B. edu-sharing-ux-build-tiles),
   description (max. 1024 Zeichen, 3. Person, WAS und WANN, alle Auslöser-Begriffe),
   metadata (owner: team-5-ui-ux, version: 1.0.0).
2. Body unter 500 Zeilen, nur Wissen, das ein Modell nicht schon hat.
3. Abschnitte: Zweck · Ablauf (nummeriert) · Verbindlich (exakte Werte) · Spielraum · Nie · Verweise · Abschluss-Checkliste.
4. Tokens aus der DESIGN.md nur referenzieren, nicht kopieren.
5. Lange Tabellen (Komponenten, Beispiele, Texte) in references/*.md, eine Ebene tief verlinkt,
   Inhaltsverzeichnis ab 100 Zeilen.
6. Zusätzlich: evals/evals.json mit 3 Testaufgaben (query, expected_behavior[]) und eine Liste offener Fragen.
Gib jede Datei als eigenen Codeblock mit Dateipfad aus.
Arbeitsnotiz: [einfügen]
```

## Prompt D · Testergebnis auswerten (Schritt 4)
```
Hier sind ein Skill, seine Testaufgaben (evals.json) und das Ergebnis eines Agenten in einer frischen Sitzung.
1. Wurde der Skill geladen? Woran erkennst du das?
2. Tabelle: Testaufgabe · erwartetes Verhalten · erfüllt ja/nein · Beleg im Ergebnis.
3. Für jedes „nein“: Welche Regel fehlte oder war unklar? Kleinste Änderung am Skill vorschlagen.
4. Welche Passagen des Skills haben nichts bewirkt und können weg?
Skill: [einfügen] · evals.json: [einfügen] · Ergebnis: [einfügen]
```
