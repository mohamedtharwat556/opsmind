/**
 * Caching Utilities للـ Frontend
 * - LocalStorage Cache
 * - In-Memory Cache
 * - Session Storage
 */

// ✅ LocalStorage Cache Manager
class LocalStorageCache {
  constructor(prefix = 'ops_') {
    this.prefix = prefix;
  }

  set(key, value, expiryMinutes = null) {
    const data = {
      value,
      timestamp: Date.now(),
      expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : null
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('LocalStorage set error:', e);
      return false;
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Check if expired
      if (parsed.expiry && parsed.expiry < Date.now()) {
        this.remove(key);
        return null;
      }

      return parsed.value;
    } catch (e) {
      console.error('LocalStorage get error:', e);
      return null;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (e) {
      console.error('LocalStorage remove error:', e);
      return false;
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (e) {
      console.error('LocalStorage clear error:', e);
      return false;
    }
  }

  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }
}

// ✅ In-Memory Cache (أسرع، يُفقد عند تحديث الصفحة)
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, expiryMinutes = null) {
    const data = {
      value,
      timestamp: Date.now(),
      expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : null
    };

    this.cache.set(key, data);
    return true;
  }

  get(key) {
    const data = this.cache.get(key);
    if (!data) return null;

    // Check if expired
    if (data.expiry && data.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return data.value;
  }

  remove(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    return true;
  }

  getSize() {
    return this.cache.size;
  }
}

// ✅ Hybrid Cache (يحاول Memory أولاً، ثم LocalStorage)
class HybridCache {
  constructor(prefix = 'ops_') {
    this.memory = new MemoryCache();
    this.storage = new LocalStorageCache(prefix);
  }

  set(key, value, expiryMinutes = null, useStorage = true) {
    this.memory.set(key, value, expiryMinutes);
    if (useStorage) {
      this.storage.set(key, value, expiryMinutes);
    }
    return true;
  }

  get(key) {
    // جرّب Memory أولاً (أسرع)
    let value = this.memory.get(key);
    if (value !== null) return value;

    // إذا لم يجد، جرّب Storage
    value = this.storage.get(key);
    if (value !== null) {
      this.memory.set(key, value); // احفظ في Memory للمرة القادمة
    }
    return value;
  }

  remove(key) {
    this.memory.remove(key);
    this.storage.remove(key);
    return true;
  }

  clear() {
    this.memory.clear();
    this.storage.clear();
    return true;
  }
}

// ✅ API Cache Wrapper
class APICache {
  constructor() {
    this.cache = new HybridCache();
  }

  /**
   * Fetch with cache
   * @param {string} url - API URL
   * @param {object} options - Fetch options
   * @param {number} cacheMinutes - Cache duration in minutes
   */
  async fetchWithCache(url, options = {}, cacheMinutes = 5) {
    const cacheKey = `api_${url}`;

    // جرّب الـ Cache أولاً
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log(`[Cache HIT] ${url}`);
      return cached;
    }

    // اجلب من الـ API
    try {
      console.log(`[Cache MISS] ${url}`);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // احفظ في الـ Cache
      this.cache.set(cacheKey, data, cacheMinutes);
      
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      memorySize: this.cache.memory.getSize()
    };
  }
}

// Create singleton instances
export const localStorageCache = new LocalStorageCache();
export const memoryCache = new MemoryCache();
export const hybridCache = new HybridCache();
export const apiCache = new APICache();

// Useful helpers
export const cacheHelper = {
  // User Preferences
  saveUserPrefs: (prefs) => hybridCache.set('userPrefs', prefs, 30 * 24 * 60), // 30 days
  getUserPrefs: () => hybridCache.get('userPrefs'),

  // User Data
  saveUser: (user) => hybridCache.set('currentUser', user, 24 * 60), // 24 hours
  getUser: () => hybridCache.get('currentUser'),

  // Lists
  cacheList: (key, data, minutes = 10) => hybridCache.set(key, data, minutes),
  getList: (key) => hybridCache.get(key),

  // Clear all
  clearAll: () => hybridCache.clear()
};

export default {
  LocalStorageCache,
  MemoryCache,
  HybridCache,
  APICache,
  localStorageCache,
  memoryCache,
  hybridCache,
  apiCache,
  cacheHelper
};
