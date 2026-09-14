import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiUser, BiLock, BiArrowFromLeft } from 'react-icons/bi';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../Context/AuthContext';

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

    /* Quick-fill buttons for testing */
    const quickFill = (u) => {
        setUsername(u);
        setPassword('ChangeMe123!');
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center px-8 py-20">
                <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl p-12">
                    <h2 className="text-4xl font-bold text-white mb-2 text-center">Welcome Back</h2>
                    <p className="text-white/60 text-lg text-center mb-8">Sign in to manage your assets</p>

                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Username</label>
                            <div className="relative">
                                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#173ef0] focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
                            <div className="relative">
                                <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#173ef0] focus:outline-none transition"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={busy}
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-[#264bee] disabled:opacity-50 transition-colors"
                        >
                            {busy ? 'Signing in…' : 'Sign In'}
                            <BiArrowFromLeft className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/60">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#7c8cff] font-semibold hover:text-[#173ef0]">
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