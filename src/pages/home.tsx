import { Link } from "wouter";
import { motion } from "framer-motion";
import { Blocks, Radio, ArrowRight, Zap, Code2, Layers } from "lucide-react";

const features = [
  {
    icon: Blocks,
    title: "Component Library",
    description: "Buttons, cards, inputs, and toasts — all documented with live previews and copy-paste code snippets.",
    href: "/components",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    icon: Radio,
    title: "Live Notifications",
    description: "Real-time WebSocket feed showing live events as they happen — zero page reload required.",
    href: "/live",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Code2,
    title: "Copy-Paste Ready",
    description: "Every component ships with usage examples. Pick what you need and drop it into your project.",
    href: "/components",
    color: "bg-blue-500/10 text-blue-500",
  },
];

const stats = [
  { label: "Components", value: "20+" },
  { label: "Variants", value: "60+" },
  { label: "Live Events", value: "Real-time" },
];

export function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <Zap className="w-3 h-3" />
              WebSocket-powered real-time UI
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              A component library
              <br />
              <span className="text-primary">built to be used</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fully documented, copy-paste ready UI components. Plus a live notification system
              powered by WebSockets — watch events arrive in real time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/components"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Components
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/live"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                <Radio className="w-4 h-4 text-primary" />
                Watch Live Feed
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 flex items-center justify-center gap-12"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <Link href={f.href}>
                <div className="group p-6 border border-border rounded-xl bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer h-full">
                  <div className={`inline-flex p-2.5 rounded-lg ${f.color} mb-4`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 p-6 border border-border rounded-xl bg-card"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Tech Stack</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Built with React, Tailwind CSS, Framer Motion, and a Node.js/WebSocket backend.
              </p>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "WebSockets", "Express"].map((t) => (
                  <span key={t} className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
