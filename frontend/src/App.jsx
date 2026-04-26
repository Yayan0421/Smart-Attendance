import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Events from './pages/Events';
import RFIDCards from './pages/RFIDCards';
import ScanAttendance from './pages/ScanAttendance';
import AttendanceLogs from './pages/AttendanceLogs';
import Profile from './pages/Profile';

// Layout
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Events />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rfid"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RFIDCards />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ScanAttendance />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-logs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AttendanceLogs />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
