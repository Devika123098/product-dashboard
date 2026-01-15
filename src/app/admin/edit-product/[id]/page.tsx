"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpcClient } from "@/lib/orpcClient";
import { ProductForm } from "@/components/ProductForm";
import { ProductInput } from "@/lib/schemas/product.schema";
import { motion } from "framer-motion";

export default function EditProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await fetch(`https://dummyjson.com/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProductInput) => 
      orpcClient.products.editProduct({ id: productId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      router.push("/products");
    },
    onError: (error: any) => {
      console.error("EDIT PRODUCT ERROR:", error);
      alert(error.message || "Failed to update product");
    },
  });

  if (isLoadingProduct) return <div className="p-6">Loading product details...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6"
    >
      <ProductForm 
        title={`Edit Product: ${product?.title}`}
        initialData={product}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </motion.div>
  );
}
