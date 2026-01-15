"use client";

import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { orpcClient } from "@/lib/orpcClient";
import { useProductsFilterStore } from "@/store/productsFilterStore";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
};

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { search, category, minPrice, maxPrice, setSearch, setCategory, setMinPrice, setMaxPrice, resetFilters } =
    useProductsFilterStore();

  const { data, isLoading, isError, isPlaceholderData } = useQuery<ProductsResponse>({
    queryKey: ["productsAll"],
    queryFn: () =>
      orpcClient.products.getProducts({ limit: 100, skip: 0 }), 
    placeholderData: keepPreviousData,
  });

  if (isLoading && !isPlaceholderData) return <div>Loading products…</div>;
  if (isError) return <div>Failed to load products</div>;

  const allProducts = data?.products ?? [];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch = search
        ? p.title.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory = category ? p.category === category : true;
      const matchesMinPrice = minPrice !== null ? p.price >= minPrice : true;
      const matchesMaxPrice = maxPrice !== null ? p.price <= maxPrice : true;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [allProducts, search, category, minPrice, maxPrice]);

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const pagedProducts = filteredProducts.slice(page * limit, (page + 1) * limit);

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set);
  }, [allProducts]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); 
          }}
          className="border p-2 rounded flex-1"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice ?? ""}
          onChange={(e) => {
            setMinPrice(e.target.value ? Number(e.target.value) : null);
            setPage(0);
          }}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice ?? ""}
          onChange={(e) => {
            setMaxPrice(e.target.value ? Number(e.target.value) : null);
            setPage(0);
          }}
          className="border p-2 rounded"
        />

        <button
          onClick={() => resetFilters()}
          className="px-3 py-1 border rounded bg-gray-200"
        >
          Reset
        </button>
      </div>
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
