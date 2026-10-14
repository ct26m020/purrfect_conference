# Purrfect Conference - Branding und Design Tokens

## 1. Markenkonzept

Purrfect Conference verbindet eine moderne Konferenzplattform mit einem unverwechselbaren Katzendesign, das für eine freundliche und entspannte Nutzererfahrung sorgt. Im Gegensatz zu generischen Konferenz-Websites kombinieren wir eine verspielte Markenidentität mit praktischen Funktionen wie einem personalisierten Konferenz-Körbchen, intelligenten Programmfiltern und Offline-Zugriff auf gespeicherte Sessions. Unser Motto „A purrfect plan for your conference“ steht für die Verbindung von Persönlichkeit, Übersichtlichkeit und Funktionalität.

## 2. Visuelle Gestaltung und Farbpalette

Unser Design soll ruhig, modern und leicht verspielt wirken. Babyblau ist unsere Hauptfarbe und sorgt für einen freundlichen, wiedererkennbaren Look. 
Dunkles Navy verwenden wir für Texte und wichtige Buttons, weil es auf den hellen Hintergründen gut lesbar ist. 
Ice Blue und Weiß eignen sich als Flächenfarben, Cream und Peach setzen sparsame Akzente. 
Die Katze soll als kleines Maskottchen und in einzelnen Icons vorkommen, nicht als große Dekoration auf jeder Seite. So bleibt das Konferenzprogramm im Mittelpunkt.

| Farbe         | HEX       | Verwendung |

| Baby Blue     | `#B8DDF2` | Markenfarbe, hervorgehobene Flächen |
| Ice Blue      | `#EDF7FC` | Seitenhintergrund |
| Deep Navy     | `#213B50` | Haupttext, Buttons, Navigation |
| Slate Blue    | `#425F73` | Sekundärer Text |
| Cream         | `#FFF9F1` | Alternative Hintergrundflächen |
| Soft Peach    | `#F2B6A0` | Kleine Akzente |
| White         | `#FFFFFF` | Kartenflächen, Buttontext auf Navy |

## 3. Lesbarkeit und Kontrast

Wir orientieren uns an WCAG AA. Für normalen Text ist ein Kontrast von mindestens 4,5:1 nötig, für großen Text mindestens 3:1. 
Unsere gewählten Text-Hintergrund-Paare haben folgende berechnete Kontrastwerte:

| Text / Hintergrund        | Kontrast  | Normaler Text (AA) |

| Deep Navy auf Baby Blue   | 8,12:1    | Bestanden |
| Deep Navy auf Ice Blue    | 10,69:1   | Bestanden |
| Deep Navy auf Weiß        | 11,63:1   | Bestanden |
| Slate Blue auf Baby Blue  | 4,71:1    | Bestanden |
| Slate Blue auf Ice Blue   | 6,20:1    | Bestanden |
| Weiß auf Deep Navy        | 11,63:1   | Bestanden |

Weiße Schrift auf Babyblau vermeiden wir, weil dieses Paar nur 1,43:1 erreicht. 
Für klickbare Elemente und Zustände wie Fokus prüfen wir den Kontrast bei der Umsetzung zusätzlich.

## 4. Typografie und Abstände

Für Überschriften wählen wir Nunito. Die Schrift wirkt durch ihre runden Formen freundlich und passt zu unserem Katzenthema, ohne zu kindlich zu sein. 
Für längere Texte und Session-Informationen verwenden wir Inter, weil sie klar und gut lesbar ist. 
Wir planen eine einfache Größenskala mit 14, 16, 20, 24 und 36 Pixeln. So ist der Unterschied zwischen Metadaten, Fließtext und Überschriften erkennbar.

Unsere Spacing-Skala besteht aus 4, 8, 16, 24 und 32 Pixeln. Statt bei jedem Element neue Abstände festzulegen, verwenden wir diese gemeinsamen Werte für Karten, Navigation, Buttons und Seitenbereiche. Dadurch wirkt die Oberfläche einheitlicher und lässt sich später leichter anpassen.

## 5. Aufbau der Design Tokens

Wir trennen primitive Tokens und semantische Tokens. 
Primitive Tokens enthalten konkrete Werte, zum Beispiel `--blue-baby: #B8DDF2` oder `--space-3: 16px`. 
Semantische Tokens beschreiben dagegen ihren Zweck, etwa `--color-surface-accent` oder `--color-text-primary`, und verweisen auf primitive Werte. 
Die Definitionen stehen gesammelt in `tokens/tokens.css`.

Diese Trennung hat für uns drei wichtige Vorteile. 
Konsistenz: Dieselben Farben, Schriften und Abstände werden überall verwendet. 
Wartbarkeit: Wenn wir eine Farbe ändern, müssen wir nicht jede Komponente einzeln bearbeiten. 
Erweiterbarkeit: Beim späteren Dark Mode können wir die semantischen Farbwerte neu zuweisen, ohne die Komponentenstruktur zu verändern. Eine vollständige Dark-Mode-Palette erstellen wir in diesem Schritt noch nicht.