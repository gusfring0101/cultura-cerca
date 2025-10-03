export default function FilterPanel({ maxKm, setMaxKm, maxBudget, setMaxBudget, prefs, setPrefs }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 8, borderRadius: 8 }}>
      <div>
        <label>Radio (km): </label>
        <input type="number" value={maxKm} onChange={e => setMaxKm(+e.target.value)} />
      </div>
      <div>
        <label>Presupuesto (€): </label>
        <input type="number" value={maxBudget} onChange={e => setMaxBudget(+e.target.value)} />
      </div>
      <div>
        <label>Preferencias: </label>
        <input
          type="text"
          value={prefs.join(',')}
          onChange={e => setPrefs(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        />
      </div>
    </div>
  );
}
