import { WS_BASE_URL } from "../../lib/api-client-react/src/config/api"

export type WsStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

export interface WsNotification {
  id: string;
  type: "message" | "alert" | "info" | "success" | "warning";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

type NotificationCb = (n: WsNotification) => void;
type StatusCb = (s: WsStatus) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private notificationListeners: Set<NotificationCb> = new Set();
  private statusListeners: Set<StatusCb> = new Set();
  private status: WsStatus = "disconnected";
  private retryDelay = 1000;
  private maxDelay = 30000;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldConnect = false;

  private getUrl(): string {
    // Always prefer environment variable (VITE_WS_URL)
    const wsBase = import.meta.env.VITE_WS_URL;
    console.log(wsBase, "wsBase")
    if (wsBase) {
      console.log(`[WebSocket] Connecting to: ${wsBase}/ws`);
      return `${wsBase}/ws`;
    }

    // Fallback only if env variable is missing (for safety)
    console.warn("[WebSocket] VITE_WS_URL is not set! Using same origin fallback.");

    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}/ws`;
  }

  connect(): void {
    this.shouldConnect = true;
    this.retryDelay = 1000;
    this._connect();
  }

  private _connect(): void {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }

    const url = this.getUrl();
    console.log(`[WebSocket] Connecting to: ${url}`);

    this.setStatus("connecting");

    try {
      this.ws = new WebSocket(url);
    } catch (err) {
      console.error("[WebSocket] Failed to create connection:", err);
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log("✅ WebSocket connected successfully");
      this.retryDelay = 1000;
      this.setStatus("connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as { event: string; data: WsNotification };
        if (msg.event === "notification") {
          this.notificationListeners.forEach((cb) => cb(msg.data));
        }
      } catch (err) {
        console.warn("[WebSocket] Failed to parse message:", err);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`[WebSocket] Closed. Code: ${event.code}, Reason: ${event.reason || 'No reason'}`);
      if (this.shouldConnect) {
        this.scheduleReconnect();
      } else {
        this.setStatus("disconnected");
      }
    };

    this.ws.onerror = (error) => {
      console.error("[WebSocket] Error occurred:", error);
      // Don't close here, let onclose handle it
    };
  }

  private scheduleReconnect(): void {
    this.setStatus("reconnecting");
    if (this.retryTimer) clearTimeout(this.retryTimer);

    this.retryTimer = setTimeout(() => {
      if (this.shouldConnect) this._connect();
    }, this.retryDelay);

    this.retryDelay = Math.min(this.retryDelay * 2, this.maxDelay);
  }

  disconnect(): void {
    this.shouldConnect = false;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.setStatus("disconnected");
  }

  private setStatus(s: WsStatus): void {
    this.status = s;
    console.log(`[WebSocket] Status changed to: ${s}`);
    this.statusListeners.forEach((cb) => cb(s));
  }

  getStatus(): WsStatus {
    return this.status;
  }

  onNotification(cb: NotificationCb): void {
    this.notificationListeners.add(cb);
  }

  onStatusChange(cb: StatusCb): void {
    this.statusListeners.add(cb);
  }

  removeListener(cb: NotificationCb | StatusCb): void {
    this.notificationListeners.delete(cb as NotificationCb);
    this.statusListeners.delete(cb as StatusCb);
  }
}

export const wsManager = new WebSocketManager();