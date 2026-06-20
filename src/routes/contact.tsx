import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/i18n";
import { CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Demo — FacilityOS Arabia" },
      { name: "description", content: "Request a demo of FacilityOS Arabia. We respond within one business day." },
      { property: "og:title", content: "Book a Demo — FacilityOS Arabia" },
      { property: "og:description", content: "Tell us about your portfolio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, lang } = useLang();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-navy bg-mesh py-20 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("contact.title")}</h1>
          <p className="mt-4 text-white/75">{t("contact.sub")}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          {sent ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-8">
              <CheckCircle2 className="h-10 w-10 text-accent" />
              <h2 className="font-display text-2xl font-semibold">{t("contact.sent")}</h2>
            </div>
          ) : (
            <form
              className="grid gap-5 rounded-2xl border border-border bg-background p-6 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label={t("contact.name")} required />
                <Field id="email" label={t("contact.email")} type="email" required />
                <Field id="company" label={t("contact.company")} required />
                <Field id="buildings" label={t("contact.buildings")} type="number" min={1} />
              </div>
              <div>
                <Label htmlFor="msg">{t("contact.message")}</Label>
                <Textarea id="msg" rows={5} className="mt-1.5" maxLength={1000} />
              </div>
              <Button type="submit" size="lg" className="bg-navy text-primary-foreground hover:bg-navy/90 sm:w-fit">
                {t("contact.submit")}
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-4 text-sm">
          <div className="rounded-2xl border border-border bg-secondary/40 p-6">
            <h3 className="font-display text-base font-semibold">{lang === "ar" ? "تواصل مباشر" : "Direct contact"}</h3>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> hello@facilityos.sa</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +966 11 000 0000</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Riyadh, Saudi Arabia</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6">
            <h3 className="font-display text-base font-semibold">{lang === "ar" ? "هل تبحث عن دعم؟" : "Need support?"}</h3>
            <p className="mt-2 text-muted-foreground">{lang === "ar" ? "العملاء الحاليون: support@facilityos.sa" : "Existing customers: support@facilityos.sa"}</p>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}

function Field({ id, label, type = "text", required, min }: { id: string; label: string; type?: string; required?: boolean; min?: number }) {
  return (
    <div>
      <Label htmlFor={id}>{label}{required && <span className="ms-1 text-destructive">*</span>}</Label>
      <Input id={id} type={type} required={required} min={min} maxLength={200} className="mt-1.5" />
    </div>
  );
}
