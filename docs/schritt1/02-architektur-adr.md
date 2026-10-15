# ADR-02: Komponenten- und Ordnerstruktur

## 1. Kontext

Die Konferenzplattform **Purrfect Conference** soll eine übersichtliche, wartbare und erweiterbare Komponentenarchitektur erhalten. Zu den zentralen Funktionen gehören die Anzeige von Sessions, das Filtern des Konferenzprogramms und das Hinzufügen von Sessions zum persönlichen Programm. Da mehrere Komponenten dieselben Daten und Funktionen verwenden können, sollen Darstellung, Geschäftslogik und Datenzugriff klar voneinander getrennt werden.

Dafür werden die Komponenten in drei Schichten unterteilt: Base/UI-Komponenten, Feature-Komponenten und Layout-Komponenten. Zusätzlich werden Composables verwendet, um wiederverwendbare Logik unabhängig von der Benutzeroberfläche zu implementieren.

Gemäß ADR-04 wird das Projekt mit **Nuxt 4** umgesetzt. Die Komponentenarchitektur muss sich daher in die Nuxt-Verzeichniskonventionen einfügen: Seiten entstehen über dateibasiertes Routing im `pages/`-Verzeichnis, übergreifende Seitengerüste liegen in `layouts/`, und Komponenten sowie Composables werden automatisch importiert.

## 2. Betrachtete Optionen

### Option 1: Flache Komponentenstruktur

Alle Komponenten, Funktionen und Datenzugriffe werden in einer gemeinsamen Struktur abgelegt. Diese Lösung ist einfach einzurichten und verursacht anfangs wenig Aufwand. Mit zunehmender Anzahl an Funktionen wird es jedoch schwieriger, Verantwortlichkeiten zu unterscheiden und wiederverwendbare Elemente zu identifizieren.

### Option 2: Geschichtete Komponentenarchitektur mit Composables

Die Anwendung wird in Base/UI-, Feature- und Layout-Komponenten unterteilt. Wiederverwendbare Logik wird in Composables ausgelagert, während Daten und Geschäftsregeln möglichst unabhängig von der Darstellung bleiben. Diese Struktur benötigt anfangs etwas mehr Planung, erleichtert jedoch Wartung, Wiederverwendung und Erweiterungen.

## 3. Entscheidung

Wir entscheiden uns für Option 2, da sie eine klare Trennung der Verantwortlichkeiten ermöglicht und mit Purrfect Conference mitwachsen kann.

Die Base/UI-Schicht enthält allgemeine Elemente wie `BaseButton.vue`, `BaseCard.vue` und `BaseInput.vue`. Feature-Komponenten bilden konkrete Funktionen der Konferenzplattform ab, beispielsweise `SessionCard.vue`, `SessionFilter.vue` und `MyProgram.vue`. Die Layout-Schicht wird in Nuxt zweigeteilt umgesetzt: Das Seitengerüst liegt als Nuxt-Layout in `layouts/default.vue`, während wiederverwendbare Layout-Bausteine wie `AppHeader.vue` und `AppFooter.vue` normale Komponenten bleiben, die das Layout einbindet.

Die Seiten werden über das dateibasierte Routing von Nuxt definiert: `pages/index.vue` (Startseite), `pages/program.vue` (Konferenzprogramm) und `pages/my-program.vue` („Mein Programm“). Eine manuelle Router-Konfiguration entfällt.

Die zentrale Interaktion der Session-Filterung wird bewusst nach dem Headless-Prinzip umgesetzt. Die Filterlogik liegt im Composable `useSessionFilter.ts`, während `SessionFilter.vue` die Eingabefelder und Filteroptionen darstellt. Dadurch kann die Darstellung unabhängig von der Filterlogik angepasst oder wiederverwendet werden.

Das Hinzufügen von Sessions zum persönlichen Programm wird analog in `useMyProgram.ts` gekapselt. Das Composable verwaltet die ausgewählten Session-IDs und die Speicherung im `localStorage`.

## 4. Konsequenzen

Die gewählte Architektur verbessert die Übersichtlichkeit, Wiederverwendbarkeit und Testbarkeit der Anwendung. Änderungen am Design können weitgehend unabhängig von der Geschäftslogik durchgeführt werden. Außerdem lassen sich neue Funktionen, beispielsweise eine Suche oder zusätzliche Filter, leichter ergänzen.

Als Nachteil entstehen mehr Dateien und ein gewisser initialer Planungsaufwand. Für sehr einfache Komponenten wäre eine zusätzliche Abstraktion nicht notwendig. Deshalb werden Composables nur dort eingesetzt, wo Logik tatsächlich wiederverwendet wird oder eine zentrale fachliche Verantwortung besitzt.

## 5. Vorgesehene Ordnerstruktur

Die Struktur folgt den Verzeichniskonventionen von Nuxt 4, bei denen der Anwendungscode im `app/`-Verzeichnis liegt:

```text
purrfect_conference
├── app/
│   ├── assets/
│   │   └── styles/
│   │       └── tokens.css
│   ├── components/
│   │   ├── base/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseCard.vue
│   │   │   └── BaseInput.vue
│   │   ├── features/
│   │   │   ├── sessions/
│   │   │   │   ├── SessionCard.vue
│   │   │   │   └── SessionFilter.vue
│   │   │   └── program/
│   │   │       └── MyProgram.vue
│   │   └── layout/
│   │       ├── AppHeader.vue
│   │       └── AppFooter.vue
│   ├── composables/
│   │   ├── useConferenceData.ts
│   │   ├── useSessionFilter.ts
│   │   └── useMyProgram.ts
│   ├── data/
│   │   └── conference-data.json
│   ├── layouts/
│   │   └── default.vue
│   ├── pages/
│   │   ├── index.vue
│   │   ├── program.vue
│   │   └── my-program.vue
│   └── app.vue
├── public/
├── nuxt.config.ts
└── package.json
```

Eine `main.ts` und eine manuelle Router-Konfiguration entfallen, da Nuxt den Einstiegspunkt und das Routing übernimmt. Die Ordnerstruktur wird bei Bedarf erweitert. Komponenten, die ausschließlich zu einem Feature gehören, können innerhalb des jeweiligen Feature-Ordners abgelegt werden.

Nuxt leitet die Auto-Import-Namen von Komponenten standardmäßig aus dem Verzeichnispfad ab (z. B. `features/sessions/SessionCard.vue` → `FeaturesSessionsSessionCard`). Damit die Komponenten unter ihren Dateinamen verwendet werden können, wird in `nuxt.config.ts` die Option `pathPrefix: false` für das Komponentenverzeichnis gesetzt.

## 6. Komponentenübersicht

- **Pages / Seiten:** `pages/index.vue`, `pages/program.vue` und `pages/my-program.vue` bilden über das dateibasierte Routing die einzelnen Seiten der Anwendung.
- **Layout:** `layouts/default.vue` stellt als Nuxt-Layout den gemeinsamen Seitenaufbau bereit und bindet die Layout-Komponenten `AppHeader.vue` und `AppFooter.vue` ein.
- **Base/UI-Komponenten:** `BaseButton.vue`, `BaseCard.vue` und `BaseInput.vue` sind allgemeine, wiederverwendbare UI-Elemente.
- **Feature-Komponenten:** `SessionCard.vue` zeigt eine Session an, `SessionFilter.vue` stellt Filteroptionen dar und `MyProgram.vue` zeigt das persönliche Programm.
- **Composables:** `useConferenceData.ts` stellt Konferenzdaten bereit, `useSessionFilter.ts` kapselt die Filterlogik und `useMyProgram.ts` verwaltet die ausgewählten Session-IDs.
- **Datenquellen:** `conference-data.json` enthält die Konferenzdaten; `localStorage` speichert das persönliche Programm im Browser.
