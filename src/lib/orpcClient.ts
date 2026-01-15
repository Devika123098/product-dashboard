import { createORPCClient } from "@orpc/client";
import { ORPCLink } from "@orpc/client/fetch";
import type { AppRouter } from "@/server/orpc";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "https://product-dashboard-seven-mu.vercel.app/";
}

export const orpcClient = createORPCClient<AppRouter>(
  new ORPCLink({
    url: `${getBaseUrl()}/api/orpc`,
  })
);


