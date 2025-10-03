import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Discover from './pages/Discover.jsx'
import Favorites from './pages/Favorites.jsx'
import Map from './pages/Map.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/discover" replace />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/map" element={<Map />} />
      <Route path="/profile" element={<Profile />} />
      {/* 404 */}
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}
