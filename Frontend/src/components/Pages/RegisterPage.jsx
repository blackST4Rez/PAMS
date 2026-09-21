import { useState } from 'react';
import {
    BiUser, BiEnvelope, BiLock, BiArrowFromLeft, BiPhone, BiMapPin,
    BiCheckCircle,
} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../Context/AuthContext';

const WARD_OPTIONS = [
    'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5',
    'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9',
];

const RegisterPage = () => {
    const { submitRegistration } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        municipality: 'Gaurishankar Rural Municipality',
        ward: 'Ward 3',
        password: '',
        confirmPassword: '',
        agree: false,
    });

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!form.firstName.trim() || !form.lastName.trim()) {
            return toast.error('First and last name are required');
        }
        if (!form.email.trim()) {
            return toast.error('Email is required');
        }
        if (form.password.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (!form.agree) {
            return toast.error('Please accept the Terms & Conditions');
        }

        setBusy(true);
        try {
            const username = form.email.split('@')[0].toLowerCase();

            submitRegistration({
                username,
                fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
                email: form.email.trim(),
                phone: form.phone.trim(),
                municipality: form.municipality,
                ward: form.ward,
                password: form.password,
            });

            setSubmitted(true);
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setBusy(false);
        }
    };

    /* ============ Submitted state ============ */
    if (submitted) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
                <Header />

                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
                    <div className="max-w-lg w-full text-center">
                        <BiCheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                            Registration Submitted
                        </h2>
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                            Your registration is pending approval. An administrator
                            will review your request and assign your role.
                        </p>

                        <div className="p-4 mb-6">
                            <p className="text-sm sm:text-base font-semibold text-[#7c8cff] uppercase tracking-wider mb-4 text-center">
                                What happens next
                            </p>
                            <ul className="space-y-2 text-sm text-white/80 text-left inline-block">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#7c8cff] shrink-0 mt-0.5">•</span>
                                    <span>An admin reviews your request in the Users panel</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#7c8cff] shrink-0 mt-0.5">•</span>
                                    <span>They assign you a role based on your department</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#7c8cff] shrink-0 mt-0.5">•</span>
                                    <span>You can log in once your account is approved</span>
                                </li>
                            </ul>
                        </div>

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-[#7c8cff] font-semibold hover:text-[#173ef0] text-sm sm:text-base"
                        >
                            ← Back to Sign In
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    /* ============ Form state ============ */
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-10 sm:py-16 lg:py-20">
                <div className="max-w-5xl w-full bg-[#1a1a1a] rounded-2xl p-6 sm:p-10 lg:p-12">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            Create Account
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base lg:text-lg">
                            Register to request access — an admin will assign your role
                        </p>
                    </div>

                    <form className="space-y-5 sm:space-y-6" onSubmit={onSubmit}>
                        {/* Row 1: First & Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={onChange}
                                        placeholder="John"
                                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={onChange}
                                        placeholder="Doe"
                                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <BiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={onChange}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <BiPhone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={onChange}
                                        placeholder="+977-98XXXXXXXX"
                                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Municipality & Ward */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    Municipality
                                </label>
                                <div className="relative">
                                    <BiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="municipality"
                                        value={form.municipality}
                                        disabled
                                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60 focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    Ward
                                </label>
                                <div className="relative">
                                    <BiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 z-10" />
                                    <select
                                        name="ward"
                                        value={form.ward}
                                        onChange={onChange}
                                        className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition appearance-none cursor-pointer"
                                    >
                                        {WARD_OPTIONS.map((w) => (
                                            <option key={w} value={w} className="bg-[#242424] text-white">
                                                {w}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                                        ▼
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Password & Confirm */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={onChange}
                                        placeholder="Create a strong password"
                                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={onChange}
                                        placeholder="Confirm your password"
                                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2 mb-6 sm:mb-10">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={onChange}
                                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-[#173ef0] focus:ring-[#173ef0] focus:ring-offset-0 shrink-0"
                            />
                            <label className="block text-sm text-white/60 leading-snug">
                                I agree to the{' '}
                                <Link to="#" className="text-[#7c8cff] hover:underline">
                                    Terms &amp; Conditions
                                </Link>{' '}
                                and{' '}
                                <Link to="#" className="text-[#7c8cff] hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={busy}
                                className="flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#0020ad] disabled:opacity-50 transition-all ease-in-out duration-300 cursor-pointer"
                            >
                                <span>{busy ? 'Submitting…' : 'Create Account'}</span>
                                <BiArrowFromLeft className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm sm:text-base">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-[#7c8cff] font-semibold hover:text-[#173ef0] hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RegisterPage;