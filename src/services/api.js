export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Keep one refresh request running if multiple API requests fail together.
let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    if (!data.accessToken) {
      throw new Error("No access token returned");
    }

    localStorage.setItem("accessToken", data.accessToken);

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function apiFetch(endpoint, options = {}) {
  const makeRequest = (token) => {
    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  let token = localStorage.getItem("accessToken");
  let response = await makeRequest(token);

  if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
    try {
      token = await refreshAccessToken();
      response = await makeRequest(token);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.dispatchEvent(new Event("auth:expired"));

      throw error;
    }
  }

  return response;
}
