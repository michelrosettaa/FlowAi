// public/service-worker.js

self.addEventListener("install", (event) => {
  console.log("🛠️ Refraim AI Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Refraim AI Service Worker activated");
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Refraim AI Update";
  const options = {
    body: data.body || "You have a new Refraim AI notification.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Optional: respond to notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://refraim.ai") // Change this to your app URL when deployed
  );
});
