// utils/analyticsUtils.js

const ANALYTICS_KEY = 'META_SURFER_ANALYTICS';

export const trackAnalysis = (category, isCacheHit) => {
  const analytics = loadAnalytics();
  
  // Update category count
  analytics.categories[category] = (analytics.categories[category] || 0) + 1;
  
  // Update cache hit/miss count
  if (isCacheHit) {
    analytics.cacheHits++;
  } else {
    analytics.apiCalls++;
  }
  
  saveAnalytics(analytics);
};

export const getAnalytics = () => {
  return loadAnalytics();
};

const loadAnalytics = () => {
  const storedAnalytics = localStorage.getItem(ANALYTICS_KEY);
  return storedAnalytics ? JSON.parse(storedAnalytics) : {
    categories: {},
    cacheHits: 0,
    apiCalls: 0
  };
};

const saveAnalytics = (analytics) => {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
};