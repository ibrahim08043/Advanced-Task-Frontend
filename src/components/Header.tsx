import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sun, Moon, Bell, Zap, X, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useNotifications } from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const typeColors: Record<string, string> = {
  message: "bg-blue-500",
  alert: "bg-red-500",
  info: "bg-indigo-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
};

export function Header() {
  const [location] = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const { notifications, unreadCount, connectionStatus, markAllRead } = useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);
  console.log(connectionStatus, "connectionStatus")
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/components", label: "Components" },
    { href: "/live", label: "Live" },
  ];

  const statusColor =
    connectionStatus === "connected"
      ? "bg-green-500"
      : connectionStatus === "reconnecting"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Zap className="w-5 h-5" />
            <span className="hidden sm:inline">DesignKit</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${statusColor}`} />
            <span className="hidden sm:inline capitalize">{connectionStatus}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setPanelOpen((o) => !o)}
              className="relative p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {panelOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="font-semibold text-sm">Notifications</span>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Mark all read"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setPanelOpen(false)}
                          className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.slice(0, 5).length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 border-b border-border last:border-0 flex gap-3 ${!n.read ? "bg-primary/5" : ""}`}
                          >
                            <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${typeColors[n.type] ?? "bg-gray-400"}`} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium leading-tight truncate">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.body}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 5 && (
                      <Link
                        href="/live"
                        onClick={() => setPanelOpen(false)}
                        className="block px-4 py-2 text-center text-xs text-primary hover:bg-muted transition-colors"
                      >
                        View all {notifications.length} notifications
                      </Link>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
