# Aufgabe B – Offline-Strategie-Konzept

## 1. Ausgangssituation und Ziel

Mit Purrfect Conference können Besucher Sessions und Speaker ansehen und ihr eigenes Programm zusammenstellen.
Während einer Konferenz kann das WLAN langsam oder überlastet sein. Deshalb möchten wir, dass die wichtigsten Funktionen auch ohne Internet funktionieren.
Unsere Website verwendet Static Site Generation (SSG). Die Konferenzdaten kommen aus einer lokalen JSON-Datei und ändern sich normalerweise nur selten. 
Das persönliche Programm wird bereits im localStorage gespeichert.
Unser Ziel ist, dass Besucher nach einem Online-Besuch auch offline die Sessions ansehen und auf ihr gespeichertes Programm zugreifen können.

## 2. Unsere Caching-Strategien

|       Datentyp                            | Strategie  |                      Warum?                |
| Sessions und Speaker                      | Cache First| Die Daten ändern sich selten und sollen offline verfügbar sein. |
| App-Shell (HTML, JS, CSS)                 | Precache   | Die wichtigsten Dateien werden vorab gespeichert, damit die App offline startet. |
| Statische Dateien (Icons, Logos, Fonts)   | Precache   | Das Design soll auch ohne Internet richtig angezeigt werden. |
| Mein Programm                             | localStorage + Precache   | Gespeicherte Sessions bleiben erhalten und können mithilfe der gecachten App-Dateien angezeigt werden. |

Cache First bedeutet, dass zuerst im Cache nachgeschaut wird. Nur wenn die Datei dort nicht vorhanden ist, wird sie aus dem Internet geladen.
Precache bedeutet, dass wichtige Dateien bereits bei der Installation des Service Workers gespeichert werden. Dadurch müssen sie nicht vorher einzeln geöffnet werden.

## 3. Andere mögliche Strategien

Wir haben auch Stale While Revalidate und Network First verglichen.
Bei Stale While Revalidate werden zuerst gespeicherte Daten angezeigt. Gleichzeitig wird im Hintergrund nach einer neueren Version gesucht.
Das wäre sinnvoll, wenn sich Räume oder Uhrzeiten von Sessions kurzfristig ändern. Allerdings sieht der Besucher zunächst möglicherweise noch die alten Informationen.

Bei Network First versucht die App zuerst, die neuesten Daten aus dem Internet zu laden. Wenn das nicht funktioniert, verwendet sie den Cache. Bei schlechtem WLAN kann das aber länger dauern.
Wir entscheiden uns für Cache First, weil unsere Konferenzdaten meistens gleich bleiben und eine schnelle Offline-Nutzung für uns wichtiger ist.

## 4. Verhalten ohne Internet

Wir orientieren uns am Prinzip Graceful Degradation aus der LV. Das bedeutet, dass die App auch ohne Internet weiterhin die Funktionen anbietet, die offline möglich sind.
Wenn während der Nutzung die Verbindung abbricht, sollen bereits gespeicherte Seiten weiterhin funktionieren.

Auch "Mein Programm" soll offline geöffnet werden können. Sessions sollen weiterhin hinzugefügt oder entfernt werden können, solange die benötigten Daten gespeichert sind.
Ein Nachteil ist, dass gecachte Informationen möglicherweise nicht mehr aktuell sind.
Wenn jemand unsere Website zum ersten Mal ohne Internet öffnet, funktioniert sie nicht, weil noch keine Dateien gespeichert wurden. Das akzeptieren wir als Grenze unserer Offline-Strategie.

## 5. Fazit
Wir kombinieren Cache First, Precache und localStorage, damit unsere Konferenzplattform auch bei schlechtem WLAN möglichst gut funktioniert.
Diese Lösung passt zu unserer SSG-Architektur, weil viele Inhalte bereits als statische Seiten vorhanden sind.
Ob alle geplanten Funktionen tatsächlich offline funktionieren, überprüfen wir anschließend mit den Tests aus Aufgabe D und E.