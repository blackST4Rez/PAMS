import { NavLink, useNavigate } from 'react-router-dom';
import * as Fa from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useUi } from '../Context/UiContext';

const UnifiedSidebar = () => {
    const { user, menu, logout } = useAuth();
    const { mobileMenuOpen, closeMenu } = useUi();
    const navigate = useNavigate();
    const roleLabel = user?.roles?.[0]?.replace(/_/g, ' ') || 'Dashboard';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const nav = (
        <div className="w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-full flex flex-col">
            <div className="sticky top-4 p-4 flex flex-col flex-1">
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Fa.FaTachometerAlt className="text-[#173ef0]" />
                        {roleLabel} Menu
                    </h3>
                </div>

                <nav className="space-y-1 px-2 flex-1 overflow-y-auto">
                    {menu.map((item) => {
                        const Icon = Fa[item.icon] || Fa.FaCircle;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-[#173ef0] text-white'
                                            : 'text-white/70 hover:bg-[#173ef0] hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-4 px-2 pt-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-center items-center gap-3 px-4 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors ease-in-out duration-300 cursor-pointer"
                    >
                        <Fa.FaSignOutAlt className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop — static sidebar, visible at lg and up */}
            <div className="hidden lg:block">{nav}</div>

            {/* Mobile — slide-out drawer + backdrop */}
            <div
                className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${
                    mobileMenuOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60"
                    onClick={closeMenu}
                />

                {/* Drawer */}
                <div
                    className={`absolute top-0 left-0 h-full transition-transform duration-250 ease-out ${
                        mobileMenuOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }`}
                >
                    {nav}
                </div>
            </div>
        </>
    );
};

export default UnifiedSidebar;