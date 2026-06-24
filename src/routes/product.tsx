import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard, BarChart3, ClipboardCheck, Building2, Users, FileBarChart2, Smartphone, CheckSquare } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product")({
  head: () => ({ meta: [{ title: "Product — FacilityOS Arabia" }] }),
  component: Product,
});

function Product() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-gradient py-24 sm:py-32">
        <div className="absolute inset-0 bg-mesh opacity-40 mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-6">Platform Overview</p>
          <h1 className="mx-auto max-w-4xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-6xl drop-shadow-lg">
            One Simple Platform.<br />Three Powerful Dashboards.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-white/80">
            A complete ecosystem designed to connect the platform admin, the building owner, and the labour team with zero friction.
          </p>
        </div>
      </section>

      {/* DASHBOARDS DETAIL */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-32">

          {/* Admin Dashboard */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white mb-6">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-display font-semibold tracking-tight sm:text-4xl">Admin Dashboard</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Manage the entire platform from one place. View all owners, buildings, labour accounts, subscriptions, revenue, checklist templates, and daily reports.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Owner management", "Building management", "Labour management",
                  "Checklist templates", "Daily report monitoring", "Earnings overview"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckSquare className="h-4 w-4" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl bg-surface-2/50 p-8 border border-border">
              <div className="grid gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-navy/5 p-4 text-center">
                    <Building2 className="mx-auto h-6 w-6 text-navy mb-2" />
                    <div className="text-2xl font-bold text-navy">24</div>
                    <div className="text-xs text-muted-foreground mt-1">Buildings</div>
                  </div>
                  <div className="rounded-xl bg-navy/5 p-4 text-center">
                    <Users className="mx-auto h-6 w-6 text-navy mb-2" />
                    <div className="text-2xl font-bold text-navy">18</div>
                    <div className="text-xs text-muted-foreground mt-1">Owners</div>
                  </div>
                  <div className="rounded-xl bg-navy/5 p-4 text-center">
                    <FileBarChart2 className="mx-auto h-6 w-6 text-navy mb-2" />
                    <div className="text-2xl font-bold text-navy">142</div>
                    <div className="text-xs text-muted-foreground mt-1">Reports Today</div>
                  </div>
                </div>
                <div className="rounded-xl bg-accent/5 p-4 border border-accent/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold">Platform Activity</h4>
                    <span className="text-xs text-accent font-medium">+12% this week</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active subscriptions</span>
                      <span className="font-medium">22</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly revenue</span>
                      <span className="font-medium">SAR 8,450</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending reports</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Dashboard */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="rounded-2xl bg-surface-2/50 p-8 border border-border">
              <div className="grid gap-6">
                <div className="rounded-xl bg-navy/5 p-6 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-navy mb-3" />
                  <h4 className="font-semibold mb-2">Al Olaya Tower</h4>
                  <p className="text-sm text-muted-foreground mb-4">Riyadh, Saudi Arabia</p>
                  <div className="flex justify-center gap-4 text-sm">
                    <div>
                      <span className="block font-bold text-navy">12</span>
                      <span className="text-xs text-muted-foreground">Labour</span>
                    </div>
                    <div>
                      <span className="block font-bold text-accent">8</span>
                      <span className="text-xs text-muted-foreground">Reports Today</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-accent/5 p-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckSquare className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-sm font-medium">Task Complete</div>
                  </div>
                  <div className="rounded-lg bg-navy/5 p-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-navy/20 flex items-center justify-center">
                      <FileBarChart2 className="h-4 w-4 text-navy" />
                    </div>
                    <div className="text-sm font-medium">Report Ready</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-display font-semibold tracking-tight sm:text-4xl">Owner Dashboard</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Building owners get a private dashboard to manage their own buildings, assign labour, create daily checklists, and view submitted reports.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "My buildings", "Labour accounts", "Assign tasks",
                  "Today's reports", "Report history", "Subscription overview"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckSquare className="h-4 w-4" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Labour Dashboard */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white mb-6">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-display font-semibold tracking-tight sm:text-4xl">Labour Dashboard</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Labour users get a very simple visual dashboard with large task cards, icons, check buttons, and one submit button. No complex menus or technical knowledge required.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Big visual checklist", "Simple mark-done buttons", "Daily task progress",
                  "Mobile-first layout", "Submit work report", "Easy for non-technical workers"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckSquare className="h-4 w-4" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl bg-surface-2/50 p-8 border border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold">Today's Tasks</h4>
                  <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">4 of 6 done</span>
                </div>
                {[
                  { task: "Clean lobby floor", done: true },
                  { task: "Empty trash bins", done: true },
                  { task: "Mop restrooms", done: true },
                  { task: "Clean windows", done: true },
                  { task: "Restock supplies", done: false },
                  { task: "Sweep parking area", done: false },
                ].map((item) => (
                  <div key={item.task} className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.done ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}`}>
                      {item.done ? <CheckSquare className="h-5 w-5" /> : <div className="h-5 w-5 rounded border-2 border-current" />}
                    </div>
                    <span className={`text-sm ${item.done ? 'font-medium' : 'text-muted-foreground'}`}>
                      {item.task}
                    </span>
                  </div>
                ))}
                <Button className="w-full mt-4" size="lg">
                  Submit Work Report
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BUILT FOR DAILY PROOF */}
      <section className="bg-secondary/50 border-y border-border py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Built for daily proof of work</h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Building owners no longer need to call repeatedly or guess if work was completed. The platform is designed for one simple loop: Labour submits the daily checklist, and the owner instantly receives a verifiable daily report.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="h-14 px-8 text-base">
              <Link to="/pricing">
                Get Owner Dashboard Access <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}