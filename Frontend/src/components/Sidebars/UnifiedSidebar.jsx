import { NavLink } from 'react-router-dom';
import * as Fa from 'react-icons/fa';
import LogoImage from '../../assets/Logo.svg';
import { useAuth } from '../Context/AuthContext';
import { useUi } from '../Context/UiContext';

const UnifiedSidebar = () => {
    const { menu } = useAuth();
    const {
        mobileMenuOpen,
        closeMenu,
        sidebarCollapsed,
    } = useUi();

    /* ---------- Collapsed rail (logo + icons, no text) ---------- */
    const collapsedNav = (
        <div className="sidebar-shell w-20 shrink-0 bg-[#1a1a1a] border-r border-white/10 h-screen sticky top-0 flex flex-col overflow-hidden">
            <div className="px-3 pb-3 pt-3 lg:pt-4 flex flex-col flex-1 items-center min-h-0">
                <div className="w-12 h-12 flex items-center justify-center mb-4 shrink-0">
                    <img src={LogoImage} alt="Logo" className="w-11 h-11" />
                </div>

                <nav className="sidebar-scroll space-y-1.5 flex-1 w-full flex flex-col items-center overflow-y-auto min-h-0">
                    {menu.map((item) => {
                        const Icon = Fa[item.icon] || Fa.FaCircle;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                title={item.label}
                                className={({ isActive }) =>
                                    `group w-12 h-12 flex items-center justify-center transition-colors duration-200 shrink-0 ${
                                        isActive
                                            ? 'bg-[#173ef0] text-white'
                                            : 'text-white/70 hover:bg-[#173ef0] hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="sidebar-icon w-5 h-5 group-hover:scale-110" />
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );

    /* ---------- Expanded (logo + wordmark + labels) ---------- */
    const expandedNav = (
        <div className="sidebar-shell w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 h-screen sticky top-0 flex flex-col overflow-hidden">
            <div className="px-4 pb-4 pt-3 lg:pt-4 flex flex-col flex-1 min-h-0">
                <div className="flex items-center gap-3 px-2 pb-5 mb-2 border-b border-white/10 shrink-0">
                    <img src={LogoImage} alt="Logo" className="w-11 h-11 shrink-0" />
                    <div className="flex flex-col leading-tight min-w-0">
                        <span className="font-bold text-xl text-[#173ef0] truncate">
                            PMS
                        </span>
                        <p className="text-white/60 text-xs truncate">
                            Asset Management
                        </p>
                    </div>
                </div>

                <nav className="sidebar-scroll space-y-1 px-2 flex-1 overflow-y-auto overscroll-contain min-h-0">
                    {menu.map((item) => {
                        const Icon = Fa[item.icon] || Fa.FaCircle;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `group w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-[#173ef0] text-white'
                                            : 'text-white/70 hover:bg-[#173ef0] hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="sidebar-icon w-5 h-5 shrink-0 group-hover:scale-110" />
                                <span className="truncate">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );

    const nav = sidebarCollapsed ? collapsedNav : expandedNav;

    return (
        <>
            {/* Desktop — static sidebar */}
            <div className="hidden lg:block shrink-0">{nav}</div>

            {/* Mobile — slide-out drawer */}
            <div
                className={`fixed inset-0 z-9999 lg:hidden transition-opacity duration-200 ${
                    mobileMenuOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            >
                <div
                    className="absolute inset-0 bg-black/60 touch-none overscroll-contain"
                    onClick={closeMenu}
                />

                <div
                    className={`absolute top-0 left-0 h-full transition-transform duration-250 ease-out touch-pan-y overscroll-contain ${
                        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {expandedNav}
                </div>
            </div>
        </>
    );
};

export default UnifiedSidebar;