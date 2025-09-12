// lib/clientManager.js
const DEFAULT_BASE_PATH = '/api';
const DEFAULT_TIMEOUT_MS = 15000;

class ClientManager {
  constructor(basePath = DEFAULT_BASE_PATH, { defaultHeaders = {}, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    this.basePath = basePath.replace(/\/$/, ''); // sin slash al final
    this.defaultHeaders = defaultHeaders;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Construye una URL con query params.
   */
  buildUrl(path, params) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.basePath}${cleanPath}`, window.location.origin);
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
      });
    }
    return url.toString();
  }

  /**
   * Request genérico
   */
  async request(method, path, { params, data, headers, signal } = {}) {
    const url = this.buildUrl(path, params);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);
    const finalSignal = signal ?? controller.signal;

    const isJson = data !== undefined && data !== null;
    const reqHeaders = {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...this.defaultHeaders,
      ...headers,
    };

    // Logs útiles para debug en dev
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[clientManager][${method}]`, { url, params, data, headers: reqHeaders });
    }

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include', // <-- manda/recibe cookies HttpOnly
        headers: reqHeaders,
        body: isJson ? JSON.stringify(data) : undefined,
        signal: finalSignal,
      });

      const text = await res.text();
      let payload;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = text; // por si el endpoint devuelve texto plano
      }

      if (!res.ok) {
        console.log(payload, res.status);
        const err = new Error(payload?.error || payload?.message || `Request failed: ${res.status}`);
        err.status = res.status;
        err.data = payload;
        err.url = url;
        throw err;
      }

      return payload;
    } catch (error) {
      console.error(`[clientManager][${method}] Error:`, error);
      throw error;
    } finally {
      clearTimeout(id);
    }
  }

  get(path, options = {}) {
    return this.request('GET', path, options);
  }

  post(path, data = {}, options = {}) {
    return this.request('POST', path, { ...options, data });
  }

  put(path, data = {}, options = {}) {
    return this.request('PUT', path, { ...options, data });
  }

  delete(path, options = {}) {
    return this.request('DELETE', path, options);
  }
}

// Instancia lista para usar contra /api
const clientManager = new ClientManager(DEFAULT_BASE_PATH);

// Exporta la clase por si quieres crear variantes, p. ej. /api/admin
export { ClientManager };
export default clientManager;