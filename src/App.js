// App.js
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import Analysis from './components/Analysis';
import ErrorBoundary from './components/ErrorBoundary';
import { saveToCache, loadFromCache, clearExpiredCache } from './utils/cacheUtils';
import { trackAnalysis, getAnalytics } from './utils/analyticsUtils';
import './App.css';

const API_KEY = 'AIzaSyArqu0qB8jyJBjgjkPFCxOPD4IIcNDrzAg';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent';

const CATEGORY_PROMPTS = {
  // ... (category prompts remain the same)
};

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    clearExpiredCache();
    setAnalytics(getAnalytics());
  }, []);

  const handleAnalysis = async (title, author, category) => {
    setError(null);
    setIsLoading(true);

    const cacheKey = `${title}-${author}-${category}`;
    const cachedAnalysis = loadFromCache(cacheKey);

    if (cachedAnalysis) {
      setAnalysis(cachedAnalysis);
      setIsLoading(false);
      trackAnalysis(category, true);
      setAnalytics(getAnalytics());
      return;
    }

    try {
      const prompt = CATEGORY_PROMPTS[category].replace('{title}', title).replace('{author}', author);
      const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("You've exceeded the API rate limit. Please wait and try again later.");
        } else {
          throw new Error(`API request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const newAnalysis = {
          title,
          author,
          category,
          content: data.candidates[0].content.parts[0].text
        };
        setAnalysis(newAnalysis);
        saveToCache(cacheKey, newAnalysis);
        trackAnalysis(category, false);
        setAnalytics(getAnalytics());
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header>
          <h1>Meta Surfer</h1>
          <h2>The easiest way to know an artistic work</h2>
        </header>
        {error && <p className="error">{error}</p>}
        {isLoading ? (
          <div className="loading">Analyzing... Please wait.</div>
        ) : !analysis ? (
          <InputForm onSubmit={handleAnalysis} />
        ) : (
          <Analysis data={analysis} onReset={() => setAnalysis(null)} />
        )}
        {analytics && (
          <div className="analytics">
            <h3>Usage Statistics</h3>
            <p>Total Analyses: {analytics.cacheHits + analytics.apiCalls}</p>
            <p>Cache Hits: {analytics.cacheHits}</p>
            <p>API Calls: {analytics.apiCalls}</p>
            <h4>Analyses by Category:</h4>
            <ul>
              {Object.entries(analytics.categories).map(([category, count]) => (
                <li key={category}>{category}: {count}</li>
              ))}
            </ul>
          </div>
        )}
        <footer>
          <p>API Limits: 15 RPM, 32,000 TPM, 1,500 RPD</p>
          <p>Meta Surfer can make mistakes. Please double-check responses.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;