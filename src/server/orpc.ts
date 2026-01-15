import { os } from "@orpc/server";
import { z } from "zod";
const login = os
  .route({
    method: "POST",
    path: "/auth/login",
  })
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  )
  .handler(async ({ input }) => {
    console.log("Login input:", input);
    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      console.log("DummyJSON status:", res.status);

      const text = await res.text();
      console.log("DummyJSON raw response:", text);

      if (!res.ok) {
        throw new Error(`DummyJSON error: ${text}`);
      }
      return JSON.parse(text);
    } catch (err) {
      console.error("Login handler error:", err);
      throw err;
    }
  });
  const getProducts = os
  .route({ method: "GET", path: "/products" })
  .input(
    z.object({
      limit: z.number().min(1).max(100).optional(),
      skip: z.number().min(0).optional(),
    })
  )
  .handler(async ({ input }) => {
    const { limit = 10, skip = 0 } = input;
    const res = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  });
export const appRouter = {
  auth: { login },
  products: { getProducts }, 
};
export type AppRouter = typeof appRouter;