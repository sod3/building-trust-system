import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import { pathToFileURL } from "node:url";

function vercelApiDevMiddleware() {
  const apiRoutes: Record<string, string> = {
    "/api/auth/register-owner": "api/auth/register-owner.js",
    "/api/auth/login": "api/auth/login.js",
    "/api/checkout/create-order": "api/checkout/create-order.js",
    "/api/verify-payment": "api/verify-payment.js",
    "/api/moyasar-webhook": "api/moyasar-webhook.js",
    "/api/me": "api/me.js",
    "/api/admin/owners": "api/admin/owners.js",
    "/api/admin/payments": "api/admin/payments.js",
    "/api/admin/subscriptions": "api/admin/subscriptions.js",
    "/api/admin/earnings": "api/admin/earnings.js",
    "/api/owner/subscription": "api/owner/subscription.js",
  };

  return {
    name: "facilityos-vercel-api-dev",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        const pathname = new URL(req.url || "/", "http://localhost").pathname;
        const routeFile = apiRoutes[pathname];
        if (!routeFile) return next();

        try {
          res.status = (statusCode: number) => {
            res.statusCode = statusCode;
            return res;
          };

          const routePath = path.resolve(process.cwd(), routeFile);
          const routeUrl = `${pathToFileURL(routePath).href}?t=${Date.now()}`;
          const mod = await import(routeUrl);
          await mod.default(req, res);
        } catch (error) {
          console.error(`[api-dev] ${pathname}`, error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
          }
          res.end(JSON.stringify({ success: false, message: "Local API route failed." }));
        }
      });
    },
  };
}

export default defineConfig({
  nitro: true,
  plugins: [vercelApiDevMiddleware()],

  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});
