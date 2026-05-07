import React from "react";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AnimatedScene from "../components/AnimatedScene";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const submit = async ({ email, password }) => {
    try {
      setError("");
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="container-pad flex min-h-[calc(100vh-9rem)] items-center justify-center py-14">
      <Helmet>
        <title>Admin Login | Alex Carter</title>
      </Helmet>
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/70 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <AnimatedScene />
        </div>
        <form onSubmit={handleSubmit(submit)} className="relative z-10 w-full space-y-4 p-6">
          <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Admin</p>
          <h1 className="mt-2 text-2xl font-bold">Project dashboard login</h1>
        </div>
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
        <label className="space-y-1 text-sm font-medium">
          <span>Email</span>
          <input className="input" type="email" {...register("email", { required: "Email is required" })} />
          {errors.email && <small className="text-red-600">{errors.email.message}</small>}
        </label>
        <label className="space-y-1 text-sm font-medium">
          <span>Password</span>
          <input className="input" type="password" {...register("password", { required: "Password is required" })} />
          {errors.password && <small className="text-red-600">{errors.password.message}</small>}
        </label>
        <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"} <LogIn className="h-4 w-4" />
        </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
