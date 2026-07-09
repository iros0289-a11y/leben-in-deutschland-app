# Leben in Deutschland BAMF Lernplattform

Eine deutschsprachige Next.js-App zum Lernen für den Test "Leben in Deutschland" und den Einbürgerungstest.

Die App enthält:

- 460 BAMF-Fragen mit richtiger Antwort
- Testmodus mit direkter Rückmeldung
- Prüfungsmodus mit Timer und Endauswertung
- Fehlerpool im Browser
- Statistik nach Bereichen
- Bildfragen
- Türkisch-Button für Frage, Antworten und Begründung

Fehlerpool und Statistik werden lokal im Browser gespeichert.

## Wichtiger Upload-Hinweis

Lade den Inhalt dieses Ordners in dein GitHub-Repository hoch:

```text
leben-in-deutschland-app-upload-clean
```

Nicht den übergeordneten Codex-Arbeitsordner hochladen.

Dieser Upload-Ordner enthält keine Original-PDF, keine Arbeits-Skripte, keine lokalen Installationsordner und keine Build-Ausgaben.

## Start in GitHub Codespaces

1. Repository auf GitHub öffnen.
2. "Code" anklicken.
3. "Codespaces" auswählen.
4. Neuen Codespace erstellen.
5. Im Terminal ausführen:

```bash
npm install
npm run dev
```

Danach den weitergeleiteten Port `3000` öffnen.

## Lokaler Start, falls Node später funktioniert

```bash
npm install
npm run dev
```

Danach läuft die App unter:

```text
http://localhost:3000
```

## Deployment auf Vercel

1. Den Inhalt dieses Ordners in ein GitHub-Repository hochladen.
2. Auf Vercel "New Project" wählen.
3. Das Repository importieren.
4. Vercel erkennt Next.js automatisch.
5. Build Command: `npm run build`
6. Install Command: `npm install`

## Wo sind die Fragen?

- Fragen: `src/data/questions.json`
- Fehlende Antworten: `missing-answers.md`
- Fehlende Antworten als JSON: `src/data/missingAnswers.json`
- Bildfragen: `public/question-images`

Aktueller Stand: Alle 460 Fragen haben eine richtige Antwort. `missing-answers.md` ist deshalb leer bis auf den Hinweis.

## Richtige Antworten ergänzen oder korrigieren

Falls du später eine Antwort manuell prüfen oder ändern möchtest:

1. Frage in `src/data/questions.json` suchen.
2. In `answers` die richtige Antwort-ID wählen: `A`, `B`, `C` oder `D`.
3. `correctAnswerId` auf diese ID setzen.
4. `isEvaluable` auf `true` setzen.
5. Falls eine Antwort fehlt, in `missing-answers.md` dokumentieren.

## Projektstruktur

```text
src/app                 Seiten und Layout
src/components          Startseite, Testmodus, Prüfungsmodus, Fehlerpool, Statistik
src/data                Fragenkatalog als JSON
src/lib                 Fragenlogik, Speicherung, Übersetzung
public/question-images  Bilder zu Bildfragen
.devcontainer           GitHub-Codespaces-Konfiguration
.github/workflows       Build-Test für GitHub Actions
```

## Hinweise zur Übersetzung

Der Türkisch-Button nutzt im Browser eine automatische Übersetzung und speichert übersetzte Texte lokal zwischen. Die deutschen Originalfragen und die offiziellen richtigen Antworten bleiben immer die Grundlage der Bewertung.
