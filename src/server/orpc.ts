import { os } from "@orpc/server";
import { z } from "zod";
import { productSchema } from "@/lib/schemas/product.schema";

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
    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      let data: any;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error(`Auth server returned an invalid response (Status ${res.status})`);
      }
      
      if (!res.ok) {
        throw new Error(data.message || `Login failed (${res.status})`);
      }

      const lowerUsername = data.username?.toLowerCase();
      if (lowerUsername === "emilys" || lowerUsername === "kminchelle") {
        data.role = "admin";
      }

      return data;
    } catch (err) {
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

const addProduct = os
  .route({ method: "POST", path: "/products/add" })
  .input(productSchema)
  .handler(async ({ input }) => {
    try {
      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add product");
      }
      return res.json();
    } catch (err) {
      console.error("Add Product Error:", err);
      throw err;
    }
  });

const editProduct = os
  .route({
    method: "PUT",
    path: "/products/{id}"
  })
  .input(z.object({
    id: z.number(),
    data: productSchema.partial()
  }))
  .handler(async ({ input }) => {
    try {
      const res = await fetch(`https://dummyjson.com/products/${input.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input.data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      return res.json();
    } catch (err) {
      console.error("Edit Product Error:", err);
      throw err;
    }
  });

const deleteProduct = os
  .route({
    method: "DELETE",
    path: "/products/{id}"
  })
  .input(z.object({
    id: z.number()
  }))
  .handler(async ({ input }) => {
    try {
      const res = await fetch(`https://dummyjson.com/products/${input.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      return res.json();
    } catch (err) {
      console.error("Delete Product Error:", err);
      throw err;
    }
  });

export const appRouter = {
  auth: { login },
  products: { getProducts, addProduct, editProduct },
};

export type AppRouter = typeof appRouter;
