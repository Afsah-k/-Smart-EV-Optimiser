import { useState } from 'react';
import EVOptimiserForm from './EVOptimiserForm';
import EVResults from './EVResults';
import './App.css';

const API_URL = 'https://nfi7oc32ad.execute-api.eu-west-2.amazonaws.com/default/ev-optimiser';

function App() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      battery_percent:        formData.currentBattery,
      battery_capacity_kwh:   formData.capacity,
      daily_miles:            formData.dailyDriving,
      location:               formData.location,
      target_battery_percent: formData.targetBattery,
      preferred_charger:      formData.charger,
      efficiency:             formData.efficiency,
      connectors:             formData.connectors,
    };

    try {
      const response = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">

      {/* Show form only when no result yet */}
      {!result && (
        <EVOptimiserForm onSubmit={handleSubmit} />
      )}

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: 'center', color: '#00d4aa', marginTop: '1rem', fontFamily: 'monospace' }}>
          Finding best charging options...
        </p>
      )}

      {/* Error */}
      {error && (
        <div style={{ maxWidth: 640, margin: '1rem auto' }}>
          <p style={{ textAlign: 'center', color: '#ef4444', marginBottom: '1rem' }}>
            ⚠ {error}
          </p>
          <button onClick={handleReset} style={{
            display: 'block', margin: '0 auto',
            background: 'transparent', border: '1px solid #1e2d45',
            borderRadius: 8, color: '#a0bbc8', padding: '8px 16px',
            cursor: 'pointer', fontFamily: 'sans-serif',
          }}>
            ← Try again
          </button>
        </div>
      )}

      {/* Results card */}
      {result && (
        <EVResults result={result} onReset={handleReset} />
      )}

    </div>
  );
}

export default App;