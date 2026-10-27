import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import handler from "./server/snap.mjs";

function snapAPI(): Plugin {
  const install = (server: {
    middlewares: {
      use: (
        handler: (
          req: import("node:http").IncomingMessage,
          res: import("node:http").ServerResponse,
          next: () => void,
        ) => void,
      ) => void;
    };
  }) => {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split("?")[0] === "/api/snap") void handler(req, res);
      else next();
    });
  };
  return {
    name: "biosig-snap-api",
    configureServer: install,
    configurePreviewServer: install,
  };
}
export default defineConfig({ plugins: [react(), snapAPI()] });
