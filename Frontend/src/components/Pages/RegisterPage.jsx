import { BiUser, BiEnvelope, BiLock, BiArrowFromLeft, BiPhone, BiMapPin } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Header />

            {/* Register Form */}
            <div className="flex-1 flex items-center justify-center px-8 lg:px-12 py-20">
                <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Start managing your assets today
                        </p>
                    </div>

                    <form className="space-y-6">
                        {/* Row 1: Full Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                                    />
                                </div>
                            </div>

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
                        </div>

                        {/* Row 2: Phone & Municipality */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BiPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="+977-123456789"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Municipality
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BiMapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Gaurishankar, Dolakha"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Password & Confirm Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        placeholder="Create a strong password"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirm your password"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-[#173ef0] focus:ring-[#173ef0] border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                I agree to the{' '}
                                <Link to="#" className="text-[#173ef0] hover:underline">
                                    Terms & Conditions
                                </Link>
                                {' '}and{' '}
                                <Link to="#" className="text-[#173ef0] hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-max mx-auto flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-[#0020ad] transition-all ease-in-out duration-300 cursor-pointer"
                        >
                            <span>Create Account</span>
                            <BiArrowFromLeft className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#173ef0] font-semibold hover:underline">
                                Sign in
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

export default RegisterPage;