import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
    const { isAuthenticated, loading, hasPermission } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredPermissions.length > 0) {
        const hasAccess = requiredPermissions.every(p => hasPermission(p));
        if (!hasAccess) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;