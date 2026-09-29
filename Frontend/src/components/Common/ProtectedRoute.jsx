import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    /* Only show the loader while auth is genuinely still hydrating.
       Once loading is false, subsequent route changes render instantly. */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    return children;
};

export default ProtectedRoute;