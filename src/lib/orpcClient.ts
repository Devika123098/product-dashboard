import { createORPCClient } from "@orpc/client";
import { ORPCLink } from "@orpc/client/fetch";
import type { AppRouter } from "@/server/orpc";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export const orpcClient = createORPCClient<AppRouter>(
  new ORPCLink({
    url: `${getBaseUrl()}/api/orpc`,
  })
);


