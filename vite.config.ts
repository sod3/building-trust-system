import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type ApiRoute = {
  pattern: RegExp;
  routeFile: string;
  dynamicSegments: number;
  segmentCount: number;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function discoverApiRoutes() {
  const apiRoot = path.resolve(process.cwd(), "api");
  const routes: ApiRoute[] = [];

  function walk(directory: string) {
    if (!fs.existsSync(directory)) return;

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

      const routeFile = path.relative(process.cwd(), absolutePath).replace(/\\/g, "/");
      const relativeRoute = path
        .relative(apiRoot, absolutePath)
        .replace(/\\/g, "/")
        .replace(/\.js$/, "");
      const segments = relativeRoute.split("/").filter(Boolean);
      const dynamicSegments = segments.filter((segment) => /^\[[^\]]+\]$/.test(segment)).length;
      const patternSegments = segments.map((segment) =>
        /^\[[^\]]+\]$/.test(segment) ? "[^/]+" : escapeRegex(segment),
      );

      routes.push({
        pattern: new RegExp(`^/api/${patternSegments.join("/")}/?$`),
        routeFile,
        dynamicSegments,
        segmentCount: segments.length,
      });
    }
  }

  walk(apiRoot);

  return routes.sort((a, b) => {
    if (a.dynamicSegments !== b.dynamicSegments) return a.dynamicSegments - b.dynamicSegments;
    return b.segmentCount - a.segmentCount;
  });
}

function vercelApiDevMiddleware() {
  return {
    name: "facilityos-vercel-api-dev",
    configureServer(server: any) {
      let apiRoutes = discoverApiRoutes();

      server.watcher.on("all", (_event: string, filePath: string) => {
        if (filePath.includes(`${path.sep}api${path.sep}`)) {
          apiRoutes = discoverApiRoutes();
        }
      });

      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        const pathname = new URL(req.url || "/", "http://localhost").pathname;
        const routeFile = apiRoutes.find((route) => route.pattern.test(pathname))?.routeFile;
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
