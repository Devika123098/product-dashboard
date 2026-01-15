import { ORPCHandler } from "@orpc/server/fetch";
import { appRouter } from "@/server/orpc";

async function handle(request: Request) {
  try {
    const handler = new ORPCHandler(appRouter);

    const result = await handler.handle(request, {
      prefix: "/api/orpc",
    });

    return result.response ?? new Response("Not Found", { status: 404 });
  } catch (err: any) {
    const message = err?.message || "Internal Server Error";
    return new Response(message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
