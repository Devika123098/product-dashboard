"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpcClient } from "@/lib/orpcClient";
import { useAuthStore } from "@/store/authStore";

type LoginInput = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore();

  const { register, handleSubmit } = useForm<LoginInput>();

  const mutation = useMutation({
  mutationFn: (data: LoginInput) =>
    orpcClient.auth.login(data),

  onSuccess: (data: any) => {
    console.log("LOGIN SUCCESS:", data);
    loginStore.login(data, data.accessToken);
    router.push("/");
  },

  onError: (error: any) => {
    console.error("LOGIN ERROR:", error);
    alert("Login failed — check console");
  },
});

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="min-h-screen flex flex-col items-center justify-center gap-4"
    >
      <input placeholder="username" {...register("username")} />
      <input type="password" placeholder="password" {...register("password")} />
      <button type="submit">
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
