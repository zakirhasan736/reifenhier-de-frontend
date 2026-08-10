/* Reifexa Web Push service worker — price alerts for viewed / clicked products */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {
    title: 'Reifexa Preisalarm',
    body: 'Es gibt ein Update zu einem Ihrer Reifenangebote.',
    url: 'https://www.reifexa.de/',
    tag: 'reifexa-price',
    icon: '/images/favicon.png',
    badge: '/images/favicon.png',
  }

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() }
    }
  } catch {
    try {
      const text = event.data && event.data.text()
      if (text) data.body = text
    } catch {
      // ignore
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Reifexa', {
      body: data.body,
      icon: data.icon || '/images/favicon.png',
      badge: data.badge || '/images/favicon.png',
      tag: data.tag || 'reifexa-price',
      renotify: true,
      data: { url: data.url || 'https://www.reifexa.de/' },
      actions: [{ action: 'open', title: 'Angebot ansehen' }],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target =
    (event.notification.data && event.notification.data.url) ||
    'https://www.reifexa.de/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(
      (clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(target)
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(target)
        }
      }
    )
  )
})
