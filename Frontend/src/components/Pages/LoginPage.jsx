import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiUser, BiLock, BiArrowFromLeft, BiArrowBack } from 'react-icons/bi';
import { FaExclamationTriangle } from 'react-icons/fa';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../Context/AuthContext';

const isDeactivated = (msg) => /deactivat/i.test(msg);

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setBusy(false);
        }
    };

    const clearError = () => {
        setError('');
        setPassword('');
    };

    /* ---------- Deactivated account screen ---------- */
    if (error && isDeactivated(error)) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
                <Header />

                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
                    <div className="max-w-lg w-full bg-[#1a1a1a] rounded-2xl p-6 sm:p-10 lg:p-12">
                        {/* Icon + Title + Message */}
                        <div className="flex flex-col items-center text-center mb-5">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-4">
                                <FaExclamationTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-2">
                                Account Deactivated
                            </h2>
                            <p className="text-sm sm:text-base text-white/60">
                                {error}
                            </p>
                        </div>

                        {/* Back */}
                        <div className="flex justify-center">
                            <button
                                onClick={clearError}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#607dff] hover:text-[#7c8cff] transition-colors"
                            >
                                <BiArrowBack className="w-4 h-4" />
                                Back
                            </button>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    /* ---------- Normal login screen ---------- */
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
                <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl p-6 sm:p-10 lg:p-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 text-center">
                        Welcome Back
                    </h2>
                    <p className="text-white/60 text-sm sm:text-base lg:text-lg text-center mb-6 sm:mb-8">
                        Sign in to manage your assets
                    </p>

                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-[#173ef0] focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-[#173ef0] focus:outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Non-deactivation errors */}
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
                            >
                                <FaExclamationTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            disabled={busy}
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 py-3 font-semibold text-base sm:text-lg hover:bg-[#264bee] disabled:opacity-50 transition-colors"
                        >
                            {busy ? 'Signing in…' : 'Sign In'}
                            <BiArrowFromLeft className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm sm:text-base">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-[#7c8cff] font-semibold hover:text-[#173ef0]"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LoginPage;