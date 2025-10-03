export default function LocationSelector({ value, onChange }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 8, borderRadius: 8 }}>
      <div>
        <label>Lat: </label>
        <input
          type="number"
          value={value.lat}
          onChange={e => onChange({ ...value, lat: +e.target.value })}
          step="0.0001"
        />
      </div>
      <div>
        <label>Lng: </label>
        <input
          type="number"
          value={value.lng}
          onChange={e => onChange({ ...value, lng: +e.target.value })}
          step="0.0001"
        />
      </div>
    </div>
  );
}
