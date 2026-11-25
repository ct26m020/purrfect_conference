// Ergänzt die Caching-Regeln S1–S3 aus nuxt.config.ts (Aufgabe C)
//
// 1. Vorab befüllen: Auf /program stecken die Sessions direkt im HTML, /api/sessions wird dort
//    nie abgerufen. „Mein Programm“ braucht aber genau diese Antwort. Ohne diesen Schritt wäre die
//    Liste offline leer, wenn man Sessions hinzugefügt, „Mein Programm“ aber nie online geöffnet hat.
//    Außerdem landet die Seite, mit der der Service Worker installiert wird, nicht im Laufzeit-Cache.
//    Deshalb werden /api/sessions und /program einmal über den Service Worker geladen (Cache First).
// 2. Aufräumen: Die Laufzeit-Caches tragen die Build-Version im Namen. Caches älterer Builds
//    werden gelöscht, damit kein altes HTML auf nicht mehr vorhandene JS-Dateien verweist.
// 3. Update: Chrome sucht erst nach einem neuen Service Worker, wenn der alte untätig ist.
//    Bis dahin würde nach einem neuen Build noch der alte antworten, ohne die aktuellen Regeln.
//    Deshalb wird beim Start aktiv nach einem Update gefragt.
export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator) || !('caches' in window)) {
    return
  }

  const { version, names, warmUpUrls } = useAppConfig().offlineCache

  async function prepareOfflineCache() {
    await removeOutdatedCaches(version, names)
    // Bereits gecachte Antworten kommen aus dem Cache, es entsteht also kein zusätzlicher Netzverkehr
    await Promise.allSettled(warmUpUrls.map(url => fetch(url)))
  }

  onNuxtReady(async () => {
    // Beim Erstbesuch und nach einem Update übernimmt der neue Service Worker die Seite erst nachträglich.
    // Vorher gehen die Anfragen an ihm vorbei, deshalb wird bei jedem Wechsel erneut vorab geladen.
    navigator.serviceWorker.addEventListener('controllerchange', prepareOfflineCache)
    if (navigator.serviceWorker.controller) {
      await prepareOfflineCache()
    }

    const registration = await navigator.serviceWorker.getRegistration()
    // Offline scheitert die Abfrage, dann bleibt einfach der aktuelle Service Worker aktiv
    await registration?.update().catch(() => {})
  })
})

async function removeOutdatedCaches(version: string, names: string[]) {
  const current = new Set(names.map(name => `${name}-${version}`))
  const outdated = (await caches.keys()).filter(
    key => names.some(name => key.startsWith(`${name}-`)) && !current.has(key),
  )
  await Promise.all(outdated.map(key => caches.delete(key)))
}
