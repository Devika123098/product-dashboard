"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { orpcClient } from "@/lib/orpcClient";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
};

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const limit = 10; 

  const { data, isLoading, isError, isPlaceholderData } = useQuery<ProductsResponse>({
    queryKey: ["productsAll"],
    queryFn: () =>
      orpcClient.products.getProducts({ limit: 100, skip: 0 }), 
    placeholderData: keepPreviousData,
  });

  if (isLoading && !isPlaceholderData) return <div>Loading products…</div>;
  if (isError) return <div>Failed to load products</div>;

  const allProducts = data?.products ?? [];
  const total = allProducts.length;
  const totalPages = Math.ceil(total / limit);

  const pagedProducts = allProducts.slice(page * limit, (page + 1) * limit);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagedProducts.map((p) => (
          <div
            key={p.id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={p.thumbnail}
              alt={p.title}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-gray-600 mb-2">{p.description}</p>
            <p className="font-bold">${p.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
