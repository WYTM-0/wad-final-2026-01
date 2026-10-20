// Centralized React -> Next.js API client. Cookie auth + bearer fallback for
// independent domains (such as two separate Vercel projects).
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
const KEY = "course_exam_token";
export const getToken = () => sessionStorage.getItem(KEY);
export const setToken = (token) => token ? sessionStorage.setItem(KEY, token) : sessionStorage.removeItem(KEY);

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}
