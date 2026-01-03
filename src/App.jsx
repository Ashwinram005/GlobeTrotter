import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import UserDashboard from './UserDashboard';
import Profile from './Profile';
import MyTrips from './MyTrips';
import SearchPage from './SearchPage';
import ResultDetail from './ResultDetail';
import Community from './Community';
import CalendarPage from './CalendarPage';
import AdminPanel from './AdminPanel';
import CreateTrip from './CreateTrip';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/explore" element={<SearchPage />} />
      <Route path="/explore/:id" element={<ResultDetail />} />
      <Route path="/community" element={<Community />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/create-trip" element={<CreateTrip />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;