import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getToken } from "./token";

let echoInstance: Echo | null = null;

function getPusherClient() {
  const candidate = Pusher as unknown as { default?: typeof Pusher };
  return candidate.default ?? Pusher;
}

export function getEcho() {
  if (echoInstance) {
    return echoInstance;
  }

  const key = import.meta.env.VITE_REVERB_APP_KEY;
  const host = import.meta.env.VITE_REVERB_HOST;
  const portRaw = import.meta.env.VITE_REVERB_PORT;
  const scheme = import.meta.env.VITE_REVERB_SCHEME ?? "http";

  if (!key || !host) {
    // eslint-disable-next-line no-console
    console.warn("Reverb: missing env", {
      hasKey: Boolean(key),
      hasHost: Boolean(host),
      key,
      host
    });
    return null;
  }

  const apiBase = "http://127.0.0.1:8000";
  const authEndpoint = `${apiBase}/broadcasting/auth`;
  const token = getToken();

  try {
    const globalWindow = window as Window & { Pusher?: typeof Pusher };
    if (!globalWindow.Pusher) {
      globalWindow.Pusher = getPusherClient();
    }

    echoInstance = new Echo({
      broadcaster: "reverb",
      key,
      wsHost: host,
      wsPort: portRaw ? Number(portRaw) : 8080,
      wssPort: portRaw ? Number(portRaw) : 8080,
      forceTLS: scheme === "https",
      enabledTransports: ["ws", "wss"],
      authEndpoint,
      auth: token
        ? {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
        : undefined
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Reverb: echo init failed", err);
    return null;
  }

  return echoInstance;
}
