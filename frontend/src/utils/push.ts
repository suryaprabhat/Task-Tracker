const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

export const subscribeUserToPush = async () => {
  if (!("serviceWorker" in navigator)) return;
  if (!("PushManager" in window)) return;

  const registration = await navigator.serviceWorker.ready;

  /* 🔴 PREVENT DUPLICATES (CRITICAL) */
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    console.log("Push subscription already exists");
    return;
  }

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    console.error("VAPID public key missing");
    return;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  const res = await fetch("http://localhost:5000/api/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  if (!res.ok) {
    throw new Error("Failed to save subscription");
  }

  console.log("Push subscription saved successfully");
};
