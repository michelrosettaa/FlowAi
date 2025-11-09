self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "FlowAI", {
      body: data.body || "",
      icon: "/icons.png",
      data
    })
  );
});
