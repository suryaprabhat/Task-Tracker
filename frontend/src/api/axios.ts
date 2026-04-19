import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// ── Logout registration ──────────────────────────────────────────────────────
// AuthContext registers its logout fn here so the interceptor can call it
// (avoids circular imports and keeps React state in sync with the 401 redirect)
let _logout: (() => void) | null = null;

export function registerLogout(fn: () => void) {
  _logout = fn;
}

// ── Request interceptor: attach token ────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 via React auth state ───────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (_logout) {
        _logout(); // clears localStorage + React state → ProtectedRoute redirects
      } else {
        // Fallback if called before AuthContext mounts (rare)
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
