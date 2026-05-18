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
export const fallbackProjectImage = "/project-images/portfolio-cms.png";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
      localStorage.removeItem("portfolio_token");
      localStorage.removeItem("portfolio_user");
      window.location.assign("/admin/login");
    }

    return Promise.reject(error);
  }
);

export const imageUrl = (path) => {
  if (!path) return fallbackProjectImage;
  if (path.startsWith("data:")) return path;
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/uploads/")) return path.startsWith("/") ? path : `/${path}`;

  const configuredUploadsUrl = import.meta.env.VITE_UPLOADS_URL;
  const base = configuredUploadsUrl ? normalizeUrl(configuredUploadsUrl) : apiBaseUrl.startsWith("http") ? new URL(apiBaseUrl).origin : "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const getApiErrorMessage = (error, fallback = "Request failed") => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((item) => item.message).join(", ");
  }

  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.status) return `${fallback} (HTTP ${error.response.status})`;
  if (error.request) return `${fallback}. Could not reach API at ${apiBaseUrl}.`;
  return error.message || fallback;
};
