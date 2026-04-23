import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(
  /\/$/,
  ""
);

const ASSET_BASE_URL = (
  import.meta.env.VITE_ASSET_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080"
).replace(/\/$/, "");

export function toAbsoluteAssetUrl(url) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${ASSET_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  try {
    const rawAuth = window.localStorage.getItem("ha_giang_auth");
    if (!rawAuth) {
      return config;
    }

    const auth = JSON.parse(rawAuth);
    if (auth?.user?.id) {
      config.headers["X-User-Id"] = String(auth.user.id);
    }
  } catch {
    return config;
  }

  return config;
});

export default api;
