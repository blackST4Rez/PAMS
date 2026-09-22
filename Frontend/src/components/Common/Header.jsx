import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import LogoImage from "../../assets/Logo.svg";
import { useUi } from "../Context/UiContext";
import { useAuth } from "../Context/AuthContext";

const PROTECTED_PREFIXES = [
    '/dashboard', '/profile', '/users', '/assets',
    '/approvals', '/maintenance', '/valuation',
    '/reports', '/audit', '/gis',
];

const Header = () => {
    const { toggleMenu } = useUi();
    const { user } = useAuth();
    const location = useLocation();

    const isProtectedRoute = PROTECTED_PREFIXES.some((p) =>
        location.pathname.startsWith(p)
    );
    const showHamburger = Boolean(user) && isProtectedRoute;

    return (
        <div className="bg-[#111112] sticky top-0 z-2000">
            <div className="flex max-w-7xl h-20 bg-[#111112] items-center justify-between mx-auto px-4">
                <div className="flex items-center gap-3">
                    {showHamburger && (
                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <FaBars className="w-5 h-5" />
                        </button>
                    )}

                    <Link to="/" className="flex gap-3 items-center">
                        <img src={LogoImage} alt="Logo" className="w-12 h-12" />
                        <div className="flex flex-col leading-tight">
                            <span className="font-bold text-xl text-[#173ef0]">PMS</span>
                            <p className="text-white text-xs">Asset Management</p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link to="/login">
                        <button className="flex items-center justify-center bg-[#173ef0] text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base hover:bg-[#0020ad] transition-colors cursor-pointer">
                            Log In
                        </button>
                    </Link>
                    <Link to="/register" className="hidden sm:block">
                        <button className="flex items-center justify-center bg-[#173ef0] text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base hover:bg-[#0020ad] transition-colors cursor-pointer">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Header;