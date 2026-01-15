"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpcClient } from "@/lib/orpcClient";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

type LoginInput = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();

  const mutation = useMutation({
    mutationFn: (data: LoginInput) => orpcClient.auth.login(data),
    onSuccess: (data: any) => {
      try {
        const token = data.token || data.accessToken;
        if (!token) throw new Error("Invalid session token");
        loginStore.login(data, token);
        router.push("/products");
      } catch (err: any) {
        alert(err.message || "Login failed");
      }
    },
    onError: (error: any) => {
      alert(error.message || "Invalid credentials");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Username"
                  {...register("username", { required: "Username is required" })}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

