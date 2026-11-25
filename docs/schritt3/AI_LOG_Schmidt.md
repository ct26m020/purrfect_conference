# AI-LOG Florian Schmidt – Schritt 3

## Planung

**Tool:** Claude Opus 5.5 (Claude Code)
**Prompt:** [Aufgabenteilung und Aufgabenstellungen B, C, D und E eingefügt] ich bin Person 2, gehen wir die Aufgabe Schritt für Schritt durch
**Zweck:** Aufgabenstellung verstehen, Stand von Person 1 (A, B, C/1) im Repo analysieren und einen Plan für meine Aufgaben erstellen

**Tool:** Claude Opus 5.5 (Claude Code)
**Prompt:** Schlag mir passende Caching Strategien für die Sessions-/Speaker-Daten vor
**Zweck:** Cache First, Stale-While-Revalidate und Network First für die Sessions- und Speaker-Daten abwägen und eine Strategie für C/2 auswählen

**Tool:** Claude Opus 5.5 (Claude Code)
**Prompt:** Teste die Umsetzung der Caching Strategien
**Zweck:** Im Produktions-Build prüfen, ob die Regeln S1 bis S3 greifen und Sessions und Speaker offline aus dem Cache kommen

**Tool:** Claude Opus 5.5 (Claude Code)
**Prompt:** Schreib Kommentare zu den wichtigen Code Snippets, welche Regel zu welcher B-Entscheidung gehört
**Zweck:** Caching-Regeln in `nuxt.config.ts` und `app/plugins/offline-cache.client.ts` kommentieren, damit jede Regel der zugehörigen Entscheidung aus B zugeordnet ist

**Tool:** Claude Opus 5.5 (Claude Code)
**Prompt:** Wie mach ich den Lighthouse-PWA-Audit?
**Zweck:** Audit selbst durchführen (Lighthouse 11 per Kommandozeile, da das eingebaute Lighthouse keine PWA-Kategorie mehr hat)

**Tool:** Claude Opus 5.5 (Claude Code)
**Prompt:** Gib mir einen Entwurf für E und schau dir die Screenshots + Lighthouse Report an
**Zweck:** Entwurf für den Verifikations-Nachweis (`04-verifikation.md`) erstellen und die Screenshots der drei Szenarien und den Lighthouse-Report darin beschreiben
