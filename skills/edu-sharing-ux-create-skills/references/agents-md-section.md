# Abschnitt für `Frontend/AGENTS.md` (und Import in `Frontend/CLAUDE.md`)

So wird er eingesetzt:

1. Den Block unten in `Frontend/AGENTS.md` einfügen. Gibt es die Datei noch nicht, sie anlegen.
2. In `Frontend/CLAUDE.md` ganz oben die Zeile `@AGENTS.md` ergänzen. Dann lesen Claude Code und Codex, Cursor, Copilot denselben Text.
3. `DESIGN.md` nach `Frontend/DESIGN.md` kopieren.
4. Den Inhalt von `skills/` nach `Frontend/.claude/skills/` und `Frontend/.agents/skills/` kopieren, **ohne die Ordner `evals/`**. Sonst sieht der Agent die erwarteten Lösungen. Den Meta-Skill `edu-sharing-ux-create-skills` braucht Team 6 nicht; er bleibt bei Team 5.
5. In `Frontend/CLAUDE.md` die Zeile 59 korrigieren: Statt `--mdc-text-button-label-text-color` gilt `--mat-button-text-label-text-color` (Widerspruch W2).

---

```markdown
## Design (Owner: Team 5 UI/UX)
- Vor jeder UI-Änderung DESIGN.md lesen und einhalten. Farben nur über var(--…) aus
  projects/edu-sharing-ui/assets/scss/variables.scss – neue Tokens in :root UND body.isDarkTheme.
- Wichtigste Regeln:
  - Erst vorhandene Bausteine (ngx-edu-sharing-ui, src/app/shared, Angular Material), dann neu bauen.
  - --primaryBackgroundXX statt --palette-primary-X; kein mat.theme(), keine --mdc-* Tokens.
  - Icons nur <i esIcon="…">; Icon-only-Buttons mit übersetztem aria-label.
  - Fokus sichtbar über @include setGlobalKeyboardFocus(); Kontrast ≥ 4,5:1 in Light und Dark.
  - Jede Datenansicht hat Lade-, Leer- und Fehlerzustand; Texte nur über i18n-Schlüssel (de Sie-Form + en).
- Skills für Design-Aufgaben liegen in .claude/skills/ und .agents/skills/ – bei passender Aufgabe laden:
  - edu-sharing-ux-build-components: neue oder geänderte Komponenten, Kacheln, Seiten, Dialoge, SCSS
  - edu-sharing-ux-audit-accessibility: vor jedem Merge Request mit UI-Änderung
  - edu-sharing-ux-review: UX-Review eines Screens oder Flows
  - edu-sharing-ux-write-copy: Labels, Fehlermeldungen, Leerzustände, Toasts
  - edu-sharing-ux-build-topic-pages: Themenseiten, Vorlagen, Abschnitte, Widgets
  - edu-sharing-ux-build-embeds: Web Components, iframe-Embeds, Rendering-Komponente, LMS/LTI
  - edu-sharing-ux-write-handoff: Figma/Konzept in eine Handoff-Datei übersetzen
- Prüfen: node .claude/skills/edu-sharing-ux-build-components/scripts/lint-design-rules.mjs <geänderte Dateien>
  muss auf neuen/geänderten Zeilen 0 FEHLER melden; vorbestehende FEHLER nur melden, nicht mitändern.
- Handoffs liegen unter handoffs/<feature>.md und gehen der DESIGN.md für dieses Feature vor.
  Offene Fragen im Handoff vor der Umsetzung klären; ist keine Antwort möglich, die Annahme im Code
  kapseln und kommentieren und in der Antwort nennen.
- Regeln nicht selbst ändern; Lücken als Issue mit Label design-rule an Team 5 melden.
```
