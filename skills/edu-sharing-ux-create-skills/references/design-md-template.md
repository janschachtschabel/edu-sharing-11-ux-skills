# Vorlage · DESIGN.md

Alle Werte sind Platzhalter. Schlüsselnamen im Token-Block vor dem ersten Einsatz mit `npx @google/design.md lint DESIGN.md` abgleichen [A]. Ein ausgefülltes Beispiel ist `DESIGN.md` in diesem Skill-Repo.

```markdown
---
name: [Produkt] Designsystem
version: 1.0.0
colors:
  primary: "[#hex]"        # [--css-var]: Primäraktionen, Links
  on-primary: "[#hex]"     # Text auf primary
  surface: "[#hex]"        # Flächen, Kacheln
  text: "[#hex]"
  error: "[#hex]"
typography:
  body: { fontFamily: "[Font]", fontSize: "[16px]", lineHeight: "[1.5]" }
  heading-1: { fontFamily: "[Font]", fontSize: "[32px]", fontWeight: "[700]" }
spacing: { s1: "[4px]", s2: "[8px]", s3: "[16px]", s4: "[24px]" }
rounded: { s: "[2px]", m: "[4px]", l: "[8px]" }
---
# [Produkt] Designsystem
## Leitbild
[2–3 Sätze: Wirkung, Zielgruppe, wofür das System optimiert. Technische Basis und Quelle der Wahrheit.]
## Kernregeln (immer einhalten)
1. Nur Komponenten aus [Bibliothek/Pfad]; Neubau nur nach Rücksprache mit Team 5.
2. Farben, Abstände, Radien nur über Tokens; keine Hex-Werte im Komponentencode.
3. Jede interaktive Komponente hat die Zustände default, hover, focus, active, disabled.
4. Fokus immer sichtbar: [Token/Mixin].
5. Kontrast Text ≥ 4,5:1, große Schrift ≥ 3:1 [in allen Theme-Modi]; Klickziele ≥ [24 × 24 px (WCAG 2.2 AA) | Team-Vorgabe]; Ist-Größen der Komponenten nicht verkleinern.
[… bis max. 20]
## Komponenten-Kurzliste
| Begriff | Komponente | Hinweis |
|---|---|---|
| Kachel | [app-tile] | Titel max. 2 Zeilen + Ellipsis |
## Nie
- Verlaufstext, Glassmorphism, Schatten außerhalb der Tokens
- Fremd-Fonts oder Icon-Sets außerhalb von [Icon-Set]
## Do / Don't
- Do: `color: var(--[token])` · Don't: `color: #[hex]`
## Skills für einzelne Aufgaben
- [building-…]: Komponenten und Kacheln bauen
```
