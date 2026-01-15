"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Plus, ShoppingCart, Search, X, User } from "lucide-react";
import Link from "next/link";

import { orpcClient } from "@/lib/orpcClient";
import { useProductsFilterStore } from "@/store/productsFilterStore";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const limit = 9;
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const {
    search,
    category,
    minPrice,
    maxPrice,
    setSearch,
    setCategory,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useProductsFilterStore();

  const addToCart = useCartStore((s) => s.addToCart);

  const {
    data,
    isLoading,
    isError,
    isPlaceholderData,
  } = useQuery<ProductsResponse>({
    queryKey: ["products"],
    queryFn: () => orpcClient.products.getProducts({ limit: 100, skip: 0 }),
    placeholderData: (prev) => prev ?? { products: [], total: 0 },
  });


  const allProducts = data?.products ?? [];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (category && p.category !== category) return false;

      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;

      return true;
    });
  }, [allProducts, search, category, minPrice, maxPrice]);

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const pagedProducts = filteredProducts.slice(
    page * limit,
    (page + 1) * limit
  );

  const categories = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.category)));
  }, [allProducts]);

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-semibold text-destructive">Failed to load products</h2>
        <Button variant="outline" className="mt-4" onClick={() => queryClient.refetchQueries({ queryKey: ["products"] })}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Products</h1>
          <p className="text-muted-foreground">Browse and manage our exclusive collection</p>
        </div>
      </div>

      <Card className="mb-8 border-none bg-muted/30 shadow-none">
        <CardContent className="p-4 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          <div className="w-[180px] space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-end">
            <div className="w-24 space-y-1.5">
              <label className="text-xs font-medium uppercase text-muted-foreground">Price</label>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice ?? ""}
                onChange={(e) => {
                  setMinPrice(e.target.value ? Number(e.target.value) : null);
                  setPage(0);
                }}
                className="bg-background"
              />
            </div>
            <div className="w-24 space-y-1.5">
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice ?? ""}
                onChange={(e) => {
                  setMaxPrice(e.target.value ? Number(e.target.value) : null);
                  setPage(0);
                }}
                className="bg-background"
              />
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              resetFilters();
              setPage(0);
            }}
            className="text-muted-foreground h-10"
          >
            <X className="h-4 w-4 mr-1" /> Reset
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {pagedProducts.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full flex flex-col group overflow-hidden border-primary/5 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                   <div className="absolute top-2 right-2 flex flex-col gap-2 transition-opacity">
                    {isAdmin && (
                      <Link href={`/admin/edit-product/${p.id}`}>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                  <Badge className="absolute bottom-2 left-2 bg-background/80 text-foreground backdrop-blur-sm border-none">
                    {p.category}
                  </Badge>
                </div>

                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg line-clamp-1">{p.title}</CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-2 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  <p className="text-xl font-bold mt-2 text-primary">${p.price.toFixed(2)}</p>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() =>
                      addToCart({
                        productId: p.id,
                        title: p.title,
                        price: p.price,
                        thumbnail: p.thumbnail,
                      })
                    }
                    className="w-full gap-2 shadow-sm"
                    variant="outline"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No products found matching your filters.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex gap-4 justify-center mt-12 items-center">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => {
              setPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Prev
          </Button>

          <div className="text-sm font-medium">
            Page {page + 1} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => {
              setPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next
          </Button>
        </div>
      )}
      <CartSidebar />
    </div>
  );
}

