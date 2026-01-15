import { create } from "zustand";

interface ProductsFilterState {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  resetFilters: () => void;
}

export const useProductsFilterStore = create<ProductsFilterState>((set) => ({
  search: "",
  category: "",
  minPrice: null,
  maxPrice: null,
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  resetFilters: () =>
    set({ search: "", category: "", minPrice: null, maxPrice: null }),
}));
