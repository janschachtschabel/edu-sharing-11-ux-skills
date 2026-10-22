---
name: edu-sharing-ux-create-skills
description: Erarbeitet mit dem Designteam UI/UX-Regeln für KI-Coding-Agenten und erstellt daraus eine DESIGN.md, Design-Skills (SKILL.md) oder Markdown-Handoffs für WirLernenOnline/edu-sharing. Verwenden, wenn jemand Designregeln, Design-Tokens, eine DESIGN.md, einen Design-Skill, Regeln für Agenten, eine Entwickler-Übergabe oder einen Handoff anlegen, testen, verbessern oder aus Figma, Styleguide oder Code (SCSS, Angular-Theme) ableiten möchte.
metadata:
  owner: team-5-ui-ux
  version: 1.4.0
---
# WLO-Design-Regeln erarbeiten und ablegen

## Ablauf (Checkliste kopieren und abhaken)
- [ ] 1. **Format klären.**
  - Gilt die Regel immer: DESIGN.md.
  - Gilt sie für eine Aufgabe: Skill.
  - Gilt sie für ein Feature: Handoff.
- [ ] 2. **Quellen anfordern:** Tokens, Komponenten mit Zuständen, UX-Regeln, Texte, Do/Don't, A11y-Werte.
  - Ist die Quelle Code statt Figma: Token-Dateien, Theme, Mixins, Komponentenbibliothek, i18n-Dateien und eine vorhandene AGENTS.md/CLAUDE.md lesen (siehe references/code-extraction.md).
- [ ] 3. **Testaufgaben und Baseline.** Nach 3 echten Testaufgaben fragen und nach Baseline-Fehlern eines Agenten ohne Regeln. Im Code-Fall zusätzlich die Verstöße zählen, die im Bestand schon stecken, denn ein Agent kopiert Nachbarcode.
- [ ] 4. **Bestandsaufnahme:** Fakten (mit Quelle) · Annahmen · Widersprüche · offene Fragen.
- [ ] 5. **Iterieren.** Höchstens 5 Rückfragen pro Runde, Widersprüche gegenüberstellen, je Regel ein Do/Don't.
- [ ] 6. **Arbeitsnotiz.** Auf das Stichwort „Arbeitsnotiz“ den Stand zusammenfassen: references/prompts.md, Prompt A.
- [ ] 7. **Verdichten** nach references/design-md-template.md, references/skill-skeleton.md oder references/handoff-template.md (Prompts B und C).
- [ ] 8. **Qualitätsprüfung** (unten). Testfälle nach references/evals-template.json anlegen, offene Fragen ausgeben.
- [ ] 9. **Testen** in einer frischen Sitzung und mit Prompt D auswerten. Dazu ein **Mockup-Test**: Eine Sitzung, die nur DESIGN.md und Skills kennt, entwirft eine typische Seite. Danach mit Screenshots des Originals abgleichen. So fallen fehlende Aufbau-Beschreibungen auf.
- [ ] 10. **Ablage nennen:** Pfad im Repo wlo-design-skills, Hinweis auf Merge Request mit Review durch Team 5 und Team 6, AGENTS.md-Abschnitt nach references/agents-md-section.md.

## Verbindlich
- Werte nur aus den Quellen. Fehlendes wird nachgefragt, nie erfunden.
- `name`: kleinbuchstaben-mit-bindestrich, höchstens 64 Zeichen, gleich dem Ordnernamen. Schema: Produkt-Präfix + Verb + Gegenstand, z. B. `edu-sharing-ux-build-components`, `edu-sharing-ux-write-copy`. So stehen alle Skills im Slash-Menü nebeneinander (`/edu-sharing-ux-…`).
- `description`: 3. Person, WAS und WANN, enthält die Begriffe, die Entwickler:innen tippen. Lieber zu offensiv als zu vage.
- Größen:
  - DESIGN.md unter 8 KB.
  - SKILL.md-Body unter 500 Zeilen.
  - Details in references/, nur eine Ebene tief; Inhaltsverzeichnis ab 100 Zeilen.
- Werte exakt (Token-Name, Hex, px). Jede Regel hat ein Do/Don't. Ein Begriff pro Konzept.
- Vorhandene edu-sharing/Angular-Komponenten vor Neubau; Tokens statt Hardcodes.
- A11y-Mindestwerte (WCAG 2.1 AA) stehen immer als eigene Checkliste. Kontraste werden **berechnet**, nicht geschätzt, und zwar für alle Theme-Modi und für die bekannten Branding-Farben (z. B. WLO aus `/edu-sharing/rest/config/v1/values` → `themeColors`).
- Code-Quellen auf Wirksamkeit prüfen: veraltete Selektoren und umbenannte Tokens werden nicht als Regel übernommen.
- Wo möglich gibt es einen Validator als Skript (Lint, Kontrast), damit die Checkliste prüfbar ist.

## Nie
- Allgemeinwissen erklären (was ein Button ist).
- Generische KI-Ästhetik zulassen (Verlaufstext, Fremd-Fonts, Deko-Glassmorphism).
- Verschachtelte Verweise (Datei → Datei → Datei).
- Datumsabhängige Regeln („ab Q3 gilt …“).
- Den Ist-Zustand des Codes als Zielbild ausgeben, wenn der Auftrag etwas anderes sagt (z. B. „Material Design 3“). Den Widerspruch zeigen und Team 5 fragen.

## Qualitätsprüfung vor Abgabe
- [ ] Würde ein Agent den Skill anhand der description für alle 3 Testaufgaben laden?
- [ ] Ist jede Regel prüfbar (Wert, Komponente, Zustand)?
- [ ] Gibt es eine Abschluss-Checkliste und, wo möglich, einen Validator (DESIGN.md-Lint, Kontrast, Storybook)?
- [ ] Stehen die wichtigsten Regeln zusätzlich in der DESIGN.md, und nennt sie alle Skills mit Auslösern?
- [ ] Sind alle genannten Tokens, Komponenten und i18n-Schlüssel im Code vorhanden (stichprobenartig per grep geprüft)?

## Verweise
- Prompts A–D: references/prompts.md
- Vorlagen: references/design-md-template.md, references/skill-skeleton.md, references/handoff-template.md, references/evals-template.json, references/agents-md-section.md
- Regeln aus Code ableiten: references/code-extraction.md
