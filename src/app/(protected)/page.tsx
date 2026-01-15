"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/lib/orpcClient";
import { useProductsFilterStore } from "@/store/productsFilterStore";
import { useCartStore } from "@/store/cartStore";
import CartSidebar from "@/components/CartSidebar";
import { motion, AnimatePresence } from "framer-motion";
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
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" },
};
export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [flyingProduct, setFlyingProduct] = useState<Product | null>(null);
  const limit = 10;
  const filterStore = useProductsFilterStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { data, isLoading, isError, isPlaceholderData } = useQuery<ProductsResponse, Error>({
    queryKey: ["productsAll"],
    queryFn: () => orpcClient.products.getProducts({ limit: 100, skip: 0 }),
    placeholderData: (prev) => prev ?? { products: [], total: 0 },
  });
  const allProducts = data?.products ?? [];
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch = filterStore.search
        ? p.title.toLowerCase().includes(filterStore.search.toLowerCase())
        : true;
      const matchesCategory = filterStore.category ? p.category === filterStore.category : true;
      const matchesMinPrice = filterStore.minPrice !== null ? p.price >= filterStore.minPrice : true;
      const matchesMaxPrice = filterStore.maxPrice !== null ? p.price <= filterStore.maxPrice : true;
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [allProducts, filterStore.search, filterStore.category, filterStore.minPrice, filterStore.maxPrice]);
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const pagedProducts = filteredProducts.slice(page * limit, (page + 1) * limit);
  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set);
  }, [allProducts]);
  if (isLoading && !isPlaceholderData) return <div>Loading products…</div>;
  if (isError) return <div>Failed to load products</div>;
  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={filterStore.search}
          onChange={(e) => {
            filterStore.setSearch(e.target.value);
            setPage(0);
          }}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filterStore.category}
          onChange={(e) => {
            filterStore.setCategory(e.target.value);
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
          value={filterStore.minPrice ?? ""}
          onChange={(e) => {
            filterStore.setMinPrice(e.target.value ? Number(e.target.value) : null);
            setPage(0);
          }}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filterStore.maxPrice ?? ""}
          onChange={(e) => {
            filterStore.setMaxPrice(e.target.value ? Number(e.target.value) : null);
            setPage(0);
          }}
          className="border p-2 rounded"
        />
        <button
          onClick={() => filterStore.resetFilters()}
          className="px-3 py-1 border rounded bg-gray-200"
        >
          Reset
        </button>
      </div>
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedProducts.map((p) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              exit={{ opacity: 0, y: 20 }}
              className="border rounded p-4 shadow transition relative"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-gray-600 mb-2">{p.description}</p>
              <p className="font-bold mb-2">${p.price}</p>
              <button
                onClick={() => {
                  setFlyingProduct(p);
                  addToCart({
                    productId: p.id,
                    title: p.title,
                    price: p.price,
                    thumbnail: p.thumbnail,
                  });
                  setTimeout(() => setFlyingProduct(null), 800);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
              {flyingProduct?.id === p.id && (
                <motion.img
                  src={p.thumbnail}
                  className="w-16 h-16 rounded-full absolute top-0 left-0 z-50 pointer-events-none"
                  initial={{ top: 0, left: 0, opacity: 1, scale: 1 }}
                  animate={{ top: -400, left: 400, opacity: 0, scale: 0.2 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
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
      <CartSidebar />
    </div>
  );
}
