import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, Search, Check, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group">
      <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 rounded-lg p-4 text-xs overflow-x-auto font-mono leading-relaxed border border-zinc-800">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function ComponentCard({ title, preview, code }: { title: string; preview: React.ReactNode; code: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="border border-border rounded-xl bg-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <div className="px-5 py-6 flex flex-wrap items-center gap-3">
        {preview}
      </div>
      <div className="px-5 pb-5">
        <CodeBlock code={code} />
      </div>
    </motion.div>
  );
}

// ─── Button Demos ────────────────────────────────────────────────────────────
function PrimaryBtn({ size = "md", children = "Primary" }: { size?: "sm" | "md" | "lg"; children?: string }) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button className={`${sizes[size]} bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 active:scale-95 transition-all`}>
      {children}
    </button>
  );
}

function SecondaryBtn({ children = "Secondary" }: { children?: string }) {
  return (
    <button className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 active:scale-95 transition-all">
      {children}
    </button>
  );
}

function DestructiveBtn() {
  return (
    <button className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 active:scale-95 transition-all">
      Delete
    </button>
  );
}

function LoadingBtn() {
  return (
    <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 cursor-not-allowed opacity-80">
      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
    </button>
  );
}

function DisabledBtn() {
  return (
    <button disabled className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg font-medium cursor-not-allowed">
      Disabled
    </button>
  );
}

// ─── Input Demos ─────────────────────────────────────────────────────────────
function TextInput() {
  return (
    <input
      type="text"
      placeholder="Type something..."
      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
    />
  );
}

function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full">
      <input
        type={show ? "text" : "password"}
        placeholder="Enter password"
        defaultValue="supersecret"
        className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
      />
      <button
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function ErrorInput() {
  return (
    <div className="w-full">
      <input
        type="email"
        defaultValue="not-an-email"
        className="w-full px-3 py-2 text-sm border border-destructive rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive/30 transition-all"
      />
      <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> Please enter a valid email address
      </p>
    </div>
  );
}

function SearchInput() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search..."
        className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
      />
    </div>
  );
}

// ─── Card Demos ───────────────────────────────────────────────────────────────
function ImageCard() {
  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden w-64">
      <div className="h-36 bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-muted-foreground text-sm">
        Image placeholder
      </div>
      <div className="p-4">
        <h4 className="font-semibold">Card Title</h4>
        <p className="text-sm text-muted-foreground mt-1">A short description of what this card is about.</p>
        <div className="mt-4 flex gap-2">
          <button className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
            Action
          </button>
          <button className="px-3 py-1.5 text-xs border border-border rounded-md font-medium hover:bg-muted transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SimpleCard() {
  return (
    <div className="border border-border rounded-xl bg-card p-5 w-64">
      <h4 className="font-semibold">Simple Card</h4>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        A versatile container for related content and actions.
      </p>
      <div className="mt-4 pt-4 border-t border-border flex justify-end gap-2">
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
        <button className="text-xs text-primary font-medium hover:underline">Confirm</button>
      </div>
    </div>
  );
}

function StatCard() {
  return (
    <div className="border border-border rounded-xl bg-card p-5 w-48">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Users</span>
        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
          <Check className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-3xl font-bold">2,847</div>
      <p className="text-xs text-green-500 font-medium mt-1">+12.5% from last month</p>
    </div>
  );
}

// ─── Toast Demos ──────────────────────────────────────────────────────────────
function ToastDemos() {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => toast.success("Action completed successfully")}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <Check className="w-3.5 h-3.5" /> Success
      </button>
      <button
        onClick={() => toast.error("Something went wrong, please try again")}
        className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
      >
        <AlertCircle className="w-3.5 h-3.5" /> Error
      </button>
      <button
        onClick={() => toast.warning("Check your connection before proceeding")}
        className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
      >
        <AlertTriangle className="w-3.5 h-3.5" /> Warning
      </button>
      <button
        onClick={() => toast.info("Update available. Refresh to apply.")}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
      >
        <Info className="w-3.5 h-3.5" /> Info
      </button>
    </div>
  );
}

export function Components() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-bold">Component Library</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Every component below is live and interactive. Copy the code snippet to use it in your project.
        </p>
      </motion.div>

      <div className="mt-12 space-y-16">
        {/* BUTTONS */}
        <section>
          <SectionTitle title="Buttons" description="Interactive controls in multiple variants and sizes." />
          <div className="space-y-5">
            <ComponentCard
              title="Variants"
              preview={<><PrimaryBtn /> <SecondaryBtn /> <DestructiveBtn /></>}
              code={`// Primary
<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
  Primary
</button>

// Secondary
<button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80">
  Secondary
</button>

// Destructive
<button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90">
  Delete
</button>`}
            />
            <ComponentCard
              title="States"
              preview={<><LoadingBtn /> <DisabledBtn /></>}
              code={`// Loading
<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 cursor-not-allowed opacity-80">
  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
</button>

// Disabled
<button disabled className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium cursor-not-allowed">
  Disabled
</button>`}
            />
            <ComponentCard
              title="Sizes"
              preview={<><PrimaryBtn size="sm">Small</PrimaryBtn> <PrimaryBtn size="md">Medium</PrimaryBtn> <PrimaryBtn size="lg">Large</PrimaryBtn></>}
              code={`// Small
<button className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-medium">Small</button>

// Medium  
<button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium">Medium</button>

// Large
<button className="px-6 py-3 text-base bg-primary text-primary-foreground rounded-lg font-medium">Large</button>`}
            />
          </div>
        </section>

        {/* CARDS */}
        <section>
          <SectionTitle title="Cards" description="Container components for grouping related content and actions." />
          <div className="space-y-5">
            <ComponentCard
              title="Image Card"
              preview={<ImageCard />}
              code={`<div className="border border-border rounded-xl bg-card overflow-hidden w-64">
  <div className="h-36 bg-gradient-to-br from-primary/20 to-violet-500/20" />
  <div className="p-4">
    <h4 className="font-semibold">Card Title</h4>
    <p className="text-sm text-muted-foreground mt-1">Description text here.</p>
    <div className="mt-4 flex gap-2">
      <button className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md">Action</button>
      <button className="px-3 py-1.5 text-xs border border-border rounded-md">Cancel</button>
    </div>
  </div>
</div>`}
            />
            <ComponentCard
              title="Simple & Stat Cards"
              preview={<><SimpleCard /> <StatCard /></>}
              code={`// Simple card
<div className="border border-border rounded-xl bg-card p-5">
  <h4 className="font-semibold">Title</h4>
  <p className="text-sm text-muted-foreground mt-2">Content goes here.</p>
  <div className="mt-4 pt-4 border-t border-border flex justify-end gap-2">
    <button className="text-xs text-muted-foreground">Cancel</button>
    <button className="text-xs text-primary font-medium">Confirm</button>
  </div>
</div>

// Stat card
<div className="border border-border rounded-xl bg-card p-5">
  <div className="flex items-center justify-between mb-3">
    <span className="text-xs text-muted-foreground uppercase">Total Users</span>
    <div className="p-1.5 rounded-md bg-primary/10 text-primary"><Icon className="w-3.5 h-3.5" /></div>
  </div>
  <div className="text-3xl font-bold">2,847</div>
  <p className="text-xs text-green-500 font-medium mt-1">+12.5% from last month</p>
</div>`}
            />
          </div>
        </section>

        {/* INPUTS */}
        <section>
          <SectionTitle title="Inputs" description="Form controls in various states with validation support." />
          <div className="space-y-5">
            <ComponentCard
              title="Text Input"
              preview={<div className="w-full max-w-sm"><TextInput /></div>}
              code={`<input
  type="text"
  placeholder="Type something..."
  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
/>`}
            />
            <ComponentCard
              title="Password Input"
              preview={<div className="w-full max-w-sm"><PasswordInput /></div>}
              code={`const [show, setShow] = useState(false);

<div className="relative">
  <input
    type={show ? "text" : "password"}
    placeholder="Enter password"
    className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
  />
  <button
    onClick={() => setShow(s => !s)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
  >
    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
</div>`}
            />
            <ComponentCard
              title="Error State"
              preview={<div className="w-full max-w-sm"><ErrorInput /></div>}
              code={`<div>
  <input
    type="email"
    className="w-full px-3 py-2 text-sm border border-destructive rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive/30 transition-all"
  />
  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
    <AlertCircle className="w-3 h-3" /> Please enter a valid email address
  </p>
</div>`}
            />
            <ComponentCard
              title="Search Input"
              preview={<div className="w-full max-w-sm"><SearchInput /></div>}
              code={`<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <input
    type="search"
    placeholder="Search..."
    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
  />
</div>`}
            />
          </div>
        </section>

        {/* TOASTS */}
        <section>
          <SectionTitle title="Toast Notifications" description="Click any button below to trigger a live toast notification." />
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">Variants (click to trigger)</span>
            </div>
            <div className="px-5 py-6">
              <ToastDemos />
            </div>
            <div className="px-5 pb-5">
              <CodeBlock code={`import { toast } from "sonner";

// Trigger toasts from anywhere:
toast.success("Action completed successfully");
toast.error("Something went wrong, please try again");
toast.warning("Check your connection before proceeding");
toast.info("Update available. Refresh to apply.");`} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
