import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="text-white text-lg">Loading…</div>
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

export default ProtectedRoute;