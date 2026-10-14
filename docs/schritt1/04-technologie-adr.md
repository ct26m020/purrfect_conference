# ADR-04: Technologieentscheidung – Projekt-Setup

## 1. Kontext
Die „Purrfect Conference“-Plattform benötigt ein technisches Grundgerüst. Die Anwendung wird aus mehreren unterschiedlichen Seitentypen bestehen: einer allgemeinen Übersichtsseite, statischen Speaker- bzw. Session-Detailseiten und einem personalisierten Dashboard („Mein Programm“). Zudem ist bereits bekannt, dass das Projekt im weiteren Verlauf spezifische Rendering-Strategien (SSG, CSR, SSR) sowie Offline-Fähigkeiten (PWA) erfordern wird. Das gewählte Setup muss daher ein effizientes Routing für die verschiedenen Ansichten bieten und flexibel genug sein, um kommende Anforderungen ohne tiefgreifende Umbauten der Codebasis zu unterstützen.

## 2. Betrachtete Optionen

**Option 1: Vue 3 + Vite + Vue Router**
Dieses Setup ist der klassische Ansatz für eine Single-Page-Application (SPA). Es ist sehr leichtgewichtig und bietet vollständige Kontrolle über die Architektur. Das Routing muss manuell über eine zentrale Konfigurationsdatei eingerichtet und gepflegt werden. Der größte Nachteil ist jedoch, dass diese Kombination standardmäßig rein clientseitig (CSR) arbeitet. Die spätere Integration von Server-Side-Rendering (SSR) oder Static-Site-Generation (SSG) für einzelne Seiten würde komplexe manuelle Konfigurationen oder den nachträglichen Einbau von Zusatzbibliotheken (wie `vite-ssg`) erfordern.

**Option 2: Nuxt 3**
Nuxt ist ein Meta-Framework, das auf Vue aufbaut. Es bietet "out of the box" ein automatisches, dateibasiertes Routing über ein `pages/`-Verzeichnis, was den Konfigurationsaufwand für unsere verschiedenen Seitentypen drastisch minimiert. Nuxt bringt zudem automatische Imports für Komponenten und Composables mit. Der wichtigste Aspekt für die Zukunft: Nuxt unterstützt hybrides Rendering nativ. Die Architektur ist bereits darauf ausgelegt, später je nach Route zwischen CSR, SSR oder SSG zu wechseln.

## 3. Entscheidung
Wir entscheiden uns für **Option 2 (Nuxt 3)**. 
Obwohl in diesem Schritt noch keine spezifischen Rendering-Strategien umgesetzt werden, ist Nuxt die zukunftssicherere Basis für die kommenden Projektanforderungen. Das dateibasierte Routing nimmt uns bei den geplanten Seitentypen viel Boilerplate-Code ab und fügt sich nahtlos in unsere geplante Komponentenarchitektur ein.

## 4. Konsequenzen
Durch die Wahl von Nuxt profitieren wir von einer hohen Entwicklungsgeschwindigkeit dank Auto-Imports und konventionsbasierter Struktur. Das Projekt ist direkt bereit für die Evaluierung von Rendering-Strategien in Schritt 2 und PWA-Features in Schritt 3. 
Ein Nachteil ist, dass Nuxt als Meta-Framework etwas mehr Overhead („Blackbox“-Verhalten) und eine leicht höhere Lernkurve als eine nackte Vite-Installation mit sich bringt. Zudem müssen wir uns strikt an die vorgegebene Nuxt-Verzeichnisstruktur (`components/`, `composables/`, `pages/`) halten, was jedoch die langfristige Wartbarkeit und Einarbeitung für alle Teammitglieder positiv beeinflusst.