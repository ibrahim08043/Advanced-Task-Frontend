import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListNotifications, getListNotificationsQueryKey } from "../../lib/api-client-react/src/generated/api";
import { wsManager, type WsStatus, type WsNotification } from "@/services/websocket";

interface NotificationContextType {
  notifications: WsNotification[];
  unreadCount: number;
  connectionStatus: WsStatus;
  markAllRead: () => void;
  clearAll: () => void;
  toggleRead: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

function playPing() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not available
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<WsNotification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<WsStatus>("disconnected");
  const initialized = useRef(false);

  const { data: history } = useListNotifications();

  useEffect(() => {
    if (history && !initialized.current) {
      initialized.current = true;
      setNotifications(Array.isArray(history) ? history : []);
    }
  }, [history]);

  const handleNotification = useCallback((n: WsNotification) => {
    setNotifications((prev) => [n, ...prev].slice(0, 50));
    playPing();
    queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
  }, [queryClient]);

  const handleStatusChange = useCallback((s: WsStatus) => {
    console.log("WebSocket status:", s); // helpful for debugging
    setConnectionStatus(s);
  }, []);

  useEffect(() => {
    wsManager.onNotification(handleNotification);
    wsManager.onStatusChange(handleStatusChange);
    wsManager.connect();

    return () => {
      wsManager.removeListener(handleNotification);
      wsManager.removeListener(handleStatusChange);
      wsManager.disconnect();
    };
  }, [handleNotification, handleStatusChange]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, connectionStatus, markAllRead, clearAll, toggleRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}