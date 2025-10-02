import { Routes, Route, Navigate } from 'react-router-dom'
import Discover from '../pages/Discover.jsx'
import Favorites from '../pages/Favorites.jsx'
import MapPage from '../pages/Map.jsx'
import Profile from '../pages/Profile.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Discover />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


