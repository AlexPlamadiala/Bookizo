// Bookizo Service Worker - Push Notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "Ai o notificare nouă",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.tag || "bookizo-notification",
    data: {
      url: data.url || "/notifications",
    },
    actions: [
      { action: "open", title: "Deschide" },
      { action: "dismiss", title: "Închide" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Bookizo", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
