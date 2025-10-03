import { Routes, Route, Link, NavLink } from 'react-router-dom';
import Discover from './pages/Discover.jsx';
import Favorites from './pages/Favorites.jsx';
import MapPage from './pages/Map.jsx';
import Profile from './pages/Profile.jsx';

const navStyle = ({ isActive }) => ({
  padding: '8px 12px',
  textDecoration: 'none',
  borderRadius: 8,
  background: isActive ? '#222' : '#eee',
  color: isActive ? '#fff' : '#111',
  marginRight: 8
});

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#111' }}>
          CulturaCerca
        </Link>
        <nav style={{ marginLeft: 'auto' }}>
          <NavLink to="/" style={navStyle} end>Descubrir</NavLink>
          <NavLink to="/favorites" style={navStyle}>Favoritos</NavLink>
          <NavLink to="/map" style={navStyle}>Mapa</NavLink>
          <NavLink to="/profile" style={navStyle}>Perfil</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div>No encontrado</div>} />
      </Routes>
    </div>
  );
}



