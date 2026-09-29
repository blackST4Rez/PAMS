import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GrLogout } from 'react-icons/gr';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaBell,
    FaCheck,
    FaOutdent,
    FaUserCircle,
    FaUserCog,
    FaHistory,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useUi } from '../Context/UiContext';
import Loader from './Loader';

/* ---------------- helpers ---------------- */

const initials = (name) => {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
};

const timeAgo = (iso) => {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    if (!Number.isFinite(then)) return '';
    const diff = Math.floor((Date.now() - then) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) {
        const h = Math.floor(diff / 3600);
        return `${h} hour${h === 1 ? '' : 's'} ago`;
    }
    const d = Math.floor(diff / 86400);
    return `${d} day${d === 1 ? '' : 's'} ago`;
};

/* ---------------- component ---------------- */

const PageToolbar = () => {
    const {
        user,
        logout,
        notifications = [],
        markNotificationRead,
        markAllNotificationsRead,
    } = useAuth();
    const { sidebarCollapsed, toggleSidebar } = useUi();
    const location = useLocation();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [loggingOut, setLoggingOut] = useState(false);

    const menuRef = useRef(null);
    const notifRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    /* Close dropdowns on outside click */
    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    /* Close dropdowns on route change */
    useEffect(() => {
        setMenuOpen(false);
        setNotifOpen(false);
    }, [location.pathname]);

    /* Reset tab when dropdown closes */
    useEffect(() => {
        if (!menuOpen) setActiveTab('profile');
    }, [menuOpen]);

    const handleLogout = async () => {
        setMenuOpen(false);
        setLoggingOut(true);
        await logout();
        navigate('/login');
    };

    /* Navigate to profile with a specific tab */
    const goToProfileTab = (tab = 'details') => {
        setMenuOpen(false);
        setNotifOpen(false);
        navigate(`/profile?tab=${tab}`);
    };

    const handleNotifClick = (n) => {
        if (!n.read && markNotificationRead) markNotificationRead(n.id);
    };

    const handleMarkAll = () => {
        if (markAllNotificationsRead) markAllNotificationsRead();
    };

    if (!user) return null;

    return (
        <>
            <div className="mb-4 flex items-center gap-2 sm:gap-3">
                {/* Sidebar toggle (desktop only) */}
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="hidden lg:flex shrink-0 items-center justify-center w-9 h-9 text-white bg-white/5 transition-colors"
                    aria-label="Toggle sidebar"
                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <FaOutdent
                        className={`w-4 h-4 sidebar-toggle-icon ${
                            sidebarCollapsed ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </button>

                {/* Search (placeholder) */}
                <div className="relative w-full max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search assets, users…"
                        className="w-full pl-9 pr-16 py-2 bg-white/5 border border-white/10 text-white placeholder-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition cursor-pointer"
                        readOnly
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5">
                        Ctrl + K
                    </kbd>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right cluster: bell + avatar */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* ---------- Notification bell ---------- */}
                    <div className="relative" ref={notifRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setNotifOpen((v) => !v);
                                setMenuOpen(false);
                            }}
                            className={`relative w-9 h-9 flex items-center justify-center transition-colors ${
                                notifOpen
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                            aria-label="Notifications"
                            aria-expanded={notifOpen}
                        >
                            <FaBell className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-semibold bg-[#173ef0] text-white rounded-full">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="fade-slide-in absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-[#161616] border border-white/10 shadow-2xl z-2000">
                                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-white">
                                        Notifications
                                    </h3>
                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleMarkAll}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                                        >
                                            <FaCheck className="w-3 h-3" />
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-96 overflow-y-auto hide-scrollbar divide-y divide-white/5">
                                    {notifications.length === 0 ? (
                                        <p className="text-sm text-white/40 italic py-10 text-center">
                                            No notifications yet.
                                        </p>
                                    ) : (
                                        notifications.map((n) => (
                                            <button
                                                key={n.id}
                                                type="button"
                                                onClick={() => handleNotifClick(n)}
                                                className={`w-full text-left px-5 py-4 flex items-start gap-3 transition-colors ${
                                                    n.read
                                                        ? 'hover:bg-white/2'
                                                        : 'bg-[#173ef0]/5 hover:bg-[#173ef0]/10'
                                                }`}
                                            >
                                                <span
                                                    className={`shrink-0 mt-1.5 w-2 h-2 rounded-full ${
                                                        n.read
                                                            ? 'bg-white/15'
                                                            : 'bg-[#173ef0]'
                                                    }`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p className="text-sm font-medium text-white leading-snug">
                                                            {n.title}
                                                        </p>
                                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider shrink-0 pt-0.5">
                                                            {timeAgo(n.createdAt)}
                                                        </span>
                                                    </div>
                                                    {n.body && (
                                                        <p className="text-xs text-white/60 mt-1 leading-snug">
                                                            {n.body}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                {notifications.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => goToProfileTab('notifications')}
                                        className="w-full px-5 py-3 text-center text-sm font-medium text-[#7c8cff] hover:text-[#173ef0] hover:bg-white/2 transition-colors border-t border-white/10"
                                    >
                                        View All
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ---------- Avatar + dropdown ---------- */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen((v) => !v);
                                setNotifOpen(false);
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#173ef0]/20 text-[#7c8cff] font-semibold hover:bg-[#173ef0]/30 transition-colors overflow-hidden"
                            aria-label="Account menu"
                            aria-expanded={menuOpen}
                        >
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs">
                                    {initials(user?.fullName || user?.username)}
                                </span>
                            )}
                        </button>

                        {menuOpen && (
                            <div className="fade-slide-in absolute right-0 top-full mt-2 w-80 bg-[#161616] border border-white/10 shadow-2xl z-2000">
                                {/* Header row */}
                                <div className="px-4 py-4 flex items-center gap-3 border-b border-white/10">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#173ef0]/20 text-[#7c8cff] font-semibold flex items-center justify-center overflow-hidden">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm">
                                                {initials(user?.fullName || user?.username)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {user?.fullName || user?.username}
                                        </p>
                                        <p className="text-xs text-white/50 truncate mt-0.5">
                                            {user?.roles?.[0]?.replace(/_/g, ' ') || '—'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        title="Log Out"
                                        aria-label="Log Out"
                                        className="shrink-0 w-8 h-8 flex items-center justify-center text-white/60 hover:text-red-400 transition-colors"
                                    >
                                        <GrLogout className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('profile')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 ${
                                            activeTab === 'profile'
                                                ? 'text-[#173ef0] border-[#173ef0]'
                                                : 'text-white/60 border-transparent hover:text-white'
                                        }`}
                                    >
                                        <FaUserCircle className="w-3.5 h-3.5" />
                                        Profile
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('settings')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 ${
                                            activeTab === 'settings'
                                                ? 'text-[#173ef0] border-[#173ef0]'
                                                : 'text-white/60 border-transparent hover:text-white'
                                        }`}
                                    >
                                        <FaUserCog className="w-3.5 h-3.5" />
                                        Settings
                                    </button>
                                </div>

                                {/* Profile tab content */}
                                {activeTab === 'profile' && (
                                    <div className="py-1">
                                        <MenuItem
                                            icon={<FaUserCircle className="w-4 h-4" />}
                                            label="View Profile"
                                            onClick={() => goToProfileTab('details')}
                                        />
                                        <MenuItem
                                            icon={<GrLogout className="w-4 h-4" />}
                                            label="Logout"
                                            onClick={handleLogout}
                                            danger
                                        />
                                    </div>
                                )}

                                {/* Settings tab content */}
                                {activeTab === 'settings' && (
                                    <div className="py-1">
                                        <MenuItem
                                            icon={<FaUserCog className="w-4 h-4" />}
                                            label="Account Settings"
                                            onClick={() => goToProfileTab('details')}
                                        />
                                        <MenuItem
                                            icon={<FaHistory className="w-4 h-4" />}
                                            label="History"
                                            onClick={() => goToProfileTab('history')}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Full-screen logout loader */}
            {loggingOut &&
                createPortal(
                    <div className="fixed inset-0 z-9999 bg-[#1a1a1a] flex items-center justify-center">
                        <Loader />
                    </div>,
                    document.body
                )}
        </>
    );
};

/* ---------------- small sub-components ---------------- */

const MenuItem = ({ icon, label, onClick, danger = false }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
            danger
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                : 'text-white/80 hover:text-white hover:bg-white/5'
        }`}
    >
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">
            {icon}
        </span>
        <span className="truncate">{label}</span>
    </button>
);

export default PageToolbar;