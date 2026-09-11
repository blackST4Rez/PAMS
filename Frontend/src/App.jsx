import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import LoginPage from './components/Pages/LoginPage';
import RegisterPage from './components/Pages/RegisterPage';
import DashboardPage from './components/Pages/DashboardPage';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { AuthProvider } from './components/Context/AuthContext';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Old role URLs → one dashboard */}
        <Route path="/sysAdmin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/asset-manager" element={<Navigate to="/dashboard" replace />} />
        <Route path="/finance-officer" element={<Navigate to="/dashboard" replace />} />
        <Route path="/field-officer" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auditor" element={<Navigate to="/dashboard" replace />} />
        <Route path="/public" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;