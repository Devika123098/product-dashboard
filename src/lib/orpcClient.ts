import { createORPCClient } from "@orpc/client";
import { ORPCLink } from "@orpc/client/fetch";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export const orpcClient = createORPCClient(
  new ORPCLink({
    url: `${getBaseUrl()}/api/orpc`,
  })
) as any;

