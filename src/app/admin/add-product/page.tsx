"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpcClient } from "@/lib/orpcClient";
import { ProductForm } from "@/components/ProductForm";
import { ProductInput } from "@/lib/schemas/product.schema";
import { motion } from "framer-motion";

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ProductInput) => orpcClient.products.addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
    onError: (error: any) => {
      console.error("ADD PRODUCT ERROR:", error);
      alert(error.message || "Failed to add product");
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6"
    >
      <ProductForm 
        title="Add New Product"
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </motion.div>
  );
}

