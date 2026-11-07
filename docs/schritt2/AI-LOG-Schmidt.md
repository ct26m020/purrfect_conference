# AI-LOG Florian Schmidt – Schritt 2

## ADR

**Tool:** Claude Opus 5.5
**Prompt:** Gib mir eine erste Einschätzung mit Begründung ob wir SSG, CSR, SSR oder ISR brauchen für: Speaker-Profile, Session-Detailseiten, Session Übersicht mit Filtern, „Mein Programm"-Dashboard
**Zweck:** Erste Übersicht und Einschätzung

**Tool:** Claude Opus 5.5
**Prompt:** Formuliere die ADR um ohne die Logik zu verändern, damit sie auf folgendes Schema passt: ADR mit kurzer Einleitung (~100 Wörter, allgemeine Auswahlkriterien) +
vier Entscheidungspunkte im Schema Kontext → Optionen [mind. 2] → Entscheidung
→ Konsequenzen, je 150–250 Wörter.
**Zweck:** Umformulieren der Entscheidungen damit Deliverable erfüllt wird

**Tool:** Claude Opus 5.5
**Prompt:** Kontrolliere nochmal die ADR auf Denkfehler
**Zweck:** Kritische Analyse der ADR

## Features

**Tool:** Claude Opus 5.5
**Prompt:** Gib mir eine Schritt für Schritt Anleitung für folgende Features: Eigene Route pro Session (z. B. /sessions/[id] ) mit Titel, Abstract, Zeit (Tag, Start-/Endzeit), Raum, Track, Level, Format, Links zu den zugehörigen Speaker Profilen. Deliverable: für alle 20 Sessions korrekt befüllte, von der Übersicht erreichbare Detailseite. Aber beachte die im ADR festgelegten Entscheidungen
**Zweck:** Schritt für Schritt Anleitung zum Umsetzen der Anforderungen

**Tool:** Claude Opus 5.5
**Prompt:** Prüfe ob alle Anforderungen und die ADR erfüllt sind
**Zweck:** Überprüfung ob alles richtig umgesetzt wurde

**Tool:** Claude Opus 5.5
**Prompt:** Prüfe was von der Anforderung noch fehlt: Hinzufügen/Entfernen einer Session zum persönlichen Programm, Persistenz in localStorage gemäß Schritt-1-Konzept (IDs vs. volle Objekte jetzt tatsächlich umsetzen), Rehydration beim Neuladen. Eigene „Mein Programm"-Seite, die den persistierten State anzeigt. Deliverable: Funktionierendes Hinzufügen/Entfernen mit sichtbarer Persistenz über einen Reload hinweg, eigene Seite.
**Zweck:** Herausfinden was noch zu tun und was schon umgesetzt ist

**Tool:** Claude Opus 5.5
**Prompt:** Prüfe ob alle Anforderungen und die ADR erfüllt sind
**Zweck:** Überprüfung ob alles richtig umgesetzt wurde