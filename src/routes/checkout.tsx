import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, CheckCircle2, ArrowRight, CreditCard, Receipt, Building, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";

const checkoutSearchSchema = z.object({
  plan: z.string().optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: (search) => checkoutSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Checkout — FacilityOS Arabia" }] }),
  component: Checkout,
});

const planDetails: Record<string, { name: string; price: number; features: string[] }> = {
  starter: {
    name: "Starter",
    price: 299,
    features: ["1 building", "Owner dashboard access", "Labour checklist dashboard", "Daily reports"],
  },
  professional: {
    name: "Professional",
    price: 899,
    features: ["Up to 5 buildings", "Multiple labour accounts", "Checklist templates", "Today's reports"],
  },
  enterprise: {
    name: "Enterprise",
    price: 1999,
    features: ["Multiple buildings", "Custom setup", "Advanced report history", "Priority onboarding"],
  },
};

function Checkout() {
  const search = Route.useSearch();
  const planKey = search.plan || "starter";
  const plan = planDetails[planKey] || planDetails.starter;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/dashboard/owner" });
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col md:flex-row">
      {/* LEFT SIDE - SUMMARY */}
      <div className="bg-navy text-primary-foreground p-8 md:p-12 lg:p-16 flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 backdrop-blur border border-white/15">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="font-display font-semibold tracking-tight text-lg">FacilityOS</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gold">Order Summary</h2>
            <div className="flex items-baseline gap-2 pb-6 border-b border-white/10">
              <span className="font-display text-5xl font-bold">{plan.price}</span>
              <span className="text-white/60">SAR / month</span>
            </div>

            <div className="pt-2">
              <h3 className="font-display text-xl font-semibold">{plan.name} Plan</h3>
              <ul className="mt-6 space-y-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/50">
          <p>You can cancel your subscription at any time. By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-foreground">Complete your registration</h1>
            <p className="mt-2 text-muted-foreground">Fill in your details to get owner dashboard access.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Account Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input required type="text" className="w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Email</label>
                  <input required type="email" className="w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input required type="tel" className="w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition" placeholder="+966 50 000 0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input required type="text" className="w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition" placeholder="Riyadh" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Company Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input required type="text" className="w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition" placeholder="Acme Properties" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Buildings</label>
                  <select required className="w-full h-11 rounded-xl border px-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none transition bg-white">
                    <option value="">Select...</option>
                    <option value="1">1 Building</option>
                    <option value="2-5">2-5 Buildings</option>
                    <option value="6-10">6-10 Buildings</option>
                    <option value="11+">11+ Buildings</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Payment Method</h2>
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-sm mb-4 flex items-start gap-3">
                <span className="bg-blue-100 p-1 rounded-md shrink-0"><CheckCircle2 className="h-4 w-4" /></span>
                <p>Payment integration coming soon. This is a frontend demo checkout. You will not be charged.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-accent bg-accent/5 cursor-pointer">
                  <CreditCard className="h-6 w-6 text-accent" />
                  <span className="text-sm font-medium text-accent">Credit Card</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border hover:bg-secondary cursor-pointer transition">
                  <Building className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Bank Transfer</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border hover:bg-secondary cursor-pointer transition">
                  <Receipt className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Invoice</span>
                </div>
              </div>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Access created successfully. Redirecting to Dashboard...</span>
              </div>
            ) : (
              <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  <>Continue to Owner Dashboard Demo <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            )}

            <div className="text-center">
              <span className="text-sm text-muted-foreground">Already have access? </span>
              <Link to="/login" className="text-sm font-semibold text-accent hover:underline">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
