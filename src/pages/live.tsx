import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Trash2, Send, Users, BarChart3, AlertCircle, Check, Info, AlertTriangle, MessageSquare, MailOpen, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGetNotificationStats, useTriggerNotification, getListNotificationsQueryKey, getGetNotificationStatsQueryKey } from "../../lib/api-client-react/src/generated/api";
import { useNotifications } from "../hooks/useNotifications";
import type { WsNotification } from "@/services/websocket";

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  message: { color: "text-blue-500", bg: "bg-blue-500/10", icon: MessageSquare },
  alert: { color: "text-red-500", bg: "bg-red-500/10", icon: AlertCircle },
  info: { color: "text-indigo-500", bg: "bg-indigo-500/10", icon: Info },
  success: { color: "text-green-500", bg: "bg-green-500/10", icon: Check },
  warning: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: AlertTriangle },
};

const STATUS_CONFIG = {
  connected: { color: "bg-green-500", label: "Connected", labelColor: "text-green-600 dark:text-green-400" },
  connecting: { color: "bg-yellow-500 animate-pulse", label: "Connecting...", labelColor: "text-yellow-600 dark:text-yellow-400" },
  reconnecting: { color: "bg-yellow-500 animate-pulse", label: "Reconnecting...", labelColor: "text-yellow-600 dark:text-yellow-400" },
  disconnected: { color: "bg-red-500", label: "Disconnected", labelColor: "text-red-600 dark:text-red-400" },
};

function NotificationItem({ n, onToggleRead }: { n: WsNotification; onToggleRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16, height: 0 }}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 p-4 border-b border-border last:border-0 group transition-colors ${!n.read ? "bg-primary/5" : ""}`}
    >
      {/* Tighter Icon Background */}
      <div className={`flex-shrink-0 p-2 rounded-lg ${cfg.bg} h-fit self-start mt-0.5`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{n.title}</span>
          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-0.5" />}
        </div>

        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-xs font-medium capitalize px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
            {n.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
          </span>
        </div>
      </div>

      <button
        onClick={() => onToggleRead(n.id)}
        title={n.read ? "Mark as unread" : "Mark as read"}
        className="flex-shrink-0 self-start p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all text-muted-foreground hover:text-foreground mt-0.5"
      >
        {n.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
      </button>
    </motion.div>
  );
}

export function Live() {
  const queryClient = useQueryClient();
  const { notifications, unreadCount, connectionStatus, markAllRead, clearAll, toggleRead } = useNotifications();
  const { data: serverStats } = useGetNotificationStats({ query: { queryKey: getGetNotificationStatsQueryKey(), refetchInterval: 5000 } });

  const CAP = 50;

  // Derive stats from local notifications so they update immediately on mark-read / clear
  const localStats = useMemo(() => {
    const byType: Record<string, number> = {};
    for (const n of notifications) {
      byType[n.type] = (byType[n.type] ?? 0) + 1;
    }
    const total = notifications.length;
    return {
      total,
      totalLabel: total >= CAP ? `${CAP}+` : String(total),
      unread: unreadCount,
      unreadLabel: unreadCount >= CAP ? `${CAP}+` : String(unreadCount),
      byType,
      connectedClients: serverStats?.connectedClients ?? 0,
    };
  }, [notifications, unreadCount, serverStats?.connectedClients]);

  const triggerMutation = useTriggerNotification({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetNotificationStatsQueryKey() });
        setForm({ type: "info", title: "", body: "" });
      },
    },
  });

  const [form, setForm] = useState<{ type: string; title: string; body: string }>({
    type: "info",
    title: "",
    body: "",
  });

  const statusCfg = STATUS_CONFIG[connectionStatus];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    triggerMutation.mutate({
      data: {
        type: form.type as "message" | "alert" | "info" | "success" | "warning",
        title: form.title,
        body: form.body,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Live Notifications</h1>
          <div className={`w-2.5 h-2.5 rounded-full ${statusCfg.color}`} />
        </div>
        <p className={`text-sm font-medium ${statusCfg.labelColor}`}>{statusCfg.label}</p>
        <p className="text-muted-foreground mt-1">
          Real-time WebSocket feed — notifications arrive automatically every few seconds.
        </p>
      </motion.div>

      {/* Stats — derived from local state so they update instantly */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: "Total", display: localStats.totalLabel, icon: Bell },
          { label: "Unread", display: localStats.unreadLabel, icon: BarChart3 },
          { label: "Connected", display: String(localStats.connectedClients), icon: Users },
          { label: "Types", display: String(Object.keys(localStats.byType).length), icon: AlertCircle },
        ].map(({ label, display, icon: Icon }) => (
          <div key={label} className="border border-border rounded-xl bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs">{label}</span>
            </div>
            <div className="text-2xl font-bold">{display}</div>
          </div>
        ))}
      </motion.div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Notification Feed */}
        <div className="lg:col-span-2">
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Live Feed</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    {localStats.unreadLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Mark all read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[560px]">
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center text-muted-foreground"
                  >
                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No notifications yet — they will appear here live</p>
                  </motion.div>
                ) : (
                  notifications.map((n) => <NotificationItem key={n.id} n={n} onToggleRead={toggleRead} />)
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Trigger Form */}
        <div>
          <div className="border border-border rounded-xl bg-card overflow-hidden sticky top-20">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Send className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Trigger Notification</span>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="message">Message</option>
                  <option value="alert">Alert</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="Notification title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Message</label>
                <textarea
                  placeholder="Notification body text..."
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={triggerMutation.isPending || !form.title.trim() || !form.body.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {triggerMutation.isPending ? "Sending..." : "Send Notification"}
              </button>
              {triggerMutation.isError && (
                <p className="text-xs text-destructive">Failed to send. Try again.</p>
              )}
            </form>

            <div className="px-4 pb-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Notifications broadcast to all connected clients via WebSocket automatically every 6-10 seconds. Use this form to trigger one manually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
