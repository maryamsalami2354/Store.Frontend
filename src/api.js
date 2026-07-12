const API_BASE_KEY = "store_api_base";
const TOKEN_KEY = "store_auth_token";
const GUEST_TOKEN_KEY = "store_guest_token";

export function getApiBase() {
  return localStorage.getItem(API_BASE_KEY) || import.meta.env.VITE_API_BASE || "http://localhost:5155";
}

export function setApiBase(value) {
  localStorage.setItem(API_BASE_KEY, value.replace(/\/$/, ""));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getGuestToken() {
  let token = localStorage.getItem(GUEST_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  }
  return token;
}

export function buildUrl(path) {
  const base = getApiBase();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const { skipAuth, ...fetchOptions } = options;
  const token = getToken();
  const headers = new Headers(fetchOptions.headers || {});

  if (token && !skipAuth) headers.set("Authorization", `Bearer ${token}`);
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers,
    body: fetchOptions.body && !(fetchOptions.body instanceof FormData)
      ? JSON.stringify(fetchOptions.body)
      : fetchOptions.body
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.title ||
      payload?.errors?.join?.("، ") ||
      (typeof payload === "string" ? payload : "درخواست ناموفق بود");
    throw new Error(message);
  }

  return payload;
}

export function extractList(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

export function normalizeProduct(product) {
  return {
    id: product.productId ?? product.id,
    name: product.productName ?? product.name,
    price: product.productPrice ?? product.price ?? 0,
    categoryId: product.categoryId ?? product.productCategoryId,
    categoryName: product.categoryName ?? product.productCategoryTitle ?? "بدون دسته",
    imageUrl: product.imageUrl
  };
}

export function formatMoney(value) {
  return new Intl.NumberFormat("fa-IR").format(Number(value || 0));
}
