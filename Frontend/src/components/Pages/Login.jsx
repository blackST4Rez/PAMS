import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
    BiUser, BiLockAlt, BiShow, BiHide, BiShieldAlt2,
    BiBuilding, BiChevronRight
} from 'react-icons/bi';
import toast from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await login(username, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const quickLogin = (username) => {
        setUsername(username);
        setPassword('ChangeMe123!');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Panel - Branding */}
                <div className="lg:w-2/5 bg-linear-to-br from-indigo-600 to-indigo-800 p-8 lg:p-12 flex flex-col justify-between text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                <BiShieldAlt2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">PMS</h2>
                                <p className="text-indigo-200 text-xs">Asset Management</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                                Welcome to the<br />
                                <span className="text-indigo-200">Asset Management System</span>
                            </h1>
                            <p className="text-indigo-200/80 text-sm leading-relaxed">
                                Track, manage, and optimize your public assets efficiently with our comprehensive asset management platform.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-indigo-200/80">
                            <div className="w-1 h-8 bg-indigo-400 rounded-full"></div>
                            <div>
                                <p className="font-medium text-white">Gaurishankar Rural Municipality</p>
                                <p className="text-xs text-indigo-300">Dolakha, Nepal</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs text-indigo-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span>Secure Login</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-indigo-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span>256-bit Encryption</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="lg:w-3/5 p-8 lg:p-12">
                    <div className="max-w-md mx-auto">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Username
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BiUser className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                                        placeholder="Enter your username"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BiLockAlt className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <BiHide className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                        ) : (
                                            <BiShow className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                                    <span className="text-red-500 text-lg">⚠</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <BiChevronRight className="ml-1 w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Quick Login Help */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center mb-3">Quick Test Access</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => quickLogin('prem.thapa')}
                                    className="text-xs px-3 py-2 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
                                >
                                    Prem Thapa (Admin)
                                </button>
                                <button
                                    onClick={() => quickLogin('sita.devkota')}
                                    className="text-xs px-3 py-2 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
                                >
                                    Sita Devkota (AM)
                                </button>
                                <button
                                    onClick={() => quickLogin('narayan.kafle')}
                                    className="text-xs px-3 py-2 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
                                >
                                    Narayan Kafle (FO)
                                </button>
                                <button
                                    onClick={() => quickLogin('ram.basnet')}
                                    className="text-xs px-3 py-2 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
                                >
                                    Ram Basnet (FO)
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-3">
                                All accounts use password: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">ChangeMe123!</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;