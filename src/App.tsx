import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import TripView from './pages/TripView'
import TripItinerary from './pages/TripItinerary'
import TripBudget from './pages/TripBudget'
import TripCalendar from './pages/TripCalendar'
import UserProfile from './pages/UserProfile'
import PublicTripView from './pages/PublicTripView'
import AdminDashboard from './pages/AdminDashboard'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
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
      <Route path="/trip/:tripId" element={session ? <TripView /> : <Navigate to="/login" />} />
      <Route path="/trip/:tripId/edit" element={session ? <TripItinerary /> : <Navigate to="/login" />} />
      <Route path="/trip/:tripId/budget" element={session ? <TripBudget /> : <Navigate to="/login" />} />
      <Route path="/trip/:tripId/calendar" element={session ? <TripCalendar /> : <Navigate to="/login" />} />
      <Route path="/trip/:tripId/public" element={<PublicTripView />} />
      <Route path="/cities" element={session ? <CitySearch /> : <Navigate to="/login" />} />
      <Route path="/activities" element={session ? <ActivitySearch /> : <Navigate to="/login" />} />
      <Route path="/profile" element={session ? <UserProfile /> : <Navigate to="/login" />} />
      <Route path="/admin" element={session ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
