import { BiEnvelope, BiLock, BiArrowFromLeft } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Header />

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-8 lg:px-12 py-20">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Sign in to manage your assets
                        </p>
                    </div>

                    <form className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-[#173ef0] focus:ring-[#173ef0] border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link to="#" className="text-sm text-[#173ef0] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-[#264bee] transition-all ease-in-out duration-300 cursor-pointer"
                        >
                            <span>Sign In</span>
                            <BiArrowFromLeft className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to='/register' className="text-[#173ef0] font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LoginPage;