import { ORPCHandler } from "@orpc/server/fetch";
import { appRouter } from "@/server/orpc";

export const dynamic = "force-dynamic";

async function handle(request: Request) {
  try {
    const headers: Record<string, string> = {};
    request.headers.forEach((v, k) => (headers[k] = v));

    console.log("ORPC Route handling:", request.method, request.url, "Headers:", JSON.stringify(headers));

    const handler = new ORPCHandler(appRouter);

    const result = await handler.handle(request, {
      prefix: "/api/orpc",
    });

    if (!result.response) {
      return new Response("oRPC handler returned no response", { status: 404 });
    }

    return result.response;
  } catch (err: any) {
    console.error("CRITICAL VERCEL ERROR:", err.message, err.stack);

    return new Response(`Server error detected: ${err.message}\n${err.stack}`, {
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
