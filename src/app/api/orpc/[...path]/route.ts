import { ORPCHandler } from "@orpc/server/fetch";
import { appRouter } from "@/server/orpc";

const handler = new ORPCHandler(appRouter);

async function handle(request: Request) {
  try {
    const result = await handler.handle(request, {
      prefix: "/api/orpc",
    });

    return result.response ?? new Response("Not Found", { status: 404 });
  } catch (err) {
    console.error("ORPC handler error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
