# Leben in Deutschland App

## Was ist diese App?

Diese Web-App hilft beim Üben für den Test „Leben in Deutschland“ und den Einbürgerungstest. Sie enthält den vorbereiteten Fragenkatalog, Bildfragen, Prüfungsmodus, Testmodus, Fehlerpool und Statistik.

Die App speichert Fehlerpool und Statistik lokal im Browser.

## Wichtig für GitHub

Lade den Inhalt des Ordners leben-in-deutschland-app-upload-clean in dein GitHub-Repository hoch. Nicht den übergeordneten Codex-Ordner hochladen.

Dieser Ordner ist die kleinere Upload-Version. Er enthält keine Original-PDF, keine Skripte, keine Arbeitsdateien und keine lokalen Build-Ordner.

## Diese Dateien und Ordner hochladen

- `src`
- `public`
- `package.json`
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `README.md`
- `missing-answers.md`
- `UPLOAD-CHECKLIST.md`
- `.gitignore`
- `.devcontainer`
- `.github`

## Diese Dateien und Ordner NICHT hochladen

- `node_modules`
- `.next`
- `.git`
- `dist`
- `build`
- `data`
- `scripts`
- Cache-Ordner
- temporäre Codex-Dateien
- `work`
- `outputs`

## Start in GitHub Codespaces

```bash
npm install
npm run dev
```

Dann den weitergeleiteten Port `3000` öffnen.

## Lokaler Start, falls Node funktioniert

```bash
npm install
npm run dev
```

Danach läuft die App unter:

```text
http://localhost:3000
```

## Deployment über Vercel

1. Den Inhalt dieses Ordners in dein GitHub-Repository hochladen.
2. Repository in Vercel importieren.
3. Vercel erkennt Next.js automatisch.
4. Build Command: `npm run build`
5. Install Command: `npm install`

## Wo sind die Fragen?

- Fragen: `src/data/questions.json`
- Fehlende Antworten als JSON: `src/data/missingAnswers.json`
- Fehlende Antworten als Liste: `missing-answers.md`
- Antwortvorlage: `src/data/answer-key-template.csv`
- Beispiel: `src/data/answer-key-example.csv`
- Bilder: `public/question-images`

## Fehlende richtige Antworten nachtragen

In `src/data/questions.json` haben fehlende Lösungen diese Werte:

```json
"correctAnswerId": null,
"isEvaluable": false
```

Zum Nachtragen:

1. Frage in `src/data/questions.json` suchen.
2. Richtige Antwort-ID aus `answers` wählen: `A`, `B`, `C` oder `D`.
3. `correctAnswerId` auf diese ID setzen.
4. `isEvaluable` auf `true` setzen.
5. Den Eintrag in `missing-answers.md` und `src/data/missingAnswers.json` aktualisieren.

Fragen ohne richtige Antwort werden im Testmodus als „nicht bewertbar“ gezählt. Der Prüfungsmodus verwendet nur bewertbare Fragen.
