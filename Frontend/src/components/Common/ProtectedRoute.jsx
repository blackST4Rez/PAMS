import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Loader from './Loader';

const MIN_LOADER_MS = 350;

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [minDelayDone, setMinDelayDone] = useState(false);

    /* Ensure the loader is visible for at least MIN_LOADER_MS on mount
       so it doesn't flash by on fast loads. */
    useEffect(() => {
        const t = setTimeout(() => setMinDelayDone(true), MIN_LOADER_MS);
        return () => clearTimeout(t);
    }, []);

    if (loading || !minDelayDone) {
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