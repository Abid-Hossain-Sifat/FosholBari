const TOKEN_KEY = "fosholbari_jwt";

export const jwtHelper = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },

  authHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async fetchToken(baseURL: string): Promise<string | null> {
    try {
      const res = await fetch(`${baseURL}/api/auth/token`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.token) {
        this.setToken(data.token);
        return data.token;
      }
      return null;
    } catch {
      return null;
    }
  },
};
