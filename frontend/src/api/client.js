import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const imageUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";
  if (path.startsWith("http")) return path;
  const configuredUploadsUrl = import.meta.env.VITE_UPLOADS_URL;
  const base = configuredUploadsUrl ?? (apiBaseUrl.startsWith("http") ? new URL(apiBaseUrl).origin : "");
  return `${base}${path}`;
};
