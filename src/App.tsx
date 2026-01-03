import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import TripItinerary from './pages/TripItinerary'
import { useAuth } from './context/AuthContext'

function App() {
  const { session, loading } = useAuth()

  if (loading) return null

  return (
    <Routes>
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!session ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/create-trip" element={session ? <CreateTrip /> : <Navigate to="/login" />} />
      <Route path="/my-trips" element={session ? <MyTrips /> : <Navigate to="/login" />} />
      <Route path="/trip/:tripId" element={session ? <TripItinerary /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
