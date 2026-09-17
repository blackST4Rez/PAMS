import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/Pages/HomePage';
import LoginPage from './components/Pages/LoginPage';
import RegisterPage from './components/Pages/RegisterPage';
import DashboardPage from './components/Pages/DashboardPage';
import ProfilePage from './components/Profile/ProfilePage';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { AuthProvider } from './components/Context/AuthContext';
import { AssetsProvider } from './components/Context/AssetsContext';
import { ApprovalsProvider } from './components/Context/ApprovalsContext';
import { MaintenanceProvider } from './components/Context/MaintenanceContext';
import { ValuationProvider } from './components/Context/ValuationContext';
import UsersPage from './components/Users/UsersPage';
import AssetsPage from './components/Assets/AssetsPage';
import ApprovalsPage from './components/Approvals/ApprovalsPage';
import MaintenancePage from './components/Maintainence/MaintenancePage';
import ValuationPage from './components/Valuation/ValuationPage';
import ReportsPage from './components/Reports/ReportsPage';

const App = () => (
  <AuthProvider>
    <AssetsProvider>
      <ApprovalsProvider>
        <MaintenanceProvider>
          <ValuationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/users"       element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
                <Route path="/assets"      element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
                <Route path="/approvals"   element={<ProtectedRoute><ApprovalsPage /></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
                <Route path="/valuation"   element={<ProtectedRoute><ValuationPage /></ProtectedRoute>} />
                <Route path="/reports"     element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

                <Route path="/sysAdmin"        element={<Navigate to="/dashboard" replace />} />
                <Route path="/asset-manager"   element={<Navigate to="/dashboard" replace />} />
                <Route path="/finance-officer" element={<Navigate to="/dashboard" replace />} />
                <Route path="/field-officer"   element={<Navigate to="/dashboard" replace />} />
                <Route path="/auditor"         element={<Navigate to="/dashboard" replace />} />
                <Route path="/public"          element={<Navigate to="/dashboard" replace />} />
              </Routes>

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#242424',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    padding: '12px 16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  },
                  success: { iconTheme: { primary: '#22c55e', secondary: '#242424' } },
                  error:   { iconTheme: { primary: '#ef4444', secondary: '#242424' } },
                }}
              />
            </Router>
          </ValuationProvider>
        </MaintenanceProvider>
      </ApprovalsProvider>
    </AssetsProvider>
  </AuthProvider>
);

export default App;