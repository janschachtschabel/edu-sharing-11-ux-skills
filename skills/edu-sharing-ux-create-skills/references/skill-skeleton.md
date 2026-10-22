# Vorlage · SKILL.md

Ordner:

```
[edu-sharing-ux-verb-gegenstand]/
├── SKILL.md            Pflicht: Frontmatter + Ablauf + Regeln + Checkliste
├── references/         Details, nur bei Bedarf gelesen (eine Ebene tief)
├── assets/             Vorlagen
├── scripts/            Validatoren (Lint, Kontrast), keine Abhängigkeiten
└── evals/evals.json    drei Testaufgaben
```

Inhalt der SKILL.md:

```markdown
---
name: [edu-sharing-ux-build-tiles]
description: [Baut und prüft … im … nach dem …-Designsystem. Verwenden bei Aufgaben zu <alle Begriffe, die Entwickler:innen tippen>.]
metadata:
  owner: team-5-ui-ux
  version: 1.0.0
---
# [Titel]
## Zweck
[1–2 Sätze]
## Ablauf
1. Vorhandene Komponente in references/components.md suchen, nicht neu bauen.
2. Werte nur aus DESIGN.md (Tokens).
3. Alle Zustände umsetzen: default, hover, focus, disabled, loading, leer, Fehler.
4. Storybook-Story ergänzen.
5. Validator ausführen: `node scripts/[lint].mjs <dateien>`.
6. Abschluss-Checkliste abarbeiten.
## Verbindlich
- [exakte Werte: Token-Namen, px, Komponenten]
## Spielraum
- [wo Gestaltung frei ist]
## Nie
- [Anti-Patterns, je mit Ersatz]
## Verweise
- [references/…md]
## Abschluss-Checkliste
- [ ] Nur Tokens, keine Hardcodes
- [ ] Fokus sichtbar, per Tastatur bedienbar
- [ ] Kontrast ≥ 4,5:1 (alle Theme-Modi)
- [ ] Lade-, Leer- und Fehlerzustand vorhanden
- [ ] Storybook-Story ergänzt
```
