import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GoInbox } from "react-icons/go";
import { GrLogout, GrNotification } from 'react-icons/gr';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaCheck,
    FaOutdent,
    FaBars,
    FaUserCircle,
    FaUserCog,
    FaHistory,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimesCircle,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useUi } from '../Context/UiContext';
import Loader from './Loader';
import CommandPalette from './CommandPalette';

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

const isTypingTarget = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (el.isContentEditable) return true;
    return false;
};

const NOTIF_TYPE_META = {
    success: { Icon: FaCheckCircle, color: 'text-emerald-400', ring: 'bg-emerald-500/10' },
    info:    { Icon: FaInfoCircle,  color: 'text-[#7c8cff]',    ring: 'bg-[#173ef0]/10' },
    warning: { Icon: FaExclamationTriangle, color: 'text-yellow-400', ring: 'bg-yellow-500/10' },
    error:   { Icon: FaTimesCircle, color: 'text-red-400',      ring: 'bg-red-500/10' },
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
    const {
        sidebarCollapsed,
        toggleSidebar,
        openMenu,
    } = useUi();
    const location = useLocation();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [loggingOut, setLoggingOut] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [notifFilter, setNotifFilter] = useState('all');

    const menuRef = useRef(null);
    const notifRef = useRef(null);
    const notifPanelRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const visibleNotifs = notifFilter === 'unread'
        ? notifications.filter((n) => !n.read)
        : notifications;

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setPaletteOpen(true);
                setMenuOpen(false);
                setNotifOpen(false);
                return;
            }

            if (e.key === 'Escape') {
                if (menuOpen) setMenuOpen(false);
                if (notifOpen) setNotifOpen(false);
                return;
            }

            if (
                e.key === '/' &&
                !e.ctrlKey &&
                !e.metaKey &&
                !e.altKey &&
                !isTypingTarget(e.target)
            ) {
                e.preventDefault();
                setPaletteOpen(true);
                setMenuOpen(false);
                setNotifOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen, notifOpen]);

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

    useEffect(() => {
        setMenuOpen(false);
        setNotifOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) setActiveTab('profile');
    }, [menuOpen]);

    useEffect(() => {
        if (!notifOpen) setNotifFilter('all');
    }, [notifOpen]);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const isOpen = menuOpen || notifOpen;
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [menuOpen, notifOpen]);

    const handleLogout = async () => {
        setMenuOpen(false);
        setLoggingOut(true);
        await logout();
        navigate('/login');
    };

    const goToProfileTab = (tab = 'details') => {
        setMenuOpen(false);
        setNotifOpen(false);
        navigate(`/profile?tab=${tab}`);
    };

    const goToNotificationsTab = () => {
        setMenuOpen(false);
        setNotifOpen(false);
        navigate('/profile?tab=notifications');
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
            <div
                className="
                    fixed top-0 left-0 right-0 z-40
                    lg:relative lg:top-auto lg:left-auto lg:right-auto lg:z-auto
                    bg-[#1a1a1a] border-b border-white/10 lg:border-0 lg:bg-transparent
                    px-4 sm:px-6 lg:px-0
                    py-3.5 lg:py-0
                    lg:mb-4
                    flex items-center gap-2 sm:gap-3
                "
            >
                <button
                    type="button"
                    onClick={openMenu}
                    aria-label="Open menu"
                    className="lg:hidden shrink-0 flex items-center justify-center w-9 h-9 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <FaBars className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="hidden lg:flex shrink-0 items-center justify-center w-9 h-9 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="Toggle sidebar"
                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <FaOutdent
                        className={`w-4 h-4 sidebar-toggle-icon ${
                            sidebarCollapsed ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setPaletteOpen(true);
                        setMenuOpen(false);
                        setNotifOpen(false);
                    }}
                    className="
                        relative flex items-center
                        flex-1 min-w-0 lg:max-w-md
                        pl-9 pr-2 sm:pr-3 lg:pr-16 py-2
                        bg-[#1e1e1e] border border-white/10
                        text-left
                        transition-colors duration-150
                        hover:bg-[#1e1e1e] hover:border-white/20
                        focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:ring-inset
                    "
                    aria-label="Open search"
                >
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none" />
                    <span className="text-white/40 text-sm truncate">
                        Search…
                    </span>
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-block text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5">
                        Ctrl + K
                    </kbd>
                </button>

                <div className="hidden lg:block flex-1" />

                {/*
                  Right cluster is `relative` for panel positioning.
                  The bell+panel and avatar+panel are each wrapped in
                  their own ref'd div so outside-click detection works
                  when clicking ON the panel.
                */}
                <div className="relative flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
                    {/* Bell + panel wrapper — contains both so clicks inside panel don't close it */}
                    <div ref={notifRef} className="static">
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
                            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                            aria-expanded={notifOpen}
                            aria-haspopup="dialog"
                        >
                            <GoInbox className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-semibold bg-[#173ef0] text-white rounded-full ring-2 ring-[#1a1a1a] lg:ring-transparent">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification panel — absolute to the outer cluster (right-0) */}
                        {notifOpen && (
                            <div
                                ref={notifPanelRef}
                                role="dialog"
                                aria-label="Notifications"
                                className="
                                    fade-slide-in absolute top-full mt-2
                                    right-0
                                    w-[calc(100vw-2rem)] sm:w-96
                                    bg-[#161616] border border-white/10 shadow-2xl z-2000
                                    flex flex-col
                                    max-h-[calc(100vh-6rem)]
                                    sm:max-h-128
                                "
                            >
                                <div className="shrink-0 px-4 sm:px-5 pt-4 pb-3 border-b border-white/10">
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                                                Notifications
                                            </h3>
                                            {unreadCount > 0 && (
                                                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-[#173ef0] text-white rounded">
                                                    {unreadCount} new
                                                </span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleMarkAll}
                                                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                                            >
                                                <FaCheck className="w-3 h-3" />
                                                Mark all
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 p-0.5 bg-white/5 border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setNotifFilter('all')}
                                            className={`flex-1 text-xs font-medium py-1.5 transition-colors ${
                                                notifFilter === 'all'
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            All
                                            <span className="ml-1 text-white/40">
                                                ({notifications.length})
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNotifFilter('unread')}
                                            className={`flex-1 text-xs font-medium py-1.5 transition-colors ${
                                                notifFilter === 'unread'
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            Unread
                                            <span className="ml-1 text-white/40">
                                                ({unreadCount})
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto hide-scrollbar divide-y divide-white/5">
                                    {visibleNotifs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                                <GrNotification className="w-5 h-5 text-white/30" />
                                            </div>
                                            <p className="text-sm font-medium text-white/70">
                                                {notifFilter === 'unread'
                                                    ? 'All caught up'
                                                    : 'No notifications yet'}
                                            </p>
                                            <p className="text-xs text-white/40 mt-1 leading-relaxed">
                                                {notifFilter === 'unread'
                                                    ? 'You have no unread notifications.'
                                                    : 'Updates about your requests will appear here.'}
                                            </p>
                                        </div>
                                    ) : (
                                        visibleNotifs.map((n) => {
                                            const meta =
                                                NOTIF_TYPE_META[n.type] ??
                                                NOTIF_TYPE_META.info;
                                            const { Icon, color, ring } = meta;
                                            return (
                                                <button
                                                    key={n.id}
                                                    type="button"
                                                    onClick={() => handleNotifClick(n)}
                                                    className={`w-full text-left px-4 sm:px-5 py-3.5 flex items-start gap-3 transition-colors ${
                                                        n.read
                                                            ? 'hover:bg-white/5'
                                                            : 'bg-[#173ef0]/5 hover:bg-[#173ef0]/10'
                                                    }`}
                                                >
                                                    <div className={`shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center ${ring}`}>
                                                        <Icon className={`w-4 h-4 ${color}`} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <p className={`text-sm leading-snug ${n.read ? 'font-normal text-white/80' : 'font-semibold text-white'}`}>
                                                                {n.title}
                                                            </p>
                                                            {!n.read && (
                                                                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#173ef0]" />
                                                            )}
                                                        </div>
                                                        {n.body && (
                                                            <p className="text-xs text-white/60 mt-1 leading-snug line-clamp-2">
                                                                {n.body}
                                                            </p>
                                                        )}
                                                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-1.5">
                                                            {timeAgo(n.createdAt)}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>

                                {notifications.length > 0 && (
                                    <div className="shrink-0 border-t border-white/10 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-2 bg-[#161616]">
                                        <p className="text-[11px] text-white/40 truncate">
                                            {unreadCount > 0
                                                ? `${unreadCount} unread`
                                                : 'All read'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={goToNotificationsTab}
                                            className="shrink-0 text-xs font-medium text-[#7c8cff] hover:text-[#173ef0] transition-colors"
                                        >
                                            View all
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Avatar + profile panel wrapper */}
                    <div ref={menuRef} className="static">
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen((v) => !v);
                                setNotifOpen(false);
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#173ef0]/20 text-[#7c8cff] font-semibold hover:bg-[#173ef0]/30 transition-colors overflow-hidden ring-2 ring-transparent hover:ring-[#173ef0]/40"
                            aria-label="Account menu"
                            aria-expanded={menuOpen}
                            aria-haspopup="menu"
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
                            <div
                                role="menu"
                                aria-label="Account menu"
                                className="
                                    fade-slide-in absolute top-full mt-2
                                    right-0
                                    w-[calc(100vw-2rem)] sm:w-80
                                    bg-[#161616] border border-white/10 shadow-2xl z-2000
                                    flex flex-col
                                "
                            >
                                <div className="px-4 py-4 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 shrink-0 rounded-full bg-[#173ef0]/20 text-[#7c8cff] font-semibold flex items-center justify-center overflow-hidden">
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
                                                {user?.email || `@${user?.username}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                                        <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#173ef0] text-white rounded">
                                            {user?.roles?.[0]?.replace(/_/g, ' ') || 'User'}
                                        </span>
                                        {user?.roles?.length > 1 && (
                                            <span className="text-[10px] text-white/50">
                                                +{user.roles.length - 1} more
                                            </span>
                                        )}
                                    </div>
                                </div>

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

                                {activeTab === 'profile' && (
                                    <div className="py-1.5">
                                        <MenuItem
                                            icon={<FaUserCircle className="w-4 h-4" />}
                                            label="View Profile"
                                            onClick={() => goToProfileTab('details')}
                                        />
                                        <MenuItem
                                            icon={<GrNotification className="w-4 h-4" />}
                                            label="Notifications"
                                            badge={unreadCount > 0 ? unreadCount : null}
                                            onClick={goToNotificationsTab}
                                        />
                                        <MenuItem
                                            icon={<FaHistory className="w-4 h-4" />}
                                            label="Login History"
                                            onClick={() => goToProfileTab('history')}
                                        />
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="py-1.5">
                                        <MenuItem
                                            icon={<FaUserCog className="w-4 h-4" />}
                                            label="Account Settings"
                                            onClick={() => goToProfileTab('details')}
                                        />
                                        <MenuItem
                                            icon={<FaHistory className="w-4 h-4" />}
                                            label="Login History"
                                            onClick={() => goToProfileTab('history')}
                                        />
                                    </div>
                                )}

                                <div className="border-t border-white/10 py-1.5">
                                    <MenuItem
                                        icon={<GrLogout className="w-4 h-4" />}
                                        label="Log Out"
                                        onClick={handleLogout}
                                        danger
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-16 lg:hidden" aria-hidden="true" />

            <CommandPalette
                open={paletteOpen}
                onClose={() => setPaletteOpen(false)}
            />

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

const MenuItem = ({ icon, label, onClick, danger = false, badge = null }) => (
    <button
        type="button"
        role="menuitem"
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
        <span className="truncate flex-1">{label}</span>
        {badge != null && (
            <span className="shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-semibold bg-[#173ef0] text-white rounded-full">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
    </button>
);

export default PageToolbar;