"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductInput } from "@/lib/schemas/product.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Package, Tag, DollarSign, Image as ImageIcon, Briefcase, Hash, Loader2 } from "lucide-react";

interface ProductFormProps {
  initialData?: Partial<ProductInput>;
  onSubmit: (data: ProductInput) => void;
  isLoading: boolean;
  title: string;
}

export function ProductForm({ initialData, onSubmit, isLoading, title }: ProductFormProps) {
  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      thumbnail: initialData?.thumbnail || "",
    },
  });

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-background/60 backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-8">
        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription>Fill in the details below to manage your product catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Product Title
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="High-performance headphones"
                className="h-11 bg-muted/20 border-border/50 focus:border-primary/50 transition-all duration-200"
              />
              {form.formState.errors.title && (
                <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Full Description
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe the key features and benefits..."
                rows={4}
                className="bg-muted/20 border-border/50 focus:border-primary/50 transition-all duration-200 resize-none"
              />
              {form.formState.errors.description && (
                <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> List Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground text-sm font-medium">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...form.register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="pl-7 h-11 bg-muted/20 border-border/50 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              {form.formState.errors.price && (
                <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Collection
              </Label>
              <Input
                id="category"
                {...form.register("category")}
                placeholder="Electronics, Fashion..."
                className="h-11 bg-muted/20 border-border/50 focus:border-primary/50 transition-all duration-200"
              />
              {form.formState.errors.category && (
                <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="thumbnail" className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" /> Featured Image URL
              </Label>
              <Input
                id="thumbnail"
                {...form.register("thumbnail")}
                placeholder="https://images.unsplash.com/..."
                className="h-11 bg-muted/20 border-border/50 focus:border-primary/50 transition-all duration-200"
              />
              {form.formState.errors.thumbnail && (
                <p className="text-xs font-medium text-destructive mt-1">{form.formState.errors.thumbnail.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Finalizing Changes...
                </span>
              ) : (
                "Save Product Details"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
