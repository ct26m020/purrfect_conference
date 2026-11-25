# Aufgabe D – Entscheidungsprotokoll Offline und Caching

## Einleitung

Purrfect Conference soll im Vortragssaal bei überlastetem WLAN und im Flugmodus zwischen zwei Sessions nutzbar bleiben.
Die Strategien je Datentyp haben wir in B festgelegt, umgesetzt sind sie im Service Worker (`nuxt.config.ts`) und in `app/plugins/offline-cache.client.ts`.
Dieses Protokoll hält die Entscheidungen im Schema Kontext → Optionen → Entscheidung → Konsequenzen fest und prüft sie danach an konkreten Szenarien.
Beide Teammitglieder haben die Szenarien unabhängig auf dem eigenen Rechner getestet.

## 1. Session- und Speaker-Daten – Cache First

*Kontext:* Sessions und Speaker ändern sich nach der Veröffentlichung des Programms kaum. Sie kommen auf drei Wegen in den Browser: über die API `/api/sessions`, als Seiten `/program` und `/sessions/:id`, die der Server zur Laufzeit rendert (SWR, siehe Schritt 2), und als beim Build vorgerenderte Speaker-Seiten. Die zur Laufzeit gerenderten Seiten lassen sich nicht beim Build precachen.

*Optionen:* *Cache First* antwortet sofort aus dem Cache und fragt das Netz nur, wenn noch kein Eintrag da ist. *Stale-While-Revalidate* antwortet ebenfalls aus dem Cache, lädt aber im Hintergrund nach, sodass Änderungen beim nächsten Öffnen erscheinen. *Network First* fragt zuerst das Netz und nutzt den Cache erst danach. Bei schlechtem WLAN wartet man dann auf den Timeout.

*Entscheidung:* Wir wählen *Cache First* für alle drei Wege (Regeln S1 bis S3 in `nuxt.config.ts`). Im Saal zählt die sofortige Antwort, und das Programm ist weitgehend stabil. Gecacht wird nur Status 200, damit kein Fehler im Cache hängen bleibt. Die Cache-Namen enthalten eine Build-Version, damit nach einem neuen Build kein altes HTML auf gelöschte JS-Dateien verweist.

*Konsequenzen:* Bereits geöffnete Inhalte erscheinen offline ohne Verzögerung. Dafür erreicht eine Zeitplanänderung einen Browser mit gefülltem Cache erst nach dem nächsten Build (Szenario 4). Die ISR-Aktualisierung aus Schritt 2 kommt also nur noch bei Browsern ohne gefüllten Cache an. Müssten späte Raumänderungen sicher ankommen, wäre für S1 und S2 Stale-While-Revalidate nötig.

## 2. App-Shell und statische Assets – Precache

*Kontext:* Damit die App offline überhaupt startet, braucht sie das HTML von Startseite und „Mein Programm“, die gebauten JS- und CSS-Dateien inklusive Token-CSS, die Icons und die Schriften. Diese Dateien entstehen beim Build und ändern sich nur mit einem neuen Build.

*Optionen:* *Precache* lädt alle Dateien bei der Installation des Service Workers. *Cache First zur Laufzeit* speichert jede Datei erst, wenn sie zum ersten Mal gebraucht wird.

*Entscheidung:* App-Shell und lokale Assets kommen in den *Precache* (37 Einträge, rund 570 KiB). Google Fonts liegen auf fremden Servern und lassen sich beim Build nicht erfassen. Sie werden deshalb per Cache First beim ersten Online-Besuch gespeichert.

*Konsequenzen:* Nach dem ersten Besuch ist die App-Shell vollständig offline verfügbar, auch „Mein Programm“, wenn die Seite noch nie geöffnet wurde. Die Installation lädt die Dateien einmalig im Hintergrund. Ein neuer Build ersetzt den Precache automatisch.

## 3. „Mein Programm“ – localStorage, Precache und vorab geladene Session-Daten

*Kontext:* Die Auswahl liegt als Liste von Session-IDs im localStorage. Die Seite wird nur im Browser gerendert (CSR, siehe Schritt 2) und lädt Titel und Uhrzeiten über `/api/sessions`. Auf `/program` stecken die Daten aber direkt im HTML, dort wird die API nie abgerufen. Wer Sessions nur dort hinzufügt, hat die API-Antwort also nicht im Cache. Im Test mit dem reinen Precache-Stand öffnete sich „Mein Programm“ offline, die Liste war aber leer, obwohl drei Sessions gespeichert waren.

*Optionen:* (a) Nur auf den Cache aus der normalen Nutzung vertrauen. (b) Offline auf den beim Build eingebundenen JSON-Datensatz zurückfallen. (c) `/api/sessions` vorab laden, sobald der Service Worker die Seite kontrolliert.

*Entscheidung:* Wir wählen *(c)*. Das Plugin lädt `/api/sessions` und `/program` beim ersten Besuch und nach jedem Update des Service Workers vorab. Option (a) scheitert genau im beschriebenen Fall. Option (b) könnte nach einer Zeitplanänderung andere Zeiten zeigen als die Programmseite, weil der Datensatz beim Build eingefroren ist.

*Konsequenzen:* „Mein Programm“ funktioniert nach dem ersten Besuch einer beliebigen Seite offline, egal wo die Sessions hinzugefügt wurden. Hinzufügen und Entfernen wirken auch offline, weil sich nur der localStorage ändert. Beim ersten Besuch entstehen zwei zusätzliche Anfragen.

## 4. Ohne Cache – Fehlerseite des Browsers statt eigener Offline-Seite

*Kontext:* Ein Service Worker lässt sich nur über das Netz installieren. Beim Erstbesuch ohne Verbindung gibt es weder Service Worker noch Cache. Auch Session- und Speaker-Seiten, die nie online geöffnet wurden, fehlen im Cache.

*Optionen:* (a) Eine eigene Offline-Seite, die bei fehlendem Cache-Eintrag erscheint (`navigateFallback`). (b) Alle 20 Session- und 18 Speaker-Seiten beim ersten Besuch vorab laden. (c) Die Fehlerseite des Browsers akzeptieren.

*Entscheidung:* Für den Erstbesuch bleibt nur *(c)*, weil ohne Service Worker nichts abgefangen werden kann. Für nie geöffnete Detailseiten nehmen wir *(c)* vorerst ebenfalls in Kauf (`navigateFallback: null`). Die wichtigsten Angaben, Zeit und Raum, stehen bereits in der gecachten Übersicht.

*Konsequenzen:* Beim Erstbesuch offline erscheint die Chrome-Seite „Keine Internetverbindung“. Ein Klick innerhalb der App auf eine nie geöffnete Session zeigt einen leeren Inhaltsbereich ohne Hinweis (Szenario 1). Wir empfehlen deshalb, die App vor der Konferenz einmal online zu öffnen oder zu installieren, etwa über einen Link in der Anmeldebestätigung.

## Testszenarien

### Testumgebung

| | Rechner 1 (Schmidt) | Rechner 2 (Horvath) |
|---|---|---|
| Betriebssystem | Windows 11 Pro | _offen_ |
| Browser | Chrome 158 | _offen_ |
| Server | Produktions-Build (`npm run build`, Server aus `.output`) | _offen_ |
| Offline schalten | Offline-Emulation der DevTools für Seite und Service Worker, zusätzlich Server gestoppt | _offen_ |

Die Offline-Emulation der DevTools entspricht für den Browser dem Flugmodus: `navigator.onLine` ist `false`, und jede Anfrage ohne Cache-Treffer scheitert.

### Szenario 1 – Session-Übersicht offline nach einmaligem Online-Laden

*Ausgangslage:* Neues Browser-Profil, der Server läuft. `/program` wird als allererste Seite online geöffnet. Der Service Worker installiert sich während dieses Besuchs und lädt `/program` und `/api/sessions` vorab in den Cache.

*Aktion:* Offline schalten, `/program` neu laden, einen Track-Filter wählen, eine Session hinzufügen und dann auf eine Session klicken, deren Detailseite nie geöffnet wurde.

*Beobachtetes Verhalten:* Die Seite kommt mit Status 200 aus dem Service Worker und zeigt alle 20 Sessions mit Tag, Uhrzeit und Raum. Der Track-Filter reduziert die Liste sofort auf 3 Sessions, „Hinzufügen“ speichert die Session im localStorage. Beim Klick auf die nie geöffnete Session s11 wechselt die URL, der Inhaltsbereich bleibt aber leer. Wird eine nie besuchte Detailseite neu geladen, erscheint die Fehlerseite des Browsers.

| Ergebnis | Rechner 1 | Rechner 2 |
|---|---|---|
| Übersicht, Filter, Hinzufügen | bestanden | _offen_ |
| Nie geöffnete Detailseite | Lücke (siehe Entscheidung 4) | _offen_ |

### Szenario 2 – „Mein Programm“ offline nach dem Hinzufügen von Sessions

*Ausgangslage:* Neues Browser-Profil. Auf `/program` werden online drei Sessions hinzugefügt (s03, s07, s10). „Mein Programm“ wird online bewusst nicht geöffnet. Das ist der schwierigere Fall, weil `/api/sessions` dann nur durch das Vorab-Laden im Cache liegt.

*Aktion:* Offline schalten, `/my-program` öffnen, eine Session entfernen und die Seite neu laden.

*Beobachtetes Verhalten:* Die Seite kommt aus dem Precache. Alle drei Sessions erscheinen mit Tag und Uhrzeit, zum Beispiel „10:15–11:00 Uhr Design Tokens: Eine Sprache für Design und Code“. „Entfernen“ wirkt sofort, und nach dem Neuladen sind weiterhin zwei Einträge da, weil die Änderung im localStorage liegt. Zum Vergleich: Mit dem reinen Precache-Stand ohne Vorab-Laden blieb die Liste in derselben Situation leer.

| Ergebnis | Rechner 1 | Rechner 2 |
|---|---|---|
| Anzeige, Entfernen, Persistenz | bestanden | _offen_ |

### Szenario 3 – Erstbesuch ohne vorheriges Online-Laden (Grenzfall)

*Ausgangslage:* Neues Browser-Profil, die App wurde nie online geöffnet. Es gibt weder Service Worker noch Cache.

*Aktion:* Offline schalten und nacheinander `/`, `/program` und `/my-program` öffnen.

*Beobachtetes Verhalten:* Alle drei Aufrufe enden auf der Chrome-Fehlerseite „Keine Internetverbindung“ (`ERR_INTERNET_DISCONNECTED`). Ein Service Worker ist nicht registriert.

*Akzeptables Verhalten:* Die Fehlerseite des Browsers ist hier das erwartbare und ehrliche Ergebnis. Ein Service Worker kann nur über das Netz installiert werden. Vor dem ersten Besuch gibt es also nichts, was die App ausliefern könnte, auch eine eigene Offline-Seite würde erst danach wirken. Die Abhilfe ist organisatorisch: Teilnehmende öffnen die App vorab einmal, etwa über den Link in der Anmeldebestätigung oder im WLAN am Einlass.

| Ergebnis | Rechner 1 | Rechner 2 |
|---|---|---|
| Fehlerseite des Browsers wie erwartet | bestanden | _offen_ |

### Zusatzszenario 4 – Zeitplanänderung bei gefülltem Cache

*Ausgangslage:* Online, der Cache ist befüllt. Session s01 steht in „Mein Programm“ mit 09:00–09:45 Uhr.

*Aktion:* Über `POST /api/simulate/schedule-change` wird s01 auf dem Server um 30 Minuten verschoben. Danach wird „Mein Programm“ online neu geladen.

*Beobachtetes Verhalten:* Der Server liefert 09:30–10:15 Uhr. Der Browser zeigt weiterhin 09:00–09:45 Uhr, weil die Antwort aus dem Cache von Regel S1 kommt und das Netz gar nicht gefragt wird.

*Einordnung:* Das ist die bewusst in Kauf genommene Folge von Cache First (Entscheidung 1). Sobald späte Raum- oder Zeitänderungen zuverlässig ankommen müssen, wäre Stale-While-Revalidate für S1 und S2 die passende Strategie. Die neue Zeit erschiene dann spätestens beim zweiten Öffnen nach der Änderung.

| Ergebnis | Rechner 1 | Rechner 2 |
|---|---|---|
| Alte Zeit bleibt sichtbar | wie erwartet | _offen_ |

## Unterschiede zwischen den Rechnern

_offen, nach dem Test auf Rechner 2_
