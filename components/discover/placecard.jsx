export default function PlaceCard({ place }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h3 style={{ margin: '4px 0' }}>{place.name || 'Lugar'}</h3>
      <div style={{ opacity: 0.8, fontSize: 14 }}>{place.type || place.category || '-'}</div>
      {place.distance && <div>Distancia: {place.distance} km</div>}
      {place.price != null && <div>Precio: {place.price} €</div>}
    </div>
  );
}
