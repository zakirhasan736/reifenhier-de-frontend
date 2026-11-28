/* Reifexa Web Push service worker — price alerts and ops sale alerts */

self.addEventListener('install', () => {
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
    sound: true,
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

  const admin = String(data.kind || '').indexOf('admin_') === 0
  const target = data.url || (admin ? 'https://www.reifexa.de/ops' : 'https://www.reifexa.de/')

  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const deskVisible = clientList.some((client) => client.visibilityState === 'visible' && String(client.url || '').indexOf('/ops') !== -1)
    clientList.forEach((client) => {
      client.postMessage({
        type: 'rx-push',
        kind: data.kind || '',
        title: data.title,
        body: data.body,
        vendor: data.vendor || '',
        commission: data.commission || '',
        amount: data.saleAmount || '',
        transactionId: data.transactionId || data.tag || '',
        url: target,
      })
    })
    await self.registration.showNotification(data.title || 'Reifexa', {
      body: data.body,
      icon: data.icon || '/images/favicon.png',
      badge: data.badge || '/images/favicon.png',
      tag: data.tag || (admin ? 'reifexa-sale' : 'reifexa-price'),
      renotify: true,
      silent: deskVisible || data.sound === false,
      requireInteraction: admin && !deskVisible,
      vibrate: admin ? [140, 70, 140, 70, 220] : [80, 40, 80],
      data: {
        url: target,
        kind: data.kind || '',
        transactionId: data.transactionId || data.tag || '',
        vendor: data.vendor || '',
        commission: data.commission || '',
        amount: data.saleAmount || '',
      },
      actions: [{ action: 'open', title: admin ? 'Im Desk öffnen' : 'Angebot ansehen' }],
    })
  })())
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
