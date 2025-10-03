import { useState } from 'react';
import { ccSearch } from '../lib/n8n.js';
// Si ya los tienes implementados, importa tus componentes reales:
import FilterPanel from '../components/discover/FilterPanel.jsx';
import LocationSelector from '../components/discover/LocationSelector.jsx';
import PlaceCard from '../components/discover/PlaceCard.jsx';

export default function Discover() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const [location, setLocation] = useState({ lat: 40.4168, lng: -3.7038 });
  const [maxKm, setMaxKm] = useState(10);
  const [maxBudget, setMaxBudget] = useState(15);
  const [prefs, setPrefs] = useState(['museos', 'teatro']);

  async function runSearch() {
    setLoading(true);
    setError('');
    try {
      const data = await ccSearch({ location, maxKm, maxBudget, prefs });
      setResults(Array.isArray(data?.places) ? data.places : data);
    } catch (e) {
      setError(e.message || 'Error buscando');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Descubrir</h1>

      {/* aquí conecta tus propios componentes si ya existen */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <LocationSelector value={location} onChange={setLocation} />
        <FilterPanel
          maxKm={maxKm}
          setMaxKm={setMaxKm}
          maxBudget={maxBudget}
          setMaxBudget={setMaxBudget}
          prefs={prefs}
          setPrefs={setPrefs}
        />
        <button onClick={runSearch} disabled={loading}>Buscar</button>
      </div>

      {loading && <p>Buscando…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {results.map((p, i) => (
          <PlaceCard key={p.id || i} place={p} />
        ))}
      </div>
    </div>
  );
}
