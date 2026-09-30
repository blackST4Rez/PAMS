import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Loader from './Loader';

const LOGIN_TRANSITION_MS = 500;

const ProtectedRoute = ({ children }) => {
    const { user, loading, consumeLoginTransition } = useAuth();

    /*
      Read the module-level "just logged in" flag exactly once,
      on mount. If it's a fresh login, show the loader for a short
      moment before revealing the destination page.

      Kept in useState to guarantee the read happens only on mount
      (not on every render).
    */
    const [showTransition] = useState(() => consumeLoginTransition());
    const [transitionDone, setTransitionDone] = useState(!showTransition);

    useEffect(() => {
        if (!showTransition) return;

        const t = setTimeout(
            () => setTransitionDone(true),
            LOGIN_TRANSITION_MS
        );
        return () => clearTimeout(t);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    /* Loader during auth boot OR during the post-login transition */
    if (loading || !transitionDone) {
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