// utils/cacheUtils.js

const CACHE_KEY = 'META_SURFER_CACHE';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const saveToCache = (key, data) => {
  const cacheData = loadCache();
  cacheData[key] = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

export const loadFromCache = (key) => {
  const cacheData = loadCache();
  const cachedItem = cacheData[key];
  
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRATION) {
    return cachedItem.data;
  }
  
  return null;
};

const loadCache = () => {
  const cacheData = localStorage.getItem(CACHE_KEY);
  return cacheData ? JSON.parse(cacheData) : {};
};

export const clearExpiredCache = () => {
  const cacheData = loadCache();
  const now = Date.now();
  
  Object.keys(cacheData).forEach(key => {
    if (now - cacheData[key].timestamp >= CACHE_EXPIRATION) {
      delete cacheData[key];
    }
  });
  
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};