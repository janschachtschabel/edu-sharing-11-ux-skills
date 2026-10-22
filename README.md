# edu-sharing 11 · UX-Skills für KI-Coding-Agenten

Eine **DESIGN.md** und acht **Agent Skills**, mit denen Coding-Agenten (Claude Code, Codex, Cursor, Copilot u. a.) Oberflächen im edu-sharing-Frontend so bauen und prüfen, wie es das Designsystem vorsieht. Das Frontend ist Angular 21 mit Angular Material 21.

- **Grundlage:** der Code von `edu-sharing-community-repository`, Branch `maven/fixes/11.0`, Ordner `Frontend/`. Maßstab ist der **Ist-Stand** des Codes, ohne seine bekannten Fehler.
- **Ergänzt** um Messungen an einer laufenden Instanz (Palette, Klickflächen, Branding-Beispiel WirLernenOnline).
- **Format:** offener Standard [agentskills.io](https://agentskills.io); jeder Skill ist ein Ordner mit `SKILL.md`.

> Status: Entwurf, getestet in zwei Mockup-Tests und einem Testlauf mit Baseline-Vergleich. Noch nicht von UI/UX- und IT-Team freigegeben.

---

## Zwei Ebenen

| Ebene | Datei | Wann der Agent sie liest | Inhalt |
|---|---|---|---|
| 1 · Grundregeln | `DESIGN.md` (unter 8 KB) | **immer**, über den Verweis in `AGENTS.md`/`CLAUDE.md` | Token-Block (YAML), 17 prüfbare Kernregeln, Komponenten-Kurzliste, Verbote, Do/Don't, Liste aller Skills |
| 2 · Aufgaben | `skills/<name>/SKILL.md` | **nur wenn die Aufgabe passt** | Ablauf, Pflichtregeln, Spielraum, Verbote, Abschluss-Checkliste; Details in `references/`, Prüfskripte in `scripts/` |

Ein Agent lädt Skills nicht immer von selbst. Deshalb stehen die wichtigsten Regeln zusätzlich in der immer geladenen DESIGN.md, und `AGENTS.md` nennt alle Skills.

## Die Skills

| Skill | Was er tut | Typische Auslöser |
|---|---|---|
| `edu-sharing-ux-build-components` | Komponenten, Kacheln, Listen, Seiten, Dialoge und **Formulare** bauen oder ändern: Tokens, Mixins, Material-Varianten, Aufbau von Kachel und Seiten, Zustände, Storybook. Mit Prüfskript `lint-design-rules.mjs` | Komponente, Kachel, Card, Suchergebnis, Dialog, Formular, SCSS, Dark Mode |
| `edu-sharing-ux-build-topic-pages` | **Themenseiten**: Varianten, Vorlagen, Abschnitte (Swimlanes), Widgets; Anleitung und Gerüst für neue Widgets | Themenseite, Vorlage, Abschnitt, Widget, Teaser |
| `edu-sharing-ux-build-embeds` | **Einbettung**: Web Components, iframe-Seiten `/components/embed`, Rendering-Komponente, Lernplattform und LTI. Regeln für fremde Gastseiten (kein Shadow DOM, Höhe, Overlays, helles Theme) | Web Component, einbetten, iframe, Moodle, LMS, LTI |
| `edu-sharing-ux-audit-accessibility` | A11y-Audit nach WCAG 2.1 AA (+ 2.5.8 aus 2.2), Befunde als Datei:Zeile mit Fix. Ändert keinen Code. Mit `contrast.mjs` | barrierefrei, A11y, Kontrast, Tastatur, vor dem MR |
| `edu-sharing-ux-review` | UX-Review eines Screens oder Flows nach Heuristiken, mit Zustände-Matrix und Befundliste nach Schweregrad | UX prüfen, Usability, Flow bewerten |
| `edu-sharing-ux-write-copy` | Oberflächentexte als i18n-Schlüssel: Sie-Form, `de-informal`, `{{GENDER_SEPARATOR}}`, Begriffe, Muster für Fehler, Leerzustände und Toasts | Text, Label, Fehlermeldung, Leerzustand, Toast |
| `edu-sharing-ux-write-handoff` | Aus Figma, Screenshot oder Konzept eine Handoff-Datei für die Umsetzung machen (Vorlage in `assets/`) | Handoff, Übergabe, Spezifikation |
| `edu-sharing-ux-create-skills` | *Meta-Skill fürs Designteam*: neue Designregeln oder Skills erarbeiten, testen und ablegen (Prompts, Vorlagen, Ableitung aus Code) | Designregel anlegen, DESIGN.md ändern, Skill bauen |

## Aufbau des Repos

```
DESIGN.md                      Ebene 1, immer laden
handoff-template.md            Vorlage für Übergaben an die Entwicklung
CHANGELOG.md
skills/
  edu-sharing-ux-build-components/
    SKILL.md
    references/   tokens · material-variants · mixins · layout-patterns · building-blocks · examples
                  node-entries-anatomy · page-layouts · component-specs · forms
    scripts/lint-design-rules.mjs
    evals/evals.json
  edu-sharing-ux-build-topic-pages/   SKILL.md · references/ · evals/
  edu-sharing-ux-build-embeds/        SKILL.md · references/ · evals/
  edu-sharing-ux-audit-accessibility/ SKILL.md · references/ · scripts/contrast.mjs · evals/
  edu-sharing-ux-review/              SKILL.md · references/ · evals/
  edu-sharing-ux-write-copy/          SKILL.md · references/ · evals/
  edu-sharing-ux-write-handoff/       SKILL.md · assets/ · evals/
  edu-sharing-ux-create-skills/       SKILL.md · references/
```

`evals/evals.json` enthält je drei Testaufgaben mit erwartetem Verhalten, um die Wirkung eines Skills zu prüfen.

---

## Einbinden in ein Projekt (z. B. das edu-sharing-Frontend)

### 1. Dateien kopieren

```bash
# im Frontend-Repo (z. B. edu-sharing-community-repository/Frontend)
cp <dieses-repo>/DESIGN.md ./DESIGN.md

# Claude Code liest Projekt-Skills aus .claude/skills/
mkdir -p .claude/skills
cp -r <dieses-repo>/skills/edu-sharing-ux-* .claude/skills/

# Codex CLI und andere Agenten lesen .agents/skills/
mkdir -p .agents/skills
cp -r <dieses-repo>/skills/edu-sharing-ux-* .agents/skills/

# Testaufgaben nicht ins Produkt-Repo übernehmen (sonst sieht der Agent die erwarteten Lösungen)
rm -rf .claude/skills/*/evals .agents/skills/*/evals
```

Den Meta-Skill `edu-sharing-ux-create-skills` braucht das Entwicklungsteam meist nicht; er kann weggelassen werden. Statt zu kopieren geht auch ein Git-Submodule oder ein Skript in der Build-Pipeline.

### 2. Verweis in `AGENTS.md`

`AGENTS.md` im Projekt-Root lesen Codex, Cursor, Copilot und weitere Agenten. Diesen Abschnitt einfügen:

```markdown
## Design (Owner: UI/UX-Team)
- Vor jeder UI-Änderung DESIGN.md lesen und einhalten. Farben nur über var(--…) aus
  projects/edu-sharing-ui/assets/scss/variables.scss – neue Tokens in :root UND body.isDarkTheme.
- Wichtigste Regeln:
  - Erst vorhandene Bausteine (ngx-edu-sharing-ui, src/app/shared, Angular Material), dann neu bauen.
  - --primaryBackgroundXX statt --palette-primary-X; kein mat.theme(), keine --mdc-* Tokens.
  - Icons nur <i esIcon="…">; Icon-only-Buttons mit übersetztem aria-label.
  - Fokus sichtbar über @include setGlobalKeyboardFocus(); Kontrast ≥ 4,5:1 in Light und Dark.
  - Jede Datenansicht hat Lade-, Leer- und Fehlerzustand; Texte nur über i18n-Schlüssel (de Sie-Form + en).
- Skills für Design-Aufgaben liegen in .claude/skills/ und .agents/skills/ – bei passender Aufgabe laden:
  - edu-sharing-ux-build-components: neue oder geänderte Komponenten, Kacheln, Seiten, Dialoge, Formulare, SCSS
  - edu-sharing-ux-build-topic-pages: Themenseiten, Vorlagen, Abschnitte, Widgets
  - edu-sharing-ux-build-embeds: Web Components, iframe-Embeds, Rendering-Komponente, LMS/LTI
  - edu-sharing-ux-audit-accessibility: vor jedem Merge Request mit UI-Änderung
  - edu-sharing-ux-review: UX-Review eines Screens oder Flows
  - edu-sharing-ux-write-copy: Labels, Fehlermeldungen, Leerzustände, Toasts
  - edu-sharing-ux-write-handoff: Figma/Konzept in eine Handoff-Datei übersetzen
- Prüfen: node .claude/skills/edu-sharing-ux-build-components/scripts/lint-design-rules.mjs <geänderte Dateien>
  muss auf neuen/geänderten Zeilen 0 FEHLER melden; vorbestehende FEHLER nur melden, nicht mitändern.
- Handoffs liegen unter handoffs/<feature>.md und gehen der DESIGN.md für dieses Feature vor.
- Regeln nicht selbst ändern; Lücken als Issue mit Label design-rule an das UI/UX-Team melden.
```

### 3. Verweis in `CLAUDE.md` (Claude Code)

Claude Code liest `CLAUDE.md`, nicht `AGENTS.md`. Damit beide denselben Text nutzen, ganz oben in `CLAUDE.md` importieren:

```markdown
@AGENTS.md
```

Alternativ den Abschnitt aus Schritt 2 direkt in `CLAUDE.md` einfügen. Die Skills unter `.claude/skills/` findet Claude Code automatisch; die DESIGN.md wird über den Verweis im Abschnitt gelesen.

---

## Skills auslösen

**Automatisch:**
- Der Agent liest beim Start Name und Beschreibung aller Skills.
- Passt eine Anfrage zur Beschreibung, lädt er die `SKILL.md` und bei Bedarf die `references/`.
- Die Beschreibungen enthalten deshalb die Wörter, die Entwicklerinnen und Entwickler typischerweise schreiben („Kachel“, „Dialog“, „Themenseite“, „barrierefrei“ …).

**Manuell**, wenn ein Skill sicher verwendet werden soll; das ist empfehlenswert, weil Agenten Skills nicht immer von selbst laden:

| Agent | So geht's |
|---|---|
| Claude Code | als Slash-Befehl: `/edu-sharing-ux-build-components Baue die Merkliste als Kachelansicht` |
| Claude Code (Alternative) | im Prompt: „Nutze den Skill edu-sharing-ux-audit-accessibility und prüfe …“ |
| Codex CLI und andere | den Skill-Namen im Prompt nennen, z. B. „Lade den Skill edu-sharing-ux-review (.agents/skills/edu-sharing-ux-review/SKILL.md) und …“; je nach Agent auch über dessen Skill-Menü oder Befehl |
| Agenten ohne Skill-Unterstützung | die `SKILL.md` als Datei in den Kontext geben („Lies .agents/skills/…/SKILL.md und folge dem Ablauf“) |

Alle Skills beginnen mit `edu-sharing-ux-`. Im Slash-Menü stehen sie dadurch beieinander.

## Prüfskripte (Node ≥ 18, ohne Abhängigkeiten)

```bash
# Designregeln prüfen (Farbliterale, mat-icon, Selektoren vor MDC, Abstände, Fokus, Icon-Buttons ohne Label …)
node .claude/skills/edu-sharing-ux-build-components/scripts/lint-design-rules.mjs src/app/features/meine-komponente

# Kontrast zweier Farben oder Tokens, hell und dunkel
node .claude/skills/edu-sharing-ux-audit-accessibility/scripts/contrast.mjs textMediumLight backgroundColor \
  --vars projects/edu-sharing-ui/assets/scss/variables.scss
node .claude/skills/edu-sharing-ux-audit-accessibility/scripts/contrast.mjs focusColor roundedContainerBackground \
  --vars projects/edu-sharing-ui/assets/scss/variables.scss --dark --set primary=#003b7c
```

## Pflege

- Änderungen laufen als Pull Request mit Review durch UI/UX- und IT-Team.
- Bei jeder Änderung `metadata.version` im Skill hochzählen, einen Eintrag in `CHANGELOG.md` schreiben und die Testaufgaben aus `evals/` in einer frischen Sitzung erneut laufen lassen.
- Regeln nicht lokal im Produkt-Repo ändern, sondern hier.
- Fremde Skills vor der Übernahme vollständig lesen; sie können Skripte und Prompt-Injection enthalten.

## Grenzen

- Werte, die nur eine Installation festlegt, stehen nicht im Code. Dazu gehören Branding (`themeColors`, eigenes CSS, Logo), das Metadatenset (welche Metadaten auf Kacheln und als Filter erscheinen) und Menüeinträge. Die Skills nennen dafür Defaults und zeigen WirLernenOnline als Beispiel.
- Die Defaults von Angular Material liegen in `node_modules` und sind teils nur gemessen.
- Bekannte Fehler im Bestand sind in den Referenzen markiert („nicht als Vorbild nehmen“), damit Agenten sie nicht kopieren.
