import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useAuth, demoCredentials } from "@/lib/auth-context";
import type { AppRole } from "@/lib/mock-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — FacilityOS Arabia" },
      { name: "description", content: "Sign in to your FacilityOS dashboard" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    const to = user.role === "admin" ? "/dashboard/admin" : user.role === "owner" ? "/dashboard/owner" : "/dashboard/labour";
    navigate({ to });
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        const role = JSON.parse(sessionStorage.getItem("facilityos_auth_user") || "{}").role as AppRole;
        const to = role === "admin" ? "/dashboard/admin" : role === "owner" ? "/dashboard/owner" : "/dashboard/labour";
        navigate({ to });
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    }, 600);
  }

  function quickLogin(role: AppRole) {
    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(creds.email, creds.password);
      if (result.success) {
        const to = role === "admin" ? "/dashboard/admin" : role === "owner" ? "/dashboard/owner" : "/dashboard/labour";
        navigate({ to });
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 relative overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, oklch(0.55 0.11 245 / 0.3) 0%, transparent 60%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur border border-white/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-white">FacilityOS Arabia</div>
            <div className="text-xs text-white/50 uppercase tracking-widest">Building Operations Platform</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 mt-auto mb-16">
          <h1 className="font-display text-4xl font-semibold text-white leading-tight">
            Your Building Operations,<br />
            <span className="text-gold">Fully Under Control</span>
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-md leading-relaxed">
            Assign daily tasks to labour, track completion in real-time, and receive verified reports — all from one dashboard.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "98%", label: "Task completion rate" },
              { value: "6+", label: "Buildings managed" },
              { value: "24/7", label: "Operations visibility" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="font-display text-2xl font-semibold text-white">{s.value}</div>
                <div className="mt-1 text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust badge */}
        <div className="relative z-10 flex items-center gap-2 text-white/50 text-sm">
          <ShieldCheck className="h-4 w-4 text-gold" />
          <span>Trusted by building owners across Saudi Arabia & Gulf</span>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div className="font-display text-base font-semibold text-foreground">FacilityOS Arabia</div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">Sign in to your dashboard</h2>
            <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access your role-based dashboard.</p>
          </div>

          {/* Quick demo buttons */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {(["admin", "owner", "labour"] as AppRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => quickLogin(role)}
                  disabled={loading}
                  className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-md active:scale-[0.98] ${
                    role === "admin"
                      ? "border-navy/20 bg-navy/5 hover:border-navy/40"
                      : role === "owner"
                      ? "border-accent/20 bg-accent/5 hover:border-accent/40"
                      : "border-emerald-500/20 bg-emerald-50 hover:border-emerald-500/40"
                  }`}
                >
                  <div className={`text-xs font-bold uppercase tracking-wider ${
                    role === "admin" ? "text-navy" : role === "owner" ? "text-accent" : "text-emerald-700"
                  }`}>{demoCredentials[role].label}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground leading-tight">{demoCredentials[role].description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-3">or sign in with credentials</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-10 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy text-white font-medium text-sm transition-all hover:bg-navy/90 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Admin note */}
          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-secondary/60 border border-border p-3.5">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Admin access is restricted</strong> to platform management only and is not a public role. Owner and Labour access is available through subscription.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
