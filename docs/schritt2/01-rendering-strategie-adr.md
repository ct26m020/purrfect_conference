# Rendering-Strategie – Purrfect Conference
## Einleitung

Für Purrfect Conference verwenden wir Nuxt und einen lokalen JSON-Datensatz mit 20 Sessions und 18 Speakern. 
Ein Backend gibt es derzeit nicht. Weil die Seiten unterschiedliche Daten zeigen, entscheiden wir für jeden Teil getrennt, wie er gerendert wird.

- Öffentliche Informationen sollen schnell sichtbar und für Suchmaschinen gut lesbar sein.
- Persönliche Daten müssen dagegen im Browser geladen werden, weil sie in localStorage gespeichert sind.

Wir vergleichen SSG, CSR, SSR und ISR vor allem nach Aktualität der Daten, Ladezeit, SEO und technischem Aufwand. Wo sich Daten zur Laufzeit ändern können, simulieren wir die Änderungen. Ein echtes Backend würde später nur die Datenquelle ersetzen.

## 1. Speaker-Profile – SSG

*Kontext:* Unsere Konferenz hat 18 Speaker. Jedes Profil enthält Name, Titel, Firma, Biografie und Links zu den Sessions. Diese Informationen sind für alle Besucher gleich und ändern sich normalerweise selten. Aktuell kommen sie direkt aus unserer JSON-Datei.

*Optionen:* Bei *SSG* werden die Profile bereits beim Build als HTML erzeugt. Bei *SSR* würde Nuxt das Profil erst beim Aufrufen der Seite auf dem Server rendern. Auch *CSR* wäre möglich, dann würde der Browser die Profilinhalte selbst aufbauen.

*Entscheidung:* Wir wählen *SSG*. Da sich die Profile zur Laufzeit nicht ändern, hat SSR keinen Vorteil. Der Server müsste bei jedem Aufruf die gleiche Seite neu erzeugen. Im Vergleich zu reinem CSR ist der Inhalt außerdem schon im HTML vorhanden, was für SEO hilfreich ist. Alle 18 Profil-Routen werden in Nuxt über `nitro.prerender.routes` beim Build vorab erzeugt.

*Konsequenzen:* Die Seiten sind schnell, weil sie als fertige Dateien ausgeliefert werden und der Server nichts rendern muss. Wenn sich eine Biografie oder Firma ändert, müssen wir die JSON-Daten aktualisieren und die Website neu bauen. Für unseren Prototyp ist das in Ordnung. Bei häufigen Änderungen würden wir die Entscheidung neu prüfen.

## 2. Session-Detailseiten – ISR

*Kontext:* Jede der 20 Sessions hat eine Detailseite mit Abstract, Tag, Uhrzeit, Raum, Level und Speakern. Die Inhalte sind für alle Besucher gleich. Bei einer echten Konferenz können sich Uhrzeit oder Raum aber kurzfristig ändern.

*Optionen:* *SSG* erzeugt alle Detailseiten beim Build, jede Zeitplanänderung erfordert einen neuen Build. *SSR* ist immer aktuell, rendert aber bei jedem Aufruf neu, auch wenn sich nichts geändert hat. *ISR* liefert eine zwischengespeicherte Seite aus und erneuert sie nach einem festen Intervall im Hintergrund.

*Entscheidung:* Wir wählen *ISR*. Nuxts Option `isr` wirkt nur auf Plattformen wie Vercel oder Netlify, auf unserem Node-Server setzen wir das Prinzip mit `routeRules: { '/sessions/**': { swr: 60 } }` um. Die Seiten sind fast so schnell wie statische Seiten, weil nicht jeder Aufruf neu gerendert wird. Nach Ablauf der 60 Sekunden wird die Seite beim nächsten Aufruf im Hintergrund neu erzeugt, ohne neuen Build. Eine Minute Verzögerung ist bei Zeitplanänderungen vertretbar. Da es kein Live-Backend gibt, simulieren wir eine Änderung. Dazu verschieben wir die Uhrzeit einer Session in der Datenquelle und prüfen, ob die Detailseite nach der Revalidierung die neue Zeit zeigt.

*Konsequenzen:* Die Inhalte stehen direkt im HTML und Änderungen erscheinen ohne Deployment. Bis zur nächsten Revalidierung kann eine Seite aber kurz veraltet sein. Statt reinem Static Hosting brauchen wir einen Server oder eine Plattform mit ISR-Unterstützung. Außerdem müssen die Sessiondaten zur Laufzeit gelesen werden, z. B. über eine Server-Route, statt fest in den Build importiert zu sein.

## 3. Session-Übersicht mit Filtern – ISR + CSR

*Kontext:* Die Programmseite zeigt alle 20 Sessions mit Tag, Uhrzeit und Raum. Besucher können suchen und nach Track, Tag und Level filtern. Weil die Übersicht dieselben Zeiten und Räume wie die Detailseiten zeigt, ist sie von Zeitplanänderungen genauso betroffen.

*Optionen:* Bei reinem *CSR* baut der Browser die Übersicht erst nach dem Laden von JavaScript auf, was für SEO und den ersten Seitenaufbau schlechter ist. *SSG* liefert fertiges HTML, zeigt nach einer Zeitplanänderung aber bis zum nächsten Build veraltete Daten. *ISR* liefert ebenfalls fertiges HTML und aktualisiert es regelmäßig. Die Filterung kann in jedem Fall per CSR im Browser laufen.

*Entscheidung:* Wir kombinieren *ISR für die Programmseite* mit *CSR für Suche und Filter*. Für ISR nutzen wir dasselbe Intervall wie bei den Detailseiten, damit beide Seiten nach einer Änderung dieselben Zeiten zeigen. Die Filter arbeiten auf den bereits geladenen Sessions und reagieren sofort, ohne Neuladen der Seite.

*Konsequenzen:* Die Session-Liste steht direkt im HTML, und Filterwechsel brauchen keine Serveranfragen. Wie die Detailseiten kann die Übersicht bis zur Revalidierung kurz veraltet sein und braucht dieselbe Laufzeit-Datenquelle. Für die Filter wird JavaScript benötigt. Ohne JavaScript sieht man die ungefilterte Liste.

## 4. „Mein Programm“ – CSR

*Kontext:* Besucher können Sessions zu ihrem persönlichen Programm hinzufügen und wieder entfernen. Die Auswahl wird als Liste von Session-IDs in localStorage gespeichert und soll nach einem Reload erhalten bleiben. Diese Daten liegen nur im jeweiligen Browser. Der Server kennt die persönliche Auswahl nicht.

*Optionen:* Bei *SSR* müsste der Server wissen, welche Sessions ein Besucher gespeichert hat. Dafür bräuchten wir zum Beispiel Benutzerkonten und eine serverseitige Speicherung. *SSG* könnte nur eine allgemeine, leere Seite erzeugen, aber nicht die persönliche Liste vorab erstellen. Mit *CSR* kann die Auswahl direkt im Browser gelesen und angezeigt werden.

*Entscheidung:* Wir verwenden *CSR* für „Mein Programm“, in Nuxt über `routeRules: { '/my-program': { ssr: false } }`. Das passt zu unserer aktuellen Speicherung mit localStorage und benötigt kein Backend. Nach dem Laden der Seite lesen wir die gespeicherten IDs und zeigen die zugehörigen Sessions an. Hinzufügen und Entfernen sollen die Anzeige sofort aktualisieren.

*Konsequenzen:* Die Umsetzung bleibt einfach und die Auswahl funktioniert auch nach einem Neuladen im selben Browser. Allerdings wird das persönliche Programm nicht zwischen Geräten synchronisiert. Außerdem gibt es für die Seite kein fertiges HTML, die Inhalte erscheinen erst nach dem Laden von JavaScript. Das ist hier kein Problem, weil eine persönliche Seite nicht von Suchmaschinen gefunden werden muss. Auch die Programmseite zeigt über ihre Buttons an, ob eine Session ausgewählt ist. Dort lesen wir localStorage deshalb erst nach dem Mounten aus, sonst unterscheiden sich Server- und Browserdarstellung.