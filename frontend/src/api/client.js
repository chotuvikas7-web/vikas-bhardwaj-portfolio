import axios from "axios";

const normalizeUrl = (url) => url.replace(/\/+$/, "");
const renderBackendHost = "vikas-bhardwaj-portfolio.onrender.com";

const getRenderBackendUrl = () => {
  if (typeof window === "undefined") return "";

  const { protocol, hostname } = window.location;
  if (hostname === renderBackendHost) {
    return "";
  }

  if (hostname.endsWith("-ui.onrender.com")) {
    return `${protocol}//${hostname.replace("-ui.onrender.com", ".onrender.com")}/api`;
  }

  if (hostname.endsWith(".onrender.com")) {
    return `${protocol}//${renderBackendHost}/api`;
  }

  return "";
};

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || "";
  const renderBackendUrl = getRenderBackendUrl();

  if (renderBackendUrl && (!configuredUrl || configuredUrl === "/api")) {
    return renderBackendUrl;
  }

  return configuredUrl || "http://localhost:5000/api";
};

const apiBaseUrl = normalizeUrl(getApiBaseUrl());

export const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_token");
  config.headers = config.headers || {};
  config.headers["Cache-Control"] = "no-cache";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const imageUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";
  if (path.startsWith("http")) return path;
  const configuredUploadsUrl = import.meta.env.VITE_UPLOADS_URL;
  const base = configuredUploadsUrl ? normalizeUrl(configuredUploadsUrl) : apiBaseUrl.startsWith("http") ? new URL(apiBaseUrl).origin : "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
