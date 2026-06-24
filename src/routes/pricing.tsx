import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — FacilityOS Arabia" }] }),
  component: Pricing,
});

function Pricing() {
  const plans = [
    { 
      name: "Starter", 
      price: 299, 
      scope: "Best for single building owners.", 
      features: ["1 building", "Owner dashboard access", "Labour checklist dashboard", "Daily reports", "Basic report history", "Email support"], 
      query: "starter" 
    },
    { 
      name: "Professional", 
      price: 899, 
      scope: "Best for growing building portfolios.", 
      features: ["Up to 5 buildings", "Multiple labour accounts", "Checklist templates", "Today's reports", "Report history", "Priority support"], 
      popular: true, 
      query: "professional" 
    },
    { 
      name: "Enterprise", 
      price: 1999, 
      scope: "Best for large property groups.", 
      features: ["Multiple buildings", "Custom setup", "Multiple owner/supervisor users later", "Advanced report history", "Priority onboarding", "Dedicated support"], 
      query: "enterprise" 
    },
  ];

  const faqs = [
    { q: "Is payment active now?", a: "Payment integration is coming soon. This is currently a frontend demo." },
    { q: "Can one owner manage multiple buildings?", a: "Yes, an owner account can be assigned multiple buildings depending on the plan." },
    { q: "Can labour use this on mobile?", a: "Yes, the labour dashboard is designed mobile-first with large visual checklist cards." },
    { q: "Does this include tenant complaints?", a: "Not in the MVP. The first version focuses on daily labour checklist verification." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="bg-navy-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 text-primary-foreground">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple Pricing for Building Owners
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Choose the plan that fits your property portfolio. No hidden fees.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="-mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-3xl border p-8 ${p.popular ? "border-accent bg-background shadow-2xl scale-105 z-10" : "border-border bg-background shadow-lg mt-8 sm:mt-0"}`}>
              {p.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-white">Most Popular</span>}
              <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground min-h-[40px]">{p.scope}</p>
              <div className="mt-6 flex items-baseline gap-1 border-b border-border pb-6">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className="text-sm font-medium text-muted-foreground">SAR/mo</span>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    <span className="leading-tight">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className={`mt-8 w-full h-12 text-base ${p.popular ? "bg-accent text-white hover:bg-accent/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                <Link to="/checkout" search={{ plan: p.query }}>
                  Get Owner Access
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/30 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-border bg-background p-6 [&_summary::-webkit-details-marker]:hidden shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-lg">
                  {faq.q}
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
