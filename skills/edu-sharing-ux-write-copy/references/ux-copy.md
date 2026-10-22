# Textbausteine und Muster

Quelle: `src/assets/i18n/common/de.json` und weitere Bereiche (Stand `maven/fixes/11.0`).

## Inhalt
1. Dateien und Sprachvarianten
2. Generische Schlüssel (wiederverwenden)
3. Dialog-Button-Sätze
4. Muster mit echten Beispielen
5. Begriffe

## 1. Dateien und Sprachvarianten

| Datei | Inhalt |
|---|---|
| `src/assets/i18n/<bereich>/de.json` | Deutsch, Sie-Form, **vollständig** |
| `…/en.json` | Englisch, **vollständig** |
| `…/de-informal.json` | nur Überschreibungen in der Du-Form (großes „Du“) |
| `…/de-no-binnen-i.json` | nur Überschreibungen mit neutralen Formen statt Gendersternchen |
| `…/fr.json`, `…/it.json` | weitere Sprachen. Fehlt dort ein Schlüssel, erscheint die erste unterstützte Sprache der Installation (Standard `de`; `translations.service.ts:189-195`). Ändert sich die Bedeutung eines Schlüssels, den fr/it-Eintrag löschen, damit kein veralteter Text stehen bleibt. |
| `src/assets/i18n/override/` | Anpassungen je Installation; nicht für neue Features |
| `src/assets/i18n/topic-page/*.json` | Themenseiten, Präfix `TOPIC_PAGE.`. Achtung: Dort ist die Anrede heute gemischt (Sie und du) und „Swimlane“ steht als Wort im UI; für neue Texte Sie-Form und „Abschnitt“ |

Bereiche: `common`, `admin`, `recycle`, `workspace`, `search`, `collections`, `editorial`, `login`, `permissions`, `oer`, `messages`, `register`, `topic-page`, `profiles`, `services`, `stream`, `override`.

`{{GENDER_SEPARATOR}}` wird beim Laden durch `*` ersetzt (`translation-loader.ts`). Die Metadaten-Texte in `mds_de_DE.properties` nutzen denselben Platzhalter.

## 2. Generische Schlüssel (`common`, oberste Ebene)

| Schlüssel | Deutsch |
|---|---|
| `YES` / `NO` | Ja / Nein |
| `OK` | Ok |
| `ADD` | Hinzufügen |
| `BACK` / `NEXT` / `SKIP` | Zurück / Weiter / Überspringen |
| `SAVE` | Speichern |
| `CANCEL` | Abbrechen |
| `CLOSE` | Schließen |
| `DISCARD` | Verwerfen |
| `APPLY` | Übernehmen |
| `USE` | Verwenden |
| `YES_DELETE` | Ja, löschen |
| `RESET` | Zurücksetzen |
| `RENAME` | Umbenennen |
| `CREATE` | Erstellen |
| `DOWNLOAD` | Herunterladen |
| `LOADING` | Lädt... |
| `LOAD_MORE` | Weitere laden |
| `NO_MORE_ELEMENTS` | Keine weiteren Elemente |
| `SHOW_MORE` / `HIDE_MORE` | mehr anzeigen / weniger anzeigen |
| `FIELD_REQUIRED` | Pflichtfeld |
| `FIELD_MUST_BE_FILLED` | Dieses Feld muss ausgefüllt sein |
| `NO_MATCHES` | Keine übereinstimmenden Einträge |
| `SELECT` | {{ element }} auswählen |
| `EDIT` | {{ thing }} bearbeiten |
| `COMMON_API_ERROR` | Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut. |
| `INVALID_OPERATION` | Diese Funktion wird leider nicht unterstützt. |
| `OPTIONS.DELETE` | Löschen |
| `OPTIONS.ADD_NODE_STORE` | Auf Merkliste |
| `OPTIONS.REMOVE_REF` | Aus Sammlung entfernen |
| `CLEAR_FILTERS` | zurücksetzen |
| `SORT_BY` | Sortieren nach |
| `USER_GUEST` | Gast |
| `WORKSPACE.ADD` (workspace) | Neu |
| `SEARCH.TITLE` (search) | Suchumgebung |
| `SEARCH.SEARCH_STUFF` (search) | Suchen ... |
| `SEARCH.REPOSITORY_ALL` (search) | Alle |
| `SEARCH.MATERIALS` / `SEARCH.COLLECTIONS` (search) | Materialien / Sammlungen; die Zahl folgt in Klammern: „Materialien (n)“ |
| `SEARCH.QUERY_NO_RESULT` (search) | Die Suchanfrage ergab keinen Treffer. |
| Menü-Kurzlabels `<NAME>_SHORT` (common) | z. B. Start, Suche, Sammlungen (untere Mobilleiste) |
| `ICON_LABELS.<icon>` | Labels für `esIcon [aria]="true"`, z. B. `more_vert` → Optionen |

## 3. Dialog-Button-Sätze

Die Sätze stehen in `generic-dialog-data.ts`. Die Labels sind die generischen Schlüssel oben.

| Satz | Buttons (links → rechts) |
|---|---|
| `OK_OR_CANCEL` | Abbrechen · Ok |
| `SAVE_OR_CANCEL` | Abbrechen · Speichern |
| `DELETE_OR_CANCEL` | Abbrechen · **Ja, löschen** (danger) |
| `YES_OR_NO` | Nein · Ja |
| `DISCARD_OR_BACK` | Zurück · Verwerfen |
| `REPLACE_OR_BACK` | Zurück · Ersetzen |
| `USE_OR_CANCEL` | Abbrechen · Verwenden |

Für Bestätigungen gilt: Der Titel fragt nach der Aktion („Korrektur zurückgeben“). Die Nachricht nennt die Folge („Wenn Sie Objekte endgültig löschen, können Sie diese später nicht mehr wiederherstellen.“). Der Primärbutton wiederholt das Verb („Trotzdem zurückgeben“).

## 4. Muster mit echten Beispielen

| Typ | Muster | Beispiel aus dem Code | Schlüssel |
|---|---|---|---|
| Toast Erfolg | „<Subjekt> wurde <Partizip>.“ | „Das Element wurde der Sammlung hinzugefügt.“ | `COLLECTIONS.PROPOSALS.TOAST.ACCEPTED` |
| Toast mit Platzhalter | `{{name}}` in Anführungszeichen | „Download von "{{name}}" wurde gestartet.“ | `TOAST.DOWNLOAD_STARTED` |
| Fehler mit Ausweg | Was ist passiert. Was tun. | „Das ausgewählte Bild konnte leider nicht gelesen werden. Bitte versuchen Sie es mit einem anderen Element.“ | `COLLECTIONS.TOAST.ERROR_IMAGE_APPLY` |
| Fehler Berechtigung | Titel kurz, Text mit Ansprechperson | „Fehlende Berechtigung“ / „Falls Sie dies für einen Fehler halten, kontaktieren Sie …“ | `TOOLPERMISSION_ERROR_TITLE`, `…_FOOTER` |
| Leer kurz | „Keine <Plural>“ | „Keine Benachrichtigungen“ | `NOTIFICATION_LIST.EMPTY_ALL` |
| Leer mit Ort | „Keine <Plural> auf/in <Ort>“ | „Keine Elemente auf der Merkliste“ | `SEARCH.NODE_STORE.LIST_EMPTY` |
| Leer mit Erklärung | „Es gibt aktuell keine … Sobald …, …“ | „Es gibt aktuell keine Berechtigungen an der Obersammlung. Sobald …“ | `WORKSPACE.INHERIT_COLLECTION_EMPTY` |
| Leer nach Suche | Bezug zum Suchbegriff | „Im Papierkorb befinden sich keine Objekte, die zu dem eingegebenen Suchbegriff passen.“ | `RECYCLE.NO_RESULTS_MESSAGE` |
| Pflichtfeld | Feld + Bedingung | „Für diesen Aufgabentyp muss mindestens eine Person oder Gruppe … eingeladen werden“ | `EDITORIAL.ASSIGNMENT.ERROR.MISSING_AUTHORITIES_ASSIGNEE` |

Gender-Beispiel: `"Die Aktion wird für alle folgenden Benutzer{{GENDER_SEPARATOR}}innen … angewandt:"` (`PERMISSIONS.DELETE.CONFIRM.USERS`).

Variante `de-informal`: `"Ein Fehler ist aufgetreten. Bitte versuche es erneut."`

Variante `de-no-binnen-i`: `"Lehrende"`, `"Autorin/Autor"`.

## 5. Begriffe

Zählung über alle `de.json`. Sie zeigt den heutigen Gebrauch; die Empfehlung ist ein Vorschlag [S] und wird von Team 5 bestätigt.

| Konzept | Bevorzugt | Vorkommen | Vermeiden |
|---|---|---|---|
| beliebiger Knoten (Datei, Link, Ordner) | Element / Elemente | 194 | Objekt (57), Node |
| Bildungsinhalt aus Sicht der Nutzenden | Material / Materialien | 139 | Ressource, Content |
| kuratierte Zusammenstellung | Sammlung | 183 | Collection |
| persönliche Vormerkung | Merkliste | 7 | Favoriten, Bookmark |
| Person, die das System nutzt | Person / Nutzende | — | User, Benutzer (ungegendert) |
| endgültig weg | Löschen | — | |
| nur Verknüpfung weg | Entfernen | — | Löschen |
| Darstellung als Karte in Listen | Kachel | 8 | Card, Tile, Box |
