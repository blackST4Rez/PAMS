import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiUser, BiLock, BiArrowFromLeft } from 'react-icons/bi';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../Context/AuthContext';

const LoginPage = () => {
    const { login, USE_MOCK } = useAuth();
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

    // Quick-fill buttons for testing — only shown while USE_MOCK
    const quickFill = (u) => {
        setUsername(u);
        setPassword('ChangeMe123!');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center px-8 py-20">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
                    <p className="text-gray-600 text-lg text-center mb-8">Sign in to manage your assets</p>

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="sita.devkota"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173ef0] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="ChangeMe123!"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173ef0] focus:outline-none"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <button
                            disabled={busy}
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-[#264bee] disabled:opacity-50"
                        >
                            {busy ? 'Signing in…' : 'Sign In'}
                            <BiArrowFromLeft className="w-5 h-5" />
                        </button>
                    </form>

                    {USE_MOCK && (
                        <div className="mt-6 border-t pt-6">
                            <p className="text-xs text-gray-500 text-center mb-3">
                                🧪 Test accounts (password: <code>ChangeMe123!</code>)
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    ['prem.thapa', 'Admin'],
                                    ['sita.devkota', 'Asset Mgr'],
                                    ['narayan.kafle', 'Finance'],
                                    ['ram.basnet', 'Field'],
                                    ['saraswoti.l', 'Auditor'],
                                    ['public.user', 'Public'],
                                ].map(([u, label]) => (
                                    <button
                                        key={u}
                                        type="button"
                                        onClick={() => quickFill(u)}
                                        className="text-xs px-2 py-1.5 border border-gray-200 rounded hover:bg-gray-50"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#173ef0] font-semibold">
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